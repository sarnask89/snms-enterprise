from decimal import Decimal
import pytest
from app import models

def test_finances_dashboard_access(admin_client):
    resp = admin_client.get("/finances/invoices")
    assert resp.status_code == 200
    assert "Faktury" in resp.text

def test_cash_receipt_crud(admin_client, session):
    # 1. Create a cash receipt
    resp = admin_client.post(
        "/finances/cash/new",
        data={
            "amount": "150.00",
            "description": "Payment for service",
            "customer_id": "" # optional
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # 2. Verify in DB
    receipt = session.query(models.CashReceipt).filter_by(description="Payment for service").first()
    assert receipt is not None
    assert receipt.amount == Decimal("150.00")

    # 3. Verify it shows in list
    resp = admin_client.get("/finances/cash")
    assert "Payment for service" in resp.text

    # 4. Delete
    resp = admin_client.post(f"/finances/cash/{receipt.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.CashReceipt, receipt.id) is None

def test_tariff_list(admin_client):
    resp = admin_client.get("/finances/tariffs")
    assert resp.status_code == 200
    assert "Taryfy" in resp.text

def test_tariff_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/finances/tariffs/new",
        data={
            "name": "E2E-100MB",
            "monthly_price": "50.00",
            "description": "Fast internet"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    t = session.query(models.Tariff).filter_by(name="E2E-100MB").first()
    assert t is not None

    # 2. Delete
    resp = admin_client.post(f"/finances/tariffs/{t.id}/delete", follow_redirects=False)
    assert resp.status_code == 303

def test_invoice_create_flow(admin_client, session):
    # Setup: need a customer
    c = models.Customer(first_name="Inv", last_name="User", customer_code="INV-001", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()

    # 1. Create invoice
    resp = admin_client.post(
        "/finances/invoices/new",
        data={
            "customer_id": c.id,
            "number": "FV/2026/TEST",
            "amount": "123.45",
            "issue_date": "2026-04-16",
            "due_date": "2026-04-30",
            "status": "issued"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    inv = session.query(models.Invoice).filter_by(number="FV/2026/TEST").first()
    assert inv is not None
    assert inv.amount == Decimal("123.45")

    # 2. Delete
    resp = admin_client.post(f"/finances/invoices/{inv.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
