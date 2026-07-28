"""
SQLAlchemy engine, session factory, and Base.
Uses DIRECT_URL (session-mode pooler) for ORM operations.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DIRECT_URL

engine = create_engine(DIRECT_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
