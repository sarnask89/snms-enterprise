import pytest
from unittest.mock import MagicMock
from app.services.ui_service import ui_service

def test_get_theme_assets():
    request = MagicMock()
    request.cookies = {"theme": "dark"}
    assets = ui_service.get_theme_assets(request)
    assert "dark" in assets["bg_grid"]
    
    request.cookies = {"theme": "light"}
    assets = ui_service.get_theme_assets(request)
    assert "light" in assets["bg_grid"]

def test_get_breadcrumb():
    request = MagicMock()
    request.url.path = "/customers/123/edit"
    
    breadcrumbs = ui_service.get_breadcrumb(request, "Edit Customer")
    
    assert breadcrumbs[0]["label"] == "Pulpit"
    assert breadcrumbs[1]["label"] == "Klienci"
    assert breadcrumbs[1]["url"] == "/customers"
    assert breadcrumbs[-1]["label"] == "Edit Customer"
