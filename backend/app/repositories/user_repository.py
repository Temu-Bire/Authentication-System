"""User, Session, AuditLog, and PasswordReset database queries repository."""
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User, Session as UserSession
from app.models.audit_log import AuditLog
from app.models.password_reset import PasswordResetToken


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
    def create(
        db: Session,
        email: str,
        hashed_password: Optional[str] = None,
        google_id: Optional[str] = None,
        full_name: Optional[str] = None,
    ) -> User:
        user = User(
            email=email,
            password=hashed_password,
            google_id=google_id,
            full_name=full_name or "Temesgen Birhanu",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user: User, new_hashed_password: str) -> None:
        user.password = new_hashed_password
        db.commit()
        db.refresh(user)

    @staticmethod
    def update_profile(db: Session, user: User, full_name: Optional[str] = None, email: Optional[str] = None) -> User:
        if full_name is not None:
            user.full_name = full_name
        if email is not None:
            user.email = email
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_privacy(
        db: Session,
        user: User,
        profile_visibility: Optional[bool] = None,
        data_sharing: Optional[bool] = None,
        marketing_emails: Optional[bool] = None,
    ) -> User:
        if profile_visibility is not None:
            user.profile_visibility = profile_visibility
        if data_sharing is not None:
            user.data_sharing = data_sharing
        if marketing_emails is not None:
            user.marketing_emails = marketing_emails
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_security(
        db: Session,
        user: User,
        login_alerts: Optional[bool] = None,
        is_2fa_enabled: Optional[bool] = None,
    ) -> User:
        if login_alerts is not None:
            user.login_alerts = login_alerts
        if is_2fa_enabled is not None:
            user.is_2fa_enabled = is_2fa_enabled
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user: User) -> None:
        db.delete(user)
        db.commit()

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
    def delete_all_sessions(db: Session, user_id: int) -> None:
        sessions = (
            db.query(UserSession)
            .filter(UserSession.user_id == user_id)
            .all()
        )
        for s in sessions:
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

    # -----------------------------------------------------------------------
    # Audit Logs
    # -----------------------------------------------------------------------
    @staticmethod
    def record_audit_log(
        db: Session,
        user_id: int,
        event_type: str,
        ip_address: Optional[str] = None,
        device: Optional[str] = None,
    ) -> AuditLog:
        log_entry = AuditLog(
            user_id=user_id,
            event_type=event_type,
            ip_address=ip_address,
            device=device,
            created_at=datetime.utcnow(),
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

    @staticmethod
    def get_audit_logs(db: Session, user_id: int, limit: int = 15) -> List[AuditLog]:
        return (
            db.query(AuditLog)
            .filter(AuditLog.user_id == user_id)
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
            .all()
        )

    # -----------------------------------------------------------------------
    # Password Reset Tokens
    # -----------------------------------------------------------------------
    @staticmethod
    def create_password_reset_token(
        db: Session,
        user_id: int,
        token_hash: str,
        expires_at: datetime,
    ) -> PasswordResetToken:
        reset_record = PasswordResetToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            used=False,
            created_at=datetime.utcnow(),
        )
        db.add(reset_record)
        db.commit()
        db.refresh(reset_record)
        return reset_record

    @staticmethod
    def get_valid_reset_token(db: Session, token_hash: str) -> Optional[PasswordResetToken]:
        return (
            db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.used == False,
                PasswordResetToken.expires_at > datetime.utcnow(),
            )
            .first()
        )

    @staticmethod
    def mark_reset_token_used(db: Session, reset_record: PasswordResetToken) -> None:
        reset_record.used = True
        db.commit()
