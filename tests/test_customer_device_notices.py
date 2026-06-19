import pytest
from sqlalchemy import select
from app import models

@pytest.mark.integration
def test_node_notice_delete(admin_client, session):
    # 1. Setup test data
    # Create a customer
    customer = models.Customer(
        customer_code="TEST-NOTICE-CUST",
        first_name="Jan",
        last_name="Tester",
    )
    session.add(customer)
    session.flush()

    # Create a customer device
    device = models.CustomerDevice(
        customer_id=customer.id,
        hostname="test-device-notice",
        ip_address="1.2.3.4",
    )
    session.add(device)
    session.flush()

    # Create a customer device notice
    notice = models.CustomerDeviceNotice(
        device_id=device.id,
        title="Test Notice",
        body="This is a test notice.",
        is_active=True
    )
    session.add(notice)
    session.commit()

    notice_id = notice.id

    # 2. Action: Delete the notice via API
    resp = admin_client.post(f"/customer-devices/notices/{notice_id}/delete", follow_redirects=False)

    # 3. Verification
    assert resp.status_code == 303
    assert resp.headers["Location"] == "/customer-devices/notices"

    # Check if notice is gone from DB
    deleted_notice = session.get(models.CustomerDeviceNotice, notice_id)
    assert deleted_notice is None

@pytest.mark.integration
def test_node_notice_delete_nonexistent(admin_client, session):
    # Action: Delete a non-existent notice
    resp = admin_client.post("/customer-devices/notices/99999/delete", follow_redirects=False)

    # Verification
    assert resp.status_code == 303
    assert resp.headers["Location"] == "/customer-devices/notices"
