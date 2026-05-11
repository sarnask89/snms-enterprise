from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import verify_session, require_business_write
from app.templating import render
from app.services.network_scanner import network_scanner
from app import models
import logging

logger = logging.getLogger("app.network_tools")

router = APIRouter(prefix="/admin/network-tools", dependencies=[Depends(verify_session)], tags=["network-tools"])

@router.get("", response_class=HTMLResponse)
def tools_index(request: Request, db: Session = Depends(get_db)):
    routers = db.scalars(select(models.NetDevice).where(models.NetDevice.driver_type == "mikrotik_v7")).all()
    return render(request, "admin/network_tools.html", {
        "title": "Narzędzia Sieciowe",
        "routers": routers
    })

@router.post("/scan-subnet", response_class=HTMLResponse)
async def scan_subnet_action(request: Request, cidr: str = Form(...)):
    results = await network_scanner.scan_subnet(cidr)
    return render(request, "admin/partials/scan_results.html", {
        "results": results,
        "cidr": cidr
    })

@router.get("/neighbors/{device_id}", response_class=HTMLResponse)
async def get_neighbors_action(device_id: int, request: Request, db: Session = Depends(get_db)):
    neighbors = await network_scanner.discover_neighbors(db, device_id)
    return render(request, "admin/partials/neighbors_list.html", {
        "neighbors": neighbors
    })
