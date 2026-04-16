"""
Testy integracyjne zapisu/odczytu jak w przeglądarce (sesja admin → POST → 303).
Uzupełniają ręczne testy UI; nie zastępują testów smoke (`test_smoke.py`).
"""

import re
import uuid

import pytest
from fastapi.testclient import TestClient

from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER
from app.main import app


def _login(client: TestClient) -> None:
    r = client.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
        follow_redirects=False,
    )
    assert r.status_code == 302
    assert r.headers.get("location") == "/"


def _first_queue_id(html: str) -> str | None:
    m = re.search(r'<select[^>]*name="queue_id"[^>]*>.*?<option value="(\d+)"', html, re.DOTALL)
    return m.group(1) if m else None


@pytest.mark.integration
def test_customer_create_edit_delete_roundtrip():
    code = f"E2E-INT-{uuid.uuid4().hex[:10]}"
    with TestClient(app) as client:
        _login(client)
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
        assert r.headers.get("location") == "/customers"


@pytest.mark.integration
def test_cash_receipt_create_and_delete():
    with TestClient(app) as client:
        _login(client)
        r = client.post(
            "/finances/cash/new",
            data={"amount": "3.33", "description": "pytest cash e2e", "customer_id": ""},
            follow_redirects=False,
        )
        assert r.status_code == 303
        page = client.get("/finances/cash")
        assert page.status_code == 200
        assert "pytest cash e2e" in page.text
        m = re.search(r'action="/finances/cash/(\d+)/delete"', page.text)
        assert m, "brak formularza usuwania paragonu"
        rid = int(m.group(1))
        r = client.post(f"/finances/cash/{rid}/delete", follow_redirects=False)
        assert r.status_code == 303


@pytest.mark.integration
def test_helpdesk_ticket_create():
    with TestClient(app) as client:
        _login(client)
        form = client.get("/helpdesk/tickets/new")
        assert form.status_code == 200
        qid = _first_queue_id(form.text) or ""

        r = client.post(
            "/helpdesk/tickets/new",
            data={
                "title": "pytest HD ticket",
                "body": "opis",
                "queue_id": qid,
                "category_id": "",
                "customer_id": "1",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        assert r.headers.get("location") == "/helpdesk/tickets"
        lst = client.get("/helpdesk/tickets")
        assert lst.status_code == 200
        assert "pytest HD ticket" in lst.text


@pytest.mark.integration
def test_net_device_create_edit_delete():
    with TestClient(app) as client:
        _login(client)
        r = client.post(
            "/net-devices/new",
            data={
                "name": "E2E-Switch-01",
                "hostname": "sw-e2e-01",
                "management_ip": "10.99.0.1",
                "device_type": "switch",
                "status": "active",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        lst = client.get("/net-devices")
        assert "E2E-Switch-01" in lst.text
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
def test_net_node_create_edit_delete():
    with TestClient(app) as client:
        _login(client)
        r = client.post(
            "/net-nodes/new",
            data={
                "name": "E2E-POP-NODE",
                "location_type": "staircase",
                "location_detail": "klatka B",
                "street_number": "12",
                "info": "pytest POP",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        lst = client.get("/net-nodes")
        assert lst.status_code == 200
        assert "E2E-POP-NODE" in lst.text
        m = re.search(r'href="/net-nodes/(\d+)/edit"', lst.text)
        assert m
        nid = int(m.group(1))
        r = client.post(
            f"/net-nodes/{nid}/edit",
            data={
                "name": "E2E-POP-NODE-X",
                "location_type": "floor",
                "location_detail": "piętro 2",
                "street_number": "12",
                "info": "updated",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        lst2 = client.get("/net-nodes")
        assert "E2E-POP-NODE-X" in lst2.text
        r = client.post(f"/net-nodes/{nid}/delete", follow_redirects=False)
        assert r.status_code == 303


@pytest.mark.integration
def test_customer_device_links_net_and_device():
    """Komputer: sieć (netid) + osprzęt (netdev) — Node.ip_network_id + net_device_id."""
    tag = uuid.uuid4().hex[:10]
    cidr_third = int(tag[-2:], 16) % 200 + 20  # 20–219, unikatowy oktet
    with TestClient(app) as client:
        _login(client)
        net_name = f"E2E-Net-{tag}"
        host_ip = f"10.{cidr_third}.77.50"
        cidr = f"10.{cidr_third}.77.0/24"
        gw = f"10.{cidr_third}.77.1"
        r = client.post(
            "/ip-networks/new",
            data={
                "name": net_name,
                "cidr": cidr,
                "gateway": gw,
                "vlan_id": "",
                "description": "",
                "active": "on",
                "network_host_id": "",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        lst = client.get("/ip-networks", params={"q": net_name})
        m = re.search(r'href="/ip-networks/(\d+)/edit"', lst.text)
        assert m, "brak sieci IP po utworzeniu (szukaj po nazwie)"
        net_id = int(m.group(1))

        r = client.post(
            "/net-devices/new",
            data={
                "name": f"E2E-Dev-{tag}",
                "hostname": "",
                "management_ip": "",
                "device_type": "switch",
                "snmp_community": "",
                "login_url": "",
                "ip_network_id": str(net_id),
                "net_node_id": "",
                "customer_id": "",
                "net_device_model_id": "",
                "status": "active",
                "notes": "",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        nd = client.get("/net-devices", params={"q": f"E2E-Dev-{tag}"})
        m2 = re.search(r'href="/net-devices/(\d+)/edit"', nd.text)
        assert m2, "brak urządzenia po utworzeniu"
        dev_id = int(m2.group(1))

        cust = client.get("/customers")
        mc = re.search(r'href="/customers/(\d+)/edit"', cust.text)
        assert mc
        customer_id = int(mc.group(1))

        r = client.post(
            "/customer-devices/new",
            data={
                "customer_id": str(customer_id),
                "hostname": f"e2e-host-{tag}",
                "ip_address": host_ip,
                "mac_address": "",
                "status": "active",
                "notes": "",
                "ip_network_id": str(net_id),
                "net_device_id": str(dev_id),
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        page = client.get("/customer-devices")
        assert f"e2e-host-{tag}" in page.text


@pytest.mark.integration
def test_message_create_draft():
    with TestClient(app) as client:
        _login(client)
        r = client.post(
            "/messages/new",
            data={
                "template_id": "",
                "subject": "pytest wiadomość",
                "body": "treść testu",
                "customer_id": "",
            },
            follow_redirects=False,
        )
        assert r.status_code == 303
        lst = client.get("/messages")
        assert lst.status_code == 200
        assert "pytest wiadomość" in lst.text or "treść testu" in lst.text
