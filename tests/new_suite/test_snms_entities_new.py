import pytest
from app import models

def test_hosting_crud(admin_client, session):
    # Setup: need a customer
    c = models.Customer(first_name="Host", last_name="User", customer_code="HOST-01", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()

    # 1. Create
    resp = admin_client.post(
        "/hosting/new", 
        data={
            "account_login": "test-login",
            "customer_id": c.id,
            "domain": "test-domain.pl",
            "active": "on",
            "notes": "E2E Test"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    h = session.query(models.HostingAccount).filter_by(domain="test-domain.pl").first()
    assert h is not None

    # 2. Delete
    resp = admin_client.post(f"/hosting/{h.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.HostingAccount, h.id) is None

def test_voip_crud(admin_client, session):
    # Setup: need a customer
    c = models.Customer(first_name="Voip", last_name="User", customer_code="VOIP-01", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()

    # 1. Create
    resp = admin_client.post(
        "/voip/new",
        data={
            "label": "E2E VoIP",
            "customer_id": c.id,
            "phone_number": "48123456789",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    v = session.query(models.VoipAccount).filter_by(phone_number="48123456789").first()
    assert v is not None

    # 2. Delete
    resp = admin_client.post(f"/voip/{v.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.VoipAccount, v.id) is None

def test_document_templates_list(admin_client):
    resp = admin_client.get("/messages/templates")
    assert resp.status_code == 200
    assert "Szablony" in resp.text
