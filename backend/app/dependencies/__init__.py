"""Dependencies package exports."""
from app.dependencies.database import get_db
from app.dependencies.authentication import get_current_user, oauth2_scheme
from app.dependencies.authorization import get_current_admin_user, require_role

__all__ = [
    "get_db",
    "get_current_user",
    "oauth2_scheme",
    "get_current_admin_user",
    "require_role",
]
