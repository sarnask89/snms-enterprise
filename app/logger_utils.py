import logging
import sys
from pathlib import Path

# Base directory for logs
LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

def setup_logging():
    """Sets up the centralized logging configuration."""
    
    # Standard format for logs
    # includes: timestamp, level, name (module), and message
    log_format = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
    )

    # 1. Console Handler (stdout)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)

    # 2. File Handler (rotating or simple for now)
    file_handler = logging.FileHandler(LOG_DIR / "app.log", encoding="utf-8")
    file_handler.setFormatter(log_format)

    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers to avoid duplicates
    if root_logger.hasHandlers():
        root_logger.handlers.clear()
        
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Specific logger for our app
    app_logger = logging.getLogger("app")
    app_logger.setLevel(logging.DEBUG) # More verbose for our code

    logging.info("Logging system initialized.")

def get_logger(name: str):
    """Utility function to get a logger for a specific module."""
    return logging.getLogger(f"app.{name}")
