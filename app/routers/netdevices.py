import csv
import io

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render

router = APIRouter(prefix="/net-devices", dependencies=[Depends(verify_session)])


def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None


@router.get("", response_class=HTMLResponse)
def netdevice_list(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="nazwa, hostname, IP, typ"),
):
    stmt = select(models.NetDevice).order_by(models.NetDevice.name)
    search_q = (q or "").strip()
    if search_q:
        term = f"%{search_q}%"
        stmt = stmt.where(
            or_(
                models.NetDevice.name.ilike(term),
                models.NetDevice.hostname.ilike(term),
                models.NetDevice.management_ip.ilike(term),
                models.NetDevice.device_type.ilike(term),
            )
        )
    rows = list(db.scalars(stmt).all())
    nets = {n.id: n for n in db.scalars(select(models.IpNetwork)).all()}
    net_nodes = {n.id: n for n in db.scalars(select(models.NetNode)).all()}
    return render(
        request,
        "netdevices/list.html",
        {
            "title": "Urządzenia sieciowe",
            "devices": rows,
            "networks": nets,
            "net_nodes": net_nodes,
            "search_q": search_q,
        },
    )


@router.get("/search", response_class=HTMLResponse)
def netdevice_search_form(request: Request):
    """Formularz wyszukiwania — wyniki na liście z parametrem q."""
    return render(request, "netdevices/search.html", {"title": "Szukaj osprzętu"})


@router.get("/add", dependencies=[Depends(verify_session)])
def netdevice_add_alias():
    """Alias `/net-devices/add` — formularz dodawania."""
    return RedirectResponse("/net-devices/new", status_code=303)


@router.get("/reports", response_class=HTMLResponse)
def netdevice_reports(request: Request, db: Session = Depends(get_db)):
    """Raport zbiorczy osprzętu (druk / eksport)."""
    rows = list(db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all())
    nets = {n.id: n for n in db.scalars(select(models.IpNetwork)).all()}
    return render(
        request,
        "netdevices/reports.html",
        {"title": "Raporty — osprzęt sieciowy", "devices": rows, "networks": nets},
    )


@router.get("/reports.csv")
def netdevice_reports_csv(db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all())
    nets = {n.id: n for n in db.scalars(select(models.IpNetwork)).all()}
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["id", "nazwa", "hostname", "ip_zarzadzania", "typ", "siec_ip", "status"])
    for d in rows:
        net = nets.get(d.ip_network_id)
        w.writerow(
            [
                d.id,
                d.name,
                d.hostname or "",
                d.management_ip or "",
                d.device_type,
                net.name if net else "",
                d.status.value,
            ]
        )
    data = buf.getvalue()
    return StreamingResponse(
        iter([data]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="osprzet.csv"'},
    )


@router.get("/print", dependencies=[Depends(verify_session)])
def netdevice_print_alias():
    """Alias `/net-devices/print` — przekierowanie do raportu."""
    return RedirectResponse("/net-devices/reports", status_code=303)


@router.get("/new", response_class=HTMLResponse)
def netdevice_new_form(request: Request, db: Session = Depends(get_db)):
    nets = list(db.scalars(select(models.IpNetwork).order_by(models.IpNetwork.name)).all())
    net_nodes = list(db.scalars(select(models.NetNode).order_by(models.NetNode.name)).all())
    customers = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "netdevices/form.html",
        {
            "title": "Nowe urządzenie",
            "device": None,
            "networks": nets,
            "net_nodes": net_nodes,
            "customers": customers,
        },
    )


