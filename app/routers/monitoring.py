from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app import models
from app.database import get_db
from app.deps import verify_session
from app.templating import render

router = APIRouter(prefix="/admin/monitoring", dependencies=[Depends(verify_session)], tags=["monitoring"])

@router.get("", response_class=HTMLResponse)
def monitoring_dashboard(request: Request, db: Session = Depends(get_db)):
    devices = db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all()
    
    # Summary stats
    total_devices = len(devices)
    online_devices = sum(1 for d in devices if d.is_online)
    offline_devices = total_devices - online_devices
    
    # Recent notifications
    notifications = db.scalars(
        select(models.SystemNotification)
        .order_by(models.SystemNotification.created_at.desc())
        .limit(10)
    ).all()

    return render(request, "admin/monitoring.html", {
        "title": "Monitorowanie Sieci",
        "devices": devices,
        "online_count": online_devices,
        "offline_count": offline_devices,
        "total_count": total_devices,
        "notifications": notifications
    })

@router.get("/device/{device_id}", response_class=HTMLResponse)
def device_monitoring_details(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.NetDevice, device_id)
    if not device:
        return RedirectResponse("/admin/monitoring", status_code=302)
    
    # Get last 24h of stats
    since = datetime.utcnow() - timedelta(hours=24)
    stats = db.scalars(
        select(models.NetworkStat)
        .where(models.NetworkStat.device_id == device_id)
        .where(models.NetworkStat.timestamp >= since)
        .order_by(models.NetworkStat.timestamp.asc())
    ).all()
    
    # Get associated monitor items
    items = db.scalars(
        select(models.MonitorItem)
        .where(models.MonitorItem.device_id == device_id, models.MonitorItem.is_active == True)
        .order_by(models.MonitorItem.category, models.MonitorItem.name)
    ).all()
    
    return render(request, "admin/monitoring_device.html", {
        "title": f"Monitoring: {device.name}",
        "device": device,
        "stats": stats,
        "monitor_items": items
    })

@router.get("/api/device/{device_id}/stats")
def get_device_stats_json(
    device_id: int, 
    hours: int = Query(24), 
    item_ids: str | None = Query(None, description="Comma-separated MonitorItem IDs"),
    db: Session = Depends(get_db)
):
    since = datetime.utcnow() - timedelta(hours=hours)
    
    # If specific items requested, fetch their history
    if item_ids:
        ids = [int(i) for i in item_ids.split(",") if i.strip().isdigit()]
        items = db.scalars(select(models.MonitorItem).where(models.MonitorItem.id.in_(ids))).all()
        
        result = {"labels": [], "datasets": []}
        
        for item in items:
            history = db.scalars(
                select(models.MonitorHistory)
                .where(models.MonitorHistory.item_id == item.id)
                .where(models.MonitorHistory.timestamp >= since)
                .order_by(models.MonitorHistory.timestamp.asc())
            ).all()
            
            # Use history timestamps for labels if result labels empty
            if not result["labels"]:
                result["labels"] = [h.timestamp.strftime("%H:%M") for h in history]
            
            result["datasets"].append({
                "label": item.name,
                "data": [h.value for h in history],
                "unit": item.unit or ""
            })
        return result

    # Legacy/Default fallback
    stats = db.scalars(
        select(models.NetworkStat)
        .where(models.NetworkStat.device_id == device_id)
        .where(models.NetworkStat.timestamp >= since)
        .order_by(models.NetworkStat.timestamp.asc())
    ).all()
    
    return {
        "labels": [s.timestamp.strftime("%H:%M") for s in stats],
        "datasets": [
            {"label": "CPU", "data": [s.cpu_usage for s in stats], "type": "percentage"},
            {"label": "Traffic In", "data": [(s.in_octets or 0) * 8 / 1000000 for s in stats], "unit": "Mbps"},
            {"label": "Traffic Out", "data": [(s.out_octets or 0) * 8 / 1000000 for s in stats], "unit": "Mbps"}
        ]
    }

@router.get("/api/customer-device/{device_id}/stats")
def get_customer_device_stats_json(device_id: int, hours: int = Query(24), db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(hours=hours)
    from app.models.monitoring import CustomerDeviceStat
    stats = db.scalars(
        select(CustomerDeviceStat)
        .where(CustomerDeviceStat.device_id == device_id)
        .where(CustomerDeviceStat.timestamp >= since)
        .order_by(CustomerDeviceStat.timestamp.asc())
    ).all()
    
    return {
        "labels": [s.timestamp.strftime("%H:%M") for s in stats],
        "in_mbps": [(s.in_octets or 0) * 8 / 1000000 for s in stats],
        "out_mbps": [(s.out_octets or 0) * 8 / 1000000 for s in stats]
    }
@router.get("/gpu", response_class=HTMLResponse)
def gpu_monitoring(request: Request, db: Session = Depends(get_db)):
    from app.models.monitoring import NvidiaGPU, NvidiaStat
    gpus = db.scalars(select(NvidiaGPU).where(NvidiaGPU.is_active == True)).all()
    
    # Attach latest stat to each GPU
    for gpu in gpus:
        latest = db.scalar(
            select(NvidiaStat)
            .where(NvidiaStat.gpu_id == gpu.id)
            .order_by(NvidiaStat.timestamp.desc())
            .limit(1)
        )
        gpu.latest_stat = latest
        
    return render(request, "admin/monitoring_gpu.html", {
        "title": "Infrastruktura AI / GPU",
        "gpus": gpus
    })
