"""User profiles and query service."""
from typing import List
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse


class UserService:
    @staticmethod
    def get_profile(current_user: User, db: Session) -> UserResponse:
        has_suspicious = UserRepository.has_suspicious_activity(db, current_user.id)
        return UserResponse(
            id=current_user.id,
            email=current_user.email,
            last_login_ip=current_user.last_login_ip,
            last_login_at=current_user.last_login_at,
            google_id=current_user.google_id,
            has_suspicious_activity=has_suspicious,
        )

    @staticmethod
    def get_all_users(db: Session) -> List[UserResponse]:
        users = UserRepository.get_all(db)
        res = []
        for u in users:
            has_suspicious = UserRepository.has_suspicious_activity(db, u.id)
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
