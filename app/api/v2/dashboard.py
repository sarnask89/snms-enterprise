from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Batch count queries into a single SELECT statement for better performance
    def count_stmt(model, criterion=None):
        stmt = select(func.count()).select_from(model)
        if criterion is not None:
            stmt = stmt.where(criterion)
        return stmt.scalar_subquery()

    stats = db.execute(
        select(
            count_stmt(models.Customer),
            count_stmt(models.NetNode),
            count_stmt(models.NetDevice),
            count_stmt(models.SupportTicket, models.SupportTicket.status == models.TicketStatus.open),
        )
    ).one()

    n_customers, n_nodes, n_devices, n_tickets_open = stats

    return {
        "customers": n_customers,
        "nodes": n_nodes,
        "devices": n_devices,
        "tickets": n_tickets_open,
    }
