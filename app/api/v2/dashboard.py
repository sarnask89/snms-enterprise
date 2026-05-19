from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Batch multiple count queries into a single SQL statement using scalar subqueries
    # This reduces database round-trips and improves performance
    stmt = select(
        select(func.count()).select_from(models.Customer).scalar_subquery().label("customers"),
        select(func.count()).select_from(models.NetNode).scalar_subquery().label("nodes"),
        select(func.count()).select_from(models.NetDevice).scalar_subquery().label("devices"),
        select(func.count())
        .select_from(models.SupportTicket)
        .where(models.SupportTicket.status == models.TicketStatus.open)
        .scalar_subquery()
        .label("tickets_open"),
    )
    stats = db.execute(stmt).mappings().one()

    return {
        "customers": stats["customers"] or 0,
        "nodes": stats["nodes"] or 0,
        "devices": stats["devices"] or 0,
        "tickets": stats["tickets_open"] or 0,
    }
