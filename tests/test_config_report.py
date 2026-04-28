import pytest
import logging
from unittest.mock import patch, MagicMock
from app.config_validation import report_startup_config

def test_report_startup_config_logs_correctly():
    """Verify that startup report generates expected logs."""
    
    with patch("logging.getLogger") as mock_get_logger:
        mock_log = MagicMock()
        mock_get_logger.return_value = mock_log
        
        report_startup_config()
        
        # Check for header
        mock_log.info.assert_any_call("--- STARTUP CONFIGURATION REPORT ---")
        
        # Check for environment (default is development in tests usually unless set)
        # We look for the call starting with 'Environment:'
        found_env = False
        found_db = False
        for call in mock_log.info.call_args_list:
            if "Environment:" in call.args[0]:
                found_env = True
            if "Database:" in call.args[0]:
                found_db = True
        
        assert found_env
        assert found_db
        
        # In development, we expect warnings about default keys
        # Unless the environment running tests has these set, we'll see warnings.
        # This test ensures the validation logic is executing.
