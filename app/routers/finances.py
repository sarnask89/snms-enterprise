from datetime import date, datetime, timezone
from decimal import ROUND_HALF_UP, Decimal

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.audit import record_audit
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.snms_numbering import allocate_next_document_number
from app.templating import render

router = APIRouter(prefix="/finances", dependencies=[Depends(verify_session)])


def _parse_issue_date(raw: str | None) -> date:
    if raw and str(raw).strip():
        try:
            return date.fromisoformat(str(raw).strip()[:10])
        except ValueError:
            pass
    return date.today()


def _vat_net_amounts(gross: Decimal, vid: int | None, db: Session) -> tuple[float | None, float | None]:
    if not vid:
        return None, None
    vr = db.get(models.VatRate, vid)
    if vr is None:
        return None, None
    rate = Decimal(str(vr.rate_percent)) / Decimal("100")
    if rate < 0:
        return None, None
    net = (gross / (Decimal("1") + rate)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    vat_amt = (gross - net).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return float(net), float(vat_amt)


@router.get("/payments", response_class=HTMLResponse)
def finances_payments_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.RecurringPayment).order_by(models.RecurringPayment.id.desc())).all()
    )
    cust = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    return render(
        request,
        "finances/payments.html",
        {"title": "Płatności stałe", "rows": rows, "customers": cust},
    )


@router.get("/payments/add", dependencies=[Depends(verify_session)])
def finances_payment_add_alias():
    """Formularz dodawania płatności stałej na liście płatności."""
    return RedirectResponse("/finances/payments", status_code=303)


@router.post("/payments/new", dependencies=[Depends(require_business_write)])
def finances_payment_new(
    request: Request,
    db: Session = Depends(get_db),
    customer_id: int = Form(...),
    name: str = Form(...),
    amount: str = Form(...),
    interval_months: int = Form(1),
    day_of_month: int = Form(1),
    active: str | None = Form(None),
    next_run: str | None = Form(None),
):
    nr: date | None = None
    if next_run and str(next_run).strip():
        try:
            nr = date.fromisoformat(str(next_run).strip())
        except ValueError:
            nr = None
    p = models.RecurringPayment(
        customer_id=customer_id,
        name=name.strip()[:128],
        amount=Decimal(amount.replace(",", ".")),
        interval_months=max(1, int(interval_months or 1)),
        day_of_month=max(1, min(28, int(day_of_month or 1))),
        active=active in ("on", "true", "1", "yes"),
        next_run=nr,
    )
    db.add(p)
    db.flush()
    record_audit(db, "create", resource_type="recurring_payment", resource_id=p.id, details=f"name: {p.name}", request=request)
    db.commit()
    return RedirectResponse("/finances/payments", status_code=303)


@router.post("/payments/{pay_id}/delete", dependencies=[Depends(require_business_write)])
def finances_payment_delete(pay_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.RecurringPayment, pay_id)
    if row:
        record_audit(db, "delete", resource_type="recurring_payment", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/finances/payments", status_code=303)


@router.get("/balance", response_class=HTMLResponse)
def finances_balance_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.LedgerEntry).order_by(models.LedgerEntry.posted_at.desc())).all()
    )
    cust = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    return render(
        request,
        "finances/balance.html",
        {
            "title": "Bilans / operacje (księga)",
            "rows": rows,
            "customers": cust,
            "kinds": list(models.LedgerEntryKind),
        },
    )


@router.get("/balance/add", dependencies=[Depends(verify_session)])
def finances_balance_add_alias():
    """Formularz nowej operacji na stronie bilansu."""
    return RedirectResponse("/finances/balance", status_code=303)


@router.post("/balance/new", dependencies=[Depends(require_business_write)])
def finances_ledger_new(
    request: Request,
    db: Session = Depends(get_db),
    customer_id: int = Form(...),
    amount: str = Form(...),
    kind: str = Form(...),
    description: str = Form(...),
    posted_at: str | None = Form(None),
):
    pt = datetime.now(timezone.utc)
    if posted_at and str(posted_at).strip():
        try:
            pt = datetime.fromisoformat(str(posted_at).strip().replace("Z", "+00:00"))
        except ValueError:
            pt = datetime.now(timezone.utc)
    try:
        k = models.LedgerEntryKind(kind)
    except ValueError:
        k = models.LedgerEntryKind.debit
    e = models.LedgerEntry(
        customer_id=customer_id,
        amount=Decimal(amount.replace(",", ".")),
        kind=k,
        description=description.strip()[:255],
        posted_at=pt,
    )
    db.add(e)
    db.flush()
    record_audit(db, "create", resource_type="ledger_entry", resource_id=e.id, details=f"desc: {e.description}", request=request)
    db.commit()
    return RedirectResponse("/finances/balance", status_code=303)


