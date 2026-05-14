from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/helpdesk", tags=["helpdesk"], dependencies=[Depends(get_current_user)])

@router.get("/tickets")
def list_tickets(db: Session = Depends(get_db), page: int = 1, limit: int = 20):
    stmt = select(models.SupportTicket).order_by(models.SupportTicket.id.desc())
    total = db.scalar(select(func.count()).select_from(models.SupportTicket)) or 0
    tickets = db.scalars(stmt.offset((page - 1) * limit).limit(limit)).all()
    return {
        "items": tickets,
        "total": total
    }

# -----------------------------------------------------------------------------
# Ticket creation and detail retrieval
# -----------------------------------------------------------------------------

@router.post("/tickets")
def create_ticket(payload: dict, db: Session = Depends(get_db), current_user: models.PortalUser = Depends(get_current_user)):
    """Create a new support ticket.

    Expects a JSON body with at least ``title`` and ``body`` fields.
    Optionally ``queue_id`` and ``category_id`` can be provided to route the ticket
    to a specific helpdesk queue and category. The authenticated user is set as the
    ticket's customer.

    Returns the created ticket with its assigned ID.
    """
    title = payload.get("title")
    body = payload.get("body")
    if not title or not body:
        return {"error": "title and body are required"}
    queue_id = payload.get("queue_id")
    category_id = payload.get("category_id")
    ticket = models.SupportTicket(
        title=str(title)[:255],
        body=str(body),
        customer_id=getattr(current_user, "customer_id", None),
        queue_id=queue_id,
        category_id=category_id,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: models.PortalUser = Depends(get_current_user)):
    """Retrieve a support ticket by its ID.

    Returns the ticket object or a simple error if not found.
    """
    ticket = db.get(models.SupportTicket, ticket_id)
    if not ticket:
        return {"error": "Ticket not found"}
    return ticket
