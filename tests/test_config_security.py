import pytest
import os
import importlib
from unittest.mock import patch

def test_config_fail_fast_in_production():
    """Verify that the application fails to load if critical keys are missing in production."""
    
    # Mock environment to simulate production without critical keys
    env_mock = {
        "CRM_ENV": "production",
        "CRM_SECRET_KEY": "dev-secret-key-replace-in-prod" # Use the insecure default
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        # We need to reload the module to trigger the logic
        import app.config
        with pytest.raises(RuntimeError) as excinfo:
            importlib.reload(app.config)
        
        assert "CRITICAL CONFIG ERROR" in str(excinfo.value)
        assert "CRM_SECRET_KEY" in str(excinfo.value)

def test_config_valid_in_development():
    """Verify that development mode allows insecure defaults."""
    env_mock = {
        "CRM_ENV": "development",
        "CRM_SECRET_KEY": "dev-secret-key-replace-in-prod"
    }
    
    with patch.dict(os.environ, env_mock, clear=True):
        import app.config
        importlib.reload(app.config)
        # Should not raise any error
        assert app.config.SECRET_KEY == "dev-secret-key-replace-in-prod"
