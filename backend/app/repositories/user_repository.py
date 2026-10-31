"""User and Session database queries repository."""
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User, Session as UserSession


class UserRepository:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_all(db: Session) -> List[User]:
        return db.query(User).all()

    @staticmethod
    def create(db: Session, email: str, hashed_password: Optional[str] = None, google_id: Optional[str] = None) -> User:
        user = User(email=email, password=hashed_password, google_id=google_id)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def create_session(
        db: Session,
        user: User,
        token_hash: str,
        device: str,
        ip_address: str,
        is_suspicious: bool,
    ) -> UserSession:
        session_record = UserSession(
            user_id=user.id,
            refresh_token_hash=token_hash,
            device=device,
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

    @staticmethod
    def get_sessions(db: Session, user_id: int) -> List[UserSession]:
        return (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id)
            .order_by(UserSession.last_used_at.desc())
            .all()
        )

    @staticmethod
    def get_session_by_hash(db: Session, token_hash: str) -> Optional[UserSession]:
        return db.query(UserSession).filter(UserSession.refresh_token_hash == token_hash).first()

    @staticmethod
    def get_session_by_id(db: Session, session_id: int, user_id: int) -> Optional[UserSession]:
        return (
            db.query(UserSession)
            .filter(UserSession.id == session_id, UserSession.user_id == user_id)
            .first()
        )

    @staticmethod
    def delete_session(db: Session, session_record: UserSession) -> None:
        db.delete(session_record)
        db.commit()

    @staticmethod
    def delete_other_sessions(db: Session, user_id: int) -> None:
        sessions = (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id)
            .order_by(UserSession.last_used_at.desc())
            .all()
        )
        if len(sessions) > 1:
            for s in sessions[1:]:
                db.delete(s)
            db.commit()

    @staticmethod
    def has_suspicious_activity(db: Session, user_id: int) -> bool:
        return (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id, UserSession.is_suspicious == True)
            .first()
            is not None
        )
