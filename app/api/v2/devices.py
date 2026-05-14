"""
Device import, export and backup endpoints for API v2.

This module provides endpoints to import a batch of network device definitions
from JSON, export a device inventory snapshot, and generate a RouterOS-style
backup/export from either database inventory or a live RouterOS SSH session.
"""

import json

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.services.device_backup_service import device_backup_service


router = APIRouter(prefix="/devices", tags=["devices"])


@router.post("/import")
async def import_devices(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import network devices from an uploaded JSON file.

    The uploaded file must contain a JSON array of objects. Each object is
    mapped to a new ``NetDevice`` instance. Only a subset of fields are
    supported: ``name`` (required), ``hostname``, ``management_ip`` and
    ``device_type``. All other keys are ignored. Devices with missing
    ``name`` fields are skipped.
    """
    content = await file.read()
    try:
        data = json.loads(content.decode())
    except Exception:
        return {"error": "Invalid JSON"}

    if not isinstance(data, list):
        return {"error": "Expected a JSON array"}

    imported = 0
    for item in data:
        if not isinstance(item, dict):
            continue
        name = item.get("name")
        if not name:
            continue
        hostname = item.get("hostname")
        management_ip = item.get("management_ip")
        device_type = item.get("device_type", "other")

        dev = models.NetDevice(
            name=str(name)[:128],
            hostname=str(hostname)[:255] if hostname else None,
            management_ip=str(management_ip)[:64] if management_ip else None,
            device_type=str(device_type)[:64] if device_type else "other",
        )
        db.add(dev)
        imported += 1
    if imported:
        db.commit()
    return {"imported": imported}


@router.get("/{device_id}/export")
def export_device(device_id: int, db: Session = Depends(get_db)):
    """Export a network device's database configuration as JSON."""
    dev = db.get(models.NetDevice, device_id)
    if not dev:
        return {"error": "Device not found"}
    return {
        "id": dev.id,
        "name": dev.name,
        "hostname": dev.hostname,
        "management_ip": dev.management_ip,
        "device_type": dev.device_type,
        "serial_number": dev.serial_number,
        "mac_address": dev.mac_address,
        "status": getattr(dev.status, "value", dev.status),
    }


@router.post("/{device_id}/backup")
def backup_device(device_id: int, payload: dict | None = None, db: Session = Depends(get_db)):
    """Generate a device configuration backup/export.

    Request body options:
    - method: ``inventory`` (default) or ``routeros_ssh``
    - username/password: optional live RouterOS SSH credentials
    - port/timeout: optional RouterOS SSH connection settings

    ``inventory`` never connects to the network and returns a RouterOS-style
    export from database objects. ``routeros_ssh`` attempts a live ``/export
    terse hide-sensitive`` command when paramiko and credentials are available.
    """
    dev = db.get(models.NetDevice, device_id)
    if not dev:
        return {"error": "Device not found"}

    payload = payload or {}
    method = payload.get("method", "inventory")

    if method == "inventory":
        return device_backup_service.inventory_export(dev).as_dict()

    if method == "routeros_ssh":
        return device_backup_service.routeros_ssh_export(
            dev,
            username=payload.get("username"),
            password=payload.get("password"),
            port=int(payload.get("port", 22)),
            timeout=int(payload.get("timeout", 12)),
        ).as_dict()

    return {"error": f"Unsupported backup method: {method}"}
