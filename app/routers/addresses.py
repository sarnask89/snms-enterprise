from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse, Response
import sqlalchemy as sa
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_admin_or_manager, verify_session
from app.templating import render
from app.audit import record_audit

router = APIRouter(prefix="/admin/addresses", dependencies=[Depends(verify_session), Depends(require_admin_or_manager)])

@router.get("", response_class=HTMLResponse)
def manage_addresses(request: Request, db: Session = Depends(get_db)):
    # Pobierz miasta oznaczone jako zarządzane
    managed_cities = list(db.scalars(
        select(models.LocationCity)
        .where(models.LocationCity.is_managed == True)
        .order_by(models.LocationCity.name)
    ).all())
    
    return render(
        request, 
        "addresses/manage.html", 
        {
            "title": "Zarządzanie Miastami i Adresami", 
            "cities": managed_cities
        }
    )

@router.post("/city/{id}/set-default")
def set_default_city(id: int, request: Request, db: Session = Depends(get_db)):
    # Wyłącz obecny domyślny
    db.execute(sa.update(models.LocationCity).values(is_default=False))
    
    city = db.get(models.LocationCity, id)
    if city:
        city.is_default = True
        city.is_managed = True
        db.commit()
        record_audit(db, "update", "location_city", city.id, f"Set default: {city.name}", request)
        return RedirectResponse("/admin/addresses", status_code=303)
    return Response(status_code=404)

@router.post("/city/{id}/toggle-managed")
def toggle_managed(id: int, request: Request, db: Session = Depends(get_db)):
    city = db.get(models.LocationCity, id)
    if city:
        city.is_managed = not city.is_managed
        if not city.is_managed:
            city.is_default = False
        db.commit()
        record_audit(db, "update", "location_city", city.id, f"Managed: {city.is_managed}", request)
        
        referer = request.headers.get("referer")
        return RedirectResponse(referer or "/admin/addresses", status_code=303)
    return Response(status_code=404)

@router.get("/search-teryt", response_class=HTMLResponse)
def search_teryt_cities(
    request: Request, 
    q: str = Query(..., min_length=2), 
    db: Session = Depends(get_db)
):
    """Wyszukiwarka miast w pełnym słowniku TERYT (lokalnym)."""
    term = f"%{q.strip()}%"
    stmt = select(models.LocationCity).where(models.LocationCity.name.ilike(term)).limit(20)
    rows = list(db.scalars(stmt).all())
    
    return render(
        request, 
        "addresses/teryt_search_results.html", 
        {"results": rows}
    )
