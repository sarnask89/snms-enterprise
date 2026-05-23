from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session
import logging

from app import models
from app.database import get_db
from app.deps import verify_session
from app.templating import render

logger = logging.getLogger("app.dashboard")

router = APIRouter(dependencies=[Depends(verify_session)])


@router.get("/", response_class=HTMLResponse)
def dashboard_home(request: Request, db: Session = Depends(get_db)):
    try:
        # Batch count queries into a single SELECT statement for better performance
        def count_stmt(model, criterion=None):
            stmt = select(func.count()).select_from(model)
            if criterion is not None:
                stmt = stmt.where(criterion)
            return stmt.scalar_subquery()

        stats = db.execute(
            select(
                count_stmt(models.Customer),
                count_stmt(models.Invoice),
                count_stmt(models.Tariff),
                count_stmt(models.SupportTicket, models.SupportTicket.status == models.TicketStatus.open),
                count_stmt(models.Document),
                count_stmt(models.CustomerDevice),
                count_stmt(models.Subscription, models.Subscription.active.is_(True)),
            )
        ).one()

        (
            n_customers,
            n_invoices,
            n_tariffs,
            n_tickets_open,
            n_documents,
            n_nodes,
            n_subs,
        ) = stats

        # Fetch active alarms
        active_alarms = db.scalars(
            select(models.MonitorTrigger).where(models.MonitorTrigger.last_status == "PROBLEM").order_by(models.MonitorTrigger.last_change.desc())
        ).all()
        
    except Exception as e:
        logger.error(f"Dashboard stats calculation failed: {e}", exc_info=True)
        # Fallback
        n_customers = n_invoices = n_tariffs = n_tickets_open = n_documents = n_nodes = n_subs = 0
        active_alarms = []

    return render(
        request,
        "dashboard.html",
        {
            "title": "Pulpit",
            "counts": {
                "customers": n_customers,
                "invoices": n_invoices,
                "tariffs": n_tariffs,
                "tickets_open": n_tickets_open,
                "documents": n_documents,
                "nodes": n_nodes,
                "subscriptions_active": n_subs,
            },
            "active_alarms": active_alarms,
        },
    )
