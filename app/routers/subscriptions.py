from datetime import date

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, require_can_mutate, verify_session
from app.templating import render

router = APIRouter(prefix="/subscriptions", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def subscription_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.Subscription).order_by(models.Subscription.id.desc())).all())
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    tariffs = {t.id: t for t in db.scalars(select(models.Tariff)).all()}
    return render(
        request,
        "subscriptions/list.html",
        {
            "title": "Subskrypcje (taryfy u klientów)",
            "subscriptions": rows,
            "customers": customers,
            "tariffs": tariffs,
        },
    )


@router.get("/new", response_class=HTMLResponse)
def subscription_new_form(
    request: Request, 
    db: Session = Depends(get_db),
    customer_id: int | None = Query(None),
    node_id: int | None = Query(None),
):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    tars = list(db.scalars(select(models.Tariff).where(models.Tariff.active == True)).all())  # noqa: E712
    
    # Pre-populate nodes if customer is selected
    initial_nodes = []
    if customer_id:
        initial_nodes = list(db.scalars(select(models.Node).where(models.Node.customer_id == customer_id)).all())

    return render(
        request,
        "subscriptions/form.html",
        {
            "title": "Nowa subskrypcja", 
            "customers": custs, 
            "tariffs": tars,
            "today": date.today().isoformat(),
            "pre_customer_id": customer_id,
            "pre_node_id": node_id,
            "initial_nodes": initial_nodes
        },
    )


@router.get("/customer-nodes/{customer_id}", response_class=HTMLResponse)
def get_customer_nodes(customer_id: int, db: Session = Depends(get_db)):
    nodes = list(db.scalars(select(models.Node).where(models.Node.customer_id == customer_id)).all())
    options = [("", "— Wszystkie urządzenia —")]
    for n in nodes:
        options.append((n.id, f"{n.hostname} ({n.ip_address or 'no IP'})"))
    
    from app.templating import render
    # Return just the options
    html = ""
    for val, label in options:
        html += f'<option value="{val}">{label}</option>'
    return HTMLResponse(html)


@router.post("/new", dependencies=[Depends(require_business_write)])
def subscription_new_submit(
    db: Session = Depends(get_db),
    customer_id: int = Form(...),
    node_id: int | None = Form(None),
    tariff_id: int = Form(...),
    start_date: str = Form(...),
    end_date: str | None = Form(None),
    active: str | None = Form(None),
    technology: str = Form("FTTH"),
    speed_down_mbps: int | None = Form(None),
    speed_up_mbps: int | None = Form(None),
):
    def _parse_d(s: str | None) -> date | None:
        if not s or not str(s).strip():
            return None
        return date.fromisoformat(str(s).strip())

    sub = models.Subscription(
        customer_id=customer_id,
        node_id=node_id,
        tariff_id=tariff_id,
        start_date=_parse_d(start_date) or date.today(),
        end_date=_parse_d(end_date),
        active=active in ("on", "true", "1", "yes"),
        technology=technology,
        speed_down_mbps=speed_down_mbps,
        speed_up_mbps=speed_up_mbps,
    )
    db.add(sub)
    db.commit()
    return RedirectResponse("/subscriptions", status_code=303)


@router.post("/{sub_id}/toggle", dependencies=[Depends(require_business_write)])
def subscription_toggle(sub_id: int, db: Session = Depends(get_db)):
    s = db.get(models.Subscription, sub_id)
    if s:
        s.active = not s.active
        db.commit()
    return RedirectResponse("/subscriptions", status_code=303)


@router.post("/{sub_id}/delete", dependencies=[Depends(require_business_write)])
def subscription_delete(sub_id: int, db: Session = Depends(get_db)):
    s = db.get(models.Subscription, sub_id)
    if s:
        db.delete(s)
        db.commit()
    return RedirectResponse("/subscriptions", status_code=303)
