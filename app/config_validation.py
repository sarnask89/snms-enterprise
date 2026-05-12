import logging
import os
from app import config

logger = logging.getLogger("app.config_validation")

def report_startup_config():
    """Generates a summary of critical configuration settings at startup."""
    
    log = logging.getLogger("startup_config")
    
    log.info("--- STARTUP CONFIGURATION REPORT ---")
    log.info(f"Environment: {config.ENV.upper()}")
    log.info(f"App Display Name: {config.APP_DISPLAY_NAME}")
    
    # Database
    db_type = "SQLite" if "sqlite" in config.DATABASE_URL else "Other"
    log.info(f"Database: {db_type}")
    
    # Security Checks
    _validate_security(log)
    
    # TERYT
    _validate_teryt_config(log)
    
    log.info("--- END OF CONFIGURATION REPORT ---")

def _validate_security(log):
    # Security keys are now strictly required and have no defaults in app.config
    log.info("Security: Critical environment variables (SECRET_KEY, ENCRYPTION_KEY, ADMIN_PASSWORD) validated by config loader.")

def _validate_teryt_config(log):
    if not config.TERYT_WS_USER:
        log.info("TERYT: External WebService user not configured. Using local data mode.")
    else:
        log.info(f"TERYT: WebService user configured: {config.TERYT_WS_USER}")
