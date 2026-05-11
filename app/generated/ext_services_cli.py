
from fastapi import APIRouter, Depends, Request, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.templating import render
from app.deps import verify_session
from app import models

router = APIRouter(prefix="/ext-services-cli", dependencies=[Depends(verify_session)])

@router.get("", response_class=HTMLResponse)
def ext_services_cli_list(
    request: Request, 
    db: Session = Depends(get_db),
    q: str | None = Query(None)
):
    stmt = select(models.ExtServicesCli)
    if q:
        # Simple search across string fields
        term = f"%{q}%"
        stmt = stmt.where(or_(
            models.ExtServicesCli.service_name.ilike(term),
            models.ExtServicesCli.notes.ilike(term)
        ))
    
    items = db.scalars(stmt.order_by(models.ExtServicesCli.id.desc())).all()
    return render(request, "generated/ext_services_cli_list.html", {
        "title": "UsÄąâ€šugi CLI",
        "items": items,
        "q": q or ""
    })

@router.get("/new", response_class=HTMLResponse)
def ext_services_cli_new(request: Request):
    return render(request, "generated/ext_services_cli_form.html", {
        "title": "Nowy: UsÄąâ€šugi CLI",
        "item": None
    })

@router.post("/new")
def ext_services_cli_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    service_name: str | None = Form(None),
    cost: int | None = Form(None),
    notes: str | None = Form(None)
):
    item = models.ExtServicesCli(
        service_name=service_name,
        cost=cost,
        notes=notes
    )
    db.add(item)
    db.commit()
    return RedirectResponse("/ext-services-cli", status_code=303)

@router.get("/{item_id}/edit", response_class=HTMLResponse)
def ext_services_cli_edit(item_id: int, request: Request, db: Session = Depends(get_db)):
    item = db.get(models.ExtServicesCli, item_id)
    return render(request, "generated/ext_services_cli_form.html", {
        "title": "Edycja: UsÄąâ€šugi CLI",
        "item": item
    })

@router.post("/{item_id}/edit")
def ext_services_cli_edit_submit(
    item_id: int,
    request: Request,
    db: Session = Depends(get_db),
    service_name: str | None = Form(None),
    cost: int | None = Form(None),
    notes: str | None = Form(None)
):
    item = db.get(models.ExtServicesCli, item_id)
    item.service_name = service_name
    item.cost = cost
    item.notes = notes
    db.commit()
    return RedirectResponse("/ext-services-cli", status_code=303)

@router.post("/{item_id}/delete")
def ext_services_cli_delete(item_id: int, db: Session = Depends(get_db)):
    item = db.get(models.ExtServicesCli, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/ext-services-cli", status_code=303)
