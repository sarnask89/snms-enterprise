from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, func, or_, select
from sqlalchemy.orm import Session

from app import models
from app.api.auth import get_current_user
from app.database import get_db

router = APIRouter(prefix="/monitoring", tags=["monitoring"], dependencies=[Depends(get_current_user)])


def _bytes_to_mbps(byte_count: int | float, seconds: int) -> float:
    if seconds <= 0:
        return 0.0
    return round((float(byte_count or 0) * 8) / 1_000_000 / seconds, 4)


def _bucket_key(ts: datetime) -> str:
    return ts.astimezone(timezone.utc).replace(minute=0, second=0, microsecond=0).isoformat()


@router.get("/summary")
def monitoring_summary(db: Session = Depends(get_db)) -> dict[str, Any]:
    total_devices = db.scalar(select(func.count()).select_from(models.NetDevice)) or 0
    online_devices = (
        db.scalar(select(func.count()).select_from(models.NetDevice).where(models.NetDevice.is_online == True))
        or 0
    )
    active_monitor_items = (
        db.scalar(select(func.count()).select_from(models.MonitorItem).where(models.MonitorItem.is_active == True))
        or 0
    )
    netflow_rows_24h = (
        db.scalar(
            select(func.count()).select_from(models.NetFlowAggregate).where(
                models.NetFlowAggregate.timestamp >= datetime.now(timezone.utc) - timedelta(hours=24)
            )
        )
        or 0
    )
    total_bytes_24h = (
        db.scalar(
            select(func.coalesce(func.sum(models.NetFlowAggregate.bytes), 0)).where(
                models.NetFlowAggregate.timestamp >= datetime.now(timezone.utc) - timedelta(hours=24)
            )
        )
        or 0
    )

    return {
        "devices": {
            "total": int(total_devices),
            "online": int(online_devices),
            "offline": max(int(total_devices) - int(online_devices), 0),
        },
        "monitor_items": {"active": int(active_monitor_items)},
        "netflow": {
            "flows_24h": int(netflow_rows_24h),
            "traffic_mbps_avg_24h": _bytes_to_mbps(int(total_bytes_24h), 24 * 3600),
        },
    }


@router.get("/netflow/timeseries")
def netflow_timeseries(
    hours: int = Query(default=24, ge=1, le=168),
    db: Session = Depends(get_db),
) -> dict[str, list[Any]]:
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    flows = db.scalars(
        select(models.NetFlowAggregate)
        .where(models.NetFlowAggregate.timestamp >= since)
        .order_by(models.NetFlowAggregate.timestamp.asc())
    ).all()

    buckets: dict[str, int] = {}
    for flow in flows:
        key = _bucket_key(flow.timestamp)
        buckets[key] = buckets.get(key, 0) + int(flow.bytes or 0)

    labels: list[str] = []
    total_mbps: list[float] = []
    current = since.replace(minute=0, second=0, microsecond=0)
    end = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)

    while current <= end:
        key = current.isoformat()
        labels.append(current.strftime("%H:%M"))
        total_mbps.append(_bytes_to_mbps(buckets.get(key, 0), 3600))
        current += timedelta(hours=1)

    return {"labels": labels, "total_mbps": total_mbps}


@router.get("/netflow/top-talkers")
def netflow_top_talkers(
    hours: int = Query(default=4, ge=1, le=168),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    rows = db.execute(
        select(
            models.NetFlowAggregate.src_ip,
            func.coalesce(func.sum(models.NetFlowAggregate.bytes), 0).label("total_bytes"),
            func.coalesce(func.sum(models.NetFlowAggregate.packets), 0).label("total_packets"),
        )
        .where(models.NetFlowAggregate.timestamp >= since)
        .group_by(models.NetFlowAggregate.src_ip)
        .order_by(desc("total_bytes"))
        .limit(limit)
    ).all()

    return {
        "items": [
            {
                "ip": row.src_ip,
                "bytes": int(row.total_bytes or 0),
                "packets": int(row.total_packets or 0),
                "mbps_avg": _bytes_to_mbps(int(row.total_bytes or 0), hours * 3600),
            }
            for row in rows
        ]
    }


@router.get("/customer-device/{device_id}/traffic")
def customer_device_traffic(
    device_id: int,
    hours: int = Query(default=24, ge=1, le=168),
    db: Session = Depends(get_db),
) -> dict[str, list[Any]]:
    device = db.get(models.CustomerDevice, device_id)
    if not device or not device.ip_address:
        return {"labels": [], "in_mbps": [], "out_mbps": []}

    ip = device.ip_address
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    flows = db.scalars(
        select(models.NetFlowAggregate)
        .where(
            models.NetFlowAggregate.timestamp >= since,
            or_(models.NetFlowAggregate.src_ip == ip, models.NetFlowAggregate.dst_ip == ip),
        )
        .order_by(models.NetFlowAggregate.timestamp.asc())
    ).all()

    buckets: dict[str, dict[str, int]] = {}
    for flow in flows:
        key = _bucket_key(flow.timestamp)
        buckets.setdefault(key, {"in": 0, "out": 0})
        if flow.dst_ip == ip:
            buckets[key]["in"] += int(flow.bytes or 0)
        if flow.src_ip == ip:
            buckets[key]["out"] += int(flow.bytes or 0)

    labels: list[str] = []
    in_mbps: list[float] = []
    out_mbps: list[float] = []
    current = since.replace(minute=0, second=0, microsecond=0)
    end = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)

    while current <= end:
        key = current.isoformat()
        labels.append(current.strftime("%H:%M"))
        bucket = buckets.get(key, {"in": 0, "out": 0})
        in_mbps.append(_bytes_to_mbps(bucket["in"], 3600))
        out_mbps.append(_bytes_to_mbps(bucket["out"], 3600))
        current += timedelta(hours=1)

    return {"labels": labels, "in_mbps": in_mbps, "out_mbps": out_mbps}


@router.get("/events")
def monitoring_events(limit: int = Query(default=20, ge=1, le=100), db: Session = Depends(get_db)) -> dict[str, Any]:
    notifications = db.scalars(
        select(models.SystemNotification)
        .order_by(models.SystemNotification.created_at.desc())
        .limit(limit)
    ).all()

    return {
        "items": [
            {
                "id": item.id,
                "title": getattr(item, "title", None) or getattr(item, "message", "Notification"),
                "severity": getattr(item, "severity", "info"),
                "created_at": item.created_at.isoformat() if item.created_at else None,
            }
            for item in notifications
        ]
    }
