"""SQLAlchemy models for User and Session."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True, default="Temesgen Birhanu")
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=True)  # nullable for Google-only accounts
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    google_id = Column(String, unique=True, nullable=True)

    # 2FA and Security Settings
    is_2fa_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
    login_alerts = Column(Boolean, default=True)

    # Privacy Settings
    profile_visibility = Column(Boolean, default=True)
    data_sharing = Column(Boolean, default=False)
    marketing_emails = Column(Boolean, default=False)

    # Suspicious login detection
    last_login_ip = Column(String, nullable=True)
    last_login_at = Column(DateTime, nullable=True)

    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    refresh_token_hash = Column(String, nullable=False, unique=True)
    device = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, default=datetime.utcnow)
    is_suspicious = Column(Boolean, default=False)

    user = relationship("User", back_populates="sessions")
