"""Grupy węzłów — powiązanie wielu hostów z jedną etykietą (SNMS)."""

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render

router = APIRouter(prefix="/device-groups", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def node_groups_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.CustomerDeviceGroup).order_by(models.CustomerDeviceGroup.name)).all())
    return render(
        request,
        "customer_device_groups/list.html",
        {"title": "Grupy komputerów", "groups": rows},
    )


@router.get("/add", dependencies=[Depends(verify_session)])
def node_group_add_alias():
    """Alias `/device-groups/add` — ten sam formularz co /device-groups/new."""
    return RedirectResponse("/device-groups/new", status_code=303)


@router.get("/new", response_class=HTMLResponse)
def node_group_new_form(request: Request, db: Session = Depends(get_db)):
    # Optimization: removed fetching all nodes as they are not used in the template
    return render(
        request,
        "customer_device_groups/form.html",
        {"title": "Nowa grupa komputerów", "group": None},
    )


@router.post("/new", dependencies=[Depends(require_business_write)])
async def node_group_new_submit(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    name = str(form.get("name") or "").strip()
    if not name:
        return RedirectResponse("/device-groups/new", status_code=303)
    description = form.get("description")
    desc = str(description).strip() if description else None
    g = models.CustomerDeviceGroup(name=name[:128], description=desc)
    db.add(g)
    db.flush()
    _sync_group_nodes(db, g, form.getlist("device_id"))
    db.commit()
    return RedirectResponse("/device-groups", status_code=303)


@router.get("/{group_id}/edit", response_class=HTMLResponse)
def node_group_edit_form(group_id: int, request: Request, db: Session = Depends(get_db)):
    g = db.get(models.CustomerDeviceGroup, group_id)
    if not g:
        return RedirectResponse("/device-groups", status_code=302)
    # Optimization: removed fetching all nodes as they are not used in the template
    return render(
        request,
        "customer_device_groups/form.html",
        {
            "title": f"Grupa: {g.name}",
            "group": g,
        },
    )


@router.post("/{group_id}/edit", dependencies=[Depends(require_business_write)])
async def node_group_edit_submit(group_id: int, request: Request, db: Session = Depends(get_db)):
    g = db.get(models.CustomerDeviceGroup, group_id)
    if not g:
        return RedirectResponse("/device-groups", status_code=303)
    form = await request.form()
    name = str(form.get("name") or "").strip()
    if name:
        g.name = name[:128]
    description = form.get("description")
    g.description = str(description).strip() if description else None
    _sync_group_nodes(db, g, form.getlist("device_id"))
    db.commit()
    return RedirectResponse("/device-groups", status_code=303)


@router.post("/{group_id}/delete", dependencies=[Depends(require_business_write)])
def node_group_delete(group_id: int, db: Session = Depends(get_db)):
    g = db.get(models.CustomerDeviceGroup, group_id)
    if g:
        db.delete(g)
        db.commit()
    return RedirectResponse("/device-groups", status_code=303)


def _sync_group_nodes(db: Session, group: models.CustomerDeviceGroup, raw_ids: list) -> None:
    ids: set[int] = set()
    for x in raw_ids:
        try:
            ids.add(int(x))
        except (TypeError, ValueError):
            continue
    # Optimization: using IN clause to fetch all devices in one go instead of N+1 db.get calls
    if ids:
        chosen = db.scalars(select(models.CustomerDevice).where(models.CustomerDevice.id.in_(ids))).all()
        group.devices = list(chosen)
    else:
        group.devices = []
