"""Pydantic schemas for request validation and response serialization."""
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


class GoogleToken(BaseModel):
    """Body schema for the Google OAuth login endpoint."""
    token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPairResponse(TokenResponse):
    refresh_token: str
