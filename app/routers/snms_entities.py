"""Encje SNMS: VoIP, hosting, wiadomości, terminarz, statystyki ruchu, ustawienia."""

from __future__ import annotations

from datetime import date, datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.audit import record_audit
from app.database import get_db
from app.deps import (
    require_admin_or_manager,
    require_business_write,
    require_messaging_write,
    verify_session,
)
from app.templating import render

router = APIRouter(dependencies=[Depends(verify_session)])


def _customers_map(db: Session) -> dict[int, models.Customer]:
    return {c.id: c for c in db.scalars(select(models.Customer)).all()}


def _nodes_list(db: Session) -> list[models.Node]:
    return list(db.scalars(select(models.Node).order_by(models.Node.hostname)).all())


def _merge_message_from_template(
    db: Session,
    template_id: int | None,
    subject: str | None,
    body: str | None,
) -> tuple[str, str] | None:
    """Uzupełnia temat/treść z szablonu, gdy pola są puste (szablon jako źródło treści)."""
    sub = (subject or "").strip()
    bod = (body or "").strip()
    if template_id is not None:
        t = db.get(models.MessageTemplate, template_id)
        if t:
            if not sub:
                sub = (t.subject or "").strip()[:255]
            if not bod:
                bod = (t.body or "").strip()
    if not sub or not bod:
        return None
    return sub[:255], bod


# --- VoIP ---
@router.get("/voip", response_class=HTMLResponse)
def voip_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.VoipAccount).order_by(models.VoipAccount.id)).all())
    cust = _customers_map(db)
    return render(
        request,
        "snms/voip.html",
        {"title": "VoIP", "rows": rows, "customers": cust},
    )


@router.get("/voip/new", response_class=HTMLResponse)
def voip_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "snms/voip_form.html",
        {"title": "Nowe konto VoIP", "row": None, "customers": custs},
    )


@router.post("/voip/new", dependencies=[Depends(require_business_write)])
def voip_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    label: str = Form(...),
    phone_number: str = Form(...),
    customer_id: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    v = models.VoipAccount(
        label=label.strip()[:128],
        phone_number=phone_number.strip()[:32],
        customer_id=cid,
        active=active in ("on", "true", "1", "yes"),
        notes=(notes or None) and notes.strip() or None,
    )
    db.add(v)
    db.flush()
    record_audit(db, "create", resource_type="voip_account", resource_id=v.id, details=f"no: {v.phone_number}", request=request)
    db.commit()
    return RedirectResponse("/voip", status_code=303)


@router.get("/voip/{row_id}/edit", response_class=HTMLResponse)
def voip_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.VoipAccount, row_id)
    if not row:
        return RedirectResponse("/voip", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "snms/voip_form.html",
        {"title": f"VoIP: {row.label}", "row": row, "customers": custs},
    )


@router.post("/voip/{row_id}/edit", dependencies=[Depends(require_business_write)])
def voip_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    label: str = Form(...),
    phone_number: str = Form(...),
    customer_id: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
):
    row = db.get(models.VoipAccount, row_id)
    if not row:
        return RedirectResponse("/voip", status_code=303)
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    row.label = label.strip()[:128]
    row.phone_number = phone_number.strip()[:32]
    row.customer_id = cid
    row.active = active in ("on", "true", "1", "yes")
    row.notes = (notes or None) and notes.strip() or None
    record_audit(db, "update", resource_type="voip_account", resource_id=row.id, details=f"no: {row.phone_number}", request=request)
    db.commit()
    return RedirectResponse("/voip", status_code=303)


@router.post("/voip/{row_id}/delete", dependencies=[Depends(require_business_write)])
def voip_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.VoipAccount, row_id)
    if row:
        record_audit(db, "delete", resource_type="voip_account", resource_id=row.id, details=f"no: {row.phone_number}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/voip", status_code=303)


