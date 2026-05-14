"""Network device backup/export service.

This service provides a safe default inventory export and an optional live
RouterOS SSH export path. The live path intentionally requires explicit
credentials on the device record and the optional ``paramiko`` package.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from app import models


@dataclass(slots=True)
class DeviceBackupResult:
    device_id: int
    device_name: str
    method: str
    success: bool
    content: str
    error: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "device_id": self.device_id,
            "device_name": self.device_name,
            "method": self.method,
            "success": self.success,
            "content": self.content,
            "error": self.error,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }


class DeviceBackupService:
    """Export device configuration from inventory or live devices."""

    def inventory_export(self, device: models.NetDevice) -> DeviceBackupResult:
        """Return an LMS/SNMS-style text export from database inventory only."""
        lines = [
            "# SNMS Enterprise device inventory export",
            f"# generated_at={datetime.now(timezone.utc).isoformat()}",
            f"/system identity set name=\"{self._safe(device.hostname or device.name)}\"",
            "",
            "# Device metadata",
            f"# id={device.id}",
            f"# name={device.name}",
            f"# type={device.device_type}",
            f"# management_ip={device.management_ip or ''}",
            f"# serial_number={device.serial_number or ''}",
            f"# mac_address={device.mac_address or ''}",
            f"# status={getattr(device.status, 'value', device.status)}",
        ]

        if device.interfaces:
            lines.append("")
            lines.append("# Interfaces")
            for iface in device.interfaces:
                disabled = "no" if getattr(iface, "is_active", True) else "yes"
                comment = self._safe(getattr(iface, "comment", None) or "")
                lines.append(
                    f"/interface comment set [find name=\"{self._safe(iface.name)}\"] comment=\"{comment}\" disabled={disabled}"
                )

        if device.ip_pools:
            lines.append("")
            lines.append("# IP pools")
            for pool in device.ip_pools:
                lines.append(
                    f"/ip pool add name=\"{self._safe(pool.name)}\" ranges=\"{self._safe(pool.ranges)}\""
                )

        if device.dhcp_servers:
            lines.append("")
            lines.append("# DHCP servers")
            for dhcp in device.dhcp_servers:
                disabled = "no" if getattr(dhcp, "is_active", True) else "yes"
                lines.append(
                    f"/ip dhcp-server add name=\"{self._safe(dhcp.name)}\" address-pool=\"{self._safe(dhcp.address_pool_name or '')}\" disabled={disabled}"
                )

        return DeviceBackupResult(
            device_id=device.id,
            device_name=device.name,
            method="inventory",
            success=True,
            content="\n".join(lines) + "\n",
        )

    def routeros_ssh_export(
        self,
        device: models.NetDevice,
        *,
        username: str | None = None,
        password: str | None = None,
        port: int = 22,
        timeout: int = 12,
    ) -> DeviceBackupResult:
        """Run a live RouterOS export over SSH using paramiko when available.

        This is intentionally explicit: it does not try to decrypt credentials.
        If caller does not provide username/password, it uses fields already
        present on the ``NetDevice`` record. If paramiko is unavailable or the
        device lacks credentials, the result contains ``success=False`` and a
        clear error for the UI/API.
        """
        host = device.management_ip or device.hostname
        username = username or device.mgmt_username
        password = password or device.mgmt_password_encrypted

        if not host:
            return self._error(device, "routeros_ssh", "Device has no management_ip or hostname")
        if not username or not password:
            return self._error(device, "routeros_ssh", "Missing RouterOS username or password")

        try:
            import paramiko  # type: ignore
        except Exception:
            return self._error(
                device,
                "routeros_ssh",
                "Optional dependency 'paramiko' is not installed; install it to enable live RouterOS backups",
            )

        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                hostname=str(host),
                port=int(port),
                username=str(username),
                password=str(password),
                timeout=int(timeout),
                banner_timeout=int(timeout),
                auth_timeout=int(timeout),
                look_for_keys=False,
                allow_agent=False,
            )
            _, stdout, stderr = client.exec_command("/export terse hide-sensitive", timeout=int(timeout))
            content = stdout.read().decode("utf-8", errors="replace")
            error = stderr.read().decode("utf-8", errors="replace").strip() or None
            client.close()
        except Exception as exc:
            return self._error(device, "routeros_ssh", str(exc))

        if not content.strip():
            return self._error(device, "routeros_ssh", error or "RouterOS export returned empty output")

        return DeviceBackupResult(
            device_id=device.id,
            device_name=device.name,
            method="routeros_ssh",
            success=True,
            content=content,
            error=error,
        )

    @staticmethod
    def _safe(value: str) -> str:
        return str(value).replace('"', "'").replace("\n", " ").strip()

    @staticmethod
    def _error(device: models.NetDevice, method: str, error: str) -> DeviceBackupResult:
        return DeviceBackupResult(
            device_id=device.id,
            device_name=device.name,
            method=method,
            success=False,
            content="",
            error=error,
        )


device_backup_service = DeviceBackupService()
