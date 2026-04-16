"""Konfiguracja biznesowa SNMS: oddziały, VAT, plany numeracji."""

from __future__ import annotations

from decimal import Decimal, InvalidOperation

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app import models
from app.audit import record_audit
from app.database import get_db
from app.deps import require_admin_or_manager, verify_session
from app.templating import render

router = APIRouter(dependencies=[Depends(verify_session)])


def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None


# --- Divisions ---
@router.get("/config/divisions", response_class=HTMLResponse)
def division_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.Division).order_by(models.Division.name)).all())
    return render(
        request,
        "snms/config_divisions.html",
        {"title": "Oddziały (firmy)", "rows": rows},
    )


@router.get("/config/divisions/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def division_new_form(request: Request):
    return render(request, "snms/config_division_form.html", {"title": "Nowy oddział", "row": None})


@router.post("/config/divisions/new", dependencies=[Depends(require_admin_or_manager)])
def division_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    short_name: str | None = Form(None),
    address: str | None = Form(None),
    city: str | None = Form(None),
    postal_code: str | None = Form(None),
    nip: str | None = Form(None),
    regon: str | None = Form(None),
    active: str | None = Form(None),
    is_default: str | None = Form(None),
):
    if is_default in ("on", "true", "1", "yes"):
        for d in db.scalars(select(models.Division)).all():
            d.is_default = False
    div = models.Division(
        name=name.strip()[:128],
        short_name=(short_name or None) and short_name.strip()[:32] or None,
        address=(address or None) and address.strip()[:255] or None,
        city=(city or None) and city.strip()[:128] or None,
        postal_code=(postal_code or None) and postal_code.strip()[:16] or None,
        nip=(nip or None) and nip.strip()[:20] or None,
        regon=(regon or None) and regon.strip()[:20] or None,
        active=active in ("on", "true", "1", "yes"),
        is_default=is_default in ("on", "true", "1", "yes"),
    )
    db.add(div)
    db.flush()
    record_audit(db, "create", resource_type="division", resource_id=div.id, details=f"name: {div.name}", request=request)
    db.commit()
    return RedirectResponse("/config/divisions", status_code=303)


@router.get("/config/divisions/{row_id}/edit", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def division_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.Division, row_id)
    if not row:
        return RedirectResponse("/config/divisions", status_code=302)
    return render(
        request,
        "snms/config_division_form.html",
        {"title": f"Oddział: {row.name}", "row": row},
    )


@router.post("/config/divisions/{row_id}/edit", dependencies=[Depends(require_admin_or_manager)])
def division_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    short_name: str | None = Form(None),
    address: str | None = Form(None),
    city: str | None = Form(None),
    postal_code: str | None = Form(None),
    nip: str | None = Form(None),
    regon: str | None = Form(None),
    active: str | None = Form(None),
    is_default: str | None = Form(None),
):
    row = db.get(models.Division, row_id)
    if not row:
        return RedirectResponse("/config/divisions", status_code=303)
    if is_default in ("on", "true", "1", "yes"):
        if not row.is_default:
            for d in db.scalars(select(models.Division).where(models.Division.id != row_id)).all():
                d.is_default = False
    row.name = name.strip()[:128]
    row.short_name = (short_name or None) and short_name.strip()[:32] or None
    row.address = (address or None) and address.strip()[:255] or None
    row.city = (city or None) and city.strip()[:128] or None
    row.postal_code = (postal_code or None) and postal_code.strip()[:16] or None
    row.nip = (nip or None) and nip.strip()[:20] or None
    row.regon = (regon or None) and regon.strip()[:20] or None
    row.active = active in ("on", "true", "1", "yes")
    row.is_default = is_default in ("on", "true", "1", "yes")
    record_audit(db, "update", resource_type="division", resource_id=row.id, details=f"name: {row.name}", request=request)
    db.commit()
    return RedirectResponse("/config/divisions", status_code=303)


