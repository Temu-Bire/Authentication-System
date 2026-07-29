
from datetime import datetime, timedelta
import hashlib

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
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
from app.db.models import User, Session as UserSession
from app.schemas.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    GoogleToken,
    TokenResponse,
    TokenPairResponse,
    SessionResponse,
)
from app.utils.validate import validate_password

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

router = APIRouter(tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


# ---------------------------------------------------------------------------
# Auth Dependency & Helpers
# ---------------------------------------------------------------------------

def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer Access Token and return the current user."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not an access token",
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def create_user_session(
    user: User,
    refresh_token: str,
    request: Request,
    db: Session,
) -> UserSession:
    """Create a new session record in DB, detecting suspicious IP changes."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()
    else:
        ip_address = request.client.host if request.client else "127.0.0.1"

    user_agent = request.headers.get("user-agent", "Unknown Device")
    if len(user_agent) > 100:
        user_agent = user_agent[:97] + "..."

    # Detect suspicious login: IP differs from last known login IP
    is_suspicious = False
    if user.last_login_ip and user.last_login_ip != ip_address:
        is_suspicious = True

    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

    session_record = UserSession(
        user_id=user.id,
        refresh_token_hash=token_hash,
        device=user_agent,
        ip_address=ip_address,
        created_at=datetime.utcnow(),
        last_used_at=datetime.utcnow(),
        is_suspicious=is_suspicious,
    )

    user.last_login_ip = ip_address
    user.last_login_at = datetime.utcnow()

    db.add(session_record)
    db.commit()
    db.refresh(session_record)
    return session_record


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

@router.post("/auth/register", response_model=TokenPairResponse)
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
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

    access_token = create_access_token({"sub": new_user.email})
    refresh_token = create_refresh_token({"sub": new_user.email})

    create_user_session(new_user, refresh_token, request, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

@router.post("/auth/login", response_model=TokenPairResponse)
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password. Locks account after 5 failed attempts."""

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check account lock
    if db_user.locked_until and db_user.locked_until > datetime.utcnow():
        time_left = db_user.locked_until - datetime.utcnow()
        mins_left = max(1, int(time_left.total_seconds() // 60) + 1)
        raise HTTPException(
            status_code=403,
            detail=f"Account temporarily locked due to too many failed attempts. Try again in {mins_left} minute(s)."
        )

    # Reset stale lock
    if db_user.locked_until and db_user.locked_until <= datetime.utcnow():
        db_user.locked_until = None
        db_user.failed_login_attempts = 0

    # Verify password
    if not db_user.password or not verify_password(user.password, db_user.password):
        db_user.failed_login_attempts += 1

        if db_user.failed_login_attempts >= MAX_ATTEMPTS:
            db_user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
            db.commit()
            raise HTTPException(
                status_code=403,
                detail=f"Account temporarily locked due to too many failed attempts ({MAX_ATTEMPTS}/{MAX_ATTEMPTS}). Try again in {LOCKOUT_MINUTES} minutes."
            )

        db.commit()
        remaining_attempts = MAX_ATTEMPTS - db_user.failed_login_attempts
        raise HTTPException(
            status_code=401,
            detail=f"Invalid email or password. {remaining_attempts} attempt(s) remaining before account lockout."
        )

    # Successful login — reset failure counter
    db_user.failed_login_attempts = 0
    db_user.locked_until = None
    db.commit()


    access_token = create_access_token({"sub": db_user.email})
    refresh_token = create_refresh_token({"sub": db_user.email})

    create_user_session(db_user, refresh_token, request, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Refresh Token
# ---------------------------------------------------------------------------

@router.post("/auth/refresh", response_model=TokenResponse)
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

    token_hash = hashlib.sha256(token.encode()).hexdigest()
    session_record = db.query(UserSession).filter(UserSession.refresh_token_hash == token_hash).first()
    if session_record:
        session_record.last_used_at = datetime.utcnow()
        db.commit()

    return {
        "access_token": create_access_token({"sub": email}),
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Google OAuth Login / Register
# ---------------------------------------------------------------------------

@router.post("/auth/google-login", response_model=TokenPairResponse)
def google_login(request: Request, body: GoogleToken, db: Session = Depends(get_db)):
    """
    Verify a Google ID token and return access + refresh tokens.
    Creates a new account automatically on first sign-in.
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

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    create_user_session(user, refresh_token, request, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# User Profile
# ---------------------------------------------------------------------------

@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return details of currently authenticated user including suspicious flag."""
    has_suspicious = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_suspicious == True
    ).first() is not None

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        last_login_ip=current_user.last_login_ip,
        last_login_at=current_user.last_login_at,
        google_id=current_user.google_id,
        has_suspicious_activity=has_suspicious,
    )


# ---------------------------------------------------------------------------
# Active Sessions Management
# ---------------------------------------------------------------------------

@router.get("/sessions", response_model=list[SessionResponse])
def get_active_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all active sessions for the authenticated user."""
    sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == current_user.id)
        .order_by(UserSession.last_used_at.desc())
        .all()
    )

    client_ip = request.client.host if request.client else "127.0.0.1"
    res = []
    for s in sessions:
        is_current = False
        if s == sessions[0] or (s.ip_address == client_ip and (datetime.utcnow() - s.last_used_at).total_seconds() < 300):
            is_current = True

        res.append(
            SessionResponse(
                id=s.id,
                device=s.device,
                ip_address=s.ip_address,
                created_at=s.created_at,
                last_used_at=s.last_used_at,
                is_suspicious=s.is_suspicious,
                current=is_current,
            )
        )
    return res


@router.delete("/sessions/{session_id}")
def revoke_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke a specific session."""
    session_record = (
        db.query(UserSession)
        .filter(UserSession.id == session_id, UserSession.user_id == current_user.id)
        .first()
    )

    if not session_record:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session_record)
    db.commit()

    return {"message": "Session revoked successfully"}


@router.delete("/sessions")
def revoke_other_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke all sessions except the most recent one."""
    sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == current_user.id)
        .order_by(UserSession.last_used_at.desc())
        .all()
    )

    if len(sessions) > 1:
        for s in sessions[1:]:
            db.delete(s)
        db.commit()

    return {"message": "All other sessions revoked successfully"}


# ---------------------------------------------------------------------------
# Dev/Admin — list all users
# ---------------------------------------------------------------------------

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Return all registered users."""
    users = db.query(User).all()
    res = []
    for u in users:
        has_suspicious = db.query(UserSession).filter(
            UserSession.user_id == u.id,
            UserSession.is_suspicious == True
        ).first() is not None

        res.append(
            UserResponse(
                id=u.id,
                email=u.email,
                last_login_ip=u.last_login_ip,
                last_login_at=u.last_login_at,
                google_id=u.google_id,
                has_suspicious_activity=has_suspicious,
            )
        )
    return res

