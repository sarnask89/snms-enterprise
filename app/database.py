from collections.abc import Generator
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool
from app.config import DATABASE_URL

Base = declarative_base()

class DatabaseSessionManager:
    def __init__(self):
        self.engine = None
        self.SessionLocal = None
        self.init_db(os.environ.get("DATABASE_URL", DATABASE_URL))

    def init_db(self, url: str):
        # Use QueuePool for better concurrency in tests
        connect_args = {}
        if url.startswith("sqlite"):
            connect_args["check_same_thread"] = False
        
        self.engine = create_engine(
            url, 
            connect_args=connect_args,
            poolclass=QueuePool,
            pool_size=10,
            max_overflow=20
        )
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

# Global manager instance
db_manager = DatabaseSessionManager()

# Legacy aliases for backward compatibility
SessionLocal = db_manager.SessionLocal
engine = db_manager.engine

def get_db() -> Generator[Session, None, None]:
    db = db_manager.SessionLocal()
    try:
        yield db
    finally:
        db.close()
