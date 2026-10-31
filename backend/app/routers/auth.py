"""Authentication and session management HTTP routes."""
from typing import List, Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.security import create_access_token, create_refresh_token
from app.dependencies.authentication import get_current_user
from app.dependencies.database import get_db
from app.middleware.rate_limit import limiter
from app.models.user import User
from app.schemas.auth import (
    GoogleToken,
    PasswordChangeRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuditLogResponse,
)
from app.schemas.token import TokenPairResponse, TokenResponse
from app.schemas.user import UserCreate, UserLogin, UserResponse, SessionResponse
from app.services.auth_service import AuthService
from app.services.oauth_service import OAuthService
from app.services.user_service import UserService

router = APIRouter(tags=["Authentication"])


# ---------------------------------------------------------------------------
# Register & Login
# ---------------------------------------------------------------------------

@router.post("/auth/register", response_model=TokenPairResponse)
@limiter.limit("5/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email and password."""
    return AuthService.register(user_data=user, request=request, db=db)


@router.post("/auth/login", response_model=TokenPairResponse)
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password. Locks account after 5 failed attempts."""
    return AuthService.login(credentials=user, request=request, db=db)


# ---------------------------------------------------------------------------
# Refresh & Logout
# ---------------------------------------------------------------------------

@router.post("/auth/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
def refresh_token(request: Request, body: dict, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new access token."""
    token = body.get("refresh_token")
    return AuthService.refresh_access_token(token=token, db=db)


@router.post("/auth/logout")
def logout(request: Request, body: Optional[dict] = None, db: Session = Depends(get_db)):
    """Revoke session record in database on logout."""
    refresh_token_val = body.get("refresh_token") if body else None
    return AuthService.logout(refresh_token=refresh_token_val, request=request, db=db)


# ---------------------------------------------------------------------------
# Password Management (In-App Change & Recovery)
# ---------------------------------------------------------------------------

@router.put("/auth/change-password")
def change_password(
    request: Request,
    body: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password for the currently authenticated user."""
    return AuthService.change_password(
        current_user=current_user,
        current_password=body.current_password,
        new_password=body.new_password,
        request=request,
        db=db,
    )


@router.post("/auth/forgot-password")
@limiter.limit("5/minute")
def forgot_password(request: Request, body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate password recovery by email."""
    return AuthService.request_password_reset(email=body.email, request=request, db=db)


@router.post("/auth/reset-password")
@limiter.limit("5/minute")
def reset_password(request: Request, body: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Complete password reset using recovery token."""
    return AuthService.reset_password(
        token=body.token,
        new_password=body.new_password,
        request=request,
        db=db,
    )


# ---------------------------------------------------------------------------
# Google OAuth
# ---------------------------------------------------------------------------

@router.post("/auth/google-login", response_model=TokenPairResponse)
def google_login(request: Request, body: GoogleToken, db: Session = Depends(get_db)):
    """Verify Google ID token and return access + refresh tokens."""
    google_user = OAuthService.verify_google_token(body.token)
    user = OAuthService.authenticate_or_register_google_user(db, google_user)

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    AuthService.create_session(user, refresh_token, request, db)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# ---------------------------------------------------------------------------
# Profile, Activity Logs & Sessions
# ---------------------------------------------------------------------------

@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return details of currently authenticated user including suspicious flag."""
    return UserService.get_profile(current_user=current_user, db=db)


@router.get("/auth/activity", response_model=List[AuditLogResponse])
def get_security_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve security audit logs for the authenticated user."""
    return AuthService.get_audit_logs(current_user=current_user, db=db)


@router.get("/sessions", response_model=List[SessionResponse])
def get_active_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all active sessions for the authenticated user."""
    return AuthService.get_sessions(current_user=current_user, request=request, db=db)


@router.delete("/sessions/{session_id}")
def revoke_session(
    request: Request,
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke a specific session."""
    return AuthService.revoke_session(
        session_id=session_id,
        current_user=current_user,
        request=request,
        db=db,
    )


@router.delete("/sessions")
def revoke_other_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke all sessions except the most recent one."""
    return AuthService.revoke_all_other_sessions(
        current_user=current_user,
        request=request,
        db=db,
    )
