import pytest
from app.database import get_db, DatabaseSessionManager
from sqlalchemy.orm import Session
import os

def test_get_db():
    gen = get_db()
    db = next(gen)
    assert isinstance(db, Session)
    # Ensure it's closed after generator finishes
    try:
        next(gen)
    except StopIteration:
        pass

def test_database_session_manager_init():
    url = "sqlite:///:memory:"
    manager = DatabaseSessionManager()
    manager.init_db(url)
    assert str(manager.engine.url) == url
    assert manager.SessionLocal is not None
