from types import SimpleNamespace

from app.services.device_backup_service import DeviceBackupService


def test_inventory_export_contains_routeros_style_metadata():
    device = SimpleNamespace(
        id=123,
        name="Core Router",
        hostname="core-rtr-1",
        management_ip="10.0.0.1",
        device_type="router",
        serial_number="SN123",
        mac_address="AA:BB:CC:DD:EE:FF",
        status="active",
        interfaces=[],
        ip_pools=[],
        dhcp_servers=[],
    )

    result = DeviceBackupService().inventory_export(device)

    assert result.success is True
    assert result.method == "inventory"
    assert "/system identity set" in result.content
    assert "core-rtr-1" in result.content
    assert "management_ip=10.0.0.1" in result.content


def test_routeros_ssh_export_reports_missing_host():
    device = SimpleNamespace(
        id=456,
        name="No Host Device",
        hostname=None,
        management_ip=None,
        mgmt_username="admin",
        mgmt_password_encrypted="secret",
    )

    result = DeviceBackupService().routeros_ssh_export(device)

    assert result.success is False
    assert result.method == "routeros_ssh"
    assert "management_ip" in result.error
