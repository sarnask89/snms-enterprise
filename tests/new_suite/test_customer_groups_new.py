import pytest
from app import models

def test_customer_groups_list(admin_client):
    resp = admin_client.get("/customer-groups")
    assert resp.status_code == 200
    assert "Grupy" in resp.text

def test_customer_group_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/customer-groups/new",
        data={
            "name": "E2E-Group",
            "description": "Test group"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    g = session.query(models.CustomerGroup).filter_by(name="E2E-Group").first()
    assert g is not None

    # 2. Delete
    resp = admin_client.post(f"/customer-groups/{g.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.CustomerGroup, g.id) is None
