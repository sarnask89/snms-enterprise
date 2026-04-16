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
)

# Router wymagający logowania
router = APIRouter(prefix="/teryt", dependencies=[Depends(verify_session)])

# Publiczny router dla API (autosugestie)
public_api = APIRouter(prefix="/teryt/api")

@public_api.get("/suggest", response_class=HTMLResponse)
def teryt_suggest(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None, min_length=3),
    street_name: str | None = Query(None, min_length=3),
    kind: str = Query("city"),
    city_id: int | None = Query(None),
):
    """Zwraca fragment HTML (listę elementów <li>), który HTMX wstrzyknie do DOM."""
    search_query = q or street_name
    if not search_query:
        return HTMLResponse("")
        
    term = f"%{search_query.strip()}%"
    results = []
    
    if kind == "city":
        rows = db.scalars(select(models.LocationCity).where(models.LocationCity.name.ilike(term)).limit(10)).all()
        return render(request, "teryt/partials/suggest_items.html", {"items": [{"id": r.id, "text": r.name, "type": "city"} for r in rows]})
    
    elif kind == "street":
        stmt = select(models.LocationStreet).where(models.LocationStreet.name.ilike(term))
        if city_id: stmt = stmt.where(models.LocationStreet.city_id == city_id)
        rows = db.scalars(stmt.limit(10)).all()
        return render(request, "teryt/partials/suggest_items.html", {"items": [{"id": r.id, "text": r.name, "type": "street"} for r in rows]})
    
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
