"""
Device import and export endpoints for API v2.

This module provides endpoints to import a batch of network device definitions
from a JSON file and to export a single device's configuration as JSON. The
import endpoint expects a file upload containing a JSON array of device
objects. Each object should include at least a ``name`` field and may also
specify ``hostname``, ``management_ip`` and ``device_type``. Unknown fields
are ignored. The export endpoint returns a minimal representation of a
``NetDevice`` record identified by its numeric ID.

These endpoints intentionally provide only basic functionality. In a real
deployment you would likely extend validation, error handling and mapping
logic to cover additional device attributes (such as interfaces, SNMP
credentials, models, etc.) and integrate with vendor-specific backup
mechanisms. For now the goal is to demonstrate how such endpoints can be
added to the existing FastAPI application without interfering with
surrounding code.
"""

import json

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app import models


router = APIRouter(prefix="/devices", tags=["devices"])


@router.post("/import")
async def import_devices(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import network devices from an uploaded JSON file.

    The uploaded file must contain a JSON array of objects. Each object is
    mapped to a new ``NetDevice`` instance. Only a subset of fields are
    supported: ``name`` (required), ``hostname``, ``management_ip`` and
    ``device_type``. All other keys are ignored. Devices with missing
    ``name`` fields are skipped.

    Returns a dictionary with the number of successfully imported devices.
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
            # Skip entries without a name
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
    """Export a network device's configuration as a JSON-serialisable dict.

    Returns a minimal representation of the ``NetDevice`` identified by
    ``device_id``. If no such device exists a simple error structure is
    returned. This endpoint does not currently include related objects such
    as interfaces or IP pools – these could be added in future iterations.
    """
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
    }
