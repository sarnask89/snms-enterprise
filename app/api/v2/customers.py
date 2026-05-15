from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_
from typing import List
from app.database import get_db
from app.api.auth import get_current_user
from app import models, schemas

router = APIRouter(prefix="/customers", tags=["customers"], dependencies=[Depends(get_current_user)])

@router.get("/")
def list_customers(
    db: Session = Depends(get_db),
    q: str | None = Query(None),
    status: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    stmt = select(models.Customer).options(
        joinedload(models.Customer.city),
        joinedload(models.Customer.street)
    ).order_by(models.Customer.id.desc())

    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(
            models.Customer.customer_code.ilike(term),
            models.Customer.first_name.ilike(term),
            models.Customer.last_name.ilike(term),
        ))
    if status:
        stmt = stmt.where(models.Customer.status == status)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    customers = db.scalars(stmt.offset((page - 1) * limit).limit(limit)).all()

    # We use a dict return instead of a list to include 'total'
    # Pydantic schemas might not be fully ready for this structure in all modules
    # but for Nuxt needs, a JSON object is better.
    return {
        "items": customers,
        "total": total
    }

@router.get("/{customer_id}", response_model=schemas.CustomerRead)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.get(models.Customer, customer_id)
    if not customer:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
