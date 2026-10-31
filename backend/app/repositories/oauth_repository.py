"""OAuth database queries repository."""
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User


class OAuthRepository:
    @staticmethod
    def get_by_google_id(db: Session, google_id: str) -> Optional[User]:
        return db.query(User).filter(User.google_id == google_id).first()

    @staticmethod
    def link_google_account(db: Session, user: User, google_id: str) -> User:
        user.google_id = google_id
        db.commit()
        db.refresh(user)
        return user