# --- Hosting ---
@router.get("/hosting", response_class=HTMLResponse)
def hosting_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.HostingAccount).order_by(models.HostingAccount.id)).all())
    cust = _customers_map(db)
    return render(
        request,
        "snms/hosting.html",
        {"title": "Hosting", "rows": rows, "customers": cust},
    )


@router.get("/hosting/new", response_class=HTMLResponse)
def hosting_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(request, "snms/hosting_form.html", {"title": "Nowe konto hosting", "row": None, "customers": custs})


@router.post("/hosting/new", dependencies=[Depends(require_business_write)])
def hosting_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    account_login: str = Form(...),
    domain: str | None = Form(None),
    customer_id: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    h = models.HostingAccount(
        account_login=account_login.strip()[:128],
        domain=(domain or None) and domain.strip()[:255] or None,
        customer_id=cid,
        active=active in ("on", "true", "1", "yes"),
        notes=(notes or None) and notes.strip() or None,
    )
    db.add(h)
    db.flush()
    record_audit(db, "create", resource_type="hosting_account", resource_id=h.id, details=f"login: {h.account_login}", request=request)
    db.commit()
    return RedirectResponse("/hosting", status_code=303)


@router.get("/hosting/{row_id}/edit", response_class=HTMLResponse)
def hosting_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.HostingAccount, row_id)
    if not row:
        return RedirectResponse("/hosting", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "snms/hosting_form.html",
        {"title": f"Hosting: {row.account_login}", "row": row, "customers": custs},
    )


@router.post("/hosting/{row_id}/edit", dependencies=[Depends(require_business_write)])
def hosting_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    account_login: str = Form(...),
    domain: str | None = Form(None),
    customer_id: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
):
    row = db.get(models.HostingAccount, row_id)
    if not row:
        return RedirectResponse("/hosting", status_code=303)
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    row.account_login = account_login.strip()[:128]
    row.domain = (domain or None) and domain.strip()[:255] or None
    row.customer_id = cid
    row.active = active in ("on", "true", "1", "yes")
    row.notes = (notes or None) and notes.strip() or None
    record_audit(db, "update", resource_type="hosting_account", resource_id=row.id, details=f"login: {row.account_login}", request=request)
    db.commit()
    return RedirectResponse("/hosting", status_code=303)


@router.post("/hosting/{row_id}/delete", dependencies=[Depends(require_business_write)])
def hosting_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.HostingAccount, row_id)
    if row:
        record_audit(db, "delete", resource_type="hosting_account", resource_id=row.id, details=f"login: {row.account_login}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/hosting", status_code=303)


# --- Messages ---
@router.get("/messages", response_class=HTMLResponse)
def messages_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.OutboundMessage).order_by(models.OutboundMessage.id.desc())).all()
    )
    cust = _customers_map(db)
    tmpl = {t.id: t for t in db.scalars(select(models.MessageTemplate)).all()}
    return render(
        request,
        "snms/messages.html",
        {"title": "Wiadomości", "rows": rows, "customers": cust, "templates": tmpl},
    )


@router.get("/messages/api/template/{template_id}", response_class=JSONResponse)
def message_template_json(template_id: int, db: Session = Depends(get_db)):
    """JSON pod formularz wiadomości: podpowiedź tematu i treści z szablonu (bez wpisywania ręcznie)."""
    t = db.get(models.MessageTemplate, template_id)
    if not t:
        raise HTTPException(status_code=404, detail="Brak szablonu")
    return JSONResponse({"id": t.id, "subject": t.subject, "body": t.body})


@router.get("/messages/new", response_class=HTMLResponse)
def messages_new_form(
    request: Request,
    db: Session = Depends(get_db),
    template: int | None = Query(None, description="Wstępnie wybrany szablon (z listy szablonów)"),
):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    tmpls = list(db.scalars(select(models.MessageTemplate).order_by(models.MessageTemplate.name)).all())
    pre_id = template if template and db.get(models.MessageTemplate, template) else None
    return render(
        request,
        "snms/message_form.html",
        {
            "title": "Nowa wiadomość",
            "row": None,
            "customers": custs,
            "templates": tmpls,
            "preselect_template_id": pre_id,
        },
    )