@router.post("/new", dependencies=[Depends(require_business_write)])
def netdevice_new_submit(
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str | None = Form(None),
    management_ip: str | None = Form(None),
    device_type: str = Form("other"),
    snmp_community: str | None = Form(None),
    login_url: str | None = Form(None),
    ip_network_id: str | None = Form(None),
    net_node_id: str | None = Form(None),
    customer_id: str | None = Form(None),
    net_device_model_id: str | None = Form(None),
    status: str = Form("active"),
    notes: str | None = Form(None),
):
    nid = _opt_int(ip_network_id)
    mid = _opt_int(net_device_model_id)
    dtype = device_type.strip()[:64] or "other"
    if mid:
        m = db.get(models.NetDeviceModel, mid)
        if m and m.device_type:
            dtype = m.device_type.name[:64]

    d = models.NetDevice(
        name=name.strip()[:128],
        hostname=(hostname or None) and hostname.strip()[:255] or None,
        management_ip=(management_ip or None) and management_ip.strip()[:64] or None,
        device_type=dtype,
        snmp_community=(snmp_community or None) and snmp_community.strip()[:128] or None,
        login_url=(login_url or None) and login_url.strip()[:512] or None,
        ip_network_id=nid,
        net_node_id=_opt_int(net_node_id),
        customer_id=_opt_int(customer_id),
        net_device_model_id=mid,
        status=models.NetDeviceStatus(status),
        notes=(notes or None) and notes.strip() or None,
    )
    db.add(d)
    db.commit()
    return RedirectResponse("/net-devices", status_code=303)


@router.get("/{dev_id}/edit", response_class=HTMLResponse)
def netdevice_edit_form(dev_id: int, request: Request, db: Session = Depends(get_db)):
    d = db.get(models.NetDevice, dev_id)
    if not d:
        return RedirectResponse("/net-devices", status_code=302)
    nets = list(db.scalars(select(models.IpNetwork).order_by(models.IpNetwork.name)).all())
    net_nodes = list(db.scalars(select(models.NetNode).order_by(models.NetNode.name)).all())
    customers = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    return render(
        request,
        "netdevices/form.html",
        {
            "title": f"Edycja: {d.name}",
            "device": d,
            "networks": nets,
            "net_nodes": net_nodes,
            "customers": customers,
        },
    )


@router.post("/{dev_id}/edit", dependencies=[Depends(require_business_write)])
def netdevice_edit_submit(
    dev_id: int,
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str | None = Form(None),
    management_ip: str | None = Form(None),
    device_type: str = Form("other"),
    snmp_community: str | None = Form(None),
    login_url: str | None = Form(None),
    ip_network_id: str | None = Form(None),
    net_node_id: str | None = Form(None),
    customer_id: str | None = Form(None),
    net_device_model_id: str | None = Form(None),
    status: str = Form("active"),
    notes: str | None = Form(None),
):
    d = db.get(models.NetDevice, dev_id)
    if not d:
        return RedirectResponse("/net-devices", status_code=303)
    mid = _opt_int(net_device_model_id)
    dtype = device_type.strip()[:64] or "other"
    if mid:
        m = db.get(models.NetDeviceModel, mid)
        if m and m.device_type:
            dtype = m.device_type.name[:64]
    d.name = name.strip()[:128]
    d.hostname = (hostname or None) and hostname.strip()[:255] or None
    d.management_ip = (management_ip or None) and management_ip.strip()[:64] or None
    d.device_type = dtype
    d.snmp_community = (snmp_community or None) and snmp_community.strip()[:128] or None
    d.login_url = (login_url or None) and login_url.strip()[:512] or None
    d.ip_network_id = _opt_int(ip_network_id)
    d.net_node_id = _opt_int(net_node_id)
    d.customer_id = _opt_int(customer_id)
    d.net_device_model_id = mid
    d.status = models.NetDeviceStatus(status)
    d.notes = (notes or None) and notes.strip() or None
    db.commit()
    return RedirectResponse("/net-devices", status_code=303)


@router.post("/{dev_id}/delete", dependencies=[Depends(require_business_write)])
def netdevice_delete(dev_id: int, db: Session = Depends(get_db)):
    d = db.get(models.NetDevice, dev_id)
    if d:
        db.delete(d)
        db.commit()
    return RedirectResponse("/net-devices", status_code=303)
