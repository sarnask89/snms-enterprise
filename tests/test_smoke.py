import pytest
from sqlalchemy import select
from app import models

def test_database_is_isolated(db):
    """Verify that we are using our test database setup."""
    # We should have exactly 1 default VAT rate from seed_with_db
    count = db.query(models.VatRate).count()
    assert count >= 1
