import pytest
from app.services.mikrotik_parser import parse_mikrotik_comment

def test_parse_mikrotik_comment_standard():
    comment = "1825 Kowalski Mic25"
    result = parse_mikrotik_comment(comment)
    assert result is not None
    assert result["external_id"] == "1825"
    assert result["last_name"] == "Kowalski"
    assert result["street_name"] == "Adama Mickiewicza"
    assert result["street_number"] == "25"
    assert result["apartment_number"] == ""

def test_parse_mikrotik_comment_with_apartment():
    comment = "1825 Krupka M/33 Mic25"
    result = parse_mikrotik_comment(comment)
    assert result is not None
    assert result["apartment_number"] == "33"
    assert result["street_name"] == "Adama Mickiewicza"
    assert result["street_number"] == "25"

def test_parse_mikrotik_comment_case_insensitive():
    comment = "123 smith ak10"
    result = parse_mikrotik_comment(comment)
    assert result is not None
    assert result["last_name"] == "Smith"
    assert result["street_name"] == "Armii Krajowej"
    assert result["street_number"] == "10"

def test_parse_mikrotik_comment_complex_name():
    comment = "4444 Nowak-Kowalski Mic1"
    result = parse_mikrotik_comment(comment)
    assert result is not None
    assert result["last_name"] == "Nowak-Kowalski"

def test_parse_mikrotik_comment_invalid():
    assert parse_mikrotik_comment("") is None
    assert parse_mikrotik_comment("Invalid format") is None
    assert parse_mikrotik_comment("1234 OnlyName") is None
