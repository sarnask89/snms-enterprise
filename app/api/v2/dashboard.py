from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Optimization: Batch multiple count queries into a single SELECT using scalar subqueries to reduce DB round-trips
    stats_stmt = select(
        select(func.count()).select_from(models.Customer).scalar_subquery(),
        select(func.count()).select_from(models.NetNode).scalar_subquery(),
        select(func.count()).select_from(models.NetDevice).scalar_subquery(),
        select(func.count()).select_from(models.SupportTicket).where(
            models.SupportTicket.status == models.TicketStatus.open
        ).scalar_subquery()
    )
    stats = db.execute(stats_stmt).one()
    n_customers, n_nodes, n_devices, n_tickets_open = stats

    return {
        "customers": n_customers or 0,
        "nodes": n_nodes or 0,
        "devices": n_devices or 0,
        "tickets": n_tickets_open or 0,
    }
