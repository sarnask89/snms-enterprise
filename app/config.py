import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env")
except ImportError:
    pass

# Nazwa produktu widoczna w UI (menu, logowanie). Katalog repozytorium pozostaje „crm-portal”.
APP_DISPLAY_NAME = os.environ.get("APP_DISPLAY_NAME", "SNMS Enterprise")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'crm.sqlite'}",
)
CRM_ADMIN_USER = os.environ.get("CRM_ADMIN_USER", "admin")
CRM_ADMIN_PASSWORD = os.environ.get("CRM_ADMIN_PASSWORD", "test")
SECRET_KEY = os.environ.get("CRM_SECRET_KEY", "change-me-in-production-use-long-random")
# Key for encrypting device management passwords (must be 32 url-safe base64-encoded bytes)
CRM_ENCRYPTION_KEY = os.environ.get("CRM_ENCRYPTION_KEY", "7T-zN-Wf3k7VzYxZ-gH1R9_Y7m6_Z8x1Y2_X3z4v5w6=")

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
