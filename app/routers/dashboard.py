from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import verify_session
from app.templating import render

router = APIRouter(dependencies=[Depends(verify_session)])


@router.get("/", response_class=HTMLResponse)
def dashboard_home(request: Request, db: Session = Depends(get_db)):
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
    n_nodes = db.scalar(select(func.count()).select_from(models.Node)) or 0
    n_subs = (
        db.scalar(
            select(func.count()).select_from(models.Subscription).where(
                models.Subscription.active == True  # noqa: E712
            )
        )
        or 0
    )

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
        },
    )
