import logging
import os
from pathlib import Path
from app.logging import setup_logging, get_logger

def test_logging_setup():
    """Verify that logging is set up correctly and files are created."""
    setup_logging()
    
    logger = get_logger("test")
    logger.info("Test log message")
    
    # Check if log directory exists
    log_dir = Path(__file__).resolve().parent.parent / "logs"
    assert log_dir.exists()
    
    # Check if app.log exists
    log_file = log_dir / "app.log"
    assert log_file.exists()
    
    # Check if message is in file
    with open(log_file, "r", encoding="utf-8") as f:
        content = f.read()
        assert "Test log message" in content
        assert "INFO" in content
        assert "app.test" in content
