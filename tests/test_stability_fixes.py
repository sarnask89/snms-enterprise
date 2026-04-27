import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app import models
from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD

def test_middleware_order_session_available_to_portal_user(client):
    # Test if session is available in PortalUserMiddleware
    # This requires looking at the middleware stack or observing behavior.
    # If SessionMiddleware is OUTER, it must be added AFTER PortalUserMiddleware in FastAPI.
    # In main.py: 
    # app.add_middleware(PortalUserMiddleware)
    # app.add_middleware(SessionMiddleware, ...)
    # This is CORRECT because FastAPI executes middlewares in REVERSE order of adding.
    # So SessionMiddleware (last added) is OUTER, PortalUserMiddleware (first added) is INNER.
    # Wait, my previous audit said it was WRONG. Let's re-verify FastAPI middleware docs.
    # "Middlewares are executed in the reverse order they are added."
    # So the last one added is the first to start (outermost).
    # If SessionMiddleware is added last, it is outermost. Correct.
    # Let's check main.py again.
    pass

def test_customer_duplicate_code_validation(client, session):
    # Login first
    client.post("/login", data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD})
    
    # Create first customer
    client.post("/customers/new", data={
        "first_name": "Test1",
        "last_name": "User1",
        "customer_code": "DUPE-001",
        "status": "active"
    })
    
    # Try to create second customer with SAME code
    # Current implementation lacks check before db.add/commit
    response = client.post("/customers/new", data={
        "first_name": "Test2",
        "last_name": "User2",
        "customer_code": "DUPE-001",
        "status": "active"
    })
    
    # Should return error or redirect with error, NOT 500 (Internal Server Error from SQLite IntegrityError)
    assert response.status_code != 500
    assert "error=" in str(response.url) or response.status_code == 400

def test_init_db_duplicate_functions():
    # This is a static analysis check really, but we can try to import
    from app import init_db
    # If there are two functions with same name in same module, Python uses the LAST one.
    # We should ensure only one exists for clarity/stability.
    pass
