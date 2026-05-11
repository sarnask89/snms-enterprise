
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/vehicles-visual", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def vehicles_visual_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.VehiclesVisual)
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.VehiclesVisual.brand.ilike(term),
            models.VehiclesVisual.model.ilike(term),
            models.VehiclesVisual.plate.ilike(term)
        ))
    
    items = db.scalars(stmt.order_by(models.VehiclesVisual.id.desc())).all()
    return render(request, "generated/vehicles_visual_list.html", {
        "title": "Flota Visual",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def vehicles_visual_new(request: Request):
    return render(request, "generated/vehicles_visual_form.html", {
        "title": "Nowy: Flota Visual",
        "item": None
    })

@router.post("/new")
def vehicles_visual_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    brand: str | None = Form(None),
    model: str | None = Form(None),
    plate: str | None = Form(None),
    is_available: bool | None = Form(None)
):
    item = models.VehiclesVisual(
        brand=brand,
        model=model,
        plate=plate,
        is_available=is_available
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/vehicles-visual", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def vehicles_visual_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.VehiclesVisual, item_id)
    return render(request, "generated/vehicles_visual_form.html", {
        "title": "Edycja: Flota Visual",
        "item": item
    })

@router.post("/{item_id}/edit")
def vehicles_visual_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    brand: str | None = Form(None),
    model: str | None = Form(None),
    plate: str | None = Form(None),
    is_available: bool | None = Form(None)
):
    item = db.get(models.VehiclesVisual, item_id)
    item.brand = brand
    item.model = model
    item.plate = plate
    item.is_available = is_available
    db.commit()
    return RedirectResponse("/vehicles-visual", status_code=303)

@router.post("/{item_id}/delete")
def vehicles_visual_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.VehiclesVisual, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/vehicles-visual", status_code=303)
