"""Admin routes stub."""
from fastapi import APIRouter, Depends
from app.dependencies.authorization import get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/status")
def get_admin_status(admin_user: User = Depends(get_current_admin_user)):
    """Administrative status check."""
    return {"status": "ok", "admin_email": admin_user.email}
