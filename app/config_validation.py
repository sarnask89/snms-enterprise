import logging
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
    # Check for insecure defaults in non-prod
    if not config.IS_PROD:
        if config.SECRET_KEY == "dev-secret-key-replace-in-prod":
            log.warning("Security: Using DEFAULT SECRET_KEY. Change this before moving to production.")
        if config.CRM_ENCRYPTION_KEY == "dev-encryption-key-must-be-32-base64-bytes==":
            log.warning("Security: Using DEFAULT ENCRYPTION_KEY. Change this before moving to production.")
        if config.CRM_ADMIN_PASSWORD == "test-change-me":
            log.warning("Security: Using DEFAULT ADMIN PASSWORD. Change this before moving to production.")
    else:
        log.info("Security: Production mode confirmed. Mandatory keys validated by config loader.")

def _validate_teryt_config(log):
    if not config.TERYT_WS_USER:
        log.info("TERYT: External WebService user not configured. Using local data mode.")
    else:
        log.info(f"TERYT: WebService user configured: {config.TERYT_WS_USER}")
