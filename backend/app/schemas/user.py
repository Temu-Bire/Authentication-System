"""User and session schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    last_login_ip: Optional[str] = None
    last_login_at: Optional[datetime] = None
    google_id: Optional[str] = None
    has_suspicious_activity: bool = False

    class Config:
        from_attributes = True


class SessionResponse(BaseModel):
    id: int
    device: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    last_used_at: datetime
    is_suspicious: bool
    current: bool = False

    class Config:
        from_attributes = True
