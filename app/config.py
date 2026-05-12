import os
from pathlib import Path
import logging

logger = logging.getLogger("app.config")

BASE_DIR = Path(__file__).resolve().parent.parent

# Detect Environment
ENV = os.environ.get("CRM_ENV", "development").lower()
IS_PROD = ENV == "production"

try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

# Helper for mandatory environment variables
def get_required_env(key: str, default: str = None) -> str:
    val = os.environ.get(key, default)
    if IS_PROD and (not val or val == default):
        # In production, we do not allow insecure defaults for critical keys
        critical_keys = ["CRM_SECRET_KEY", "CRM_ENCRYPTION_KEY", "CRM_ADMIN_PASSWORD"]
        if key in critical_keys:
            msg = f"CRITICAL CONFIG ERROR: Missing mandatory environment variable '{key}' for production environment."
            logger.critical(msg)
            raise RuntimeError(msg)
    return val

# Authorization switch — readable at runtime (not cached at import)
# Set AUTH_ENABLED=false in .env to bypass login during deployment
def is_auth_enabled() -> bool:
    val = os.environ.get("AUTH_ENABLED", "true")
    return val.lower() not in ("false", "0", "no", "off")

# Backward compat alias
AUTH_ENABLED = is_auth_enabled()

# Product branding
APP_DISPLAY_NAME = os.environ.get("APP_DISPLAY_NAME", "SNMS Enterprise")

# Database
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'crm.sqlite'}",
)

# Admin Credentials
CRM_ADMIN_USER = os.environ.get("CRM_ADMIN_USER", "admin")

# Security Keys
SECRET_KEY = get_required_env("CRM_SECRET_KEY", "dev-secret-key-replace-in-prod")
CRM_ADMIN_PASSWORD = get_required_env("CRM_ADMIN_PASSWORD", "test-change-me")
# Key for encrypting device management passwords (must be 32 url-safe base64-encoded bytes)
CRM_ENCRYPTION_KEY = get_required_env("CRM_ENCRYPTION_KEY", "dev-encryption-key-must-be-32-base64-bytes==")

# Storage
UPLOAD_ROOT = Path(os.environ.get("CRM_UPLOAD_ROOT", str(BASE_DIR / "uploads")))
_max_mb = float(os.environ.get("CRM_MAX_UPLOAD_MB", "20"))
MAX_UPLOAD_BYTES = int(_max_mb * 1024 * 1024)

# GUS TERYT ws1 — rejestracja: https://api.stat.gov.pl/Home/TerytApi
TERYT_WS_WSDL = os.environ.get(
    "TERYT_WS_WSDL",
    "https://uslugaterytws1.stat.gov.pl/wsdl/terytws1.wsdl",
)
TERYT_WS_USER = os.environ.get("TERYT_WS_USER", "").strip()
TERYT_WS_PASSWORD = os.environ.get("TERYT_WS_PASSWORD", "")
