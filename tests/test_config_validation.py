import pytest
from unittest.mock import MagicMock, patch
from app.config_validation import _validate_security, _validate_teryt_config
from app import config

def test_validate_security_warning_in_dev():
    log = MagicMock()
    with patch("app.config.IS_PROD", False), \
         patch("app.config.SECRET_KEY", "dev-secret-key-replace-in-prod"):
        _validate_security(log)
        log.warning.assert_any_call("Security: Using DEFAULT SECRET_KEY. Change this before moving to production.")

def test_validate_security_info_in_prod():
    log = MagicMock()
    with patch("app.config.IS_PROD", True):
        _validate_security(log)
        log.info.assert_called_with("Security: Production mode confirmed. Mandatory keys validated by config loader.")

def test_validate_teryt_config_local():
    log = MagicMock()
    with patch("app.config.TERYT_WS_USER", None):
        _validate_teryt_config(log)
        log.info.assert_called_with("TERYT: External WebService user not configured. Using local data mode.")

def test_validate_teryt_config_ws():
    log = MagicMock()
    with patch("app.config.TERYT_WS_USER", "testuser"):
        _validate_teryt_config(log)
        log.info.assert_called_with("TERYT: WebService user configured: testuser")
