from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # BOLT OPTIMIZATION: Batch multiple count queries into a single SELECT statement
    # using scalar subqueries to reduce database round-trips.
    q_customers = select(func.count()).select_from(models.Customer).scalar_subquery()
    q_nodes = select(func.count()).select_from(models.NetNode).scalar_subquery()
    q_devices = select(func.count()).select_from(models.NetDevice).scalar_subquery()
    q_tickets = select(func.count()).select_from(models.SupportTicket).where(
        models.SupportTicket.status == models.TicketStatus.open
    ).scalar_subquery()

    stats = db.execute(select(q_customers, q_nodes, q_devices, q_tickets)).one()
    n_customers, n_nodes, n_devices, n_tickets_open = stats

    return {
        "customers": n_customers,
        "nodes": n_nodes,
        "devices": n_devices,
        "tickets": n_tickets_open,
    }
