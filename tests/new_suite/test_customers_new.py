import pytest
from app import models

def test_customer_list_access(admin_client):
    resp = admin_client.get("/customers")
    assert resp.status_code == 200
    assert "Lista abonentów" in resp.text

def test_customer_create_flow(admin_client, session):
    # 1. Create a customer
    resp = admin_client.post(
        "/customers/new",
        data={
            "first_name": "Jan",
            "last_name": "Kowalski",
            "customer_code": "KOW-001",
            "status": "active"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    assert resp.headers.get("location") == "/customers"

    # 2. Verify it exists in DB
    c = session.query(models.Customer).filter_by(customer_code="KOW-001").first()
    assert c is not None
    assert c.first_name == "Jan"

    # 3. Verify it shows in list
    resp = admin_client.get("/customers")
    assert "KOW-001" in resp.text
    assert "Kowalski" in resp.text

def test_customer_duplicate_code_denied(admin_client):
    # Create first
    admin_client.post(
        "/customers/new",
        data={
            "first_name": "User1",
            "last_name": "Test1",
            "customer_code": "DUPE-001",
            "status": "active"
        }
    )
    
    # Try to create second with same code
    resp = admin_client.post(
        "/customers/new",
        data={
            "first_name": "User2",
            "last_name": "Test2",
            "customer_code": "DUPE-001",
            "status": "active"
        },
        follow_redirects=False
    )
    
    # Should redirect back to form with error (not 500)
    assert resp.status_code == 303
    assert "error=" in resp.headers.get("location")
    
    # Check the error page content (optional, requires following redirect)
    resp = admin_client.get(resp.headers.get("location"))
    assert "już zajęty" in resp.text

def test_customer_edit(admin_client, session):
    # Setup
    c = models.Customer(first_name="Old", last_name="Name", customer_code="EDIT-01", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()
    
    # Edit
    resp = admin_client.post(
        f"/customers/{c.id}/edit",
        data={
            "first_name": "New",
            "last_name": "Name",
            "customer_code": "EDIT-01", # keep same code
            "status": "active"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    # Verify update
    session.refresh(c)
    assert c.first_name == "New"

def test_customer_delete(admin_client, session):
    # Setup
    c = models.Customer(first_name="To", last_name="Delete", customer_code="DEL-01", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()
    cid = c.id
    
    # Delete
    resp = admin_client.post(f"/customers/{cid}/delete", follow_redirects=False)
    assert resp.status_code == 303
    
    # Verify gone
    c_after = session.get(models.Customer, cid)
    assert c_after is None