@router.post("/balance/{entry_id}/delete", dependencies=[Depends(require_business_write)])
def finances_ledger_delete(entry_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.LedgerEntry, entry_id)
    if row:
        record_audit(db, "delete", resource_type="ledger_entry", resource_id=row.id, details=f"desc: {row.description}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/finances/balance", status_code=303)


@router.get("/cash", response_class=HTMLResponse)
def finances_cash_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.CashReceipt).order_by(models.CashReceipt.issued_at.desc())).all()
    )
    cust = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    return render(
        request,
        "finances/cash.html",
        {"title": "Kasa (paragony)", "rows": rows, "customers": cust},
    )


@router.get("/cash/add", dependencies=[Depends(verify_session)])
def finances_cash_add_alias():
    """Formularz nowego wpisu kasy na liście kasy."""
    return RedirectResponse("/finances/cash", status_code=303)


@router.post("/cash/new", dependencies=[Depends(require_business_write)])
def finances_cash_new(
    request: Request,
    db: Session = Depends(get_db),
    amount: str = Form(...),
    description: str = Form(...),
    customer_id: str | None = Form(None),
    issued_at: str | None = Form(None),
):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    it = datetime.now(timezone.utc)
    if issued_at and str(issued_at).strip():
        try:
            it = datetime.fromisoformat(str(issued_at).strip().replace("Z", "+00:00"))
        except ValueError:
            it = datetime.now(timezone.utc)
    c = models.CashReceipt(
        customer_id=cid,
        amount=Decimal(amount.replace(",", ".")),
        description=description.strip()[:255],
        issued_at=it,
    )
    db.add(c)
    db.flush()
    record_audit(db, "create", resource_type="cash_receipt", resource_id=c.id, details=f"desc: {c.description}", request=request)
    db.commit()
    return RedirectResponse("/finances/cash", status_code=303)


@router.post("/cash/{receipt_id}/delete", dependencies=[Depends(require_business_write)])
def finances_cash_delete(receipt_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.CashReceipt, receipt_id)
    if row:
        record_audit(db, "delete", resource_type="cash_receipt", resource_id=row.id, details=f"desc: {row.description}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/finances/cash", status_code=303)


@router.get("/tariffs/add", dependencies=[Depends(verify_session)])
def tariff_add_alias():
    """Formularz nowej taryfy na liście taryf."""
    return RedirectResponse("/finances/tariffs", status_code=303)


@router.get("/tariffs", response_class=HTMLResponse)
def tariff_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.Tariff).order_by(models.Tariff.id)).all())
    return render(
        request,
        "finances/tariffs.html",
        {"title": "Taryfy", "tariffs": rows},
    )


@router.post("/tariffs/new", dependencies=[Depends(require_business_write)])
def tariff_new(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    monthly_price: str = Form(...),
    description: str | None = Form(None),
):
    t = models.Tariff(
        name=name.strip(),
        monthly_price=Decimal(monthly_price.replace(",", ".")),
        description=(description or None) and description.strip() or None,
    )
    db.add(t)
    db.flush()
    record_audit(db, "create", resource_type="tariff", resource_id=t.id, details=f"name: {t.name}", request=request)
    db.commit()
    return RedirectResponse("/finances/tariffs", status_code=303)


@router.post("/tariffs/{tariff_id}/delete", dependencies=[Depends(require_business_write)])
def tariff_delete(tariff_id: int, request: Request, db: Session = Depends(get_db)):
    t = db.get(models.Tariff, tariff_id)
    if t:
        record_audit(db, "delete", resource_type="tariff", resource_id=t.id, details=f"name: {t.name}", request=request)
        db.delete(t)
        db.commit()
    return RedirectResponse("/finances/tariffs", status_code=303)


@router.get("/invoices/search", response_class=HTMLResponse)
def invoice_search_form(request: Request, db: Session = Depends(get_db)):
    return render(
        request,
        "finances/invoice_search.html",
        {
            "title": "Szukaj dokumentów",
            "statuses": list(models.InvoiceStatus),
            "kinds": list(models.InvoiceDocumentKind),
        },
    )