@router.post("/config/divisions/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def division_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.Division, row_id)
    if row:
        record_audit(db, "delete", resource_type="division", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/divisions", status_code=303)


# --- VAT ---
@router.get("/config/vat-rates", response_class=HTMLResponse)
def vat_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(
            select(models.VatRate).order_by(models.VatRate.sort_order, models.VatRate.id)
        ).all()
    )
    return render(request, "snms/config_vat_rates.html", {"title": "Stawki VAT", "rows": rows})


@router.get("/config/vat-rates/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def vat_new_form(request: Request):
    return render(request, "snms/config_vat_form.html", {"title": "Nowa stawka VAT", "row": None})


@router.post("/config/vat-rates/new", dependencies=[Depends(require_admin_or_manager)])
def vat_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    label: str = Form(...),
    rate_percent: str = Form(...),
    sort_order: int = Form(0),
    is_default: str | None = Form(None),
):
    try:
        rp = Decimal(str(rate_percent).replace(",", ".").strip())
    except InvalidOperation:
        return RedirectResponse("/config/vat-rates/new", status_code=303)
    if is_default in ("on", "true", "1", "yes"):
        for v in db.scalars(select(models.VatRate)).all():
            v.is_default = False
    vr = models.VatRate(
        label=label.strip()[:128],
        rate_percent=rp,
        is_default=is_default in ("on", "true", "1", "yes"),
        sort_order=int(sort_order or 0),
    )
    db.add(vr)
    db.flush()
    record_audit(db, "create", resource_type="vat_rate", resource_id=vr.id, details=f"label: {vr.label}", request=request)
    db.commit()
    return RedirectResponse("/config/vat-rates", status_code=303)


@router.get("/config/vat-rates/{row_id}/edit", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def vat_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.VatRate, row_id)
    if not row:
        return RedirectResponse("/config/vat-rates", status_code=302)
    return render(
        request,
        "snms/config_vat_form.html",
        {"title": f"VAT: {row.label}", "row": row},
    )


@router.post("/config/vat-rates/{row_id}/edit", dependencies=[Depends(require_admin_or_manager)])
def vat_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    label: str = Form(...),
    rate_percent: str = Form(...),
    sort_order: int = Form(0),
    is_default: str | None = Form(None),
):
    row = db.get(models.VatRate, row_id)
    if not row:
        return RedirectResponse("/config/vat-rates", status_code=303)
    try:
        rp = Decimal(str(rate_percent).replace(",", ".").strip())
    except InvalidOperation:
        return RedirectResponse(f"/config/vat-rates/{row_id}/edit", status_code=303)
    if is_default in ("on", "true", "1", "yes"):
        for v in db.scalars(select(models.VatRate).where(models.VatRate.id != row_id)).all():
            v.is_default = False
    row.label = label.strip()[:128]
    row.rate_percent = rp
    row.sort_order = int(sort_order or 0)
    row.is_default = is_default in ("on", "true", "1", "yes")
    record_audit(db, "update", resource_type="vat_rate", resource_id=row.id, details=f"label: {row.label}", request=request)
    db.commit()
    return RedirectResponse("/config/vat-rates", status_code=303)


@router.post("/config/vat-rates/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def vat_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.VatRate, row_id)
    if row:
        record_audit(db, "delete", resource_type="vat_rate", resource_id=row.id, details=f"label: {row.label}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/vat-rates", status_code=303)


# --- Number plans ---
@router.get("/config/number-plans", response_class=HTMLResponse)
def number_plan_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.NumberPlan).order_by(models.NumberPlan.name)).all()
    )
    divs = {d.id: d for d in db.scalars(select(models.Division)).all()}
    return render(
        request,
        "snms/config_number_plans.html",
        {"title": "Plany numeracji", "rows": rows, "divisions": divs},
    )


@router.get("/config/number-plans/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def number_plan_new_form(request: Request, db: Session = Depends(get_db)):
    divs = list(db.scalars(select(models.Division).order_by(models.Division.name)).all())
    return render(
        request,
        "snms/config_number_plan_form.html",
        {"title": "Nowy plan numeracji", "row": None, "divisions": divs},
    )


@router.post("/config/number-plans/new", dependencies=[Depends(require_admin_or_manager)])
def number_plan_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    doc_type: str = Form("invoice"),
    pattern_template: str = Form(...),
    next_number: int = Form(1),
    division_id: str | None = Form(None),
    active: str | None = Form(None),
):
    try:
        dt = models.NumberPlanDocType(doc_type)
    except ValueError:
        dt = models.NumberPlanDocType.invoice
    did = int(division_id) if division_id and str(division_id).strip().isdigit() else None
    plan = models.NumberPlan(
        name=name.strip()[:128],
        doc_type=dt,
        pattern_template=pattern_template.strip()[:128],
        next_number=max(1, int(next_number or 1)),
        division_id=did,
        active=active in ("on", "true", "1", "yes", None),
    )
    db.add(plan)
    db.flush()
    record_audit(db, "create", resource_type="number_plan", resource_id=plan.id, details=f"name: {plan.name}", request=request)
    db.commit()
    return RedirectResponse("/config/number-plans", status_code=303)


@router.get("/config/number-plans/{row_id}/edit", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def number_plan_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NumberPlan, row_id)
    if not row:
        return RedirectResponse("/config/number-plans", status_code=302)
    divs = list(db.scalars(select(models.Division).order_by(models.Division.name)).all())
    return render(
        request,
        "snms/config_number_plan_form.html",
        {"title": f"Plan: {row.name}", "row": row, "divisions": divs},
    )


