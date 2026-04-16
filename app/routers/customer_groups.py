from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, require_can_mutate, verify_session
from app.templating import render

router = APIRouter(prefix="/customer-groups", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def group_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.CustomerGroup).order_by(models.CustomerGroup.name)).all())
    return render(
        request,
        "customer_groups/list.html",
        {"title": "Grupy klientów", "groups": rows},
    )


@router.get("/add", dependencies=[Depends(verify_session)])
def customer_group_add_alias():
    """Alias `/customer-groups/add` — ten sam formularz co /customer-groups/new."""
    return RedirectResponse("/customer-groups/new", status_code=303)


@router.get("/new", response_class=HTMLResponse)
def group_new_form(request: Request):
    return render(
        request,
        "customer_groups/form.html",
        {"title": "Nowa grupa", "group": None, "customers": [], "selected_ids": set()},
    )


@router.post("/new", dependencies=[Depends(require_business_write)])
def group_new_submit(
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str | None = Form(None),
):
    g = models.CustomerGroup(
        name=name.strip(),
        description=(description or None) and description.strip() or None,
    )
    db.add(g)
    db.commit()
    return RedirectResponse("/customer-groups", status_code=303)


@router.get("/{group_id}/edit", response_class=HTMLResponse)
def group_edit_form(group_id: int, request: Request, db: Session = Depends(get_db)):
    g = db.get(models.CustomerGroup, group_id)
    if not g:
        return RedirectResponse("/customer-groups", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    selected = {c.id for c in g.customers}
    return render(
        request,
        "customer_groups/form.html",
        {
            "title": f"Grupa: {g.name}",
            "group": g,
            "customers": custs,
            "selected_ids": selected,
        },
    )


@router.post("/{group_id}/edit", dependencies=[Depends(require_business_write)])
async def group_edit_submit(
    group_id: int,
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str | None = Form(None),
):
    g = db.get(models.CustomerGroup, group_id)
    if not g:
        return RedirectResponse("/customer-groups", status_code=303)
    g.name = name.strip()
    g.description = (description or None) and description.strip() or None

    form = await request.form()
    raw_ids = form.getlist("member_ids")
    member_ids = []
    for x in raw_ids:
        try:
            member_ids.append(int(x))
        except (TypeError, ValueError):
            pass

    g.customers.clear()
    for cid in member_ids:
        c = db.get(models.Customer, cid)
        if c:
            g.customers.append(c)
    db.commit()
    return RedirectResponse("/customer-groups", status_code=303)


@router.post("/{group_id}/delete", dependencies=[Depends(require_business_write)])
def group_delete(group_id: int, db: Session = Depends(get_db)):
    g = db.get(models.CustomerGroup, group_id)
    if g:
        g.customers.clear()
        db.delete(g)
        db.commit()
    return RedirectResponse("/customer-groups", status_code=303)
