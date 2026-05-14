from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.database import get_db
from app.services.monitoring_service import monitoring_service

router = APIRouter(
    prefix="/monitoring",
    tags=["monitoring"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/summary")
def get_monitoring_summary(db: Session = Depends(get_db)):
    return monitoring_service.get_summary(db)


@router.get("/timeseries")
def get_monitoring_timeseries(
    period: str = Query("24h", description="Supported values: 24h, 7d, 30d"),
    db: Session = Depends(get_db),
):
    return monitoring_service.get_timeseries(db, period=period)


@router.get("/top-talkers")
def get_monitoring_top_talkers(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return monitoring_service.get_top_talkers(db, limit=limit)
