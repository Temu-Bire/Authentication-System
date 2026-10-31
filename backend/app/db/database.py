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
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR DEFAULT 'Temesgen Birhanu';"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS login_alerts BOOLEAN DEFAULT TRUE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT TRUE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS data_sharing BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;"))
        elif "sqlite" in engine.name:
            # Check SQLite table info and add columns if missing
            cursor = conn.connection.cursor()
            cursor.execute("PRAGMA table_info(users)")
            existing_cols = {col[1] for col in cursor.fetchall()}
            if "full_name" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR DEFAULT 'Temesgen Birhanu';"))
            if "is_2fa_enabled" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_2fa_enabled BOOLEAN DEFAULT 0;"))
            if "two_factor_secret" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR;"))
            if "login_alerts" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN login_alerts BOOLEAN DEFAULT 1;"))
            if "profile_visibility" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN profile_visibility BOOLEAN DEFAULT 1;"))
            if "data_sharing" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN data_sharing BOOLEAN DEFAULT 0;"))
            if "marketing_emails" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN marketing_emails BOOLEAN DEFAULT 0;"))
