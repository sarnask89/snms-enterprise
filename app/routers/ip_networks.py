import ipaddress
from typing import Any

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render

router = APIRouter(prefix="/ip-networks", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def ip_network_list(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="nazwa, CIDR, brama, opis, VLAN"),
):
    stmt = select(models.IpNetwork).order_by(models.IpNetwork.id)
    search_q = (q or "").strip()
    if search_q:
        term = f"%{search_q}%"
        parts = [
            models.IpNetwork.name.ilike(term),
            models.IpNetwork.cidr.ilike(term),
            models.IpNetwork.gateway.ilike(term),
            models.IpNetwork.description.ilike(term),
        ]
        if search_q.isdigit():
            parts.append(models.IpNetwork.vlan_id == int(search_q))
        stmt = stmt.where(or_(*parts))
    rows = list(db.scalars(stmt).all())
    n_dev: dict[int, int] = {}
    cnt_q = (
        select(models.NetDevice.ip_network_id, func.count(models.NetDevice.id))
        .where(models.NetDevice.ip_network_id.isnot(None))
        .group_by(models.NetDevice.ip_network_id)
    )
    for nid, cnt in db.execute(cnt_q).all():
        if nid is not None:
            n_dev[int(nid)] = int(cnt)
    return render(
        request,
        "ip_networks/list.html",
        {
            "title": "Sieci IP",
            "networks": rows,
            "device_counts": n_dev,
            "search_q": search_q,
        },
    )


@router.get("/search", response_class=HTMLResponse)
def ip_network_search_form(request: Request):
    """Wyszukiwanie sieci — wyniki na liście z parametrem q."""
    return render(request, "ip_networks/search.html", {"title": "Szukaj sieci IP"})


@router.get("/add", dependencies=[Depends(verify_session)])
def ip_network_add_alias():
    """Alias `/ip-networks/add` — formularz dodawania sieci."""
    return RedirectResponse("/ip-networks/new", status_code=303)


@router.get("/usage", response_class=HTMLResponse)
def ip_network_usage(request: Request, db: Session = Depends(get_db)):
    networks = list(db.scalars(select(models.IpNetwork).order_by(models.IpNetwork.id)).all())
    nodes = list(
        db.scalars(
            select(models.Node).where(
                models.Node.ip_address.isnot(None),
                models.Node.ip_address != "",
            )
        ).all()
    )
    q_dev = (
        select(models.NetDevice.ip_network_id, func.count(models.NetDevice.id))
        .where(models.NetDevice.ip_network_id.isnot(None))
        .group_by(models.NetDevice.ip_network_id)
    )
    n_dev: dict[int, int] = {}
    for nid, cnt in db.execute(q_dev).all():
        if nid is not None:
            n_dev[int(nid)] = int(cnt)
    usage_rows: list[dict[str, Any]] = []
    for net in networks:
        row: dict[str, Any] = {"network": net, "cidr_error": None, "nodes_in_net": 0, "devices": n_dev.get(net.id, 0)}
        try:
            ip_net = ipaddress.ip_network(net.cidr.strip(), strict=False)
        except ValueError:
            row["cidr_error"] = "niepoprawny CIDR"
            usage_rows.append(row)
            continue
        hits = 0
        for node in nodes:
            if node.ip_network_id == net.id:
                hits += 1
                continue
            raw = (node.ip_address or "").strip().split("/")[0].strip()
            if not raw:
                continue
            try:
                ip = ipaddress.ip_address(raw)
                if ip in ip_net:
                    hits += 1
            except ValueError:
                continue
        row["nodes_in_net"] = hits
        usage_rows.append(row)
    return render(
        request,
        "ip_networks/usage.html",
        {"title": "Wykorzystanie sieci IP", "usage_rows": usage_rows},
    )


@router.get("/new", response_class=HTMLResponse)
def ip_network_new_form(request: Request, db: Session = Depends(get_db)):
    hosts = list(db.scalars(select(models.NetworkHost).order_by(models.NetworkHost.name)).all())
    return render(
        request,
        "ip_networks/form.html",
        {"title": "Nowa sieć IP", "network": None, "network_hosts": hosts},
    )


def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None


@router.post("/new", dependencies=[Depends(require_business_write)])
def ip_network_new_submit(
    db: Session = Depends(get_db),
    name: str = Form(...),
    cidr: str = Form(...),
    gateway: str | None = Form(None),
    vlan_id: str | None = Form(None),
    description: str | None = Form(None),
    active: str | None = Form(None),
    network_host_id: str | None = Form(None),
):
    vid = None
    if vlan_id and str(vlan_id).strip().isdigit():
        vid = int(str(vlan_id).strip())
    n = models.IpNetwork(
        name=name.strip()[:128],
        cidr=cidr.strip()[:64],
        gateway=(gateway or None) and gateway.strip()[:64] or None,
        vlan_id=vid,
        description=(description or None) and description.strip() or None,
        active=active in ("on", "true", "1", "yes"),
        network_host_id=_opt_int(network_host_id),
    )
    db.add(n)
    db.commit()
    return RedirectResponse("/ip-networks", status_code=303)


@router.get("/{net_id}/edit", response_class=HTMLResponse)
def ip_network_edit_form(net_id: int, request: Request, db: Session = Depends(get_db)):
    n = db.get(models.IpNetwork, net_id)
    if not n:
        return RedirectResponse("/ip-networks", status_code=302)
    hosts = list(db.scalars(select(models.NetworkHost).order_by(models.NetworkHost.name)).all())
    return render(
        request,
        "ip_networks/form.html",
        {"title": f"Edycja: {n.name}", "network": n, "network_hosts": hosts},
    )


@router.post("/{net_id}/edit", dependencies=[Depends(require_business_write)])
def ip_network_edit_submit(
    net_id: int,
    db: Session = Depends(get_db),
    name: str = Form(...),
    cidr: str = Form(...),
    gateway: str | None = Form(None),
    vlan_id: str | None = Form(None),
    description: str | None = Form(None),
    active: str | None = Form(None),
    network_host_id: str | None = Form(None),
):
    n = db.get(models.IpNetwork, net_id)
    if not n:
        return RedirectResponse("/ip-networks", status_code=303)
    n.name = name.strip()[:128]
    n.cidr = cidr.strip()[:64]
    n.gateway = (gateway or None) and gateway.strip()[:64] or None
    n.vlan_id = (
        int(str(vlan_id).strip())
        if vlan_id and str(vlan_id).strip().isdigit()
        else None
    )
    n.description = (description or None) and description.strip() or None
    n.active = active in ("on", "true", "1", "yes")
    n.network_host_id = _opt_int(network_host_id)
    db.commit()
    return RedirectResponse("/ip-networks", status_code=303)


@router.post("/{net_id}/delete", dependencies=[Depends(require_business_write)])
def ip_network_delete(net_id: int, db: Session = Depends(get_db)):
    n = db.get(models.IpNetwork, net_id)
    if n:
        for d in list(n.devices):
            d.ip_network_id = None
        for node in list(n.nodes):
            node.ip_network_id = None
        db.delete(n)
        db.commit()
    return RedirectResponse("/ip-networks", status_code=303)
