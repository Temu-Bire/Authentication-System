"""User profiles, preferences, and query service."""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserResponse,
    ProfileUpdateRequest,
    PrivacySettingsUpdateRequest,
    SecuritySettingsUpdateRequest,
)


class UserService:
    @staticmethod
    def format_user_response(user: User, db: Session) -> UserResponse:
        has_suspicious = UserRepository.has_suspicious_activity(db, user.id)
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name or "Temesgen Birhanu",
            is_2fa_enabled=user.is_2fa_enabled if user.is_2fa_enabled is not None else False,
            login_alerts=user.login_alerts if user.login_alerts is not None else True,
            profile_visibility=user.profile_visibility if user.profile_visibility is not None else True,
            data_sharing=user.data_sharing if user.data_sharing is not None else False,
            marketing_emails=user.marketing_emails if user.marketing_emails is not None else False,
            last_login_ip=user.last_login_ip,
            last_login_at=user.last_login_at,
            google_id=user.google_id,
            has_suspicious_activity=has_suspicious,
        )

    @classmethod
    def get_profile(cls, current_user: User, db: Session) -> UserResponse:
        return cls.format_user_response(current_user, db)

    @classmethod
    def update_profile(cls, current_user: User, data: ProfileUpdateRequest, db: Session) -> UserResponse:
        updated = UserRepository.update_profile(
            db=db,
            user=current_user,
            full_name=data.full_name,
            email=data.email,
        )
        return cls.format_user_response(updated, db)

    @classmethod
    def update_privacy(cls, current_user: User, data: PrivacySettingsUpdateRequest, db: Session) -> UserResponse:
        updated = UserRepository.update_privacy(
            db=db,
            user=current_user,
            profile_visibility=data.profile_visibility,
            data_sharing=data.data_sharing,
            marketing_emails=data.marketing_emails,
        )
        return cls.format_user_response(updated, db)

    @classmethod
    def update_security(cls, current_user: User, data: SecuritySettingsUpdateRequest, db: Session) -> UserResponse:
        updated = UserRepository.update_security(
            db=db,
            user=current_user,
            login_alerts=data.login_alerts,
            is_2fa_enabled=data.is_2fa_enabled,
        )
        return cls.format_user_response(updated, db)

    @staticmethod
    def delete_account(current_user: User, db: Session) -> dict:
        UserRepository.delete_user(db, current_user)
        return {"message": "Account permanently deleted"}

    @classmethod
    def get_all_users(cls, db: Session) -> List[UserResponse]:
        users = UserRepository.get_all(db)
        return [cls.format_user_response(u, db) for u in users]
