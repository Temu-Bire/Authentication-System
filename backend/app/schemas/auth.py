"""Authentication schemas."""
from pydantic import BaseModel


class GoogleToken(BaseModel):
    """Body schema for Google OAuth login endpoint."""
    token: str
