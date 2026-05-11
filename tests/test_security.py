import pytest
from app.security import hash_password, verify_password

def test_hash_password_returns_string():
    password = "secret_password"
    hashed = hash_password(password)
    assert isinstance(hashed, str)
    assert hashed.startswith("pbkdf2_sha256$")

def test_verify_password_correct():
    password = "secret_password"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True

def test_verify_password_incorrect():
    password = "secret_password"
    hashed = hash_password(password)
    assert verify_password("wrong_password", hashed) is False

def test_verify_password_invalid_format():
    assert verify_password("password", "invalid_format") is False
    assert verify_password("password", "algo$iters$salt$hash$extra") is False

def test_hash_password_unique_salts():
    password = "same_password"
    hashed1 = hash_password(password)
    hashed2 = hash_password(password)
    assert hashed1 != hashed2
