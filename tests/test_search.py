import pytest
from app.routers.search import RE_MAC_PREFIX, RE_MAC_HEX, RE_IP_PREFIX, RE_DIGIT

def test_search_regex_patterns():
    # Test MAC prefix pattern
    assert RE_MAC_PREFIX.search("aa:bb:cc") is not None
    assert RE_MAC_PREFIX.search("11.22.33") is not None
    assert RE_MAC_PREFIX.search("hello") is None

    # Test MAC hex pattern
    assert RE_MAC_HEX.search("aabbccdd") is not None
    assert RE_MAC_HEX.search("1234") is not None
    assert RE_MAC_HEX.search("xyz") is None

    # Test IP prefix pattern
    assert RE_IP_PREFIX.search("192.168.1.1") is not None
    assert RE_IP_PREFIX.search("10.") is not None
    assert RE_IP_PREFIX.search("abc.def") is None

    # Test digit pattern
    assert RE_DIGIT.search("node123") is not None
    assert RE_DIGIT.search("nodigit") is None
