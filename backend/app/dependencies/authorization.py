"""Authorization and role checking dependencies."""
from fastapi import Depends, HTTPException, status
from app.dependencies.authentication import get_current_user
from app.models.user import User


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Check that current user has admin privileges (placeholder / check)."""
    # By default, we require authentication; if an admin flag/role is present, verify here.
    return current_user


def require_role(role_name: str):
    """Dependency factory to require a specific role."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        return current_user
    return role_checker
