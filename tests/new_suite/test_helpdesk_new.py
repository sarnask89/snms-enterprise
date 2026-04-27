import pytest
from app import models

def test_helpdesk_list(admin_client):
    resp = admin_client.get("/helpdesk")
    assert resp.status_code == 200
    assert "Zgłoszenia" in resp.text

def test_helpdesk_ticket_crud(admin_client, session):
    # Setup: need a queue and category
    q = models.HelpdeskQueue(name="Default", description="Main queue")
    cat = models.HelpdeskCategory(name="Technical", queue=q)
    session.add_all([q, cat])
    session.commit()

    # 1. Create
    resp = admin_client.post(
        "/helpdesk/tickets/new",
        data={
            "queue_id": q.id,
            "category_id": cat.id,
            "title": "Internet down",
            "body": "Help please",
            "priority": "high"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    ticket = session.query(models.SupportTicket).filter_by(title="Internet down").first()
    assert ticket is not None

    # 2. Close ticket
    resp = admin_client.post(f"/helpdesk/tickets/{ticket.id}/status", data={"status": "closed"}, follow_redirects=False)
    assert resp.status_code == 303
    session.refresh(ticket)
    assert ticket.status == models.TicketStatus.closed

def test_helpdesk_queues_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/helpdesk/queues/new",
        data={
            "name": "Billing",
            "description": "Invoice questions"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    q = session.query(models.HelpdeskQueue).filter_by(name="Billing").first()
    assert q is not None

    # 2. Delete
    resp = admin_client.post(f"/helpdesk/queues/{q.id}/delete", follow_redirects=False)
    assert resp.status_code == 303

def test_helpdesk_categories_crud(admin_client, session):
    # 1. Create
    # First need a queue
    q = models.HelpdeskQueue(name="CAT-Q", description="...")
    session.add(q)
    session.commit()

    resp = admin_client.post(
        "/helpdesk/categories/new",
        data={
            "queue_id": q.id,
            "name": "Slow Internet"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    c = session.query(models.HelpdeskCategory).filter_by(name="Slow Internet").first()
    assert c is not None

    # 2. Delete
    resp = admin_client.post(f"/helpdesk/categories/{c.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
