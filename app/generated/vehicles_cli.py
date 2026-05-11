
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/vehicles-cli", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def vehicles_cli_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.VehiclesCli)
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.VehiclesCli.brand.ilike(term),
            models.VehiclesCli.model.ilike(term),
            models.VehiclesCli.plate.ilike(term)
        ))
    
    items = db.scalars(stmt.order_by(models.VehiclesCli.id.desc())).all()
    return render(request, "generated/vehicles_cli_list.html", {
        "title": "Flota CLI",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def vehicles_cli_new(request: Request):
    return render(request, "generated/vehicles_cli_form.html", {
        "title": "Nowy: Flota CLI",
        "item": None
    })

@router.post("/new")
def vehicles_cli_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    brand: str | None = Form(None),
    model: str | None = Form(None),
    plate: str | None = Form(None),
    is_available: bool | None = Form(None)
):
    item = models.VehiclesCli(
        brand=brand,
        model=model,
        plate=plate,
        is_available=is_available
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/vehicles-cli", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def vehicles_cli_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.VehiclesCli, item_id)
    return render(request, "generated/vehicles_cli_form.html", {
        "title": "Edycja: Flota CLI",
        "item": item
    })

@router.post("/{item_id}/edit")
def vehicles_cli_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    brand: str | None = Form(None),
    model: str | None = Form(None),
    plate: str | None = Form(None),
    is_available: bool | None = Form(None)
):
    item = db.get(models.VehiclesCli, item_id)
    item.brand = brand
    item.model = model
    item.plate = plate
    item.is_available = is_available
    db.commit()
    return RedirectResponse("/vehicles-cli", status_code=303)

@router.post("/{item_id}/delete")
def vehicles_cli_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.VehiclesCli, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/vehicles-cli", status_code=303)