@router.post("/messages/new", dependencies=[Depends(require_messaging_write)])
def messages_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    subject: str | None = Form(None),
    body: str | None = Form(None),
    customer_id: str | None = Form(None),
    template_id: str | None = Form(None),
    mark_sent: str | None = Form(None),
):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    tid = int(template_id) if template_id and str(template_id).strip().isdigit() else None
    merged = _merge_message_from_template(db, tid, subject, body)
    if merged is None:
        return RedirectResponse("/messages/new", status_code=303)
    sub, bod = merged
    sent = mark_sent in ("on", "true", "1", "yes")
    now = datetime.now(timezone.utc)
    m = models.OutboundMessage(
        subject=sub,
        body=bod,
        customer_id=cid,
        template_id=tid,
        status=models.MessageStatus.sent if sent else models.MessageStatus.draft,
        sent_at=now if sent else None,
    )
    db.add(m)
    db.flush()
    record_audit(db, "create", resource_type="outbound_message", resource_id=m.id, details=f"subject: {m.subject}", request=request)
    db.commit()
    return RedirectResponse("/messages", status_code=303)


# Szablony muszą być przed /messages/{row_id}/… (ścieżka „templates” nie jest liczbą, ale inne kolizje unikamy kolejnością).
@router.get("/messages/templates", response_class=HTMLResponse)
def message_templates_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.MessageTemplate).order_by(models.MessageTemplate.name)).all())
    return render(request, "snms/message_templates.html", {"title": "Szablony wiadomości", "rows": rows})


@router.get("/messages/templates/new", response_class=HTMLResponse)
def message_templates_new_form(request: Request):
    return render(request, "snms/message_template_form.html", {"title": "Nowy szablon", "row": None})


@router.post("/messages/templates/new", dependencies=[Depends(require_messaging_write)])
def message_templates_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
):
    mt = models.MessageTemplate(
        name=name.strip()[:128],
        subject=subject.strip()[:255],
        body=body.strip(),
    )
    db.add(mt)
    db.flush()
    record_audit(db, "create", resource_type="message_template", resource_id=mt.id, details=f"name: {mt.name}", request=request)
    db.commit()
    return RedirectResponse("/messages/templates", status_code=303)


@router.get("/messages/templates/{row_id}/edit", response_class=HTMLResponse)
def message_templates_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.MessageTemplate, row_id)
    if not row:
        return RedirectResponse("/messages/templates", status_code=302)
    return render(
        request,
        "snms/message_template_form.html",
        {"title": f"Szablon: {row.name}", "row": row},
    )


@router.post("/messages/templates/{row_id}/edit", dependencies=[Depends(require_messaging_write)])
def message_templates_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
):
    row = db.get(models.MessageTemplate, row_id)
    if not row:
        return RedirectResponse("/messages/templates", status_code=303)
    row.name = name.strip()[:128]
    row.subject = subject.strip()[:255]
    row.body = body.strip()
    record_audit(db, "update", resource_type="message_template", resource_id=row.id, details=f"name: {row.name}", request=request)
    db.commit()
    return RedirectResponse("/messages/templates", status_code=303)


@router.post("/messages/templates/{row_id}/delete", dependencies=[Depends(require_messaging_write)])
def message_templates_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.MessageTemplate, row_id)
    if row:
        record_audit(db, "delete", resource_type="message_template", resource_id=row.id, details=f"name: {row.name}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/messages/templates", status_code=303)


