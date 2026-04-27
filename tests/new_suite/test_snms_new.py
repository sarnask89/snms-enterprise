import pytest
from app import models

def test_snms_dashboard(admin_client):
    resp = admin_client.get("/config")
    assert resp.status_code == 200
    assert "Konfiguracja SNMS" in resp.text

def test_snms_divisions_crud(admin_client, session):
    # 1. List
    resp = admin_client.get("/config/divisions")
    assert resp.status_code == 200

    # 2. Create
    resp = admin_client.post(
        "/config/divisions/new",
        data={
            "name": "E2E-Division",
            "description": "Test division",
            "is_default": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    div = session.query(models.Division).filter_by(name="E2E-Division").first()
    assert div is not None

    # 3. Edit
    resp = admin_client.post(
        f"/config/divisions/{div.id}/edit",
        data={
            "name": "E2E-Div-Upd",
            "description": "Updated",
            "is_default": ""
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(div)
    assert div.name == "E2E-Div-Upd"

    # 4. Delete
    resp = admin_client.post(f"/config/divisions/{div.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.Division, div.id) is None

def test_snms_vat_rates_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/config/vat-rates/new",
        data={
            "rate_percent": "23.00",
            "label": "23%",
            "is_default": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    v = session.query(models.VatRate).filter_by(label="23%").first()
    assert v is not None

    # 2. Delete
    resp = admin_client.post(f"/config/vat-rates/{v.id}/delete", follow_redirects=False)
    assert resp.status_code == 303

def test_snms_messages_crud(admin_client, session):
    # 1. List
    resp = admin_client.get("/messages")
    assert resp.status_code == 200
    assert "Wiadomości" in resp.text

    # 2. Create from template
    resp = admin_client.post(
        "/messages/new",
        data={
            "subject": "Test Msg",
            "body": "Test body",
            "customer_id": "",
            "template_id": "1" # Seeded in conftest
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    m = session.query(models.OutboundMessage).filter_by(subject="Test Msg").first()
    assert m is not None
