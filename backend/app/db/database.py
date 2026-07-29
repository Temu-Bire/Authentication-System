
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DIRECT_URL, DATABASE_URL

db_url = DIRECT_URL or DATABASE_URL or "sqlite:///./sql_app.db"
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def init_db():
    """Create tables and ensure missing columns are added automatically."""
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        # Postgres migrations for new columns if table existed prior
        if "postgresql" in engine.name:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR;"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


