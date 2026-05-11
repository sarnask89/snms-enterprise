import pytest
from unittest.mock import MagicMock
from app.nav_access import (
    visible_nav_items, grouped_visible_nav, path_allowed_for_portal,
    seed_nav_menu_and_permissions, _default_matrix
)
from app import models

def test_default_matrix():
    matrix = _default_matrix()
    assert models.UserRole.admin in matrix
    assert "dashboard" in matrix[models.UserRole.admin]
    assert "admin_backups" in matrix[models.UserRole.admin]
    assert "admin_backups" not in matrix[models.UserRole.manager]

def test_visible_nav_items():
    db = MagicMock()
    item1 = MagicMock(spec=models.NavMenuItem)
    item1.id = 1
    item2 = MagicMock(spec=models.NavMenuItem)
    item2.id = 2
    
    db.scalars.return_value.all.side_effect = [
        [item1, item2], # all_items
        [MagicMock(nav_item_id=1)] # allowed_ids
    ]
    
    result = visible_nav_items(db, models.UserRole.service)
    assert len(result) == 1
    assert result[0].id == 1

def test_grouped_visible_nav():
    item1 = MagicMock(spec=models.NavMenuItem)
    item1.key = "dashboard"
    item1.label = "Pulpit"
    
    item2 = MagicMock(spec=models.NavMenuItem)
    item2.key = "customers"
    item2.label = "Klienci"
    
    visible = [item1, item2]
    grouped = grouped_visible_nav(visible)
    
    assert len(grouped) >= 2
    assert grouped[0][0] == "Start"
    assert grouped[0][1][0].key == "dashboard"
    assert grouped[1][0] == "Klienci"
    assert grouped[1][1][0].key == "customers"

def test_path_allowed_for_portal_various():
    visible_urls = ["/teryt/browse"]
    visible_keys = {"dashboard", "customers"}
    
    # Allowed by direct URL match
    assert path_allowed_for_portal("/teryt/browse", visible_urls, visible_keys) is True
    assert path_allowed_for_portal("/teryt/browse/city/1", visible_urls, visible_keys) is True
    
    # Allowed by key mapping
    assert path_allowed_for_portal("/customers/123", visible_urls, visible_keys) is True
    assert path_allowed_for_portal("/", visible_urls, visible_keys) is True
    
    # Denied
    assert path_allowed_for_portal("/admin/backups", visible_urls, visible_keys) is False
    assert path_allowed_for_portal("/teryt/cities", visible_urls, visible_keys) is False

def test_seed_nav_menu_and_permissions():
    db = MagicMock()
    # Mock first check for item
    db.scalars.return_value.first.return_value = None
    
    seed_nav_menu_and_permissions(db)
    
    # Verify add was called for menu items and permissions
    assert db.add.called
    assert db.commit.called
