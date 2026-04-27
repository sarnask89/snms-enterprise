import pytest
from app import models

def test_net_nodes_list(admin_client):
    resp = admin_client.get("/net-nodes")
    assert resp.status_code == 200
    assert "Węzły sieci" in resp.text

def test_net_node_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/net-nodes/new",
        data={
            "name": "E2E-POP-01",
            "node_type": "pop",
            "status": "active",
            "latitude": "52.2297",
            "longitude": "21.0122"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # 2. Verify in DB
    node = session.query(models.NetNode).filter_by(name="E2E-POP-01").first()
    assert node is not None
    assert node.node_type == "pop"

    # 3. Edit
    resp = admin_client.post(
        f"/net-nodes/{node.id}/edit",
        data={
            "name": "E2E-POP-01-UPD",
            "node_type": "pop",
            "status": "active",
            "latitude": "52.2300",
            "longitude": "21.0130"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(node)
    assert node.name == "E2E-POP-01-UPD"

    # 4. Delete
    resp = admin_client.post(f"/net-nodes/{node.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.NetNode, node.id) is None

def test_net_devices_list(admin_client):
    resp = admin_client.get("/net-devices")
    assert resp.status_code == 200
    assert "Katalog osprzętu" in resp.text

def test_net_device_crud(admin_client, session):
    # Setup: need a NetDeviceType if not seeded enough, but conftest seeds some
    # router, switch, ont, server, other
    
    # 1. Create
    resp = admin_client.post(
        "/net-devices/new",
        data={
            "name": "E2E-SW-01",
            "hostname": "sw-01",
            "management_ip": "10.255.0.1",
            "device_type": "switch",
            "status": "active"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # 2. Verify
    dev = session.query(models.NetDevice).filter_by(name="E2E-SW-01").first()
    assert dev is not None
    assert dev.hostname == "sw-01"

    # 3. Delete
    resp = admin_client.post(f"/net-devices/{dev.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.NetDevice, dev.id) is None