@router.get("/messages/{row_id}/edit", response_class=HTMLResponse)
def messages_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.OutboundMessage, row_id)
    if not row:
        return RedirectResponse("/messages", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    tmpls = list(db.scalars(select(models.MessageTemplate).order_by(models.MessageTemplate.name)).all())
    return render(
        request,
        "snms/message_form.html",
        {
            "title": f"Wiadomość #{row.id}",
            "row": row,
            "customers": custs,
            "templates": tmpls,
            "preselect_template_id": None,
        },
    )


@router.post("/messages/{row_id}/edit", dependencies=[Depends(require_messaging_write)])
def messages_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    subject: str | None = Form(None),
    body: str | None = Form(None),
    customer_id: str | None = Form(None),
    template_id: str | None = Form(None),
    mark_sent: str | None = Form(None),
):
    row = db.get(models.OutboundMessage, row_id)
    if not row:
        return RedirectResponse("/messages", status_code=303)
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    tid = int(template_id) if template_id and str(template_id).strip().isdigit() else None
    merged = _merge_message_from_template(db, tid, subject, body)
    if merged is None:
        return RedirectResponse(f"/messages/{row_id}/edit", status_code=303)
    sub, bod = merged
    row.subject = sub
    row.body = bod
    row.customer_id = cid
    row.template_id = tid
    sent = mark_sent in ("on", "true", "1", "yes")
    if sent:
        row.status = models.MessageStatus.sent
        if row.sent_at is None:
            row.sent_at = datetime.now(timezone.utc)
    else:
        row.status = models.MessageStatus.draft
        row.sent_at = None
    record_audit(db, "update", resource_type="outbound_message", resource_id=row.id, details=f"subject: {row.subject}", request=request)
    db.commit()
    return RedirectResponse("/messages", status_code=303)


@router.post("/messages/{row_id}/delete", dependencies=[Depends(require_messaging_write)])
def messages_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.OutboundMessage, row_id)
    if row:
        record_audit(db, "delete", resource_type="outbound_message", resource_id=row.id, details=f"subject: {row.subject}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/messages", status_code=303)


# --- Timetable ---
@router.get("/timetable", response_class=HTMLResponse)
def timetable_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.CalendarEvent).order_by(models.CalendarEvent.starts_at.desc())).all()
    )
    cust = _customers_map(db)
    return render(
        request,
        "snms/timetable.html",
        {"title": "Terminarz", "rows": rows, "customers": cust},
    )


@router.get("/timetable/new", response_class=HTMLResponse)
def timetable_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(request, "snms/timetable_form.html", {"title": "Nowe wydarzenie", "row": None, "customers": custs})


@router.post("/timetable/new", dependencies=[Depends(require_business_write)])
def timetable_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    title: str = Form(...),
    description: str | None = Form(None),
    starts_at: str = Form(...),
    ends_at: str = Form(...),
    customer_id: str | None = Form(None),
    done: str | None = Form(None),
):
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    st = _parse_dt(starts_at)
    en = _parse_dt(ends_at)
    if st is None or en is None:
        return RedirectResponse("/timetable/new", status_code=303)
    ev = models.CalendarEvent(
        title=title.strip()[:255],
        description=(description or None) and description.strip() or None,
        starts_at=st,
        ends_at=en,
        customer_id=cid,
        done=done in ("on", "true", "1", "yes"),
    )
    db.add(ev)
    db.flush()
    record_audit(db, "create", resource_type="calendar_event", resource_id=ev.id, details=f"title: {ev.title}", request=request)
    db.commit()
    return RedirectResponse("/timetable", status_code=303)


@router.get("/timetable/{row_id}/edit", response_class=HTMLResponse)
def timetable_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.CalendarEvent, row_id)
    if not row:
        return RedirectResponse("/timetable", status_code=302)
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "snms/timetable_form.html",
        {"title": f"Wydarzenie: {row.title}", "row": row, "customers": custs},
    )


