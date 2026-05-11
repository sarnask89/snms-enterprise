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
        n_customers = db.scalar(select(func.count()).select_from(models.Customer)) or 0
        n_invoices = db.scalar(select(func.count()).select_from(models.Invoice)) or 0
        n_tariffs = db.scalar(select(func.count()).select_from(models.Tariff)) or 0
        n_tickets_open = (
            db.scalar(
                select(func.count()).select_from(models.SupportTicket).where(
                    models.SupportTicket.status == models.TicketStatus.open
                )
            )
            or 0
        )
        n_documents = db.scalar(select(func.count()).select_from(models.Document)) or 0
        n_nodes = db.scalar(select(func.count()).select_from(models.CustomerDevice)) or 0
        n_subs = (
            db.scalar(
                select(func.count()).select_from(models.Subscription).where(
                    models.Subscription.active == True  # noqa: E712
                )
            )
            or 0
        )
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
