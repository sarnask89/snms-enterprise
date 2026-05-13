import pytest
from app import models

def test_nodes_list(admin_client):
    resp = admin_client.get("/customer-devices")
    assert resp.status_code == 200
    assert "Komputery / urządzenia klientów" in resp.text

def test_node_crud(admin_client, session):
    # Setup: need a customer and network
    c = models.Customer(first_name="Node", last_name="Owner", customer_code="NODE-01", status=models.CustomerStatus.active)
    net = models.IpNetwork(name="NodeNet", cidr="10.20.30.0/24", active=True)
    session.add_all([c, net])
    session.commit()

    # 1. Create
    resp = admin_client.post(
        "/customer-devices/new",
        data={
            "customer_id": c.id,
            "name": "test-pc",
            "ip_address": "10.20.30.5",
            "active": "on",
            "ip_network_id": net.id
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    node = session.query(models.CustomerDevice).filter_by(name="test-pc").first()
    assert node is not None

    # 2. Edit
    resp = admin_client.post(
        f"/customer-devices/{node.id}/edit",
        data={
            "customer_id": c.id,
            "name": "test-pc-upd",
            "ip_address": "10.20.30.6",
            "active": "on",
            "ip_network_id": net.id
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(node)
    assert node.name == "test-pc-upd"

    # 3. Delete
    resp = admin_client.post(f"/customer-devices/{node.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.CustomerDevice, node.id) is None

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

    # 2. Delete
    resp = admin_client.post(f"/device-groups/{g.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
