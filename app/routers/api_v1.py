from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List

from app import models, schemas
from app.database import get_db
from app.deps import verify_session

router = APIRouter(prefix="/api/v1", tags=["api_v1"], dependencies=[Depends(verify_session)])

@router.get("/customers", response_model=List[schemas.CustomerRead])
def get_customers(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    q: str | None = None
):
    stmt = select(models.Customer).order_by(models.Customer.id.desc())
    if q:
        term = f"%{q}%"
        stmt = stmt.where(
            models.Customer.last_name.ilike(term) | 
            models.Customer.first_name.ilike(term) |
            models.Customer.customer_code.ilike(term)
        )
    return list(db.scalars(stmt.offset(skip).limit(limit)).all())

@router.get("/customers/{customer_id}", response_model=schemas.CustomerRead)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    return db.get(models.Customer, customer_id)

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Optimization: Fetch all counts in a single database round-trip
    stmt = select(
        select(func.count(models.Customer.id)).scalar_subquery(),
        select(func.count(models.NetNode.id)).scalar_subquery(),
        select(func.count(models.NetDevice.id)).scalar_subquery(),
        select(func.count(models.SupportTicket.id)).scalar_subquery(),
    )
    customer_count, node_count, device_count, ticket_count = db.execute(stmt).one()

    return {
        "customers": customer_count,
        "nodes": node_count,
        "devices": device_count,
        "tickets": ticket_count
    }

@router.post("/builder/implement")
async def implement_module(spec: dict):
    # This is a stub for actual file generation
    # In a real scenario, this would use a sub-agent or a template engine
    return {"status": "success", "message": "Module implementation logic triggered"}
