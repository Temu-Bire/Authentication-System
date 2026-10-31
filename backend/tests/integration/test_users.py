"""Integration tests for users endpoints."""
import pytest
from app.models.user import User
from app.services.user_service import UserService


def test_get_all_users_service(db_session):
    users = UserService.get_all_users(db_session)
    assert isinstance(users, list)
