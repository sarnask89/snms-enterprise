from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.templating import render
import sqlalchemy as sa
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin/stats", tags=["stats"])

@router.get("/network-health")
def network_health_fragment(request: Request, db: Session = Depends(get_db)):
    # 1. Count active hosts (DHCP leases in last 24h)
    # Mocking since I don't have real lease table yet, using NetDevice as proxy
    active_hosts = db.scalar(sa.select(sa.func.count(models.NetworkHost.id))) or 0
    total_devices = db.scalar(sa.select(sa.func.count(models.NetDevice.id))) or 0
    
    # 2. Finance Summary
    # Unpaid invoices
    unpaid_total = db.scalar(sa.select(sa.func.sum(models.Invoice.amount)).where(models.Invoice.status != "paid")) or 0
    
    # 3. Links
    links_count = db.scalar(sa.select(sa.func.count(models.NetworkLink.id))) or 0
    
    return render(request, "admin/dashboard_stats_fragment.html", {
        "active_hosts": active_hosts,
        "total_devices": total_devices,
        "unpaid_total": unpaid_total,
        "links_count": links_count
    })

@router.get("/live-traffic")
def live_traffic_data(db: Session = Depends(get_db)):
    # Returns JSON for Chart.js
    # Last 10 stats for the core router
    stats = db.scalars(
        sa.select(models.NetworkStat)
        .order_by(models.NetworkStat.timestamp.desc())
        .limit(20)
    ).all()
    
    return {
        "labels": [s.timestamp.strftime("%H:%M") for s in reversed(stats)],
        "in": [s.in_octets for s in reversed(stats)],
        "out": [s.out_octets for s in reversed(stats)]
    }


@router.get("/notifications-count")
def notifications_count(request: Request, db: Session = Depends(get_db)):
    count = db.scalar(sa.select(sa.func.count(models.SystemNotification.id)).where(models.SystemNotification.is_read == False)) or 0
    if count == 0:
        return Response(content="") # Return nothing if zero
    return render(request, "components/notification_badge.html", {"count": count})

@router.get("/notifications-list")
def notifications_list(request: Request, db: Session = Depends(get_db)):
    notifs = db.scalars(
        sa.select(models.SystemNotification)
        .order_by(models.SystemNotification.created_at.desc())
        .limit(5)
    ).all()
    return render(request, "components/notification_list_fragment.html", {"notifications": notifs})
