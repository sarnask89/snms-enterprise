import pytest
from app.routers.search import MAC_RE_1, MAC_RE_2, IP_RE_1, IP_RE_2
from app.services.dasan import (
    ACTIVE_ONU_RE, OLT_MAC_RE, ONU_STATUS_RE, BRIDGE_MAC_RE,
    ONU_ACTIVE_LINE_RE, SHOW_MAC_RE, SHOW_OLT_MAC_RE, ONU_DETAIL_RE, RX_POWER_RE
)
from app.routers.netdevices import OLT_MAC_LINE_RE, PON_PORT_RX_RE

def test_search_regexes():
    # MAC_RE_1
    assert MAC_RE_1.search("54:db:a2:11:e7:31") is not None
    assert MAC_RE_1.search("54-db-a2-11-e7-31") is not None
    assert MAC_RE_1.search("54.db.a2.11.e7.31") is not None
    assert MAC_RE_1.search("not-a-mac") is None

    # MAC_RE_2
    assert MAC_RE_2.search("54dba211e731") is not None
    assert MAC_RE_2.search("aabb") is not None
    assert MAC_RE_2.search("notmac1234567") is None

    # IP_RE_1
    assert IP_RE_1.search("192.168.1.1") is not None
    assert IP_RE_1.search("10.0.") is not None
    assert IP_RE_1.search("abc.123") is None

    # IP_RE_2
    assert IP_RE_2.search("has 1 digit") is not None
    assert IP_RE_2.search("no digits") is None

def test_dasan_regexes():
    # ACTIVE_ONU_RE
    m = ACTIVE_ONU_RE.search("  1 | 5 | Active")
    assert m is not None
    assert m.group(1) == "1"
    assert m.group(2) == "5"

    # OLT_MAC_RE
    m = OLT_MAC_RE.search(" 1 | 1 | 1 | 54:db:a2:11:e7:31 | 208 | 100 | dynamic")
    assert m is not None
    assert m.group(1) == "1"
    assert m.group(2) == "1"
    assert m.group(3) == "54:db:a2:11:e7:31"
    assert m.group(4) == "100"

    # ONU_STATUS_RE
    m = ONU_STATUS_RE.search("| 5 | Active |")
    assert m is not None
    assert m.group(1) == "5"
    assert m.group(2) == "Active"

    # BRIDGE_MAC_RE
    m = BRIDGE_MAC_RE.search(" 100 eth04 9c:65:ee:92:ef:a1")
    assert m is not None
    assert m.group(1) == "100"
    assert m.group(2) == "eth04"
    assert m.group(3) == "9c:65:ee:92:ef:a1"

    # ONU_ACTIVE_LINE_RE
    m = ONU_ACTIVE_LINE_RE.search("  1 | 1 | Active | manual | DSNW12345678")
    assert m is not None
    assert m.group(1) == "1"
    assert m.group(2) == "1"
    assert m.group(3) == "Active"
    assert m.group(4) == "DSNW12345678"

    # SHOW_MAC_RE
    m = SHOW_MAC_RE.search(" 100 eth01 54:db:a2:12:25:f9 OK dynamic 6.89")
    assert m is not None
    assert m.group(1) == "100"
    assert m.group(2) == "eth01"
    assert m.group(3) == "54:db:a2:12:25:f9"

    # SHOW_OLT_MAC_RE
    m = SHOW_OLT_MAC_RE.search(" 1 | 5 | 14 | 00:0a:e4:cd:84:30 | 130 | 120 | dynamic")
    assert m is not None
    assert m.group(1) == "00:0a:e4:cd:84:30"
    assert m.group(2) == "130"
    assert m.group(3) == "120"
    assert m.group(4) == "dynamic"

    # ONU_DETAIL_RE
    m = ONU_DETAIL_RE.search("    1 | 5 | Active | manual | HALN08196530 | 3030... | 16:05:55:37")
    assert m is not None
    assert m.group(1) == "Active"
    assert m.group(2) == "HALN08196530"
    assert m.group(3) == "16:05:55:37"

    # RX_POWER_RE
    m = RX_POWER_RE.search("1/1   -20.10 dBm")
    assert m is not None
    assert m.group(1) == "-20.10 dBm"

def test_netdevices_regexes():
    # OLT_MAC_LINE_RE
    m = OLT_MAC_LINE_RE.search(" 1 | 1 | 1 | 54:db:a2:11:e7:31 | 208 | 100 | dynamic")
    assert m is not None
    assert m.group(1) == "1"
    assert m.group(2) == "54:db:a2:11:e7:31"
    assert m.group(3) == "100"

    # PON_PORT_RX_RE
    m = PON_PORT_RX_RE.search("1/1   -20.10 dBm")
    assert m is not None
    assert m.group(1) == "1"
    assert m.group(2) == "1"
    assert m.group(3) == "-20.10 dBm"
