"""
Testy integracyjne zapisu/odczytu jak w przeglądarce (sesja admin → POST → 303).
Uzupełniają ręczne testy UI; nie zastępują testów smoke (`test_smoke.py`).
Core focus: Customers, NetDevices, Tariffs, NetNodes.
"""

import re
import uuid

import pytest
from fastapi.testclient import TestClient

from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER
from app.main import app
from app import models

@pytest.mark.integration
def test_customer_create_edit_delete_roundtrip(admin_client):
    code = f"E2E-INT-{uuid.uuid4().hex[:10]}"
    client = admin_client
    r = client.post(
        "/customers/new",
        data={
            "customer_code": code,
            "first_name": "Int",
            "last_name": "CRUD",
            "email": "int-crud@test.local",
            "status": "active",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    assert r.headers.get("location") == "/customers"

    lst = client.get("/customers", params={"q": code})
    assert lst.status_code == 200
    m = re.search(r'href="/customers/(\d+)/edit"', lst.text)
    assert m, "brak wiersza klienta po utworzeniu"
    cid = int(m.group(1))

    r = client.post(
        f"/customers/{cid}/edit",
        data={
            "customer_code": code,
            "first_name": "Int",
            "last_name": "CRUD",
            "email": "int-crud@test.local",
            "phone": "600111222",
            "status": "active",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303

    r = client.post(f"/customers/{cid}/delete", follow_redirects=False)
    assert r.status_code == 303


@pytest.mark.integration
def test_net_device_create_edit_delete(admin_client):
    client = admin_client
    # Get any producer if exists, otherwise empty
    cfg = client.get("/config/netdev-catalog")
    pm = re.search(r'href="/config/producers/(\d+)/edit"', cfg.text)
    producer_id = pm.group(1) if pm else ""

    r = client.post(
        "/net-devices/new",
        data={
            "name": "E2E-Switch-01",
            "producer_id": producer_id,
            "hostname": "sw-e2e-01",
            "serial_number": "E2E-SN-01",
            "management_ip": "10.99.0.1",
            "device_type": "switch",
            "status": "active",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    lst = client.get("/net-devices", headers={"HX-Request": "false"})
    assert "E2E-SN-01" in lst.text

    m = re.search(r'href="/net-devices/(\d+)/edit"', lst.text)
    assert m
    did = int(m.group(1))

    r = client.post(
        f"/net-devices/{did}/edit",
        data={
            "name": "E2E-Switch-01b",
            "hostname": "sw-e2e-01",
            "management_ip": "10.99.0.2",
            "device_type": "switch",
            "net_device_model_id": "",
            "status": "active",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303

    r = client.post(f"/net-devices/{did}/delete", follow_redirects=False)
    assert r.status_code == 303


@pytest.mark.integration
def test_tariff_create_edit_delete(admin_client, session):
    client = admin_client
    vat = session.query(models.VatRate).first()
    if not vat:
        vat = models.VatRate(label="23%", rate_percent=23.0, is_default=True)
        session.add(vat)
        session.commit()
    
    tag = uuid.uuid4().hex[:6]
    name = f"T-Fiber-{tag}"
    
    # 1. Create
    r = client.post(
        "/finances/tariffs/new",
        data={
            "name": name,
            "monthly_price": "100.00",
            "vat_rate_id": str(vat.id),
            "speed_down_mbps": "1000",
            "speed_up_mbps": "300",
            "description": "pytest e2e"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    page = client.get("/finances/tariffs")
    assert name in page.text

    # 2. Edit
    m = re.search(f'href="/finances/tariffs/(\\d+)/edit"', page.text)
    assert m
    tid = m.group(1)
    
    r = client.post(
        f"/finances/tariffs/{tid}/edit",
        data={
            "name": name + "-UPD",
            "monthly_price": "200.00",
            "vat_rate_id": str(vat.id),
            "speed_down_mbps": "2000",
            "speed_up_mbps": "600",
            "active": "on"
        },
        follow_redirects=False
    )
    assert r.status_code == 303
    
    # 3. Delete
    r = client.post(f"/finances/tariffs/{tid}/delete", follow_redirects=False)
    assert r.status_code == 303


@pytest.mark.integration
def test_net_node_create_edit_delete(admin_client):
    client = admin_client
    page = client.get("/net-nodes/new")
    # Try to find a city seeded in conftest
    m = re.search(r'<option value="(\d+)"[^>]*>Sandomierz', page.text)
    if not m:
        m = re.search(r'<option value="(\d+)"', page.text)
    city_id = m.group(1) if m else "1"

    r = client.post(
        "/net-nodes/new",
        data={
            "name": "E2E-POP-NODE",
            "location_city_id": city_id,
            "street_number": "12",
            "latitude": "50.68",
            "longitude": "21.74",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    lst = client.get("/net-nodes", headers={"HX-Request": "false"})
    assert "E2E-POP-NODE" in lst.text
    m = re.search(r'href="/net-nodes/(\d+)/edit"', lst.text)
    assert m
    nid = int(m.group(1))
    r = client.post(f"/net-nodes/{nid}/delete", follow_redirects=False)
    assert r.status_code == 303


@pytest.mark.integration
def test_customer_device_links_net_and_device(admin_client):
    tag = uuid.uuid4().hex[:10]
    client = admin_client
    
    # 1. Create IP Network
    r = client.post(
        "/ip-networks/new",
        data={
            "name": f"E2E-Net-{tag}",
            "cidr": f"10.250.77.0/24",
            "active": "on",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    
    lst = client.get("/ip-networks", params={"q": tag})
    m = re.search(r'href="/ip-networks/(\d+)/edit"', lst.text)
    assert m
    net_id = int(m.group(1))

    # 2. Create NetDevice
    r = client.post(
        "/net-devices/new",
        data={
            "name": f"E2E-Dev-{tag}",
            "management_ip": "10.250.77.1",
            "ip_network_id": str(net_id),
            "status": "active",
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    
    # 3. Create Customer
    r = client.post(
        "/customers/new",
        data={
            "customer_code": f"C-INT-{tag}",
            "first_name": "E2E",
            "last_name": "Linker",
        },
        follow_redirects=False
    )
    assert r.status_code == 303

    cust_page = client.get("/customers", params={"q": tag})
    mc = re.search(r'href="/customers/(\d+)/edit"', cust_page.text)
    assert mc
    customer_id = int(mc.group(1))

    # 4. Create Node (Customer Device)
    r = client.post(
        "/customer-devices/new",
        data={
            "customer_id": str(customer_id),
            "name": f"e2e-node-{tag}",
            "ip_address": "10.250.77.50",
            "active": "on",
            "ip_network_id": str(net_id),
        },
        follow_redirects=False,
    )
    assert r.status_code == 303
    
    page = client.get("/customer-devices", headers={"HX-Request": "false"})
    assert f"e2e-node-{tag}" in page.text
