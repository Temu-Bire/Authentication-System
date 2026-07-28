
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import GOOGLE_CLIENT_ID
from app.core.limiter import limiter
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    JWTError,
)
from app.db.database import get_db
from app.db.models import User
from app.schemas.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    GoogleToken,
    TokenResponse,
    TokenPairResponse,
)
from app.utils.validate import validate_password

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

@router.post("/register", response_model=TokenPairResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email and password."""

    # Validate password strength first
    is_valid, errors = validate_password(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=errors)

    # Check for duplicate email
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "access_token": create_access_token({"sub": new_user.email}),
        "refresh_token": create_refresh_token({"sub": new_user.email}),
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=TokenPairResponse)
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password. Locks account after 5 failed attempts."""

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check account lock
    if db_user.locked_until and db_user.locked_until > datetime.utcnow():
        raise HTTPException(status_code=403, detail="Account temporarily locked. Try again later.")

    # Reset stale lock
    if db_user.locked_until and db_user.locked_until <= datetime.utcnow():
        db_user.locked_until = None
        db_user.failed_login_attempts = 0

    # Verify password
    if not verify_password(user.password, db_user.password):
        db_user.failed_login_attempts += 1

        if db_user.failed_login_attempts >= MAX_ATTEMPTS:
            db_user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)

        db.commit()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Successful login — reset failure counter
    db_user.failed_login_attempts = 0
    db.commit()

    return {
        "access_token": create_access_token({"sub": db_user.email}),
        "refresh_token": create_refresh_token({"sub": db_user.email}),
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Refresh Token
# ---------------------------------------------------------------------------

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(body: dict, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new access token."""

    token = body.get("refresh_token")
    if not token:
        raise HTTPException(status_code=422, detail="refresh_token is required")

    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Provided token is not a refresh token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return {
        "access_token": create_access_token({"sub": email}),
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Google OAuth Login / Register
# ---------------------------------------------------------------------------

@router.post("/google-login", response_model=TokenResponse)
def google_login(body: GoogleToken, db: Session = Depends(get_db)):
    """
    Verify a Google ID token and return a JWT access token.
    Creates a new account automatically on first sign-in.

    FIX: Previously accepted `token` as a URL query param which mismatched
    the frontend sending a JSON body. Now uses the GoogleToken schema (body).
    """
    try:
        google_user = id_token.verify_oauth2_token(
            body.token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email: str = google_user["email"]
    google_id: str = google_user["sub"]

    user = db.query(User).filter(User.email == email).first()

    if not user:
        # First-time Google sign-in — auto-register
        user = User(email=email, google_id=google_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.google_id is None:
        # Existing email-password account — link Google ID
        user.google_id = google_id
        db.commit()

    return {
        "access_token": create_access_token({"sub": user.email}),
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Dev/Admin — list all users (no auth guard, add one in production)
# ---------------------------------------------------------------------------

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Return all registered users. (Remove or protect this in production.)"""
    return db.query(User).all()
