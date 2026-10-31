"""SQLAlchemy engine and database initialization."""
from sqlalchemy import create_engine, text
from app.core.config import DIRECT_URL, DATABASE_URL
from app.db.base import Base

db_url = DIRECT_URL or DATABASE_URL or "sqlite:///./sql_app.db"
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, connect_args=connect_args)


def init_db():
    """Create tables and ensure required columns are present."""
    # Ensure models are imported so Base.metadata knows about them
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        if "postgresql" in engine.name:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;"))
