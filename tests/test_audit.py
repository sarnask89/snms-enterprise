from unittest.mock import MagicMock
from app.audit import record_audit
from app import models

def test_record_audit_with_actor_and_request():
    db = MagicMock()
    request = MagicMock()
    request.headers = {"x-forwarded-for": "1.2.3.4, 5.6.7.8"}
    actor = MagicMock()
    actor.id = 123
    
    record_audit(
        db,
        action="test_action",
        resource_type="customer",
        resource_id=456,
        details="some details",
        actor=actor,
        request=request
    )
    
    db.add.assert_called_once()
    log = db.add.call_args[0][0]
    assert isinstance(log, models.AuditLog)
    assert log.actor_id == 123
    assert log.action == "test_action"
    assert log.resource_type == "customer"
    assert log.resource_id == 456
    assert log.details == "some details"
    assert log.ip_address == "1.2.3.4"

def test_record_audit_minimal():
    db = MagicMock()
    
    record_audit(db, action="minimal_action")
    
    db.add.assert_called_once()
    log = db.add.call_args[0][0]
    assert log.action == "minimal_action"
    assert log.actor_id is None
    assert log.ip_address is None

def test_record_audit_exception_handling():
    db = MagicMock()
    db.add.side_effect = Exception("DB Error")
    
    # Should not raise exception
    record_audit(db, action="error_action")
    db.add.assert_called_once()