@router.get("/invoices", response_class=HTMLResponse)
def invoice_list(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None),
    status: str | None = Query(None),
    kind: str | None = Query(None),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
):
    stmt = select(models.Invoice).order_by(models.Invoice.id.desc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(models.Invoice.number.ilike(term))
    if status and status in [s.value for s in models.InvoiceStatus]:
        stmt = stmt.where(models.Invoice.status == models.InvoiceStatus(status))
    if kind and kind in [k.value for k in models.InvoiceDocumentKind]:
        stmt = stmt.where(models.Invoice.document_kind == models.InvoiceDocumentKind(kind))
    if date_from:
        try:
            df = date.fromisoformat(date_from)
            stmt = stmt.where(models.Invoice.issue_date >= df)
        except ValueError:
            pass
    if date_to:
        try:
            dt = date.fromisoformat(date_to)
            stmt = stmt.where(models.Invoice.issue_date <= dt)
        except ValueError:
            pass

    rows = list(db.scalars(stmt).all())
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    divisions = {d.id: d for d in db.scalars(select(models.Division)).all()}
    return render(
        request,
        "finances/invoices.html",
        {
            "title": "Dokumenty sprzedaży",
            "invoices": rows,
            "customers": customers,
            "divisions": divisions,
            "search_q": q or "",
            "search_status": status or "",
            "search_kind": kind or "",
            "search_date_from": date_from or "",
            "search_date_to": date_to or "",
        },
    )


@router.get("/invoices/add", dependencies=[Depends(verify_session)])
def invoice_add_alias():
    """Wejście do kreatora nowego dokumentu sprzedaży."""
    return RedirectResponse("/finances/invoices/new", status_code=303)


@router.get("/invoices/new", response_class=HTMLResponse)
def invoice_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    divisions = list(
        db.scalars(
            select(models.Division)
            .where(models.Division.active.is_(True))
            .order_by(models.Division.name)
        ).all()
    )
    vat_rates = list(
        db.scalars(
            select(models.VatRate).order_by(models.VatRate.sort_order, models.VatRate.id)
        ).all()
    )
    number_plans = list(
        db.scalars(
            select(models.NumberPlan)
            .where(models.NumberPlan.active.is_(True))
            .order_by(models.NumberPlan.name)
        ).all()
    )
    # Convert plans to JSON for Alpine.js
    np_json = [{"id": p.id, "doc_type": p.doc_type.value} for p in number_plans]
    
    return render(
        request,
        "finances/invoice_form.html",
        {
            "title": "Nowy dokument sprzedaży",
            "customers": custs,
            "divisions": divisions,
            "vat_rates": vat_rates,
            "number_plans": number_plans,
            "number_plans_json": np_json,
            "doc_kinds": list(models.InvoiceDocumentKind),
            "invoice": None,
            "today": date.today().isoformat()
        },
    )


@router.post("/invoices/new", dependencies=[Depends(require_business_write)])
def invoice_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    number: str | None = Form(None),
    number_plan_id: str | None = Form(None),
    customer_id: int = Form(...),
    amount: str = Form(...),
    status: str = Form("draft"),
    document_kind: str = Form("invoice"),
    division_id: str | None = Form(None),
    vat_rate_id: str | None = Form(None),
    issue_date: str | None = Form(None),
):
    try:
        dk = models.InvoiceDocumentKind(document_kind.strip())
    except ValueError:
        dk = models.InvoiceDocumentKind.invoice

    num = (number or "").strip()
    pid = int(number_plan_id) if number_plan_id and str(number_plan_id).strip().isdigit() else None
    if pid:
        plan = db.get(models.NumberPlan, pid)
        if plan and plan.active and plan.doc_type.value == dk.value:
            num = allocate_next_document_number(db, plan)

    if not num:
        return RedirectResponse("/finances/invoices/new", status_code=303)

    did = int(division_id) if division_id and str(division_id).strip().isdigit() else None
    vid = int(vat_rate_id) if vat_rate_id and str(vat_rate_id).strip().isdigit() else None

    gross = Decimal(str(amount).replace(",", ".").strip())
    net_f, vat_f = _vat_net_amounts(gross, vid, db)
    inv = models.Invoice(
        number=num[:64],
        customer_id=customer_id,
        amount=gross,
        status=models.InvoiceStatus(status),
        issue_date=_parse_issue_date(issue_date),
        division_id=did,
        vat_rate_id=vid,
        document_kind=dk,
        amount_net=net_f,
        amount_vat=vat_f,
    )
    db.add(inv)
    try:
        db.flush()
        record_audit(db, "create", resource_type="invoice", resource_id=inv.id, details=f"no: {inv.number}", request=request)
        db.commit()
    except IntegrityError:
        db.rollback()
        return RedirectResponse("/finances/invoices/new?error=Numer+dokumentu+już+istnieje", status_code=303)
    except Exception:
        db.rollback()
        raise
    return RedirectResponse("/finances/invoices", status_code=303)


