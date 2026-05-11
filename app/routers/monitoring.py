from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import json
import logging
from collections import Counter

from app import models
from app.database import get_db
from app.deps import verify_session
from app.templating import render

logger = logging.getLogger("monitoring_router")

router = APIRouter(prefix="/admin/monitoring", dependencies=[Depends(verify_session)], tags=["monitoring"])

@router.get("", response_class=HTMLResponse)
def monitoring_dashboard(request: Request, db: Session = Depends(get_db)):
    devices = db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all()
    
    total_devices = len(devices)
    online_devices = sum(1 for d in devices if d.is_online)
    offline_devices = total_devices - online_devices
    
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
    
    since = datetime.utcnow() - timedelta(hours=24)
    stats = db.scalars(
        select(models.NetworkStat)
        .where(models.NetworkStat.device_id == device_id)
        .where(models.NetworkStat.timestamp >= since)
        .order_by(models.NetworkStat.timestamp.asc())
    ).all()
    
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
    item_ids: str | None = Query(None),
    db: Session = Depends(get_db)
):
    since = datetime.utcnow() - timedelta(hours=hours)
    
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
            
            if not result["labels"]:
                result["labels"] = [h.timestamp.strftime("%H:%M") for h in history]
            
            result["datasets"].append({
                "label": item.name,
                "data": [h.value for h in history],
                "unit": item.unit or ""
            })
        return result

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

@router.get("/api/device/{device_id}/netflow")
def get_device_netflow_json(device_id: int, hours: int = Query(4), db: Session = Depends(get_db)):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    
    # In this robust version, we sum bytes from NetFlowAggregate
    # We group by src_ip to see who is sending the most data
    stmt = (
        select(models.NetFlowAggregate.src_ip, func.sum(models.NetFlowAggregate.bytes).label("total_bytes"))
        .where(models.NetFlowAggregate.timestamp >= since)
        .group_by(models.NetFlowAggregate.src_ip)
        .order_by(func.sum(models.NetFlowAggregate.bytes).desc())
        .limit(10)
    )
    
    results = db.execute(stmt).all()
    
    return {
        "top_talkers": [
            {"ip": r.src_ip, "bytes": int(r.total_bytes)} for r in results
        ],
        "total_unique_ips": len(results)
    }

@router.get("/gpu", response_class=HTMLResponse)
def gpu_monitoring(request: Request, db: Session = Depends(get_db)):
    from app.models.monitoring import NvidiaGPU, NvidiaStat
    gpus = db.scalars(select(NvidiaGPU).where(NvidiaGPU.is_active == True)).all()
    
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

@router.get("/api/customer-device/{device_id}/stats")
def get_customer_device_stats(
    device_id: int, 
    hours: int = Query(24), 
    db: Session = Depends(get_db)
):
    device = db.get(models.CustomerDevice, device_id)
    if not device or not device.ip_address:
        return {"labels": [], "in_mbps": [], "out_mbps": []}
        
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    ip = device.ip_address
    
    # Fetch NetFlow aggregates related to this device's IP
    flows = db.scalars(
        select(models.NetFlowAggregate)
        .where(
            (models.NetFlowAggregate.timestamp >= since) & 
            ((models.NetFlowAggregate.src_ip == ip) | (models.NetFlowAggregate.dst_ip == ip))
        )
        .order_by(models.NetFlowAggregate.timestamp.asc())
    ).all()
    
    # Group by hour
    buckets = {}
    for f in flows:
        hour_str = f.timestamp.strftime("%Y-%m-%d %H:00")
        if hour_str not in buckets:
            buckets[hour_str] = {"in_bytes": 0, "out_bytes": 0}
        
        if f.dst_ip == ip:
            buckets[hour_str]["in_bytes"] += f.bytes
        if f.src_ip == ip:
            buckets[hour_str]["out_bytes"] += f.bytes
            
    # Generate continuous labels
    labels = []
    in_mbps = []
    out_mbps = []
    
    current = since.replace(minute=0, second=0, microsecond=0)
    end = datetime.now(timezone.utc)
    
    while current <= end:
        hour_str = current.strftime("%Y-%m-%d %H:00")
        labels.append(current.strftime("%H:%M"))
        
        if hour_str in buckets:
            # bytes * 8 (bits) / 1,000,000 (Megabits) / 3600 (seconds in hour)
            avg_in = (buckets[hour_str]["in_bytes"] * 8) / 1000000 / 3600
            avg_out = (buckets[hour_str]["out_bytes"] * 8) / 1000000 / 3600
            in_mbps.append(round(avg_in, 4))
            out_mbps.append(round(avg_out, 4))
        else:
            in_mbps.append(0)
            out_mbps.append(0)

        current += timedelta(hours=1)

    return {
        "labels": labels,
        "in_mbps": in_mbps,
        "out_mbps": out_mbps
    }

@router.get("/api/global/stats")
def get_global_stats(
    hours: int = Query(24), 
    db: Session = Depends(get_db)
):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)

    # Fetch all NetFlow aggregates in timeframe
    flows = db.scalars(
        select(models.NetFlowAggregate)
        .where(models.NetFlowAggregate.timestamp >= since)
        .order_by(models.NetFlowAggregate.timestamp.asc())
    ).all()

    # Group by hour for a global view
    buckets = {}
    for f in flows:
        hour_str = f.timestamp.strftime("%Y-%m-%d %H:00")
        if hour_str not in buckets:
            buckets[hour_str] = {"total_bytes": 0}

        buckets[hour_str]["total_bytes"] += f.bytes

    labels = []
    total_mbps = []

    current = since.replace(minute=0, second=0, microsecond=0)
    end = datetime.now(timezone.utc)

    while current <= end:
        hour_str = current.strftime("%Y-%m-%d %H:00")
        labels.append(current.strftime("%H:%M"))

        if hour_str in buckets:
            avg_mbps = (buckets[hour_str]["total_bytes"] * 8) / 1000000 / 3600
            total_mbps.append(round(avg_mbps, 4))
        else:
            total_mbps.append(0)

        current += timedelta(hours=1)

    return {
        "labels": labels,
        "total_mbps": total_mbps
    }
