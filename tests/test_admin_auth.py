import pytest
from unittest.mock import MagicMock, patch
from app.admin_auth import AdminAuth
from app import models

@pytest.mark.asyncio
async def test_admin_auth_authenticate_no_session():
    auth = AdminAuth(secret_key="test")
    request = MagicMock()
    request.session = {}
    
    with patch("app.config.AUTH_ENABLED", True):
        assert await auth.authenticate(request) is False

@pytest.mark.asyncio
async def test_admin_auth_authenticate_success():
    auth = AdminAuth(secret_key="test")
    request = MagicMock()
    request.session = {"user_id": "1"}
    
    db = MagicMock()
    user = MagicMock()
    user.active = True
    user.role = models.UserRole.admin
    db.get.return_value = user
    
    with patch("app.config.AUTH_ENABLED", True), \
         patch("app.database.db_manager.SessionLocal", return_value=db):
        assert await auth.authenticate(request) is True

@pytest.mark.asyncio
async def test_admin_auth_authenticate_not_admin():
    auth = AdminAuth(secret_key="test")
    request = MagicMock()
    request.session = {"user_id": "1"}
    
    db = MagicMock()
    user = MagicMock()
    user.active = True
    user.role = models.UserRole.manager
    db.get.return_value = user
    
    with patch("app.config.AUTH_ENABLED", True), \
         patch("app.database.db_manager.SessionLocal", return_value=db):
        assert await auth.authenticate(request) is False

@pytest.mark.asyncio
async def test_admin_auth_logout():
    auth = AdminAuth(secret_key="test")
    request = MagicMock()
    request.session = {"user_id": "1"}
    
    await auth.logout(request)
    assert len(request.session) == 0
