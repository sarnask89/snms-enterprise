"""Walidacja IP dla komputerów — spójność z CIDR i duplikaty."""

from app.database import SessionLocal
from app.ip_pool import validate_node_ip_assignment


def test_empty_ip_ok():
    db = SessionLocal()
    try:
        ok, err = validate_node_ip_assignment(db, None, "", exclude_node_id=None)
        assert ok and err is None
    finally:
        db.close()
