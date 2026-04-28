import csv
import io
from datetime import date

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app import models, schemas
from app.audit import record_audit
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render
from app.snms_numbering import allocate_next_document_number
from app.utils.parsing import parse_int, parse_int_optional

router = APIRouter(prefix="/customers", dependencies=[Depends(verify_session)])

def _get_managed_cities(db: Session):
    return list(db.scalars(
        select(models.LocationCity)
        .where(models.LocationCity.is_managed == True)
        .order_by(models.LocationCity.name)
    ).all())

@router.get("", response_class=HTMLResponse)
def customer_list(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None),
    status: str | None = Query(None),
):
    stmt = select(models.Customer).options(
        joinedload(models.Customer.city),
        joinedload(models.Customer.street)
    ).order_by(models.Customer.id.desc())

    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(
            models.Customer.customer_code.ilike(term),
            models.Customer.last_name.ilike(term),
            models.Customer.email.ilike(term)
        ))
    if status and status in [s.value for s in models.CustomerStatus]:
        stmt = stmt.where(models.CustomerStatus(status) == models.Customer.status)

    rows = list(db.scalars(stmt).all())
    if request.headers.get("HX-Request"):
        return render(request, "customers/list_rows.html", {"customers": rows, "can_write_crm": True})

    return render(request, "customers/list.html", {"title": "Klienci", "customers": rows, "search_q": q or ""})

@router.get("/notices", response_class=HTMLResponse)
def customer_notices_list(request: Request, db: Session = Depends(get_db)):
    notices = db.scalars(
        select(models.CustomerNotice).options(joinedload(models.CustomerNotice.customer)).order_by(models.CustomerNotice.id.desc())
    ).all()
    return render(request, "customers/notices.html", {
        "title": "Ogłoszenia i powiadomienia",
        "notices": notices
    })

@router.get("/preview-number", response_class=HTMLResponse)
def preview_next_number(
    db: Session = Depends(get_db),
    plan_id: str | None = Query(None)
):
    pid = parse_int_optional(plan_id)
    if not pid:
        return HTMLResponse("")
    
    plan = db.get(models.NumberPlan, pid)
    if not plan:
        return HTMLResponse('<span class="text-destructive text-xs">Nie znaleziono planu</span>')
    
    # Symulacja generowania (bez zapisu w bazie)
    today = date.today()
    n = max(1, int(plan.next_number or 1))
    tpl = (plan.pattern_template or "{year}/{n}").strip()
    fmt_data = {"year": today.year, "month": f"{today.month:02d}", "day": f"{today.day:02d}", "n": n}
    
    try:
        if "{n}" in tpl and "{n:" not in tpl:
            rendered = tpl.replace("{n}", f"{n:04d}").format(**fmt_data)
        else:
            rendered = tpl.format(**fmt_data)
    except Exception:
        rendered = "Błąd formatu"

    return HTMLResponse(f'<span class="text-primary font-mono font-bold text-sm animate-in fade-in slide-in-from-left-2">{rendered}</span>')

@router.get("/search", response_class=HTMLResponse)
def customer_search_form(request: Request):
    return render(
        request,
        "customers/search.html",
        {"title": "Szukaj abonentów"},
    )


@router.get("/new", response_class=HTMLResponse)
def customer_new_form(
    request: Request, 
    db: Session = Depends(get_db),
    last_name: str | None = Query(None),
    city_id: str | None = Query(None),
    street_id: str | None = Query(None),
    street_number: str | None = Query(None),
    apartment_number: str | None = Query(None),
):

    # Pobierz plany numeracji dla klientów
    number_plans = list(db.scalars(
        select(models.NumberPlan)
        .where(models.NumberPlan.doc_type == models.NumberPlanDocType.customer, models.NumberPlan.active == True)
    ).all())
    
    cities = _get_managed_cities(db)
    city_options = [(c.id, c.name + (f" ({c.district.name})" if c.district else "")) for c in cities]
    plan_options = [(p.id, f"{p.name} ({p.pattern_template})") for p in number_plans]
    
    # Find default plan for customers
    default_plan = next((p for p in number_plans if p.is_default), None)
    default_plan_id = default_plan.id if default_plan else ""

    # Default city or pre-populated city
    def_city_id = parse_int_optional(city_id)
    if not def_city_id:
        def_city = next((c for c in cities if c.is_default), None)
        def_city_id = def_city.id if def_city else None

    # Pre-populated street name for display
    street_name = ""
    sid = parse_int_optional(street_id)
    if sid:
        street = db.get(models.LocationStreet, sid)
        if street:
            street_name = street.name

    return render(request, "customers/form.html", {
        "title": "Nowy abonent", 
        "customer": None, 
        "city_options": city_options,
        "plan_options": plan_options,
        "default_city_id": def_city_id,
        "default_plan_id": default_plan_id,
        "pre_last_name": last_name,
        "pre_street_id": sid,
        "pre_street_name": street_name,
        "pre_street_number": street_number,
        "pre_apartment_number": apartment_number,
    })

