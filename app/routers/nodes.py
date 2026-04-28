import csv
import html
import io
from datetime import date, datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.ip_pool import free_ipv4_suggestions, validate_node_ip_assignment
from app.templating import render

router = APIRouter(prefix="/customer-devices", dependencies=[Depends(verify_session)])


def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None


def _sticky_int(sticky: dict[str, Any] | None, key: str) -> int | None:
    if not sticky or key not in sticky:
        return None
    return _opt_int(str(sticky[key]))


def _render_node_form(
    request: Request,
    db: Session,
    *,
    node: models.Node | None = None,
    sticky: dict[str, Any] | None = None,
    ip_error: str | None = None,
    status_code: int | None = None,
):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    devs = list(db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all())
    nets = list(db.scalars(select(models.IpNetwork).order_by(models.IpNetwork.name)).all())
    net_id = _sticky_int(sticky, "ip_network_id") if sticky else None
    if net_id is None and node and node.ip_network_id:
        net_id = node.ip_network_id
    exclude = node.id if node else None
    ip_suggestions: list[str] = []
    if net_id:
        ip_suggestions = free_ipv4_suggestions(db, net_id, exclude_node_id=exclude)
    title = (
        f"Edycja komputera: {node.hostname}"
        if node
        else "Nowy komputer / urządzenie klienta"
    )
    
    # Pobierz aktywną subskrypcję dla tego węzła
    active_sub = None
    if node:
        active_sub = db.scalar(
            select(models.Subscription)
            .where(models.Subscription.node_id == node.id, models.Subscription.active == True)
        )

    return render(
        request,
        "nodes/form.html",
        {
            "title": title,
            "node": node,
            "customers": custs,
            "net_devices": devs,
            "ip_networks": nets,
            "ip_suggestions": ip_suggestions,
            "sticky": sticky,
            "ip_error": ip_error,
            "active_sub": active_sub,
        },
        status_code=status_code,
    )


@router.get("/partials/ip-suggestions", response_class=HTMLResponse)
def node_ip_suggestions_partial(
    db: Session = Depends(get_db),
    ip_network_id: str | None = Query(None),
    node_id: str | None = Query(None),
):
    nid = _opt_int(ip_network_id)
    ex = _opt_int(node_id)
    if not nid:
        return HTMLResponse('<datalist id="node-ip-suggestions"></datalist>')
    ips = free_ipv4_suggestions(db, nid, exclude_node_id=ex)
    opts = "".join(f'<option value="{html.escape(ip)}">' for ip in ips)
    return HTMLResponse(f'<datalist id="node-ip-suggestions">{opts}</datalist>')


@router.get("/search", response_class=HTMLResponse)
def node_search_form(request: Request):
    return render(
        request,
        "nodes/search.html",
        {"title": "Szukaj komputerów (urządzeń klientów)"},
    )


@router.get("/add", dependencies=[Depends(verify_session)])
def node_add_alias():
    """Alias `/nodes/add` — ten sam formularz co /customer-devices/new."""
    return RedirectResponse("/customer-devices/new", status_code=303)


@router.get("/reports", response_class=HTMLResponse)
def node_reports(request: Request, db: Session = Depends(get_db)):
    """Raport zbiorczy — widok do druku i eksportu."""
    rows = list(db.scalars(select(models.Node).order_by(models.Node.hostname)).all())
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    return render(
        request,
        "nodes/reports.html",
        {
            "title": "Raporty — komputery / urządzenia klientów",
            "nodes": rows,
            "customers": customers,
        },
    )


@router.get("/reports.csv")
def node_reports_csv(db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.Node).order_by(models.Node.hostname)).all())
    cust = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["id", "hostname", "klient_kod", "ip", "mac", "status"])
    for n in rows:
        c = cust.get(n.customer_id)
        w.writerow(
            [
                n.id,
                n.hostname,
                c.customer_code if c else n.customer_id,
                n.ip_address or "",
                n.mac_address or "",
                n.status.value,
            ]
        )
    data = buf.getvalue()
    return StreamingResponse(
        iter([data]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="wezly.csv"'},
    )


@router.get("/print", dependencies=[Depends(verify_session)])
def node_print_alias():
    """Alias `/nodes/print` — przekierowanie do raportu (druk / lista)."""
    return RedirectResponse("/customer-devices/reports", status_code=303)


@router.get("", response_class=HTMLResponse)
def node_list(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="hostname, IP, MAC lub kod klienta"),
):
    stmt = select(models.Node).order_by(models.Node.id)
    if q and q.strip():
        term = f"%{q.strip()}%"
        cust_ids = [
            r[0]
            for r in db.execute(
                select(models.Customer.id).where(models.Customer.customer_code.ilike(term))
            ).all()
        ]
        parts = [
            models.Node.hostname.ilike(term),
            models.Node.ip_address.ilike(term),
            models.Node.mac_address.ilike(term),
        ]
        if cust_ids:
            parts.append(models.Node.customer_id.in_(cust_ids))
        stmt = stmt.where(or_(*parts))
    rows = list(db.scalars(stmt).all())
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    
    # Pobierz aktywne subskrypcje dla wyświetlanych węzłów
    node_ids = [n.id for n in rows]
    subs = {}
    if node_ids:
        active_subs = db.scalars(
            select(models.Subscription)
            .where(models.Subscription.node_id.in_(node_ids), models.Subscription.active == True)
        ).all()
        subs = {s.node_id: s for s in active_subs}

    return render(
        request,
        "nodes/list.html",
        {
            "title": "Komputery / urządzenia klientów",
            "nodes": rows,
            "customers": customers,
            "subscriptions": subs,
            "search_q": q or "",
        },
    )


