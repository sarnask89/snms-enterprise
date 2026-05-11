import logging
import subprocess
import sys
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import verify_session, require_business_write
from app.templating import render

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/olt-discovery", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def olt_discovery_page(request: Request, db: Session = Depends(get_db)):
    """Strona główna odkrywania OLT/ONU."""
    olts = list(db.scalars(
        select(models.NetDevice).where(models.NetDevice.driver_type == "dasan_nos")
    ).all())
    
    return render(
        request,
        "admin/olt_discovery.html",
        {
            "title": "Odkrywanie OLT / ONU",
            "olts": olts
        }
    )

@router.post("/run", dependencies=[Depends(require_business_write)])
def run_olt_discovery(
    db: Session = Depends(get_db),
    olt_id: int = Form(...),
    action: str = Form("sync_onus") # sync_onus or map_customers
):
    """Uruchamia skrypt odkrywania jako proces w tle."""
    script = "sync_onus.py" if action == "sync_onus" else "sync_macs_to_onus.py"
    
    try:
        # Uruchamiamy skrypt. W produkcji lepiej użyć Celery/BackgroundTasks, 
        # ale tutaj trzymamy się wzorca subprocess dla prostoty.
        subprocess.Popen([sys.executable, script, str(olt_id)])
        return RedirectResponse("/admin/olt-discovery?status=started", status_code=303)
    except Exception as e:
        logger.error(f"Failed to start OLT discovery: {e}")
        return RedirectResponse("/admin/olt-discovery?status=error", status_code=303)
