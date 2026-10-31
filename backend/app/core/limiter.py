"""Backward compatibility re-export of limiter."""
from app.middleware.rate_limit import limiter

__all__ = ["limiter"]