@router.get("/sessions", response_class=HTMLResponse)
def node_sessions_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(
            select(models.NodeSession).order_by(models.NodeSession.started_at.desc())
        ).all()
    )
    nodes = {n.id: n for n in db.scalars(select(models.Node)).all()}
    all_nodes = list(db.scalars(select(models.Node).order_by(models.Node.hostname)).all())
    return render(
        request,
        "nodes/sessions.html",
        {
            "title": "Sesje — komputery / urządzenia klientów",
            "sessions": rows,
            "nodes_map": nodes,
            "all_nodes": all_nodes,
        },
    )


@router.post("/sessions/new", dependencies=[Depends(require_business_write)])
def node_session_new(
    db: Session = Depends(get_db),
    node_id: int = Form(...),
    started_at: str | None = Form(None),
    ended_at: str | None = Form(None),
    ip_address: str | None = Form(None),
    source: str = Form("manual"),
    notes: str | None = Form(None),
):
    st = (
        datetime.fromisoformat(started_at.replace("Z", "+00:00"))
        if started_at and str(started_at).strip()
        else datetime.now(timezone.utc)
    )
    en: datetime | None = None
    if ended_at and str(ended_at).strip():
        try:
            en = datetime.fromisoformat(ended_at.replace("Z", "+00:00"))
        except ValueError:
            en = None
    db.add(
        models.NodeSession(
            node_id=node_id,
            started_at=st,
            ended_at=en,
            ip_address=(ip_address or None) and ip_address.strip() or None,
            source=(source or "manual").strip()[:32] or "manual",
            notes=(notes or None) and notes.strip() or None,
        )
    )
    db.commit()
    return RedirectResponse("/customer-devices/sessions", status_code=303)


@router.post("/sessions/{session_id}/delete", dependencies=[Depends(require_business_write)])
def node_session_delete(session_id: int, db: Session = Depends(get_db)):
    s = db.get(models.NodeSession, session_id)
    if s:
        db.delete(s)
        db.commit()
    return RedirectResponse("/customer-devices/sessions", status_code=303)


@router.get("/notices", response_class=HTMLResponse)
def node_notices_list(request: Request, db: Session = Depends(get_db)):
    rows = list(
        db.scalars(select(models.NodeNotice).order_by(models.NodeNotice.created_at.desc())).all()
    )
    nodes = {n.id: n for n in db.scalars(select(models.Node)).all()}
    all_nodes = list(db.scalars(select(models.Node).order_by(models.Node.hostname)).all())
    return render(
        request,
        "nodes/notices.html",
        {
            "title": "Powiadomienia — komputery",
            "notices": rows,
            "nodes_map": nodes,
            "all_nodes": all_nodes,
        },
    )


@router.post("/notices/new", dependencies=[Depends(require_business_write)])
def node_notice_new(
    db: Session = Depends(get_db),
    node_id: int = Form(...),
    title: str = Form(...),
    body: str | None = Form(None),
    valid_until: str | None = Form(None),
    is_active: str | None = Form(None),
):
    vu: date | None = None
    if valid_until and str(valid_until).strip():
        try:
            vu = date.fromisoformat(str(valid_until).strip())
        except ValueError:
            vu = None
    db.add(
        models.NodeNotice(
            node_id=node_id,
            title=title.strip()[:255],
            body=(body or None) and body.strip() or None,
            valid_until=vu,
            is_active=is_active in ("on", "true", "1", "yes"),
        )
    )
    db.commit()
    return RedirectResponse("/customer-devices/notices", status_code=303)


@router.post("/notices/{notice_id}/delete", dependencies=[Depends(require_business_write)])
def node_notice_delete(notice_id: int, db: Session = Depends(get_db)):
    n = db.get(models.NodeNotice, notice_id)
    if n:
        db.delete(n)
        db.commit()
    return RedirectResponse("/customer-devices/notices", status_code=303)


