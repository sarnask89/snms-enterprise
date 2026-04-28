import pytest
from sqlalchemy import select
from app import models

def test_database_is_isolated(db):
    """Verify that we are using an empty in-memory database for tests."""
    # This should return 0 in a fresh in-memory DB
    count = db.scalar(select(models.VatRate).limit(1))
    assert count is None
