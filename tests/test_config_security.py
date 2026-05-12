import pytest
import os
import importlib
from unittest.mock import patch

def test_config_fail_fast_missing_keys():
    """Verify that the application fails to load if critical keys are missing."""
    
    # Mock environment to simulate missing critical keys
    # In app/config.py, CRM_ADMIN_PASSWORD is the first one loaded using get_required_env
    env_mock = {
        "CRM_ENV": "development",
        # CRM_ADMIN_PASSWORD is missing
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        # We need to reload the module to trigger the logic
        import app.config
        with pytest.raises(RuntimeError) as excinfo:
            importlib.reload(app.config)
        
        assert "CRITICAL CONFIG ERROR" in str(excinfo.value)
        assert "CRM_ADMIN_PASSWORD" in str(excinfo.value)

def test_config_valid_with_keys():
    """Verify that the application loads when all mandatory keys are provided."""
    env_mock = {
        "CRM_ENV": "development",
        "CRM_SECRET_KEY": "some-secret-key",
        "CRM_ENCRYPTION_KEY": "some-encryption-key",
        "CRM_ADMIN_PASSWORD": "some-password"
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        import app.config
        importlib.reload(app.config)
        # Should not raise any error
        assert app.config.SECRET_KEY == "some-secret-key"
        assert app.config.CRM_ENCRYPTION_KEY == "some-encryption-key"
        assert app.config.CRM_ADMIN_PASSWORD == "some-password"
