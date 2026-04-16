"""Regresja: dostęp do /customer-devices gdy w menu są tylko stare prefixy URL."""

from app.nav_access import path_allowed_for_portal


def test_customer_devices_allowed_by_menu_key_not_only_url():
    """Użytkownik z kluczem `nodes` może wejść na /customer-devices mimo braku tego prefixu w url_path."""
    urls = ["/nodes"]  # stary wpis w bazie
    keys = {"nodes"}
    assert path_allowed_for_portal("/customer-devices", urls, keys) is True
    assert path_allowed_for_portal("/customer-devices/1/edit", urls, keys) is True


def test_customer_devices_denied_without_key():
    urls = ["/nodes"]
    keys: set[str] = set()
    assert path_allowed_for_portal("/customer-devices", urls, keys) is False


def test_node_groups_allowed_by_key():
    urls = []
    keys = {"node_groups"}
    assert path_allowed_for_portal("/node-groups/new", urls, keys) is True
