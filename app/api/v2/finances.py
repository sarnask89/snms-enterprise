from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database import get_db
from app.api.auth import get_current_user
from app import models

router = APIRouter(prefix="/finances", tags=["finances"], dependencies=[Depends(get_current_user)])

@router.get("/tariffs")
def list_tariffs(db: Session = Depends(get_db)):
    stmt = select(models.Tariff).order_by(models.Tariff.name)
    tariffs = db.scalars(stmt).all()
    return tariffs

@router.get("/invoices")
def list_invoices(db: Session = Depends(get_db), page: int = 1, limit: int = 20):
    stmt = select(models.Invoice).order_by(models.Invoice.id.desc())
    total = db.scalar(select(func.count()).select_from(models.Invoice)) or 0
    invoices = db.scalars(stmt.offset((page - 1) * limit).limit(limit)).all()
    return {
        "items": invoices,
        "total": total
    }