@router.get("/new", response_class=HTMLResponse)
def node_new_form(
    request: Request, 
    db: Session = Depends(get_db),
    customer_id: int | None = Query(None),
    mac_address: str | None = Query(None),
    ip_address: str | None = Query(None),
    net_device_id: int | None = Query(None),
):
    sticky = None
    if customer_id or mac_address or ip_address or net_device_id:
        sticky = {
            "customer_id": customer_id,
            "mac_address": mac_address or "",
            "ip_address": ip_address or "",
            "net_device_id": net_device_id or "",
            "name": f"node-{mac_address.replace(':', '')[-4:]}" if mac_address else ""
        }
    return _render_node_form(request, db, node=None, sticky=sticky)


@router.post("/new", dependencies=[Depends(require_business_write)])
def node_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    customer_id: int = Form(...),
    name: str = Form(...),
    login: str | None = Form(None),
    passwd: str | None = Form(None),
    ip_address: str | None = Form(None),
    mac_address: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
    net_device_id: str | None = Form(None),
    ip_network_id: str | None = Form(None),
):
    net_id = _opt_int(ip_network_id)
    # Using name as hostname for non-nullable field
    hostname = name.strip()
    status = "active" if active in ("on", "true", "1", "yes") else "inactive"
    
    ok, err = validate_node_ip_assignment(db, net_id, ip_address, exclude_node_id=None)
    if not ok:
        sticky = {
            "customer_id": customer_id,
            "name": name,
            "login": login or "",
            "ip_address": ip_address or "",
            "mac_address": mac_address or "",
            "ip_network_id": ip_network_id or "",
            "net_device_id": net_device_id or "",
            "active": active,
            "notes": notes or "",
        }
        return _render_node_form(
            request, db, node=None, sticky=sticky, ip_error=err, status_code=400
        )
    n = models.Node(
        customer_id=customer_id,
        name=name.strip(),
        hostname=hostname,
        login=(login or None) and login.strip() or None,
        passwd=(passwd or None) and passwd.strip() or None,
        ip_address=(ip_address or None) and ip_address.strip() or None,
        mac_address=(mac_address or None) and mac_address.strip() or None,
        status=models.NodeStatus(status),
        notes=(notes or None) and notes.strip() or None,
        net_device_id=_opt_int(net_device_id),
        ip_network_id=net_id,
    )
    db.add(n)
    db.commit()
    return RedirectResponse("/customer-devices", status_code=303)


@router.get("/{node_id}/edit", response_class=HTMLResponse)
def node_edit_form(node_id: int, request: Request, db: Session = Depends(get_db)):
    n = db.get(models.Node, node_id)
    if not n:
        return RedirectResponse("/customer-devices", status_code=302)
    return _render_node_form(request, db, node=n)


@router.post("/{node_id}/edit", dependencies=[Depends(require_business_write)])
def node_edit_submit(
    request: Request,
    node_id: int,
    db: Session = Depends(get_db),
    customer_id: int = Form(...),
    name: str = Form(...),
    login: str | None = Form(None),
    passwd: str | None = Form(None),
    ip_address: str | None = Form(None),
    mac_address: str | None = Form(None),
    active: str | None = Form(None),
    notes: str | None = Form(None),
    net_device_id: str | None = Form(None),
    ip_network_id: str | None = Form(None),
):
    n = db.get(models.Node, node_id)
    if not n:
        return RedirectResponse("/customer-devices", status_code=303)
    net_id = _opt_int(ip_network_id)
    status = "active" if active in ("on", "true", "1", "yes") else "inactive"
    
    ok, err = validate_node_ip_assignment(
        db, net_id, ip_address, exclude_node_id=node_id
    )
    if not ok:
        sticky = {
            "customer_id": customer_id,
            "name": name,
            "login": login or "",
            "ip_address": ip_address or "",
            "mac_address": mac_address or "",
            "ip_network_id": ip_network_id or "",
            "net_device_id": net_device_id or "",
            "active": active,
            "notes": notes or "",
        }
        return _render_node_form(
            request, db, node=n, sticky=sticky, ip_error=err, status_code=400
        )
    n.customer_id = customer_id
    n.name = name.strip()
    n.hostname = name.strip()
    n.login = (login or None) and login.strip() or None
    n.passwd = (passwd or None) and passwd.strip() or None
    n.ip_address = (ip_address or None) and ip_address.strip() or None
    n.mac_address = (mac_address or None) and mac_address.strip() or None
    n.status = models.NodeStatus(status)
    n.notes = (notes or None) and notes.strip() or None
    n.net_device_id = _opt_int(net_device_id)
    n.ip_network_id = net_id
    db.commit()
    return RedirectResponse("/customer-devices", status_code=303)


@router.post("/{node_id}/delete", dependencies=[Depends(require_business_write)])
def node_delete(node_id: int, db: Session = Depends(get_db)):
    n = db.get(models.Node, node_id)
    if n:
        db.delete(n)
        db.commit()
    return RedirectResponse("/customer-devices", status_code=303)
