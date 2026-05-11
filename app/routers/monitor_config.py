from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import verify_session
from app.templating import render
from app import models
import logging

logger = logging.getLogger("app.monitor_config")

router = APIRouter(prefix="/admin/monitor-config", dependencies=[Depends(verify_session)], tags=["monitor-config"])

@router.get("", response_class=HTMLResponse)
def config_index(request: Request, db: Session = Depends(get_db)):
    templates = db.scalars(select(models.MonitorTemplate)).all()
    return render(request, "admin/monitor_config.html", {
        "title": "Konfiguracja NMS",
        "templates": templates
    })

@router.get("/template/new", response_class=HTMLResponse)
def template_new(request: Request):
    return render(request, "admin/monitor_template_form.html", {
        "title": "Nowy Szablon Monitorowania"
    })

@router.post("/template/new")
def template_new_submit(name: str = Form(...), description: str = Form(None), db: Session = Depends(get_db)):
    tmpl = models.MonitorTemplate(name=name, description=description)
    db.add(tmpl)
    db.commit()
    return RedirectResponse("/admin/monitor-config", status_code=303)

@router.get("/discovery/{device_id}", response_class=HTMLResponse)
async def device_discovery_view(device_id: int, request: Request, db: Session = Depends(get_db)):
    from app.services.snmp_service import snmp_service
    from app.services.mikrotik import MikrotikService
    from app.security_utils import decrypt_password
    
    device = db.get(models.NetDevice, device_id)
    if not device:
        return HTMLResponse("Device not found")
    
    interfaces = []
    
    # Try native Mikrotik API if driver is set
    if device.driver_type and "mikrotik" in device.driver_type.lower():
        logger.info(f"Using native Mikrotik API for discovery on {device.name} ({device.management_ip})")
        try:
            password = decrypt_password(device.mgmt_password_encrypted)
            mt = MikrotikService(device.management_ip, device.mgmt_username, password)
            raw_ifaces = await mt.get_interfaces()
            logger.info(f"Mikrotik API returned {len(raw_ifaces)} interfaces for {device.name}")
            
            for i, iface in enumerate(raw_ifaces, 1):
                # Map Mikrotik fields to our standard format
                status = "down" if str(iface.get("disabled", "false")).lower() == "true" else "up"
                # If 'running' is available, use it for more accuracy
                if str(iface.get("running", "true")).lower() == "false":
                    status = "down"
                
                # Speed is often not in API for virtuals, default to 1G or from comment
                speed = 1000000000
                
                interfaces.append({
                    "index": i, # Mikrotik uses names mostly, but we need an index for standard OIDs if we switch to SNMP later
                    "name": iface.get("name"),
                    "type": iface.get("type", "ethernet"),
                    "status": status,
                    "speed": speed,
                    "descr": iface.get("comment", "")
                })
        except Exception as e:
            logger.error(f"Native Mikrotik discovery failed for {device.name}: {e}")
            # Fallback to SNMP simulation
            interfaces = await snmp_service.discover_interfaces(device.management_ip, device.snmp_community or "public")
    else:
        # Generic SNMP Simulation
        interfaces = await snmp_service.discover_interfaces(device.management_ip, device.snmp_community or "public")
    
    return render(request, "admin/monitor_discovery_table.html", {
        "device": device,
        "interfaces": interfaces
    })

@router.post("/discovery/{device_id}/add-items")
async def discovery_add_items(device_id: int, request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    indices = form.getlist("interface_index")
    names = form.getlist("interface_name")
    
    for idx, name in zip(indices, names):
        # Create In Octets
        in_key = f"ifInOctets.{idx}"
        if not db.scalar(select(models.MonitorItem).where(models.MonitorItem.device_id == device_id, models.MonitorItem.key == in_key)):
            db.add(models.MonitorItem(
                device_id=device_id,
                name=f"Traffic In: {name}",
                key=in_key,
                item_type="SNMP",
                snmp_oid=f".1.3.6.1.2.1.2.2.1.10.{idx}",
                delay=60,
                unit="bps",
                multiplier=8.0,
                category="traffic",
                interface_name=name,
                interface_index=int(idx)
            ))
        # Create Out Octets
        out_key = f"ifOutOctets.{idx}"
        if not db.scalar(select(models.MonitorItem).where(models.MonitorItem.device_id == device_id, models.MonitorItem.key == out_key)):
            db.add(models.MonitorItem(
                device_id=device_id,
                name=f"Traffic Out: {name}",
                key=out_key,
                item_type="SNMP",
                snmp_oid=f".1.3.6.1.2.1.2.2.1.16.{idx}",
                delay=60,
                unit="bps",
                multiplier=8.0,
                category="traffic",
                interface_name=name,
                interface_index=int(idx)
            ))
            
    db.commit()
    return RedirectResponse(f"/admin/monitoring/device/{device_id}", status_code=303)

@router.post("/device/{device_id}/discover-items")
def discover_items(device_id: int, db: Session = Depends(get_db)):
    device = db.get(models.NetDevice, device_id)
    if not device:
        return {"error": "Device not found"}
    
    # In a real system, we'd use SNMP walk here
    # For now, we simulate discovery of common metrics
    metrics = [
        ("CPU Load", "system.cpu.load", "SNMP", ".1.3.6.1.2.1.25.3.3.1.2.1"),
        ("Memory Free", "system.mem.free", "SNMP", ".1.3.6.1.2.1.25.2.3.1.6.1"),
        ("Uptime", "system.uptime", "SNMP", ".1.3.6.1.2.1.1.3.0"),
    ]
    
    for name, key, itype, oid in metrics:
        # Check if exists
        exists = db.scalar(select(models.MonitorItem).where(models.MonitorItem.device_id == device_id, models.MonitorItem.key == key))
        if not exists:
            db.add(models.MonitorItem(
                device_id=device_id,
                name=name,
                key=key,
                item_type=itype,
                snmp_oid=oid,
                delay=60
            ))
    
    db.commit()
    return RedirectResponse(f"/admin/monitoring/device/{device_id}", status_code=303)

@router.get("/template/{template_id}/items", response_class=HTMLResponse)
def template_items(template_id: int, request: Request, db: Session = Depends(get_db)):
    tmpl = db.get(models.MonitorTemplate, template_id)
    items = db.scalars(select(models.MonitorItem).where(models.MonitorItem.template_id == template_id)).all()
    return render(request, "admin/monitor_template_items.html", {
        "title": f"Elementy: {tmpl.name}",
        "template": tmpl,
        "items": items
    })
