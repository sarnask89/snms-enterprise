from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.templating import render
import sqlalchemy as sa
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/admin/stats", tags=["stats"])

@router.get("/network-health")
def get_network_health_json(db: Session = Depends(get_db)):
    total_devices = db.scalar(sa.select(sa.func.count(models.NetDevice.id))) or 10
    online_now = db.scalar(sa.select(sa.func.count(models.NetDevice.id)).where(models.NetDevice.is_online == True)) or 8
    
    history = []
    now = datetime.now()
    for i in range(24, 0, -1):
        time = (now - timedelta(hours=i)).strftime("%H:00")
        var = random.randint(-1, 1)
        history.append({
            "time": time,
            "online": online_now + var,
            "packet_loss": random.uniform(0.1, 1.5)
        })
    return {"history": history}

@router.get("/customer-traffic/{customer_id}")
def get_customer_traffic_json(customer_id: int, db: Session = Depends(get_db)):
    # Real data would come from monitoring history
    history = []
    now = datetime.now()
    for i in range(24, 0, -1):
        time = (now - timedelta(hours=i)).strftime("%H:00")
        history.append({
            "time": time,
            "in": random.randint(100, 500),
            "out": random.randint(10, 50)
        })
    return {
        "labels": [h["time"] for h in history],
        "series": [
            {"name": "Download (Mbps)", "data": [h["in"] for h in history]},
            {"name": "Upload (Mbps)", "data": [h["out"] for h in history]}
        ]
    }

@router.get("/financial-summary")
def get_financial_summary_json(db: Session = Depends(get_db)):
    now = datetime.now()
    history = []
    for i in range(12, 0, -1):
        month = (now - timedelta(days=i*30)).strftime("%b")
        history.append({
            "month": month,
            "revenue": random.randint(5000, 15000),
            "expense": random.randint(2000, 8000)
        })
    return {
        "labels": [h["month"] for h in history],
        "series": [
            {"name": "Przychody", "data": [h["revenue"] for h in history]},
            {"name": "Koszty", "data": [h["expense"] for h in history]}
        ]
    }

@router.get("/inventory-summary")
def get_inventory_summary_json(db: Session = Depends(get_db)):
    # Group devices by model
    # Simulation for now
    return {
        "labels": ["Mikrotik RB4011", "Dasan H660GM", "Cisco 2960", "Inne"],
        "series": [12, 45, 8, 15]
    }

@router.get("/customer-growth")
def get_customer_growth_json(db: Session = Depends(get_db)):
    now = datetime.now()
    labels = []
    values = []
    base = 120
    for i in range(6, 0, -1):
        labels.append((now - timedelta(days=i*30)).strftime("%b"))
        base += random.randint(2, 10)
        values.append(base)
    return {"labels": labels, "values": values}

@router.get("/notifications-count")
def notifications_count(request: Request, db: Session = Depends(get_db)):
    count = db.scalar(sa.select(sa.func.count(models.SystemNotification.id)).where(models.SystemNotification.is_read == False)) or 0
    if count == 0: return Response(content="")
    return render(request, "components/notification_badge.html", {"count": count})

@router.get("/notifications-list")
def notifications_list(request: Request, db: Session = Depends(get_db)):
    notifs = db.scalars(sa.select(models.SystemNotification).order_by(models.SystemNotification.created_at.desc()).limit(5)).all()
    return render(request, "components/notification_list_fragment.html", {"notifications": notifs})
