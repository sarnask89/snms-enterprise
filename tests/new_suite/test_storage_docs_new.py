import pytest
import io
from app import models

def test_snms_numbering_logic(session):
    from app.snms_numbering import allocate_next_document_number
    # Setup: need a number plan
    plan = models.NumberPlan(
        name="TestPlan",
        doc_type=models.NumberPlanDocType.invoice,
        pattern_template="FV/{year}/{n}",
        next_number=1,
        active=True
    )
    session.add(plan)
    session.commit()
    
    num = allocate_next_document_number(session, plan)
    # The actual implementation pads to 4 digits: FV/2026/0001
    assert "FV/2026/0001" in num 
    assert plan.next_number == 2

def test_documents_crud(admin_client, session):
    # Setup: need a customer
    c = models.Customer(first_name="Doc", last_name="User", customer_code="DOC-01", status=models.CustomerStatus.active)
    session.add(c)
    session.commit()

    # 1. List
    resp = admin_client.get("/documents")
    assert resp.status_code == 200

    # 2. Upload (mock file)
    file_content = b"fake pdf content"
    file = io.BytesIO(file_content)
    resp = admin_client.post(
        "/documents/new",
        data={
            "customer_id": c.id,
            "title": "Test Doc"
        },
        files={"file": ("test.pdf", file, "application/pdf")},
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    doc = session.query(models.Document).filter_by(title="Test Doc").first()
    assert doc is not None

    # 3. Delete
    resp = admin_client.post(f"/documents/{doc.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
    assert session.get(models.Document, doc.id) is None

def test_app_settings_crud(admin_client, session):
    # 1. Create
    resp = admin_client.post(
        "/config/new",
        data={
            "key": "test.setting",
            "value": "123"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    
    s = session.query(models.AppSetting).filter_by(key="test.setting").first()
    assert s is not None

    # 2. Edit
    resp = admin_client.post(
        f"/config/{s.id}/edit",
        data={
            "key": "test.setting.upd",
            "value": "456"
        },
        follow_redirects=False
    )
    assert resp.status_code == 303
    session.refresh(s)
    assert s.key == "test.setting.upd"

    # 3. Delete
    resp = admin_client.post(f"/config/{s.id}/delete", follow_redirects=False)
    assert resp.status_code == 303
