import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD
from app import models

@pytest.fixture
def logged_client(client):
    client.post("/login", data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD})
    return client

def test_admin_users_add_is_redirect(logged_client):
    """Test if /admin/users/add is a redirect to /admin/users/new."""
    response = logged_client.get("/admin/users/add", follow_redirects=False)
    assert response.status_code == 303
    assert "/admin/users/new" in response.headers["location"]

def test_net_device_serial_number_persistence(logged_client):
    """Test if serial_number is correctly saved and displayed for NetDevice."""
    sn = "SN-TEST-123"
    # Create
    response = logged_client.post(
        "/net-devices/new",
        data={
            "name": "Test Device",
            "hostname": "test-host",
            "serial_number": sn,
            "device_type": "switch",
            "status": "active"
        },
        follow_redirects=True
    )
    assert response.status_code == 200
    assert sn in response.text

def test_node_list_template_fields(logged_client):
    """Test if Node list template correctly displays hostname and status."""
    hostname = "host-test-999"
    # Create
    logged_client.post(
        "/customer-devices/new",
        data={
            "customer_id": "1",
            "name": hostname,
            "active": "on"
        },
        follow_redirects=True
    )
    
    # Check list
    response = logged_client.get("/customer-devices")
    assert response.status_code == 200
    assert hostname in response.text
    assert "AKTYWNE" in response.text
