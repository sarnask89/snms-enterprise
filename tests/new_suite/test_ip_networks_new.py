import pytest
from app import models

def test_ip_networks_list(admin_client):
    resp = admin_client.get("/ip-networks")
    assert resp.status_code == 200
    assert "Sieci IP" in resp.text

def test_ip_network_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/ip-networks/new",
        data={
            "name": "E2E-LAN",
            "cidr": "10.10.10.0/24",
            "gateway": "10.10.10.1",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    net = session.query(models.IpNetwork).filter_by(name="E2E-LAN").first()
    assert net is not None
    assert net.cidr == "10.10.10.0/24"

    # 2. Edit
    resp = admin_client.post(
        f"/ip-networks/{net.id}/edit",
        data={
            "name": "E2E-LAN-UPD",
            "cidr": "10.10.10.0/24",
            "gateway": "10.10.10.254",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(net)
    assert net.name == "E2E-LAN-UPD"
    assert net.gateway == "10.10.10.254"

    # 3. Delete
    resp = admin_client.post(f"/ip-networks/{net.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.IpNetwork, net.id) is None