@router.post("/timetable/{row_id}/edit", dependencies=[Depends(require_business_write)])
def timetable_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    title: str = Form(...),
    description: str | None = Form(None),
    starts_at: str = Form(...),
    ends_at: str = Form(...),
    customer_id: str | None = Form(None),
    done: str | None = Form(None),
):
    row = db.get(models.CalendarEvent, row_id)
    if not row:
        return RedirectResponse("/timetable", status_code=303)
    cid = int(customer_id) if customer_id and str(customer_id).strip().isdigit() else None
    st = _parse_dt(starts_at)
    en = _parse_dt(ends_at)
    if st is None or en is None:
        return RedirectResponse(f"/timetable/{row_id}/edit", status_code=303)
    row.title = title.strip()[:255]
    row.description = (description or None) and description.strip() or None
    row.starts_at = st
    row.ends_at = en
    row.customer_id = cid
    row.done = done in ("on", "true", "1", "yes")
    record_audit(db, "update", resource_type="calendar_event", resource_id=row.id, details=f"title: {row.title}", request=request)
    db.commit()
    return RedirectResponse("/timetable", status_code=303)


@router.post("/timetable/{row_id}/delete", dependencies=[Depends(require_business_write)])
def timetable_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.CalendarEvent, row_id)
    if row:
        record_audit(db, "delete", resource_type="calendar_event", resource_id=row.id, details=f"title: {row.title}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/timetable", status_code=303)


def _parse_dt(raw: str) -> datetime | None:
    s = (raw or "").strip()
    if not s:
        return None
    try:
        if len(s) == 16:
            return datetime.fromisoformat(s).replace(tzinfo=timezone.utc)
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None


def _fmt_dt_local(dt: datetime) -> str:
    if dt.tzinfo:
        dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M")


# --- Traffic stats ---
@router.get("/stats", response_class=HTMLResponse)
def stats_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.TrafficStat).order_by(models.TrafficStat.period_start.desc())).all()
    )
    nodes = {n.id: n for n in db.scalars(select(models.Node)).all()}
    return render(
        request,
        "snms/stats.html",
        {"title": "Statystyki ruchu", "rows": rows, "nodes_map": nodes},
    )


@router.get("/stats/new", response_class=HTMLResponse)
def stats_new_form(request: Request, db: Session = Depends(get_db)):
    return render(
        request,
        "snms/stats_form.html",
        {"title": "Nowy wpis ruchu", "row": None, "all_nodes": _nodes_list(db)},
    )


@router.post("/stats/new", dependencies=[Depends(require_business_write)])
def stats_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    period_start: str = Form(...),
    period_end: str = Form(...),
    node_id: str | None = Form(None),
    bytes_in: str = Form("0"),
    bytes_out: str = Form("0"),
    note: str | None = Form(None),
):
    try:
        ps = date.fromisoformat(str(period_start).strip())
        pe = date.fromisoformat(str(period_end).strip())
    except ValueError:
        return RedirectResponse("/stats/new", status_code=303)
    nid = int(node_id) if node_id and str(node_id).strip().isdigit() else None
    try:
        bi = int(str(bytes_in).replace(" ", "").replace(",", ""))
        bo = int(str(bytes_out).replace(" ", "").replace(",", ""))
    except ValueError:
        bi, bo = 0, 0
    st = models.TrafficStat(
        node_id=nid,
        period_start=ps,
        period_end=pe,
        bytes_in=bi,
        bytes_out=bo,
        note=(note or None) and note.strip() or None,
    )
    db.add(st)
    db.flush()
    record_audit(db, "create", resource_type="traffic_stat", resource_id=st.id, request=request)
    db.commit()
    return RedirectResponse("/stats", status_code=303)


@router.get("/stats/{row_id}/edit", response_class=HTMLResponse)
def stats_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.TrafficStat, row_id)
    if not row:
        return RedirectResponse("/stats", status_code=302)
    return render(
        request,
        "snms/stats_form.html",
        {"title": "Edycja statystyki", "row": row, "all_nodes": _nodes_list(db)},
    )


