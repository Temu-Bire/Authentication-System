"""User management HTTP routes."""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.authentication import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    ProfileUpdateRequest,
    PrivacySettingsUpdateRequest,
    SecuritySettingsUpdateRequest,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's profile information."""
    return UserService.get_profile(current_user=current_user, db=db)


@router.patch("/me/profile", response_model=UserResponse)
def update_profile(
    body: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user's name or email."""
    return UserService.update_profile(current_user=current_user, data=body, db=db)


@router.patch("/me/privacy", response_model=UserResponse)
def update_privacy_settings(
    body: PrivacySettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile visibility, data sharing, or marketing email preferences."""
    return UserService.update_privacy(current_user=current_user, data=body, db=db)


@router.patch("/me/security", response_model=UserResponse)
def update_security_settings(
    body: SecuritySettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update login alerts or 2FA preference."""
    return UserService.update_security(current_user=current_user, data=body, db=db)


@router.delete("/me")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Permanently delete user's account and all associated sessions."""
    return UserService.delete_account(current_user=current_user, db=db)


@router.get("", response_model=List[UserResponse])
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all users (secured: requires authentication)."""
    return UserService.get_all_users(db=db)
