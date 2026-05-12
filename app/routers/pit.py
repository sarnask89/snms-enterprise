from fastapi import APIRouter, Depends, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, Response, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import verify_session, require_admin_or_manager
from app.services.pit_exporter import generate_pit_gml
from app.services.gugik import GugikGeocodingService
from app.logging import get_logger

router = APIRouter(prefix="/admin/pit", dependencies=[Depends(verify_session), Depends(require_admin_or_manager)])
log = get_logger("pit_router")

@router.get("/export/nodes", response_class=Response)
def export_pit_nodes(db: Session = Depends(get_db)):
    """Generates and returns GML for all NetNodes with PUWG 1992 coordinates."""
    nodes = list(db.scalars(
        select(models.NetNode).where(models.NetNode.x_1992 != None, models.NetNode.y_1992 != None)
    ).all())
    
    gml_content = generate_pit_gml(nodes)
    
    return Response(
        content=gml_content,
        media_type="application/gml+xml",
        headers={"Content-Disposition": "attachment; filename=pit_nodes.gml"}
    )

@router.post("/sync")
def trigger_pit_sync(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Triggers background sync of PUWG 1992 coordinates from GUGiK."""
    background_tasks.add_task(sync_pit_coordinates_task)
    return RedirectResponse("/admin/audit-logs?msg=PIT+Sync+Started", status_code=303)

async def sync_pit_coordinates_task():
    """
    Background task to fetch coordinates for all NetNodes missing PUWG 1992 data.
    """
    from app.database import db_manager
    db = db_manager.SessionLocal()
    service = GugikGeocodingService()
    
    try:
        # 1. Fetch NetNodes missing coords but having TERYT info
        # We need SIMC, ULIC and house number.
        # NetNode has location_city_id (SIMC), location_street_id (ULIC), and street_number.
        nodes = list(db.scalars(
            select(models.NetNode).where(models.NetNode.x_1992 == None)
        ).all())
        
        updated_count = 0
        for device in nodes:
            if not device.street_number or not device.location_city or not device.location_city.teryt_code:
                continue
                
            simc = device.location_city.teryt_code
            ulic = device.location_street.teryt_code if device.location_street else "00000" # fallback or specific empty
            number = device.street_number
            
            coords = await service.get_coordinates_for_pit_uke(simc, ulic, number)
            if coords:
                device.x_1992 = float(coords["X_1992"])
                device.y_1992 = float(coords["Y_1992"])
                updated_count += 1
                
        db.commit()
        log.info(f"PIT Sync Task Complete: Updated {updated_count} nodes.")
        
    except Exception as e:
        log.error(f"PIT Sync Task Failed: {e}")
        db.rollback()
    finally:
        db.close()
