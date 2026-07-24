import pytest
from app import models

def test_get_customer_nodes_htmx(admin_client, session):
    """Test dynamic HTMX device selection for a customer."""
    # 1. Create customer and 2 devices
    c = models.Customer(first_name="Sub", last_name="Tester", customer_code="S-01")
    session.add(c)
    session.flush()
    
    n1 = models.CustomerDevice(customer_id=c.id, name="node-1", hostname="node-1", status=models.CustomerDeviceStatus.active)
    n2 = models.CustomerDevice(customer_id=c.id, name="node-2", hostname="node-2", status=models.CustomerDeviceStatus.active)
    session.add_all([n1, n2])
    session.commit()
    
    # 2. Get HTMX partial
    resp = admin_client.get(f"/subscriptions/customer-nodes/{c.id}")
    assert resp.status_code == 200
    assert "node-1" in resp.text
    assert "node-2" in resp.text
    assert f'value="{n1.id}"' in resp.text
    assert f'value="{n2.id}"' in resp.text

def test_subscription_links_to_node(admin_client, session):
    """Verify that a subscription correctly links to a specific device."""
    # 1. Setup data
    c = models.Customer(first_name="Sub", last_name="Tester", customer_code="S-02")
    session.add(c)
    session.flush()
    
    n = models.CustomerDevice(customer_id=c.id, name="specific-node", hostname="specific-node", status=models.CustomerDeviceStatus.active)
    session.add(n)
    session.flush()
    
    t = models.Tariff(name="Plan A", monthly_price=50.00, active=True)
    session.add(t)
    session.commit()
    
    # 2. Create subscription linked to device
    resp = admin_client.post(
        "/subscriptions/new",
        data={
            "customer_id": c.id,
            "device_id": n.id,
            "tariff_id": t.id,
            "start_date": "2026-01-01",
            "active": "on",
            "technology": "FTTH"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # 3. Verify in DB
    sub = session.query(models.Subscription).filter_by(customer_id=c.id).first()
    assert sub is not None
    assert sub.device_id == n.id
    assert sub.device.hostname == "specific-node"
