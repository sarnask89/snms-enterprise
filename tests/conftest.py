import os
import sys

# Shared DB file for ALL tests to ensure consistency and prevent "no such table"
TEST_DB_FILE = "test_crm_final.sqlite"
TEST_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

# CRITICAL: Set environment variables before any other imports
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["TESTING"] = "True"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
import time
from unittest.mock import patch

from app.database import Base, get_db, db_manager
from app.main import app

@pytest.fixture(scope="session", autouse=True)
def global_db_setup():
    """Setup the shared file-based DB for the entire test session."""
    if os.path.exists(TEST_DB_FILE):
        try: os.remove(TEST_DB_FILE)
        except: pass
        
    # 1. Initialize global manager
    db_manager.init_db(TEST_DATABASE_URL)
    
    # 2. Keep connection open for the whole session
    keep_alive = db_manager.engine.connect()
    
    # 3. Create schema
    Base.metadata.create_all(bind=db_manager.engine)
    
    # 4. Seed basic data
    db = db_manager.SessionLocal()
    seed_with_db(db)
    db.close()
    
    yield
    
    keep_alive.close()
    db_manager.engine.dispose()
    
    if os.path.exists(TEST_DB_FILE) and not os.environ.get("KEEP_TEST_DB"):
        try:
            time.sleep(1)
            os.remove(TEST_DB_FILE)
        except:
            pass

@pytest.fixture(name="session")
def session_fixture(global_db_setup):
    """Provides a session to the shared DB."""
    db = db_manager.SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@pytest.fixture(scope="session")
def server(global_db_setup):
    """Starts the FastAPI app in a background process targeting the shared test DB."""
    log_file = open("tests_server.log", "w")
    env = os.environ.copy()
    env["DATABASE_URL"] = TEST_DATABASE_URL
    env["PYTHONPATH"] = os.getcwd()
    env["TESTING"] = "True" 
    
    import subprocess
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

def seed_with_db(db):
    """Common seed logic."""
    from app.nav_access import seed_nav_menu_and_permissions, sync_new_nav_items_and_permissions
    from app import models
    from app.security import hash_password
    from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD

    seed_nav_menu_and_permissions(db)
    sync_new_nav_items_and_permissions(db)
    
    # Ensure admin has access to ALL menu items
    all_items = db.query(models.NavMenuItem).all()
    for item in all_items:
        if db.query(models.RoleMenuPermission).filter_by(role=models.UserRole.admin, nav_item_id=item.id).count() == 0:
            db.add(models.RoleMenuPermission(role=models.UserRole.admin, nav_item_id=item.id, allowed=True))
    db.flush()
    
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
    
    if db.query(models.NumberPlan).count() == 0:
        db.add(models.NumberPlan(name="Default Plan", doc_type=models.NumberPlanDocType.invoice, pattern_template="FV/{year}/{n}", next_number=1, is_default=True, active=True))

    db.commit()
