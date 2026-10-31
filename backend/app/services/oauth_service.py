"""Google OAuth service."""
from fastapi import HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy.orm import Session

from app.core.config import GOOGLE_CLIENT_ID
from app.repositories.user_repository import UserRepository
from app.repositories.oauth_repository import OAuthRepository


class OAuthService:
    @staticmethod
    def verify_google_token(token_str: str) -> dict:
        """Verify the Google OAuth token against Google Client ID."""
        try:
            return id_token.verify_oauth2_token(
                token_str,
                google_requests.Request(),
                GOOGLE_CLIENT_ID,
            )
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid Google token")

    @staticmethod
    def authenticate_or_register_google_user(db: Session, google_user: dict):
        email: str = google_user["email"]
        google_id: str = google_user["sub"]

        user = UserRepository.get_by_email(db, email)
        if not user:
            user = UserRepository.create(db, email=email, google_id=google_id)
        elif user.google_id is None:
            user = OAuthRepository.link_google_account(db, user, google_id)

        return user
