import pytest
from app.utils.string_utils import normalize_polish_chars, generate_login, generate_password

def test_normalize_polish_chars():
    assert normalize_polish_chars("Zażółć gęślą jaźń") == "Zazolc gesla jazn"
    assert normalize_polish_chars("Łódź") == "Lodz"
    assert normalize_polish_chars("") == ""

def test_generate_login():
    # Example: Kwiatkowski, Gen Lina Żółkiewskiego 9, ap 10 -> kwiatkowski9zol10
    login = generate_login("Kwiatkowski", "Gen Lina Żółkiewskiego", "9", "10")
    assert login == "kwiatkowski9zol10"
    
    # Minimal
    assert generate_login("Kowalski", "Polna", "1", "") == "kowalski1pol"

def test_generate_password():
    pw1 = generate_password(10)
    assert len(pw1) == 10
    
    pw2 = generate_password(10)
    assert pw1 != pw2 # Very high probability
    
    # Check if chars are from allowed set
    allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*")
    assert all(c in allowed for c in pw1)
