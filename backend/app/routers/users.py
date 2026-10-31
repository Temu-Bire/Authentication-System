"""User management HTTP routes."""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.authentication import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's profile information."""
    return UserService.get_profile(current_user=current_user, db=db)


@router.get("", response_model=List[UserResponse])
def get_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve all users (secured: requires authentication)."""
    return UserService.get_all_users(db=db)
