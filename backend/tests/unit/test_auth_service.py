"""Unit tests for AuthService password and token operations."""
import pytest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)
from app.utils.validate import validate_password


def test_password_validation():
    valid, errors = validate_password("StrongP@ss1")
    assert valid is True
    assert len(errors) == 0

    invalid, errors = validate_password("weak")
    assert invalid is False
    assert len(errors) > 0


def test_password_hashing():
    raw = "MySecurePassword123!"
    hashed = hash_password(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword123!", hashed) is False


def test_jwt_access_token():
    payload = {"sub": "user@example.com"}
    token = create_access_token(payload)
    decoded = decode_token(token)
    assert decoded["sub"] == "user@example.com"
    assert decoded["type"] == "access"