@router.post("/config/number-plans/{row_id}/edit", dependencies=[Depends(require_admin_or_manager)])
def number_plan_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    doc_type: str = Form("invoice"),
    pattern_template: str = Form(...),
    next_number: int = Form(1),
    division_id: str | None = Form(None),
    active: str | None = Form(None),
):
    row = db.get(models.NumberPlan, row_id)
    if not row:
        return RedirectResponse("/config/number-plans", status_code=303)
    try:
        dt = models.NumberPlanDocType(doc_type)
    except ValueError:
        dt = models.NumberPlanDocType.invoice
    did = int(division_id) if division_id and str(division_id).strip().isdigit() else None
    row.name = name.strip()[:128]
    row.doc_type = dt
    row.pattern_template = pattern_template.strip()[:128]
    row.next_number = max(1, int(next_number or 1))
    row.division_id = did
    row.active = active in ("on", "true", "1", "yes")
    record_audit(db, "update", resource_type="number_plan", resource_id=row.id, details=f"name: {row.name}", request=request)
    db.commit()
    return RedirectResponse("/config/number-plans", status_code=303)


@router.post("/config/number-plans/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def number_plan_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NumberPlan, row_id)
    if row:
        record_audit(db, "delete", resource_type="number_plan", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/number-plans", status_code=303)


# --- Hosty sieci (router dla puli IP) ---
@router.get("/config/network-hosts", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def network_host_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.NetworkHost).order_by(models.NetworkHost.name)).all())
    return render(
        request,
        "snms/config_network_hosts.html",
        {"title": "Hosty sieci", "rows": rows},
    )


@router.post("/config/network-hosts/new", dependencies=[Depends(require_admin_or_manager)])
def network_host_new(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str | None = Form(None),
):
    h = models.NetworkHost(
        name=name.strip()[:255],
        description=(description or "").strip(),
    )
    db.add(h)
    db.flush()
    record_audit(db, "create", resource_type="network_host", resource_id=h.id, details=f"name: {h.name}", request=request)
    db.commit()
    return RedirectResponse("/config/network-hosts", status_code=303)


@router.post("/config/network-hosts/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def network_host_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NetworkHost, row_id)
    if row:
        for net in list(row.ip_networks):
            net.network_host_id = None
        record_audit(db, "delete", resource_type="network_host", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/network-hosts", status_code=303)


# --- Katalog osprzętu: producenci / typy / modele ---
@router.get("/config/netdev-catalog", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def netdev_catalog(request: Request, db: Session = Depends(get_db)):
    producers = list(db.scalars(select(models.NetDeviceProducer).order_by(models.NetDeviceProducer.name)).all())
    types_ = list(db.scalars(select(models.NetDeviceType).order_by(models.NetDeviceType.name)).all())
    device_models = list(
        db.scalars(
            select(models.NetDeviceModel)
            .options(
                joinedload(models.NetDeviceModel.producer),
                joinedload(models.NetDeviceModel.device_type),
            )
            .order_by(models.NetDeviceModel.id)
        ).all()
    )
    return render(
        request,
        "snms/config_netdev_catalog.html",
        {
            "title": "Katalog osprzętu (producenci / typy / modele)",
            "producers": producers,
            "types": types_,
            "device_models": device_models,
        },
    )


@router.post("/config/netdev-catalog/producer", dependencies=[Depends(require_admin_or_manager)])
def netdev_producer_new(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    alternative_name: str | None = Form(None),
):
    p = models.NetDeviceProducer(
        name=name.strip()[:255],
        alternative_name=(alternative_name or None) and alternative_name.strip()[:255] or None,
    )
    db.add(p)
    db.flush()
    record_audit(db, "create", resource_type="netdev_producer", resource_id=p.id, details=f"name: {p.name}", request=request)
    db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)


@router.post("/config/netdev-catalog/producer/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def netdev_producer_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NetDeviceProducer, row_id)
    if row:
        record_audit(db, "delete", resource_type="netdev_producer", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)


@router.post("/config/netdev-catalog/type", dependencies=[Depends(require_admin_or_manager)])
def netdev_type_new(request: Request, db: Session = Depends(get_db), name: str = Form(...)):
    t = models.NetDeviceType(name=name.strip()[:50])
    db.add(t)
    db.flush()
    record_audit(db, "create", resource_type="netdev_type", resource_id=t.id, details=f"name: {t.name}", request=request)
    db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)


@router.post("/config/netdev-catalog/type/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def netdev_type_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NetDeviceType, row_id)
    if row:
        record_audit(db, "delete", resource_type="netdev_type", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)


@router.post("/config/netdev-catalog/model", dependencies=[Depends(require_admin_or_manager)])
def netdev_model_new(
    request: Request,
    db: Session = Depends(get_db),
    producer_id: int = Form(...),
    name: str = Form(...),
    type_id: str | None = Form(None),
    alternative_name: str | None = Form(None),
):
    m = models.NetDeviceModel(
        producer_id=producer_id,
        name=name.strip()[:255],
        alternative_name=(alternative_name or None) and alternative_name.strip()[:255] or None,
        type_id=_opt_int(type_id),
    )
    db.add(m)
    db.flush()
    record_audit(db, "create", resource_type="netdev_model", resource_id=m.id, details=f"name: {m.name}", request=request)
    db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)


@router.post("/config/netdev-catalog/model/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def netdev_model_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.NetDeviceModel, row_id)
    if row:
        record_audit(db, "delete", resource_type="netdev_model", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config/netdev-catalog", status_code=303)
