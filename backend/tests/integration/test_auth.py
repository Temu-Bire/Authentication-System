"""Integration tests for authentication endpoints."""
import pytest
from starlette.requests import Request
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService


def test_auth_registration_flow(db_session):
    scope = {"type": "http", "client": ("127.0.0.1", 12345), "headers": []}
    req = Request(scope)

    user_in = UserCreate(email="integration_test@example.com", password="SecurePassword123!")
    res = AuthService.register(user_in, req, db_session)

    assert "access_token" in res
    assert "refresh_token" in res
    assert res["token_type"] == "bearer"
