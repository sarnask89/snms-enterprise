from fastapi.testclient import TestClient
from app.main import app
from app import models
from sqlalchemy.orm import Session
import pytest

@pytest.fixture
def client():
    with TestClient(app) as c:
        # Mock login
        # In this app, we might need to actually login or bypass it
        yield c

def test_audit_logs_endpoint(admin_client: TestClient):
    # This fixture seems to be available in conftest.py
    response = admin_client.get("/admin/audit-logs")
    assert response.status_code == 200
    # Check if some expected content is there
    assert "Dziennik zdarzeń" in response.text

def test_reload_list_endpoint(admin_client: TestClient):
    response = admin_client.get("/admin/reload")
    assert response.status_code == 200
    assert "Przeładowanie (log)" in response.text

def test_user_groups_edit_form_endpoint(admin_client: TestClient, db: Session):
    # Create a group to edit
    group = models.PortalUserGroup(name="Test Group", description="Desc")
    db.add(group)
    db.commit()

    response = admin_client.get(f"/admin/user-groups/{group.id}/edit")
    assert response.status_code == 200
    assert "Edycja grupy: Test Group" in response.text
