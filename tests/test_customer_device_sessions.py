import pytest
from app import models
from datetime import datetime, timezone

def test_delete_customer_device_session_success(admin_client, session):
    # 1. Setup: Create a Customer
    customer = models.Customer(
        customer_code="CUST001",
        first_name="John",
        last_name="Doe",
        status=models.CustomerStatus.active
    )
    session.add(customer)
    session.commit()

    # 2. Setup: Create a CustomerDevice
    device = models.CustomerDevice(
        customer_id=customer.id,
        hostname="test-device",
        status=models.CustomerDeviceStatus.active
    )
    session.add(device)
    session.commit()

    # 3. Setup: Create a CustomerDeviceSession
    device_session = models.CustomerDeviceSession(
        device_id=device.id,
        started_at=datetime.now(timezone.utc),
        ip_address="192.168.1.10",
        source="manual"
    )
    session.add(device_session)
    session.commit()
    session_id = device_session.id

    # 4. Action: Call the delete endpoint
    response = admin_client.post(f"/customer-devices/sessions/{session_id}/delete", follow_redirects=False)

    # 5. Verify: Check redirect and database
    assert response.status_code == 303
    assert response.headers["location"] == "/customer-devices/sessions"

    deleted_session = session.get(models.CustomerDeviceSession, session_id)
    assert deleted_session is None

def test_delete_customer_device_session_not_found(admin_client, session):
    # 1. Action: Call the delete endpoint with non-existent ID
    non_existent_id = 99999
    response = admin_client.post(f"/customer-devices/sessions/{non_existent_id}/delete", follow_redirects=False)

    # 2. Verify: Should still redirect to sessions list
    assert response.status_code == 303
    assert response.headers["location"] == "/customer-devices/sessions"