@router.post("/new", dependencies=[Depends(require_business_write)])
def customer_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    customer_code: str | None = Form(None),
    number_plan_id: str | None = Form(None),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str | None = Form(None),
    phone: str | None = Form(None),
    status: str = Form("active"),
    location_city_id: str | None = Form(None),
    location_street_id: str | None = Form(None),
    street_number: str | None = Form(None),
    apartment_number: str | None = Form(None),
    import_mac: str | None = Form(None),
    import_ip: str | None = Form(None),
    import_device_id: str | None = Form(None),
):
    code = (customer_code or "").strip()
    
    # Automatyczna generacja numeru jeśli wybrano plan
    np_id = parse_int_optional(number_plan_id)
    if np_id:
        plan = db.get(models.NumberPlan, np_id)
        if plan and plan.doc_type == models.NumberPlanDocType.customer:
            code = allocate_next_document_number(db, plan)

    if not code:
        # Fallback: jeśli brak kodu i planu, wróć z błędem
        return RedirectResponse("/customers/new?error=Wymagany+numer+abonenta", status_code=303)

    # Check for existing duplicate code
    existing = db.scalars(select(models.Customer).where(models.Customer.customer_code == code)).first()
    if existing:
        return RedirectResponse(f"/customers/new?error=Numer+abonenta+{code}+jest+już+zajęty", status_code=303)

    c = models.Customer(
        customer_code=code,
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        email=(email or None) and email.strip() or None,
        phone=(phone or None) and phone.strip() or None,
        status=models.CustomerStatus(status),
        location_city_id=parse_int_optional(location_city_id),
        location_street_id=parse_int_optional(location_street_id),
        street_number=(street_number or None) and street_number.strip() or None,
        apartment_number=(apartment_number or None) and apartment_number.strip() or None,
    )
    db.add(c)
    db.flush()
    record_audit(db, "create", "customer", c.id, f"Abonent: {c.customer_code}", request)
    db.commit()

    if import_mac and import_ip:
        # Redirect to node creation with import data
        return RedirectResponse(
            f"/customer-devices/new?customer_id={c.id}&mac_address={import_mac}&ip_address={import_ip}&net_device_id={parse_int(import_device_id) or ''}",
            status_code=303
        )

    return RedirectResponse("/customers", status_code=303)

@router.get("/add")
def customer_add_redirect():
    return RedirectResponse("/customers/new", status_code=303)


@router.get("/{customer_id}/edit", response_class=HTMLResponse)
def customer_edit_form(customer_id: int, request: Request, db: Session = Depends(get_db)):
    c = db.get(models.Customer, customer_id)
    if not c: return RedirectResponse("/customers", status_code=302)

    # Pobierz plany numeracji dla klientów
    number_plans = list(db.scalars(
        select(models.NumberPlan)
        .where(models.NumberPlan.doc_type == models.NumberPlanDocType.customer, models.NumberPlan.active == True)
    ).all())
    
    cities = _get_managed_cities(db)
    city_options = [(c.id, c.name + (f" ({c.district.name})" if c.district else "")) for c in cities]
    plan_options = [(p.id, f"{p.name} ({p.pattern_template})") for p in number_plans]
    
    # Find default plan
    default_plan = next((p for p in number_plans if p.is_default), None)
    default_plan_id = default_plan.id if default_plan else ""

    return render(request, "customers/form.html", {
        "title": f"Edycja abonenta: {c.customer_code}", 
        "customer": c, 
        "city_options": city_options,
        "plan_options": plan_options,
        "default_plan_id": "" # Do not auto-select plan on edit
    })

@router.post("/{customer_id}/edit", dependencies=[Depends(require_business_write)])
def customer_edit_submit(
    customer_id: int,
    request: Request,
    db: Session = Depends(get_db),
    customer_code: str | None = Form(None),
    number_plan_id: str | None = Form(None),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str | None = Form(None),
    phone: str | None = Form(None),
    status: str = Form("active"),
    location_city_id: str | None = Form(None),
    location_street_id: str | None = Form(None),
    street_number: str | None = Form(None),
    apartment_number: str | None = Form(None),
):
    c = db.get(models.Customer, customer_id)
    if not c: return RedirectResponse("/customers", status_code=303)

    new_code = (customer_code or c.customer_code).strip()
    
    # Jeśli wybrano plan numeracji, wygeneruj nowy kod (nadpisuje obecny)
    np_id = parse_int_optional(number_plan_id)
    if np_id:
        plan = db.get(models.NumberPlan, np_id)
        if plan and plan.doc_type == models.NumberPlanDocType.customer:
            new_code = allocate_next_document_number(db, plan)

    if new_code != c.customer_code:
        existing = db.scalars(select(models.Customer).where(models.Customer.customer_code == new_code)).first()
        if existing:
            return RedirectResponse(f"/customers/{customer_id}/edit?error=Numer+abonenta+{new_code}+jest+już+zajęty", status_code=303)

    c.customer_code = new_code
    c.first_name = first_name.strip()
    c.last_name = last_name.strip()
    c.email = (email or None) and email.strip() or None
    c.phone = (phone or None) and phone.strip() or None
    c.status = models.CustomerStatus(status)
    c.location_city_id = parse_int_optional(location_city_id)
    c.location_street_id = parse_int_optional(location_street_id)
    c.street_number = (street_number or None) and street_number.strip() or None
    c.apartment_number = (apartment_number or None) and apartment_number.strip() or None
    db.commit()
    record_audit(db, "update", "customer", c.id, f"Abonent: {c.customer_code}", request)
    return RedirectResponse("/customers", status_code=303)

@router.post("/{customer_id}/delete", dependencies=[Depends(require_business_write)])
def customer_delete(customer_id: int, request: Request, db: Session = Depends(get_db)):
    c = db.get(models.Customer, customer_id)
    if c:
        record_audit(db, "delete", "customer", c.id, f"Abonent: {c.customer_code}", request)
        db.delete(c)
        db.commit()
    return RedirectResponse("/customers", status_code=303)
