from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/network", tags=["network"], dependencies=[Depends(get_current_user)])

@router.get("/nodes")
def list_nodes(db: Session = Depends(get_db)):
    stmt = select(models.NetNode).order_by(models.NetNode.name)
    nodes = db.scalars(stmt).all()
    return [
        {
            "id": n.id,
            "name": n.name,
            "location_type": n.location_type.value if n.location_type else "Inny",
            "address": f"{n.latitude}, {n.longitude}" if n.latitude else "Brak współrzędnych"
        }
        for n in nodes
    ]

@router.get("/devices")
def list_devices(db: Session = Depends(get_db)):
    stmt = select(models.NetDevice).order_by(models.NetDevice.hostname)
    devices = db.scalars(stmt).all()
    return [
        {
            "id": n.id,
            "hostname": n.hostname,
            "ip_address": n.ip_address,
            "status": n.status.value if n.status else "unknown"
        }
        for n in devices
    ]