@router.post("/stats/{row_id}/edit", dependencies=[Depends(require_business_write)])
def stats_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    period_start: str = Form(...),
    period_end: str = Form(...),
    node_id: str | None = Form(None),
    bytes_in: str = Form("0"),
    bytes_out: str = Form("0"),
    note: str | None = Form(None),
):
    row = db.get(models.TrafficStat, row_id)
    if not row:
        return RedirectResponse("/stats", status_code=303)
    try:
        row.period_start = date.fromisoformat(str(period_start).strip())
        row.period_end = date.fromisoformat(str(period_end).strip())
    except ValueError:
        return RedirectResponse(f"/stats/{row_id}/edit", status_code=303)
    row.node_id = int(node_id) if node_id and str(node_id).strip().isdigit() else None
    try:
        row.bytes_in = int(str(bytes_in).replace(" ", "").replace(",", ""))
        row.bytes_out = int(str(bytes_out).replace(" ", "").replace(",", ""))
    except ValueError:
        pass
    row.note = (note or None) and note.strip() or None
    record_audit(db, "update", resource_type="traffic_stat", resource_id=row.id, request=request)
    db.commit()
    return RedirectResponse("/stats", status_code=303)


@router.post("/stats/{row_id}/delete", dependencies=[Depends(require_business_write)])
def stats_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.TrafficStat, row_id)
    if row:
        record_audit(db, "delete", resource_type="traffic_stat", resource_id=row.id, request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/stats", status_code=303)


# --- Config (app_settings) ---
@router.get("/config", response_class=HTMLResponse)
def config_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.AppSetting).order_by(models.AppSetting.key)).all())
    return render(request, "snms/config.html", {"title": "Konfiguracja (ustawienia)", "rows": rows})


@router.get("/config/new", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def config_new_form(request: Request):
    return render(request, "snms/config_form.html", {"title": "Nowy klucz ustawień", "row": None})


@router.post("/config/new", dependencies=[Depends(require_admin_or_manager)])
def config_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    key: str = Form(...),
    value: str = Form(...),
):
    k = key.strip()[:128]
    if not k:
        return RedirectResponse("/config", status_code=303)
    if db.scalars(select(models.AppSetting).where(models.AppSetting.key == k)).first():
        return RedirectResponse("/config/new", status_code=303)
    s = models.AppSetting(key=k, value=value)
    db.add(s)
    db.flush()
    record_audit(db, "create", resource_type="app_setting", resource_id=s.id, details=f"key: {s.key}", request=request)
    db.commit()
    return RedirectResponse("/config", status_code=303)


@router.get("/config/{row_id}/edit", response_class=HTMLResponse, dependencies=[Depends(require_admin_or_manager)])
def config_edit_form(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.AppSetting, row_id)
    if not row:
        return RedirectResponse("/config", status_code=302)
    return render(request, "snms/config_form.html", {"title": f"Ustawienie: {row.key}", "row": row})


@router.post("/config/{row_id}/edit", dependencies=[Depends(require_admin_or_manager)])
def config_edit_submit(
    row_id: int,
    request: Request,
    db: Session = Depends(get_db),
    key: str = Form(...),
    value: str = Form(...),
):
    row = db.get(models.AppSetting, row_id)
    if not row:
        return RedirectResponse("/config", status_code=303)
    k = key.strip()[:128]
    other = db.scalars(
        select(models.AppSetting).where(models.AppSetting.key == k, models.AppSetting.id != row_id)
    ).first()
    if other:
        return RedirectResponse(f"/config/{row_id}/edit", status_code=303)
    row.key = k
    row.value = value
    record_audit(db, "update", resource_type="app_setting", resource_id=row.id, details=f"key: {row.key}", request=request)
    db.commit()
    return RedirectResponse("/config", status_code=303)


@router.post("/config/{row_id}/delete", dependencies=[Depends(require_admin_or_manager)])
def config_delete(row_id: int, request: Request, db: Session = Depends(get_db)):
    row = db.get(models.AppSetting, row_id)
    if row:
        record_audit(db, "delete", resource_type="app_setting", resource_id=row.id, details=f"key: {row.key}", request=request)
        db.delete(row)
        db.commit()
    return RedirectResponse("/config", status_code=303)
