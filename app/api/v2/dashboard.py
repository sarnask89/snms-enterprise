from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # BOLT OPTIMIZATION: Batching multiple count queries into a single SELECT statement
    # to reduce database round-trips and improve dashboard load time.
    stmt = select(
        select(func.count()).select_from(models.Customer).scalar_subquery().label("customers"),
        select(func.count()).select_from(models.NetNode).scalar_subquery().label("nodes"),
        select(func.count()).select_from(models.NetDevice).scalar_subquery().label("devices"),
        select(func.count()).select_from(models.SupportTicket).where(
            models.SupportTicket.status == models.TicketStatus.open
        ).scalar_subquery().label("tickets_open"),
    )
    result = db.execute(stmt).one()

    return {
        "customers": result.customers or 0,
        "nodes": result.nodes or 0,
        "devices": result.devices or 0,
        "tickets": result.tickets_open or 0,
    }
