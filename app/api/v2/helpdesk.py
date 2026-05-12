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
