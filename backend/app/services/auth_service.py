"""Authentication and session business logic service."""
from datetime import datetime, timedelta
import hashlib
from typing import Tuple, List, Optional
from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    JWTError,
)
from app.models.user import User, Session as UserSession
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin, SessionResponse
from app.schemas.token import TokenPairResponse, TokenResponse
from app.utils.validate import validate_password

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


class AuthService:
    @staticmethod
    def extract_client_info(request: Request) -> Tuple[str, str]:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else "127.0.0.1"

        user_agent = request.headers.get("user-agent", "Unknown Device")
        if len(user_agent) > 100:
            user_agent = user_agent[:97] + "..."

        return ip_address, user_agent

    @classmethod
    def create_session(cls, user: User, refresh_token: str, request: Request, db: Session) -> UserSession:
        ip_address, user_agent = cls.extract_client_info(request)

        # Detect suspicious login: IP differs from last known login IP
        is_suspicious = False
        if user.last_login_ip and user.last_login_ip != ip_address:
            is_suspicious = True

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        return UserRepository.create_session(
            db=db,
            user=user,
            token_hash=token_hash,
            device=user_agent,
            ip_address=ip_address,
            is_suspicious=is_suspicious,
        )

    @classmethod
    def register(cls, user_data: UserCreate, request: Request, db: Session) -> dict:
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
            if db_user.failed_login_attempts >= MAX_ATTEMPTS:
                db_user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
                db.commit()
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
    def logout(cls, refresh_token: Optional[str], db: Session) -> dict:
        """Revoke active session on server when user logs out."""
        if refresh_token:
            token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
            session_record = UserRepository.get_session_by_hash(db, token_hash)
            if session_record:
                UserRepository.delete_session(db, session_record)
        return {"message": "Logged out successfully"}

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
    def revoke_session(cls, session_id: int, current_user: User, db: Session) -> dict:
        session_record = UserRepository.get_session_by_id(db, session_id, current_user.id)
        if not session_record:
            raise HTTPException(status_code=404, detail="Session not found")

        UserRepository.delete_session(db, session_record)
        return {"message": "Session revoked successfully"}

    @classmethod
    def revoke_all_other_sessions(cls, current_user: User, db: Session) -> dict:
        UserRepository.delete_other_sessions(db, current_user.id)
        return {"message": "All other sessions revoked successfully"}
