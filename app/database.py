from collections.abc import Generator
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import DATABASE_URL

# Function to get engine and session based on current environment
def create_db_factory():
    # Use environment directly to allow dynamic overrides in tests
    url = os.environ.get("DATABASE_URL", DATABASE_URL)
    
    connect_args: dict = {}
    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    _engine = create_engine(url, connect_args=connect_args)
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine, _SessionLocal

engine, SessionLocal = create_db_factory()
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    # Always use the current SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
