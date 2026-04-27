import pytest
from datetime import date
from app import models

def test_subscriptions_list(admin_client):
    resp = admin_client.get("/messages/subscriptions") # it's in snms_entities router? no, subscriptions.py
    # let's check prefix
    pass

def test_subscription_crud(admin_client, session):
    # Setup: need customer and tariff
    c = models.Customer(first_name="Sub", last_name="User", customer_code="SUB-01", status=models.CustomerStatus.active)
    t = models.Tariff(name="Plan1", monthly_price=50.00)
    session.add_all([c, t])
    session.commit()

    # 1. Create
    resp = admin_client.post(
        "/subscriptions/new",
        data={
            "customer_id": c.id,
            "tariff_id": t.id,
            "start_date": date.today().isoformat(),
            "technology": "FTTH",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    sub = session.query(models.Subscription).filter_by(customer_id=c.id).first()
    assert sub is not None

    # 2. Delete
    resp = admin_client.post(f"/subscriptions/{sub.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
