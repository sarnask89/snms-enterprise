from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Batch multiple count queries into a single SQL statement using scalar subqueries.
    # This reduces database round-trips from 4 to 1, improving landing page performance.
    stats_stmt = select(
        select(func.count()).select_from(models.Customer).scalar_subquery(),
        select(func.count()).select_from(models.NetNode).scalar_subquery(),
        select(func.count()).select_from(models.NetDevice).scalar_subquery(),
        select(func.count()).select_from(models.SupportTicket).where(
            models.SupportTicket.status == models.TicketStatus.open
        ).scalar_subquery()
    )
    stats = db.execute(stats_stmt).one()
    n_customers, n_nodes, n_devices, n_tickets_open = [x or 0 for x in stats]

    return {
        "customers": n_customers,
        "nodes": n_nodes,
        "devices": n_devices,
        "tickets": n_tickets_open,
    }
