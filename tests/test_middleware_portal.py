import pytest
from app.middleware_portal import _auth_enabled, _path_open
import os

def test_auth_enabled():
    os.environ["AUTH_ENABLED"] = "true"
    assert _auth_enabled() is True
    os.environ["AUTH_ENABLED"] = "false"
    assert _auth_enabled() is False
    os.environ["AUTH_ENABLED"] = "0"
    assert _auth_enabled() is False
    os.environ["AUTH_ENABLED"] = "off"
    assert _auth_enabled() is False

def test_path_open():
    assert _path_open("/static/style.css") is True
    assert _path_open("/login") is True
    assert _path_open("/logout") is True
    assert _path_open("/teryt/browse") is True
    assert _path_open("/customers") is False
    assert _path_open("/admin/users") is False
    assert _path_open("/favicon.ico") is True
