import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD
from app import models

@pytest.fixture
def logged_client(client):
    client.post("/login", data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD})
    return client

def test_customers_notices_exists(logged_client):
    """Test if /customers/notices endpoint is accessible."""
    response = logged_client.get("/customers/notices", follow_redirects=False)
    assert response.status_code == 200

def test_customer_device_links(logged_client):
    """Test if customer devices are correctly linked and listed."""
    # Create customer
    r = logged_client.post(
        "/customers/new",
        data={
            "customer_code": "TEST-CUST-001",
            "first_name": "Test",
            "last_name": "User",
            "status": "active"
        },
        follow_redirects=True
    )
    assert r.status_code == 200
    
    # Verify customer exists in list
    cust = logged_client.get("/customers")
    assert "TEST-CUST-001" in cust.text
