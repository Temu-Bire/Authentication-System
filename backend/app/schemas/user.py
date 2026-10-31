"""User and session schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Temesgen Birhanu"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = "Temesgen Birhanu"
    is_2fa_enabled: bool = False
    login_alerts: bool = True
    profile_visibility: bool = True
    data_sharing: bool = False
    marketing_emails: bool = False
    last_login_ip: Optional[str] = None
    last_login_at: Optional[datetime] = None
    google_id: Optional[str] = None
    has_suspicious_activity: bool = False

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class PrivacySettingsUpdateRequest(BaseModel):
    profile_visibility: Optional[bool] = None
    data_sharing: Optional[bool] = None
    marketing_emails: Optional[bool] = None


class SecuritySettingsUpdateRequest(BaseModel):
    login_alerts: Optional[bool] = None
    is_2fa_enabled: Optional[bool] = None


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
