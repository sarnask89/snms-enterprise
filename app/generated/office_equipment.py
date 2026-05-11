
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/office-equipment", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def office_equipment_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.OfficeEquipment)
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.OfficeEquipment.item_name.ilike(term),
            models.OfficeEquipment.serial_number.ilike(term)
        ))
    
    items = db.scalars(stmt.order_by(models.OfficeEquipment.id.desc())).all()
    return render(request, "generated/office_equipment_list.html", {
        "title": "SprzÄ™t Biurowy",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def office_equipment_new(request: Request):
    return render(request, "generated/office_equipment_form.html", {
        "title": "Nowy: SprzÄ™t Biurowy",
        "item": None
    })

@router.post("/new")
def office_equipment_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    item_name: str | None = Form(None),
    serial_number: str | None = Form(None),
    quantity: int | None = Form(None)
):
    item = models.OfficeEquipment(
        item_name=item_name,
        serial_number=serial_number,
        quantity=quantity
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/office-equipment", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def office_equipment_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.OfficeEquipment, item_id)
    return render(request, "generated/office_equipment_form.html", {
        "title": "Edycja: SprzÄ™t Biurowy",
        "item": item
    })

@router.post("/{item_id}/edit")
def office_equipment_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    item_name: str | None = Form(None),
    serial_number: str | None = Form(None),
    quantity: int | None = Form(None)
):
    item = db.get(models.OfficeEquipment, item_id)
    item.item_name = item_name
    item.serial_number = serial_number
    item.quantity = quantity
    db.commit()
    return RedirectResponse("/office-equipment", status_code=303)

@router.post("/{item_id}/delete")
def office_equipment_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.OfficeEquipment, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/office-equipment", status_code=303)
