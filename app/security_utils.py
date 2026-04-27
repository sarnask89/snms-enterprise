from cryptography.fernet import Fernet
from app.config import CRM_ENCRYPTION_KEY
import logging

logger = logging.getLogger(__name__)

# Fallback mechanism if key is invalid/missing
try:
    _cipher = Fernet(CRM_ENCRYPTION_KEY.encode())
except Exception as e:
    logger.error(f"Failed to initialize Fernet encryption: {e}. Check CRM_ENCRYPTION_KEY.")
    _cipher = None

def encrypt_password(password: str) -> str:
    """Szyfruje hasło urządzenia."""
    if not password or not _cipher:
        return password
    return _cipher.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    """Odszyfrowuje hasło urządzenia."""
    if not encrypted_password or not _cipher:
        return encrypted_password
    try:
        return _cipher.decrypt(encrypted_password.encode()).decode()
    except Exception as e:
        logger.error(f"Failed to decrypt password: {e}")
        return encrypted_password # Zwróć oryginał jeśli odszyfrowanie zawiedzie
