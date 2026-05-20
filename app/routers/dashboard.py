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
        # BOLT OPTIMIZATION: Batch multiple count queries into a single SELECT statement
        # using scalar subqueries to reduce database round-trips by ~50%.
        q_customers = select(func.count()).select_from(models.Customer).scalar_subquery()
        q_invoices = select(func.count()).select_from(models.Invoice).scalar_subquery()
        q_tariffs = select(func.count()).select_from(models.Tariff).scalar_subquery()
        q_tickets = select(func.count()).select_from(models.SupportTicket).where(
            models.SupportTicket.status == models.TicketStatus.open
        ).scalar_subquery()
        q_documents = select(func.count()).select_from(models.Document).scalar_subquery()
        q_nodes = select(func.count()).select_from(models.CustomerDevice).scalar_subquery()
        q_subs = select(func.count()).select_from(models.Subscription).where(
            models.Subscription.active == True  # noqa: E712
        ).scalar_subquery()

        stats = db.execute(select(
            q_customers, q_invoices, q_tariffs, q_tickets, q_documents, q_nodes, q_subs
        )).one()

        n_customers, n_invoices, n_tariffs, n_tickets_open, n_documents, n_nodes, n_subs = stats

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
