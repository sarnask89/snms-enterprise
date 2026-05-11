import pytest
from fastapi import HTTPException, Request
from app.deps import login_required, require_admin, require_business_write
from app.models import UserRole
from unittest.mock import MagicMock
import os

def test_login_required_no_user():
    request = MagicMock(spec=Request)
    request.state.portal_user = None
    os.environ["AUTH_ENABLED"] = "true"
    
    with pytest.raises(HTTPException) as excinfo:
        login_required(request)
    assert excinfo.value.status_code == 303
    assert excinfo.value.headers["Location"] == "/login"

def test_login_required_with_user():
    request = MagicMock(spec=Request)
    request.state.portal_user = MagicMock()
    os.environ["AUTH_ENABLED"] = "true"
    
    # Should not raise
    login_required(request)

def test_require_admin_success():
    request = MagicMock(spec=Request)
    request.state.portal_user = MagicMock()
    request.state.portal_user.role = UserRole.admin
    os.environ["AUTH_ENABLED"] = "true"
    
    require_admin(request)

def test_require_admin_failure():
    request = MagicMock(spec=Request)
    request.state.portal_user = MagicMock()
    request.state.portal_user.role = UserRole.manager
    os.environ["AUTH_ENABLED"] = "true"
    
    with pytest.raises(HTTPException) as excinfo:
        require_admin(request)
    assert excinfo.value.status_code == 403

def test_require_business_write_view_only():
    request = MagicMock(spec=Request)
    request.state.portal_user = MagicMock()
    request.state.portal_user.role = UserRole.view
    os.environ["AUTH_ENABLED"] = "true"
    
    with pytest.raises(HTTPException) as excinfo:
        require_business_write(request)
    assert excinfo.value.status_code == 403
    assert "tylko podgląd" in excinfo.value.detail
