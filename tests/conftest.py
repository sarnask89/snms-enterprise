import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.init_db import (
    seed,
    ensure_default_catalog_seed,
    ensure_plan_extensions,
    ensure_portal_rbac,
    ensure_helpdesk_seed,
    ensure_app_settings
)

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # We don't run Alembic for in-memory DB in simple tests, 
    # create_all is enough as we start from scratch.
    
    db = TestingSessionLocal()
    try:
        # Seed the test database
        seed_with_db(db)
        yield db
    finally:
        db.close()

@pytest.fixture(name="client")
def client_fixture(session):
    def get_db_override():
        yield session

    app.dependency_overrides[get_db] = get_db_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="admin_client")
def admin_client_fixture(client):
    from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD
    client.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
    )
    return client

def seed_with_db(db):
    """Modified seed logic that takes a session directly for testing."""
    # This is a helper to run our seed functions on the test session
    from app.nav_access import seed_nav_menu_and_permissions, sync_new_nav_items_and_permissions
    from app import models
    from app.security import hash_password
    from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD
    import os

    # Seed navigation
    seed_nav_menu_and_permissions(db)
    sync_new_nav_items_and_permissions(db)
    
    # Minimal user seed for tests
    if db.query(models.PortalUser).count() == 0:
        db.add(models.PortalUser(
            username=CRM_ADMIN_USER,
            password_hash=hash_password(CRM_ADMIN_PASSWORD),
            role=models.UserRole.admin,
            active=True
        ))
    
    # Add other catalog seeds
    if db.query(models.NetDeviceType).count() == 0:
        for n in ("router", "switch", "ont", "server", "other"):
            db.add(models.NetDeviceType(name=n))
    
    if db.query(models.MessageTemplate).count() == 0:
        t = models.MessageTemplate(
            name="Domyślny",
            subject="Wiadomość z CRM",
            body="Dzień dobry,\n\nTo jest wiadomość testowa."
        )
        db.add(t)
        db.flush()
        print(f"DEBUG: Seeded message template with ID={t.id}")

    db.commit()
