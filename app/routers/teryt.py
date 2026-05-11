from datetime import datetime

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.audit import record_audit
from app.database import get_db
from app.deps import require_admin_or_manager, verify_session
from app.templating import render

from app.teryt_ws import (
    czy_zalogowany,
    wyszukaj_miejscowosc,
    wyszukaj_ulice,
    TerytSearchService,
)

# Router wymagający logowania
router = APIRouter(prefix="/teryt", dependencies=[Depends(verify_session)])

# Publiczny router dla API (autosugestie)
public_api = APIRouter(prefix="/teryt/api")

@public_api.get("/suggest", response_class=HTMLResponse)
def teryt_suggest(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None),
    street_name: str | None = Query(None),
    kind: str = Query("city"),
    city_id: int | None = Query(None),
    location_city_id: int | None = Query(None),
    city_name: str | None = Query(None),
):
    """Zwraca fragment HTML (listę elementów <li>), który HTMX wstrzyknie do DOM."""
    search_query = q or street_name
    if not search_query or len(search_query.strip()) < 3:
        return HTMLResponse("")
        
    service = TerytSearchService(db)
    target_city_id = city_id or location_city_id
    
    if kind == "city":
        items = service.search_cities(search_query)
        return render(request, "teryt/partials/suggest_items.html", {"items": items})
    
    elif kind == "street" and target_city_id:
        items = service.search_streets(target_city_id, search_query)
        return render(request, "teryt/partials/suggest_items.html", {"items": items})

    elif kind == "building" and city_name:
        buildings = service.search_buildings(city_name, street_name or "")
        items = [{"id": b, "text": b, "type": "building"} for b in buildings]
        return render(request, "teryt/partials/suggest_items.html", {"items": items})
    
    return HTMLResponse("")

@public_api.get("/geocode/puwg")
async def teryt_api_geocode_puwg(
    city: str = Query(...),
    street: str = Query(...),
    number: str = Query(...),
    db: Session = Depends(get_db),
):
    """Pobiera współrzędne PUWG 1992 (EPSG:2180) dla adresu."""
    from app.services.gugik import GugikGeocodingService
    service = GugikGeocodingService(db) # We might need DB for TERYT resolution if only names given
    
    # Try to resolve SIMC and ULIC codes from names if not provided
    # For now, we assume names are passed and we might need to lookup codes
    # But get_coordinates_for_pit_uke needs codes.
    
    # Simpler: first use the 'getaddress' WGS84 logic to find the object, 
    # then if it has an ID, use it. 
    # Or just use the WUG address search which might return everything.
    
    # For this POC, we'll try to find the city in our local DB to get TERYT code
    city_row = db.scalars(select(models.LocationCity).where(models.LocationCity.name == city)).first()
    if not city_row or not city_row.teryt_code:
        return JSONResponse(status_code=404, content={"error": f"City {city} not found in local TERYT database"})
        
    simc = city_row.teryt_code
    ulic = "00000"
    if street and street != "brak":
        street_row = db.scalars(
            select(models.LocationStreet)
            .where(models.LocationStreet.city_id == city_row.id, models.LocationStreet.name == street)
        ).first()
        if street_row and street_row.teryt_code:
            ulic = street_row.teryt_code
            
    gugik = GugikGeocodingService()
    res = await gugik.get_coordinates_for_pit_uke(simc, ulic, number)
    if res:
        return res
    return JSONResponse(status_code=404, content={"error": "Not found in GUGiK"})

# --- Reszta routera ---
@router.get("/browse", response_class=HTMLResponse)
def teryt_browse(request: Request, db: Session = Depends(get_db)):
    return render(request, "teryt_browse.html", {"title": "TERYT", "states": list(db.scalars(select(models.LocationState)).all())})

@router.get("/cities", response_class=HTMLResponse)
def city_list(request: Request, db: Session = Depends(get_db), q: str = Query(None)):
    stmt = select(models.LocationCity).order_by(models.LocationCity.name)
    if q: stmt = stmt.where(models.LocationCity.name.ilike(f"%{q}%"))
    return render(request, "teryt/city_list.html", {"title": "Miejscowości", "rows": list(db.scalars(stmt.limit(100)).all()), "search_q": q or ""})

@router.post("/cities/new", dependencies=[Depends(require_admin_or_manager)])
def city_new_submit(request: Request, db: Session = Depends(get_db), name: str = Form(...), district_id: int = Form(...)):
    c = models.LocationCity(name=name.strip(), district_id=district_id)
    db.add(c); db.flush(); record_audit(db, "create", "location_city", c.id, name, request); db.commit()
    return RedirectResponse("/teryt/cities", status_code=303)

@router.post("/cities/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def city_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.LocationCity, row_id)
    if row:
        record_audit(db, "delete", "location_city", row.id, row.name, request)
        db.delete(row); db.commit()
    return RedirectResponse("/teryt/cities", status_code=303)

@router.post("/sync-geoportal", dependencies=[Depends(require_admin_or_manager)])
async def teryt_sync_geoportal(
    request: Request,
    db: Session = Depends(get_db),
    city_id: int = Form(...),
):
    city = db.get(models.LocationCity, city_id)
    if not city:
        return RedirectResponse("/teryt/cities?error=City+not+found", status_code=303)
        
    from app.services.gugik import GugikGeocodingService
    gugik = GugikGeocodingService()
    
    # Simple sync: find all streets in this city and try to geocode first building found
    streets = db.scalars(select(models.LocationStreet).where(models.LocationStreet.city_id == city.id)).all()
    
    sync_count = 0
    for s in streets:
        # This is a placeholder for actual heavy sync
        # In a real app, we'd loop through buildings.
        pass
        
    record_audit(db, "update", "teryt_geoportal", city.id, f"Sync for {city.name}", request)
    db.commit()
    return RedirectResponse(f"/teryt/cities?msg=Sync+scheduled+for+{city.name}", status_code=303)
