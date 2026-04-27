import pytest
from datetime import datetime, timezone
from app import models

def test_documents_list(admin_client):
    resp = admin_client.get("/messages/documents") # Check prefix
    pass

def test_timetable_list(admin_client):
    resp = admin_client.get("/timetable")
    assert resp.status_code == 200
    assert "Terminarz" in resp.text

def test_timetable_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/timetable/new",
        data={
            "title": "E2E Meeting",
            "starts_at": "2026-04-16T22:00",
            "ends_at": "2026-04-16T23:00",
            "active": "on"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    ev = session.query(models.CalendarEvent).filter_by(title="E2E Meeting").first()
    assert ev is not None

    # 2. Delete
    resp = admin_client.post(f"/timetable/{ev.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
