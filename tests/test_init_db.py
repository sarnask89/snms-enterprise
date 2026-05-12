import pytest
from unittest.mock import patch, MagicMock
from app.init_db import seed, ensure_default_catalog_seed, ensure_helpdesk_seed, ensure_app_settings
from app import models

def test_seed_admin_creates_user():
    db = MagicMock()
    db.query.return_value.filter_by.return_value.count.return_value = 0
    
    with patch("app.init_db.SessionLocal", return_value=db):
        seed()
        assert db.add.called
        user = db.add.call_args[0][0]
        assert user.username == "admin"
        assert db.commit.called

def test_seed_admin_already_exists():
    db = MagicMock()
    db.query.return_value.filter_by.return_value.count.return_value = 1
    
    with patch("app.init_db.SessionLocal", return_value=db):
        seed()
        assert not db.add.called

def test_ensure_default_catalog_seed():
    db = MagicMock()
    db.query.return_value.count.return_value = 0
    
    with patch("app.init_db.SessionLocal", return_value=db):
        ensure_default_catalog_seed()
        # Verify it adds NetDeviceType and VatRate
        assert db.add.called
        assert db.commit.called

def test_ensure_helpdesk_seed():
    db = MagicMock()
    db.query.return_value.count.return_value = 0
    
    with patch("app.init_db.SessionLocal", return_value=db):
        ensure_helpdesk_seed()
        assert db.add_all.called
        assert db.commit.called

def test_ensure_app_settings_initializes_when_empty():
    db = MagicMock()
    db.query.return_value.count.return_value = 0

    with patch("app.init_db.SessionLocal", return_value=db):
        ensure_app_settings()
        assert db.add.called
        # It adds 2 settings
        assert db.add.call_count == 2
        assert db.commit.called

def test_ensure_app_settings_does_nothing_when_not_empty():
    db = MagicMock()
    db.query.return_value.count.return_value = 5

    with patch("app.init_db.SessionLocal", return_value=db):
        ensure_app_settings()
        assert not db.add.called
        assert not db.commit.called
