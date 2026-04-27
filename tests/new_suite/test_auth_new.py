import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD

def test_login_logout_flow(client):
    # 1. Access login page
    resp = client.get("/login")
    assert resp.status_code == 200
    assert "Zaloguj" in resp.text

    # 2. Perform login
    resp = client.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
        follow_redirects=False
    )
    # Check redirect to root
    assert resp.status_code in (302, 303)
    assert resp.headers.get("location") == "/"

    # 3. Verify access to dashboard
    resp = client.get("/", follow_redirects=False)
    assert resp.status_code == 200
    # Sidebar or header should have Pulpit
    assert "Pulpit" in resp.text

    # 4. Perform logout
    resp = client.get("/logout", follow_redirects=False)
    assert resp.status_code in (302, 303)
    assert resp.headers.get("location") == "/login"

def test_invalid_login(client):
    resp = client.post(
        "/login",
        data={"username": "wrong", "password": "wrong"},
        follow_redirects=False
    )
    # Should return 401 and show error
    assert resp.status_code == 401
    assert "nieprawidłowy login lub hasło" in resp.text.lower()
