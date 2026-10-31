"""Authentication schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class GoogleToken(BaseModel):
    """Body schema for Google OAuth login endpoint."""
    token: str


class PasswordChangeRequest(BaseModel):
    """Body schema for in-app password change."""
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    """Body schema to initiate password recovery."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Body schema to complete password reset with token."""
    token: str
    new_password: str


class AuditLogResponse(BaseModel):
    """Schema for returning security activity logs."""
    id: int
    event_type: str
    ip_address: Optional[str] = None
    device: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
