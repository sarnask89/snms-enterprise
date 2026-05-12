from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    n_customers = db.scalar(select(func.count()).select_from(models.Customer)) or 0
    n_nodes = db.scalar(select(func.count()).select_from(models.NetNode)) or 0
    n_devices = db.scalar(select(func.count()).select_from(models.NetDevice)) or 0
    n_tickets_open = (
        db.scalar(
            select(func.count()).select_from(models.SupportTicket).where(
                models.SupportTicket.status == models.TicketStatus.open
            )
        )
        or 0
    )

    return {
        "customers": n_customers,
        "nodes": n_nodes,
        "devices": n_devices,
        "tickets": n_tickets_open,
    }
