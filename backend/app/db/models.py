"""SQLAlchemy ORM models."""
from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=True)  # nullable for Google-only accounts
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
