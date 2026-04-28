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

from app.services.gugik import GugikGeocodingService

# Publiczny router dla API (autosugestie + geokodowanie)
public_api = APIRouter(prefix="/teryt/api")

@public_api.get("/geocode")
async def teryt_api_geocode(
    city: str = Query(...),
    street: str = Query(...),
    number: str = Query(...),
):
    """Authoritative geocoding using GUGiK (backend proxy)."""
    service = GugikGeocodingService()
    res = await service.geocode_address(city, street, number)
    if res:
        return res
    return JSONResponse(status_code=404, content={"error": "Not found"})


@public_api.get("/suggest", response_class=HTMLResponse)
def teryt_suggest(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None, min_length=3),
    street_name: str | None = Query(None, min_length=3),
    kind: str = Query("city"),
    city_id: int | None = Query(None),
    location_city_id: int | None = Query(None),
    city_name: str | None = Query(None),
):
    """Zwraca fragment HTML (listę elementów <li>), który HTMX wstrzyknie do DOM."""
    search_query = q or street_name
    service = TerytSearchService(db)
    target_city_id = city_id or location_city_id
    
    if kind == "city" and search_query:
        items = service.search_cities(search_query)
        return render(request, "teryt/partials/suggest_items.html", {"items": items})
    
    elif kind == "street" and search_query and target_city_id:
        items = service.search_streets(target_city_id, search_query)
        return render(request, "teryt/partials/suggest_items.html", {"items": items})

    elif kind == "building" and city_name:
        # Building search logic
        buildings = service.search_buildings(city_name, street_name or "")
        items = [{"id": b, "text": b, "type": "building"} for b in buildings]
        return render(request, "teryt/partials/suggest_items.html", {"items": items})
    
    return HTMLResponse("")

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

@router.get("/ws/check")
def teryt_ws_check():
    return {"ok": czy_zalogowany()}
