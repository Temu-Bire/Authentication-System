"""Authentication, session, recovery, and audit business logic service."""
from datetime import datetime, timedelta
import hashlib
import secrets
from typing import Tuple, List, Optional
from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.logging import logger
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    JWTError,
)
from app.models.user import User, Session as UserSession
from app.models.audit_log import AuditLog
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin, SessionResponse
from app.schemas.auth import AuditLogResponse
from app.utils.validate import validate_password
from app.utils.email import send_email

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


class AuthService:
    @staticmethod
    def parse_device_info(raw_ua: str) -> str:
        """Parse raw User-Agent string into human-friendly format (e.g. Chrome on Windows)."""
        if not raw_ua or raw_ua == "Unknown Device":
            return "Desktop Web App"

        ua = raw_ua.lower()
        os_name = "Desktop"
        if "windows" in ua:
            os_name = "Windows"
        elif "macintosh" in ua or "mac os" in ua:
            os_name = "macOS"
        elif "iphone" in ua:
            os_name = "iPhone"
        elif "ipad" in ua:
            os_name = "iPad"
        elif "android" in ua:
            os_name = "Android"
        elif "linux" in ua:
            os_name = "Linux"

        browser = "Browser"
        if "edg" in ua:
            browser = "Edge"
        elif "opr" in ua or "opera" in ua:
            browser = "Opera"
        elif "chrome" in ua:
            browser = "Chrome"
        elif "firefox" in ua:
            browser = "Firefox"
        elif "safari" in ua:
            browser = "Safari"

        return f"{browser} on {os_name}"

    @classmethod
    def extract_client_info(cls, request: Request) -> Tuple[str, str]:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else "127.0.0.1"

        raw_ua = request.headers.get("user-agent", "Unknown Device")
        device_label = cls.parse_device_info(raw_ua)
        return ip_address, device_label

    @classmethod
    def create_session(cls, user: User, refresh_token: str, request: Request, db: Session) -> UserSession:
        ip_address, device_label = cls.extract_client_info(request)

        # Detect suspicious login: IP differs from last known login IP
        is_suspicious = False
        if user.last_login_ip and user.last_login_ip != ip_address:
            is_suspicious = True
            UserRepository.record_audit_log(
                db=db,
                user_id=user.id,
                event_type="SUSPICIOUS_LOGIN_DETECTED",
                ip_address=ip_address,
                device=device_label,
            )

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        return UserRepository.create_session(
            db=db,
            user=user,
            token_hash=token_hash,
            device=device_label,
            ip_address=ip_address,
            is_suspicious=is_suspicious,
        )

    @classmethod
    def register(cls, user_data: UserCreate, request: Request, db: Session) -> dict:
        ip_address, device_label = cls.extract_client_info(request)
        is_valid, errors = validate_password(user_data.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=errors)

        if UserRepository.get_by_email(db, user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = UserRepository.create(
            db=db,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
        )

        UserRepository.record_audit_log(
            db=db,
            user_id=new_user.id,
            event_type="ACCOUNT_REGISTERED",
            ip_address=ip_address,
            device=device_label,
        )

        access_token = create_access_token({"sub": new_user.email})
        refresh_token = create_refresh_token({"sub": new_user.email})

        cls.create_session(new_user, refresh_token, request, db)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @classmethod
    def login(cls, credentials: UserLogin, request: Request, db: Session) -> dict:
        ip_address, device_label = cls.extract_client_info(request)
        db_user = UserRepository.get_by_email(db, credentials.email)
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        # Check account lockout
        if db_user.locked_until and db_user.locked_until > datetime.utcnow():
            time_left = db_user.locked_until - datetime.utcnow()
            mins_left = max(1, int(time_left.total_seconds() // 60) + 1)
            raise HTTPException(
                status_code=403,
                detail=f"Account temporarily locked due to too many failed attempts. Try again in {mins_left} minute(s).",
            )

        # Reset stale lock
        if db_user.locked_until and db_user.locked_until <= datetime.utcnow():
            db_user.locked_until = None
            db_user.failed_login_attempts = 0

        # Verify password
        if not db_user.password or not verify_password(credentials.password, db_user.password):
            db_user.failed_login_attempts += 1
            UserRepository.record_audit_log(
                db=db,
                user_id=db_user.id,
                event_type="LOGIN_FAILED",
                ip_address=ip_address,
                device=device_label,
            )

            if db_user.failed_login_attempts >= MAX_ATTEMPTS:
                db_user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
                db.commit()
                UserRepository.record_audit_log(
                    db=db,
                    user_id=db_user.id,
                    event_type="ACCOUNT_LOCKED",
                    ip_address=ip_address,
                    device=device_label,
                )
                raise HTTPException(
                    status_code=403,
                    detail=f"Account temporarily locked due to too many failed attempts ({MAX_ATTEMPTS}/{MAX_ATTEMPTS}). Try again in {LOCKOUT_MINUTES} minutes.",
                )

            db.commit()
            remaining_attempts = MAX_ATTEMPTS - db_user.failed_login_attempts
            raise HTTPException(
                status_code=401,
                detail=f"Invalid email or password. {remaining_attempts} attempt(s) remaining before account lockout.",
            )

        # Successful login
        db_user.failed_login_attempts = 0
        db_user.locked_until = None
        db.commit()

        UserRepository.record_audit_log(
            db=db,
            user_id=db_user.id,
            event_type="LOGIN_SUCCESS",
            ip_address=ip_address,
            device=device_label,
        )

        access_token = create_access_token({"sub": db_user.email})
        refresh_token = create_refresh_token({"sub": db_user.email})

        cls.create_session(db_user, refresh_token, request, db)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    @classmethod
    def refresh_access_token(cls, token: str, db: Session) -> dict:
        if not token:
            raise HTTPException(status_code=422, detail="refresh_token is required")

        try:
            payload = decode_token(token)
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Provided token is not a refresh token")

        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        token_hash = hashlib.sha256(token.encode()).hexdigest()
        session_record = UserRepository.get_session_by_hash(db, token_hash)
        if session_record:
            session_record.last_used_at = datetime.utcnow()
            db.commit()

        return {
            "access_token": create_access_token({"sub": email}),
            "token_type": "bearer",
        }

    @classmethod
    def logout(cls, refresh_token: Optional[str], request: Request, db: Session) -> dict:
        """Revoke active session on server when user logs out."""
        ip_address, device_label = cls.extract_client_info(request)
        if refresh_token:
            token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
            session_record = UserRepository.get_session_by_hash(db, token_hash)
            if session_record:
                UserRepository.record_audit_log(
                    db=db,
                    user_id=session_record.user_id,
                    event_type="LOGOUT",
                    ip_address=ip_address,
                    device=device_label,
                )
                UserRepository.delete_session(db, session_record)
        return {"message": "Logged out successfully"}

    @classmethod
    def change_password(
        cls,
        current_user: User,
        current_password: str,
        new_password: str,
        request: Request,
        db: Session,
    ) -> dict:
        """Allow an authenticated user to change their account password."""
        ip_address, device_label = cls.extract_client_info(request)

        # If user registered with Google only and has no password
        if not current_user.password:
            raise HTTPException(
                status_code=400,
                detail="Your account is managed via Google OAuth. Please use Google Sign-In.",
            )

        if not verify_password(current_password, current_user.password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")

        is_valid, errors = validate_password(new_password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=errors)

        new_hash = hash_password(new_password)
        UserRepository.update_password(db, current_user, new_hash)

        UserRepository.record_audit_log(
            db=db,
            user_id=current_user.id,
            event_type="PASSWORD_CHANGED",
            ip_address=ip_address,
            device=device_label,
        )

        return {"message": "Password changed successfully"}

    @classmethod
    def request_password_reset(cls, email: str, request: Request, db: Session) -> dict:
        """Generate a password recovery token and log/send instructions."""
        ip_address, device_label = cls.extract_client_info(request)
        user = UserRepository.get_by_email(db, email)

        # Generic success message even if email does not exist to prevent enumeration
        generic_msg = {"message": "If an account matches that email, a password reset link has been dispatched."}

        if not user or not user.password:
            return generic_msg

        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(minutes=30)

        UserRepository.create_password_reset_token(
            db=db,
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        UserRepository.record_audit_log(
            db=db,
            user_id=user.id,
            event_type="PASSWORD_RESET_REQUESTED",
            ip_address=ip_address,
            device=device_label,
        )

        reset_link = f"/reset-password?token={raw_token}"
        send_email(
            to_email=user.email,
            subject="SecureAuth: Password Reset Request",
            body=f"Click the link to reset your password (valid for 30 minutes): {reset_link}",
        )
        logger.info("Password reset token generated for %s: %s", user.email, raw_token)

        return {
            "message": "Password reset instructions generated.",
            "reset_token": raw_token,  # provided for seamless development/testing flow
        }

    @classmethod
    def reset_password(cls, token: str, new_password: str, request: Request, db: Session) -> dict:
        """Validate reset token and update account password."""
        ip_address, device_label = cls.extract_client_info(request)
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        reset_record = UserRepository.get_valid_reset_token(db, token_hash)
        if not reset_record:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")

        is_valid, errors = validate_password(new_password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=errors)

        user = UserRepository.get_by_id(db, reset_record.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_hash = hash_password(new_password)
        UserRepository.update_password(db, user, new_hash)
        UserRepository.mark_reset_token_used(db, reset_record)

        # Invalidate all other active sessions for safety
        UserRepository.delete_other_sessions(db, user.id)

        UserRepository.record_audit_log(
            db=db,
            user_id=user.id,
            event_type="PASSWORD_RESET_COMPLETED",
            ip_address=ip_address,
            device=device_label,
        )

        return {"message": "Password reset successful. You may now sign in with your new password."}

    @classmethod
    def get_audit_logs(cls, current_user: User, db: Session) -> List[AuditLogResponse]:
        """Fetch recent security activity logs for the authenticated user."""
        logs = UserRepository.get_audit_logs(db, current_user.id, limit=15)
        return [
            AuditLogResponse(
                id=log.id,
                event_type=log.event_type,
                ip_address=log.ip_address,
                device=log.device,
                created_at=log.created_at,
            )
            for log in logs
        ]

    @classmethod
    def get_sessions(cls, current_user: User, request: Request, db: Session) -> List[SessionResponse]:
        sessions = UserRepository.get_sessions(db, current_user.id)
        client_ip = request.client.host if request.client else "127.0.0.1"

        res = []
        for s in sessions:
            is_current = False
            if s == sessions[0] or (s.ip_address == client_ip and (datetime.utcnow() - s.last_used_at).total_seconds() < 300):
                is_current = True

            res.append(
                SessionResponse(
                    id=s.id,
                    device=s.device,
                    ip_address=s.ip_address,
                    created_at=s.created_at,
                    last_used_at=s.last_used_at,
                    is_suspicious=s.is_suspicious,
                    current=is_current,
                )
            )
        return res

    @classmethod
    def revoke_session(cls, session_id: int, current_user: User, request: Request, db: Session) -> dict:
        ip_address, device_label = cls.extract_client_info(request)
        session_record = UserRepository.get_session_by_id(db, session_id, current_user.id)
        if not session_record:
            raise HTTPException(status_code=404, detail="Session not found")

        UserRepository.delete_session(db, session_record)
        UserRepository.record_audit_log(
            db=db,
            user_id=current_user.id,
            event_type="SESSION_REVOKED",
            ip_address=ip_address,
            device=device_label,
        )
        return {"message": "Session revoked successfully"}

    @classmethod
    def revoke_all_other_sessions(cls, current_user: User, request: Request, db: Session) -> dict:
        ip_address, device_label = cls.extract_client_info(request)
        UserRepository.delete_other_sessions(db, current_user.id)
        UserRepository.record_audit_log(
            db=db,
            user_id=current_user.id,
            event_type="OTHER_SESSIONS_REVOKED",
            ip_address=ip_address,
            device=device_label,
        )
        return {"message": "All other sessions revoked successfully"}
