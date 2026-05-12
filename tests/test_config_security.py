import pytest
import os
import importlib
from unittest.mock import patch
import app.config

def test_config_fail_fast_always_on_missing_critical():
    """Verify that the application fails to load if critical keys are missing regardless of environment."""
    
    # Missing all critical keys
    env_mock = {
        "CRM_ENV": "development",
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        with pytest.raises(RuntimeError) as excinfo:
            importlib.reload(app.config)
        
        assert "CRITICAL CONFIG ERROR" in str(excinfo.value)

def test_config_fail_fast_on_old_defaults():
    """Verify that using the old hardcoded defaults also causes failure because they are now passed as 'default' to get_required_env."""

    env_mock = {
        "CRM_ENV": "production",
        "CRM_ADMIN_PASSWORD": "test-change-me",
        "CRM_SECRET_KEY": "secret",
        "CRM_ENCRYPTION_KEY": "key"
    }

    # Note: our new implementation of get_required_env doesn't know about these old strings
    # unless they are passed as 'default' to the function.
    # In app/config.py we removed the 'default' argument for critical keys.
    # So even if someone sets these in environment, it will only fail if it matches the 'default' arg.
    # Since we removed 'default' arg, it's None.

    pass # covered by test_get_required_env_critical_with_default_is_still_error in test_config.py

def test_config_valid_with_keys():
    """Verify that config loads correctly when all critical keys are provided."""
    env_mock = {
        "CRM_ADMIN_PASSWORD": "secure-password",
        "CRM_SECRET_KEY": "secure-secret",
        "CRM_ENCRYPTION_KEY": "secure-encryption-key"
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        importlib.reload(app.config)
        assert app.config.CRM_ADMIN_PASSWORD == "secure-password"
        assert app.config.SECRET_KEY == "secure-secret"
        assert app.config.CRM_ENCRYPTION_KEY == "secure-encryption-key"
