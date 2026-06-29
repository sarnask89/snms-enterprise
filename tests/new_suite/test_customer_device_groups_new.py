import pytest
from app import models

def test_node_groups_list(admin_client):
    resp = admin_client.get("/device-groups")
    assert resp.status_code == 200
    assert "Grupy komputerów" in resp.text

def test_node_groups_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/device-groups/new",
        data={
            "name": "Laptops",
            "description": "Mobile devices"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303

    g = session.query(models.CustomerDeviceGroup).filter_by(name="Laptops").first()
    assert g is not None

    # 2. Edit (and sync nodes)
    # Create some devices to sync
    c = models.Customer(first_name="Test", last_name="User", customer_code="TEST-01")
    net = models.IpNetwork(name="TestNet", cidr="10.0.0.0/24")
    session.add_all([c, net])
    session.flush()

    d1 = models.CustomerDevice(name="D1", hostname="d1.local", customer_id=c.id, ip_network_id=net.id)
    d2 = models.CustomerDevice(name="D2", hostname="d2.local", customer_id=c.id, ip_network_id=net.id)
    session.add_all([d1, d2])
    session.commit()

    resp = admin_client.post(
        f"/device-groups/{g.id}/edit",
        data={
            "name": "Laptops Updated",
            "device_id": [d1.id, d2.id]
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(g)
    assert g.name == "Laptops Updated"
    assert len(g.devices) == 2

    # 3. Sync with empty list
    resp = admin_client.post(
        f"/device-groups/{g.id}/edit",
        data={
            "name": "Laptops Empty",
            "device_id": []
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(g)
    assert len(g.devices) == 0

    # 4. Delete
    resp = admin_client.post(f"/device-groups/{g.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.CustomerDeviceGroup, g.id) is None
