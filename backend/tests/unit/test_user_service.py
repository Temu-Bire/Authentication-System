"""Unit tests for UserService profile formatting."""
import pytest
from app.models.user import User
from app.services.user_service import UserService


def test_user_profile_response(db_session):
    test_user = User(
        id=1,
        email="profile_test@example.com",
        last_login_ip="127.0.0.1",
    )
    profile = UserService.get_profile(test_user, db_session)
    assert profile.email == "profile_test@example.com"
    assert profile.last_login_ip == "127.0.0.1"
    assert profile.has_suspicious_activity is False
