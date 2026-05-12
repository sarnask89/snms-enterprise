import logging
from pathlib import Path
from app.logging import setup_logging, get_logger

def test_get_logger():
    logger = get_logger("test_module")
    assert logger.name == "app.test_module"

def test_setup_logging_initializes_handlers():
    setup_logging()
    root_logger = logging.getLogger()

    # Check if handlers are added
    handler_types = [type(h) for h in root_logger.handlers]
    assert logging.StreamHandler in handler_types
    assert logging.FileHandler in handler_types

    # Check log levels
    assert root_logger.level == logging.WARNING
    assert logging.getLogger("app").level == logging.DEBUG

def test_logging_to_file():
    """Verify that logging is set up correctly and files are created."""
    setup_logging()
    
    logger = get_logger("test_file")
    test_message = "Test log message for file"
    logger.info(test_message)
    
    # Check if log directory exists
    log_dir = Path(__file__).resolve().parent.parent / "logs"
    assert log_dir.exists()
    
    # Check if app.log exists
    log_file = log_dir / "app.log"
    assert log_file.exists()
    
    # Check if message is in file
    with open(log_file, "r", encoding="utf-8") as f:
        content = f.read()
        assert test_message in content
        assert "INFO" in content
        assert "app.test_file" in content
