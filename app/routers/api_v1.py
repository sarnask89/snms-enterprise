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
    # Performance: Batch multiple count queries into a single SELECT statement using scalar subqueries.
    # This reduces database round-trips from 4 down to 1.
    counts_res = db.execute(
        select(
            select(func.count()).select_from(models.Customer).scalar_subquery(),
            select(func.count()).select_from(models.NetNode).scalar_subquery(),
            select(func.count()).select_from(models.NetDevice).scalar_subquery(),
            select(func.count()).select_from(models.SupportTicket).scalar_subquery(),
        )
    ).fetchone()

    if counts_res:
        customer_count, node_count, device_count, ticket_count = counts_res
    else:
        customer_count = node_count = device_count = ticket_count = 0

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
