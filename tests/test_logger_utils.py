import logging
from app.logger_utils import setup_logging, get_logger

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
    assert root_logger.level == logging.INFO
    assert logging.getLogger("app").level == logging.DEBUG
