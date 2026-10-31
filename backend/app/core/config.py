import os
import warnings
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")
DIRECT_URL: str = os.getenv("DIRECT_URL", "")

SECRET_KEY: str = os.getenv("SECRET_KEY", "").strip()
if not SECRET_KEY:
    warnings.warn(
        "SECRET_KEY environment variable is not set! Using an insecure temporary key for development. "
        "Please configure a strong SECRET_KEY in production.",
        RuntimeWarning,
    )
    SECRET_KEY = "dev-insecure-secret-key-change-in-production-1234567890"

ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
