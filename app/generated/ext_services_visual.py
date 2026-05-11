
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/ext-services-visual", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def ext_services_visual_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.ExtServicesVisual)
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.ExtServicesVisual.service_name.ilike(term),
            models.ExtServicesVisual.notes.ilike(term)
        ))
    
    items = db.scalars(stmt.order_by(models.ExtServicesVisual.id.desc())).all()
    return render(request, "generated/ext_services_visual_list.html", {
        "title": "UsĹ‚ugi Visual",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def ext_services_visual_new(request: Request):
    return render(request, "generated/ext_services_visual_form.html", {
        "title": "Nowy: UsĹ‚ugi Visual",
        "item": None
    })

@router.post("/new")
def ext_services_visual_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    service_name: str | None = Form(None),
    cost: int | None = Form(None),
    notes: str | None = Form(None)
):
    item = models.ExtServicesVisual(
        service_name=service_name,
        cost=cost,
        notes=notes
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/ext-services-visual", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def ext_services_visual_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.ExtServicesVisual, item_id)
    return render(request, "generated/ext_services_visual_form.html", {
        "title": "Edycja: UsĹ‚ugi Visual",
        "item": item
    })

@router.post("/{item_id}/edit")
def ext_services_visual_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    service_name: str | None = Form(None),
    cost: int | None = Form(None),
    notes: str | None = Form(None)
):
    item = db.get(models.ExtServicesVisual, item_id)
    item.service_name = service_name
    item.cost = cost
    item.notes = notes
    db.commit()
    return RedirectResponse("/ext-services-visual", status_code=303)

@router.post("/{item_id}/delete")
def ext_services_visual_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.ExtServicesVisual, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/ext-services-visual", status_code=303)
