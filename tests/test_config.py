import pytest
from app.config import get_required_env, is_auth_enabled
import os
from unittest.mock import patch

def test_get_required_env_non_critical():
    val = get_required_env("NON_EXISTENT", "default")
    assert val == "default"

def test_get_required_env_missing_critical():
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(RuntimeError, match="Missing mandatory environment variable 'CRM_SECRET_KEY'"):
            get_required_env("CRM_SECRET_KEY")

def test_get_required_env_critical_with_default_is_still_error():
    # Even if a default is provided to the function, critical keys must come from environment
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(RuntimeError, match="Missing mandatory environment variable 'CRM_SECRET_KEY'"):
            get_required_env("CRM_SECRET_KEY", "some-default")

def test_is_auth_enabled():
    with patch.dict(os.environ, {"AUTH_ENABLED": "false"}):
        assert is_auth_enabled() is False
    with patch.dict(os.environ, {"AUTH_ENABLED": "true"}):
        assert is_auth_enabled() is True
