import pytest
from unittest.mock import patch, MagicMock
from app.security_utils import encrypt_password, decrypt_password

def test_encrypt_decrypt_roundtrip():
    # We need a valid 32-byte base64 key for Fernet
    key = "7Y5f0vX3_4Xv7_9Y2X4_6Z8_0A1B2C3D4E5F6G7H8I=" # dummy but valid format
    with patch("app.security_utils._cipher") as mock_cipher:
        from cryptography.fernet import Fernet
        real_cipher = Fernet(Fernet.generate_key())
        mock_cipher.encrypt.side_effect = real_cipher.encrypt
        mock_cipher.decrypt.side_effect = real_cipher.decrypt
        
        password = "secret123"
        encrypted = encrypt_password(password)
        assert encrypted != password
        
        decrypted = decrypt_password(encrypted)
        assert decrypted == password

def test_encrypt_decrypt_no_cipher():
    with patch("app.security_utils._cipher", None):
        password = "secret123"
        assert encrypt_password(password) == password
        assert decrypt_password(password) == password

def test_decrypt_failure():
    with patch("app.security_utils._cipher") as mock_cipher:
        mock_cipher.decrypt.side_effect = Exception("Decrypt Error")
        assert decrypt_password("something") == "something"
