import os
import sys

# CRITICAL: Set environment variables before any other imports
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["TESTING"] = "True"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import patch

from app.database import Base, get_db
import app.database
from app.main import app

# File for E2E tests
E2E_DB_FILE = "test_e2e_crm.sqlite"
E2E_DATABASE_URL = f"sqlite:///{E2E_DB_FILE}"

@pytest.fixture(scope="session")
def e2e_db_setup():
    """Setup a file-based DB for E2E tests."""
    if os.path.exists(E2E_DB_FILE):
        try: os.remove(E2E_DB_FILE)
        except: pass
        
    engine = create_engine(E2E_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    seed_with_db(db)
    db.close()
    engine.dispose()
    
    yield E2E_DATABASE_URL
    
    if os.path.exists(E2E_DB_FILE) and not os.environ.get("KEEP_TEST_DB"):
        try:
            time.sleep(1)
            os.remove(E2E_DB_FILE)
        except:
            pass

@pytest.fixture(scope="session")
def server(e2e_db_setup):
    """Starts the FastAPI app in a background process."""
    log_file = open("tests_server.log", "w")
    env = os.environ.copy()
    env["DATABASE_URL"] = e2e_db_setup
    env["PYTHONPATH"] = os.getcwd()
    env["TESTING"] = "True" 
    
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8001", "--log-level", "debug"],
        env=env,
        stdout=log_file,
        stderr=log_file
    )
    
    time.sleep(5)
    yield "http://127.0.0.1:8001"
    
    proc.terminate()
    proc.wait()
    log_file.close()

@pytest.fixture(name="session")
def session_fixture():
    """Clean in-memory DB for every test (isolated by engine)."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Patch the global SessionLocal so middleware uses our test DB
    with patch("app.database.SessionLocal", LocalSession):
        db = LocalSession()
        seed_with_db(db)
        try:
            yield db
        finally:
            db.close()
            engine.dispose()

@pytest.fixture(name="db")
def db_fixture(session):
    yield session

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

import subprocess
import time

def seed_with_db(db):
    """Common seed logic."""
    from app.nav_access import seed_nav_menu_and_permissions, sync_new_nav_items_and_permissions
    from app import models
    from app.security import hash_password
    from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD

    seed_nav_menu_and_permissions(db)
    sync_new_nav_items_and_permissions(db)
    
    if db.query(models.PortalUser).filter_by(username=CRM_ADMIN_USER).count() == 0:
        db.add(models.PortalUser(
            username=CRM_ADMIN_USER,
            password_hash=hash_password(CRM_ADMIN_PASSWORD),
            role=models.UserRole.admin,
            active=True
        ))
    
    if db.query(models.LocationCity).filter_by(name="Test-City-Sando").count() == 0:
        state = models.LocationState(name="Test-State", teryt_code="T1")
        db.add(state)
        db.flush()
        dist = models.LocationDistrict(name="Test-Dist", state_id=state.id, teryt_code="D1")
        db.add(dist)
        db.flush()
        sando = models.LocationCity(name="Test-City-Sando", district_id=dist.id, is_managed=True, is_default=True, is_active=True)
        db.add(sando)
        db.flush()
        db.add(models.LocationStreet(name="Test-Rynek", city_id=sando.id, teryt_code="S1"))

    if db.query(models.NetDeviceType).count() == 0:
        for n in ("router", "switch", "ont", "server", "other"):
            db.add(models.NetDeviceType(name=n))
    
    if db.query(models.VatRate).count() == 0:
        db.add(models.VatRate(label="23%", rate_percent=23.0, is_default=True))

    db.commit()