@router.get("/invoices/{invoice_id}/edit", response_class=HTMLResponse)
def invoice_edit_form(invoice_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.Invoice, invoice_id)
    if not row:
        return RedirectResponse("/finances/invoices", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    divisions = list(
        db.scalars(
            select(models.Division)
            .where(models.Division.active.is_(True))
            .order_by(models.Division.name)
        ).all()
    )
    vat_rates = list(
        db.scalars(
            select(models.VatRate).order_by(models.VatRate.sort_order, models.VatRate.id)
        ).all()
    )
    return render(
        request,
        "finances/invoice_form.html",
        {
            "title": f"Edycja: {row.number}",
            "customers": custs,
            "divisions": divisions,
            "vat_rates": vat_rates,
            "number_plans": [],
            "number_plans_json": [],
            "doc_kinds": list(models.InvoiceDocumentKind),
            "invoice": row,
            "today": date.today().isoformat()
        },
    )


@router.post("/invoices/{invoice_id}/edit", dependencies=[Depends(require_business_write)])
def invoice_edit_submit(
    invoice_id: int,
    request: Request,
    db: Session = Depends(get_db),
    number: str = Form(...),
    customer_id: int = Form(...),
    amount: str = Form(...),
    status: str = Form("draft"),
    document_kind: str = Form("invoice"),
    division_id: str | None = Form(None),
    vat_rate_id: str | None = Form(None),
    issue_date: str | None = Form(None),
):
    inv = db.get(models.Invoice, invoice_id)
    if not inv:
        return RedirectResponse("/finances/invoices", status_code=303)

    if inv.status in (models.InvoiceStatus.issued, models.InvoiceStatus.paid):
        return render(request, "finances/invoice_form.html", {"error": "Nie można edytować zatwierdzonego dokumentu.", "invoice": inv, "customers": [], "divisions": [], "vat_rates": [], "number_plans": [], "doc_kinds": []}, status_code=403)

    try:
        dk = models.InvoiceDocumentKind(document_kind.strip())
    except ValueError:
        dk = models.InvoiceDocumentKind.invoice

    num = (number or "").strip()[:64]
    if not num:
        return RedirectResponse(f"/finances/invoices/{invoice_id}/edit", status_code=303)

    did = int(division_id) if division_id and str(division_id).strip().isdigit() else None
    vid = int(vat_rate_id) if vat_rate_id and str(vat_rate_id).strip().isdigit() else None
    gross = Decimal(str(amount).replace(",", ".").strip())
    net_f, vat_f = _vat_net_amounts(gross, vid, db)

    inv.number = num
    inv.customer_id = customer_id
    inv.amount = gross
    inv.status = models.InvoiceStatus(status)
    inv.issue_date = _parse_issue_date(issue_date)
    inv.division_id = did
    inv.vat_rate_id = vid
    inv.document_kind = dk
    inv.amount_net = net_f
    inv.amount_vat = vat_f
    try:
        record_audit(db, "update", resource_type="invoice", resource_id=inv.id, details=f"no: {inv.number}, status: {inv.status.value}", request=request)
        db.commit()
    except IntegrityError:
        db.rollback()
        return RedirectResponse(f"/finances/invoices/{invoice_id}/edit?error=Numer+dokumentu+już+istnieje", status_code=303)
    except Exception:
        db.rollback()
        raise
    return RedirectResponse("/finances/invoices", status_code=303)


@router.post("/invoices/{invoice_id}/delete", dependencies=[Depends(require_business_write)])
def invoice_delete(invoice_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.Invoice, invoice_id)
    if row:
        if row.status in (models.InvoiceStatus.issued, models.InvoiceStatus.paid):
            return RedirectResponse("/finances/invoices", status_code=303)
        record_audit(db, "delete", resource_type="invoice", resource_id=row.id, details=f"no: {row.number}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/finances/invoices", status_code=303)
