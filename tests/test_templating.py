import pytest
from unittest.mock import MagicMock, patch
from app.templating import render
from app.models import UserRole

def test_render_no_user():
    request = MagicMock()
    request.state.portal_user = None
    request.state.client_user = None
    
    with patch("app.templating.templates.TemplateResponse") as mock_response:
        render(request, "test.html", {"title": "Test"})
        
        ctx = mock_response.call_args[0][2]
        assert ctx["title"] == "Test"
        assert ctx["portal_user"] is None
        assert ctx["nav_items"] == []
        assert ctx["can_write_crm"] is False

def test_render_with_admin():
    request = MagicMock()
    user = MagicMock()
    user.role = UserRole.admin
    request.state.portal_user = user
    request.state.client_user = None
    request.state.nav_items_for_template = [MagicMock()]
    request.state.visible_menu_keys = {"dashboard"}
    
    with patch("app.templating.templates.TemplateResponse") as mock_response:
        render(request, "test.html")
        
        ctx = mock_response.call_args[0][2]
        assert ctx["portal_user"] == user
        assert ctx["can_write_crm"] is True
        assert ctx["can_mutate"] is True
        assert "dashboard" in ctx["visible_menu_keys"]

def test_render_status_code():
    request = MagicMock()
    request.state.portal_user = None
    
    with patch("app.templating.templates.TemplateResponse") as mock_response:
        mock_resp_obj = MagicMock()
        mock_response.return_value = mock_resp_obj
        
        render(request, "test.html", status_code=404)
        assert mock_resp_obj.status_code == 404
