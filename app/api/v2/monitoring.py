from datetime import datetime, timedelta, timezone
from collections import defaultdict

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.netflow import NetFlowAggregate
from app.models.network import NetDevice

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


@router.get("/summary")
def summary(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    since = now - timedelta(hours=24)

    total_devices = db.scalar(select(func.count()).select_from(NetDevice)) or 0
    active_devices = db.scalar(
        select(func.count()).select_from(NetDevice).where(NetDevice.is_online == True)
    ) or 0

    traffic_today = db.scalar(
        select(func.coalesce(func.sum(NetFlowAggregate.bytes), 0)).where(
            NetFlowAggregate.timestamp >= since
        )
    ) or 0

    alerts_last_24h = 0

    return {
        "total_devices": int(total_devices),
        "active_devices": int(active_devices),
        "traffic_today_bytes": int(traffic_today),
        "alerts_last_24h": alerts_last_24h,
    }


@router.get("/timeseries")
def timeseries(
    hours: int = Query(default=24, ge=1, le=168),
    db: Session = Depends(get_db),
):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)

    rows = db.scalars(
        select(NetFlowAggregate)
        .where(NetFlowAggregate.timestamp >= since)
        .order_by(NetFlowAggregate.timestamp.asc())
    ).all()

    buckets = defaultdict(int)

    for row in rows:
        ts = row.timestamp.replace(minute=0, second=0, microsecond=0)
        buckets[ts.isoformat()] += int(row.bytes or 0)

    result = []

    current = since.replace(minute=0, second=0, microsecond=0)
    end = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)

    while current <= end:
        key = current.isoformat()
        result.append({
            "timestamp": key,
            "bytes": buckets.get(key, 0)
        })
        current += timedelta(hours=1)

    return result


@router.get("/top-talkers")
def top_talkers(
    limit: int = Query(default=10, ge=1, le=100),
    hours: int = Query(default=24, ge=1, le=168),
    db: Session = Depends(get_db),
):
    since = datetime.now(timezone.utc) - timedelta(hours=hours)

    rows = db.execute(
        select(
            NetFlowAggregate.src_ip,
            func.sum(NetFlowAggregate.bytes).label("total_bytes")
        )
        .where(NetFlowAggregate.timestamp >= since)
        .group_by(NetFlowAggregate.src_ip)
        .order_by(func.sum(NetFlowAggregate.bytes).desc())
        .limit(limit)
    ).all()

    return [
        {
            "ip": row.src_ip,
            "bytes": int(row.total_bytes or 0)
        }
        for row in rows
    ]
