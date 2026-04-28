import pytest
from app.utils.parsing import parse_int, parse_int_optional

def test_parse_int():
    assert parse_int("123") == 123
    assert parse_int(123) == 123
    assert parse_int(" 456 ") == 456
    assert parse_int("123.45") == 123
    assert parse_int(None, default=99) == 99
    assert parse_int("", default=10) == 10
    assert parse_int("invalid", default=0) == 0

def test_parse_int_optional():
    assert parse_int_optional("123") == 123
    assert parse_int_optional(123) == 123
    assert parse_int_optional(None) is None
    assert parse_int_optional("") is None
    assert parse_int_optional("   ") is None
    assert parse_int_optional("abc") is None
    assert parse_int_optional("10.9") == 10
