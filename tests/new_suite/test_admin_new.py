import pytest
from app import models

def test_admin_info(admin_client):
    resp = admin_client.get("/admin/info")
    assert resp.status_code == 200
    assert "System" in resp.text
    assert "SQLite" in resp.text

def test_portal_user_crud(admin_client, session):
    # 1. List
    resp = admin_client.get("/admin/users")
    assert resp.status_code == 200
    assert "Użytkownicy" in resp.text

    # 2. Create
    resp = admin_client.post(
        "/admin/users/new",
        data={
            "username": "newuser",
            "password": "password123",
            "role": "manager",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    u = session.query(models.PortalUser).filter_by(username="newuser").first()
    assert u is not None
    assert u.role == models.UserRole.manager

    # 3. Edit
    resp = admin_client.post(
        f"/admin/users/{u.id}/edit",
        data={
            "username": "newuser-upd",
            "role": "admin",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(u)
    assert u.username == "newuser-upd"
    assert u.role == models.UserRole.admin

    # 4. Delete
    resp = admin_client.post(f"/admin/users/{u.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.PortalUser, u.id) is None

def test_portal_user_groups_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/admin/user-groups/new",
        data={
            "name": "Technicians",
            "description": "Field staff"
        },
        follow_redirects=False
    )
    assert resp.status_code in (302, 303)
    
    g = session.query(models.PortalUserGroup).filter_by(name="Technicians").first()
    assert g is not None

    # 2. Edit (includes user selection)
    resp = admin_client.post(
        f"/admin/user-groups/{g.id}/edit",
        data={
            "name": "Techs-Updated",
            "description": "Updated desc"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(g)
    assert g.name == "Techs-Updated"

    # 3. Delete
    resp = admin_client.post(f"/admin/user-groups/{g.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.PortalUserGroup, g.id) is None

def test_teryt_sync_page(admin_client):
    resp = admin_client.get("/admin/teryt-sync")
    assert resp.status_code == 200
    assert "Synchronizacja" in resp.text

def test_audit_logs(admin_client):
    resp = admin_client.get("/admin/audit-logs")
    assert resp.status_code == 200
    assert "Dziennik" in resp.text
