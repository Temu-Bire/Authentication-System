"""Custom exceptions for the authentication system."""
from fastapi import HTTPException, status


class AuthException(HTTPException):
    def __init__(self, detail: str = "Authentication failed", status_code: int = status.HTTP_401_UNAUTHORIZED):
        super().__init__(status_code=status_code, detail=detail)


class CredentialsException(AuthException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class AccountLockedException(AuthException):
    def __init__(self, detail: str = "Account temporarily locked"):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class UserNotFoundException(AuthException):
    def __init__(self, detail: str = "User not found"):
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class PermissionDeniedException(AuthException):
    def __init__(self, detail: str = "Operation not permitted"):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)
