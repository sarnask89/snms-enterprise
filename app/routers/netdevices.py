import csv
import io
import logging
from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render
from app.security_utils import encrypt_password

logger = logging.getLogger(__name__)

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
                models.NetDevice.serial_number.ilike(term),
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
    producers = list(db.scalars(select(models.NetDeviceProducer).order_by(models.NetDeviceProducer.name)).all())
    device_models = list(db.scalars(select(models.NetDeviceModel).order_by(models.NetDeviceModel.name)).all())
    all_devices = list(db.scalars(select(models.NetDevice).order_by(models.NetDevice.name)).all())
    
    return render(
        request,
        "netdevices/form.html",
        {
            "title": "Nowe urządzenie",
            "device": None,
            "networks": nets,
            "net_nodes": net_nodes,
            "customers": customers,
            "producers": producers,
            "models": device_models,
            "all_devices": all_devices,
        },
    )


@router.post("/new", dependencies=[Depends(require_business_write)])
def netdevice_new_submit(
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str | None = Form(None),
    serial_number: str | None = Form(None),
    mac_address: str | None = Form(None),
    management_ip: str | None = Form(None),
    management_port: str | None = Form("22502"),
    device_type: str = Form("other"),
    snmp_community: str | None = Form(None),
    login_url: str | None = Form(None),
    ip_network_id: str | None = Form(None),
    net_node_id: str | None = Form(None),
    customer_id: str | None = Form(None),
    net_device_model_id: str | None = Form(None),
    parent_device_id: str | None = Form(None),
    olt_port: str | None = Form(None),
    onu_id: str | None = Form(None),
    status: str = Form("active"),
    notes: str | None = Form(None),
    driver_type: str | None = Form(None),
    mgmt_username: str | None = Form(None),
    mgmt_password_encrypted: str | None = Form(None),
):
    nid = _opt_int(ip_network_id)
    mid = _opt_int(net_device_model_id)
    dtype = device_type.strip()[:64] or "other"
    if mid:
        m = db.get(models.NetDeviceModel, mid)
        if m and m.device_type:
            dtype = m.device_type.name[:64]

    full_ip = management_ip
    if management_ip:
        p = management_port.strip() if (management_port and management_port.strip()) else "22502"
        full_ip = f"{management_ip.strip()}:{p}"

    d = models.NetDevice(
        name=name.strip()[:128],
        hostname=(hostname or None) and hostname.strip()[:255] or None,
        serial_number=(serial_number or None) and serial_number.strip()[:128] or None,
        mac_address=(mac_address or None) and mac_address.strip()[:32] or None,
        management_ip=full_ip[:64] if full_ip else None,
        device_type=dtype,
        snmp_community=(snmp_community or None) and snmp_community.strip()[:128] or None,
        login_url=(login_url or None) and login_url.strip()[:512] or None,
        ip_network_id=nid,
        net_node_id=_opt_int(net_node_id),
        customer_id=_opt_int(customer_id),
        net_device_model_id=mid,
        parent_device_id=_opt_int(parent_device_id),
        olt_port=olt_port.strip() if olt_port else None,
        onu_id=onu_id.strip() if onu_id else None,
        status=models.NetDeviceStatus(status),
        notes=(notes or None) and notes.strip() or None,
        driver_type=driver_type,
        mgmt_username=mgmt_username,
        mgmt_password_encrypted=encrypt_password(mgmt_password_encrypted) if mgmt_password_encrypted else None,
    )
    db.add(d)
    db.commit()
    return RedirectResponse("/net-devices", status_code=303)


@router.post("/{dev_id}/sync-onus")
def sync_onus_endpoint(dev_id: int, db: Session = Depends(get_db)):
    """Trigger the ONU discovery script for this OLT."""
    import subprocess
    import sys
    try:
        subprocess.run([sys.executable, "sync_onus.py", str(dev_id)], check=True)
        return RedirectResponse(f"/net-devices/{dev_id}/edit", status_code=303)
    except Exception as e:
        logger.error(f"ONU Sync failed: {e}")
        return RedirectResponse(f"/net-devices/{dev_id}/edit?error=sync_failed", status_code=303)


@router.get("/{dev_id}/pon-port/{port_id}", response_class=HTMLResponse)
def netdevice_pon_port_view(dev_id: int, port_id: str, request: Request, db: Session = Depends(get_db)):
    """Pobiera i wyświetla listę ONU na konkretnym porcie PON wraz z parametrami na żywo (Signal, MAC, IP)."""
    olt = db.get(models.NetDevice, dev_id)
    if not olt or olt.driver_type != "dasan_nos":
        return HTMLResponse("<div class='text-red-500'>Błąd: Nieprawidłowe urządzenie OLT.</div>")

    from app.security_utils import decrypt_password
    from app.services.dasan import DasanService

    try:
        password = decrypt_password(olt.mgmt_password_encrypted)
        host = olt.management_ip
        port = int(host.split(":")[1]) if host and ":" in host else 22502
        host = host.split(":")[0] if host and ":" in host else host

        ds = DasanService(host, olt.mgmt_username, password, port=port)
        client, chan = ds._get_connection()
        ds._send_cmd(chan, "terminal length 0")
        enable_resp = ds._send_cmd(chan, "enable")
        if "Password" in enable_resp or "password" in enable_resp:
            ds._send_cmd(chan, ds.password)

        import re
        macs_out = ds._send_cmd(chan, f"show olt mac {port_id}", max_wait=5)
        onu_mac_map = {}
        for line in macs_out.splitlines():
            match = re.search(r"^\s*\d+\s*\|\s*\d+\s*\|\s*(\d+)\s*\|\s*([0-9a-fA-F:]{17})\s*\|\s*\d+\s*\|\s*(\d+)", line)
            if match:
                o_id = match.group(1)
                mac = match.group(2)
                vid = match.group(3)
                if o_id not in onu_mac_map:
                    onu_mac_map[o_id] = {'mgmt_mac': None, 'client_macs': []}
                if vid == "400":
                    onu_mac_map[o_id]['mgmt_mac'] = mac
                else:
                    onu_mac_map[o_id]['client_macs'].append(mac)

        rx_out = ds._send_cmd(chan, f"show olt rx-power {port_id}", max_wait=5)
        rx_map = {}
        for line in rx_out.splitlines():
            p_match = re.search(fr"{port_id}/(\d+)\s+(-?\d+\.\d+\s*dBm)", line)
            if p_match:
                rx_map[p_match.group(1)] = p_match.group(2)

        client.close()

        onus = db.scalars(
            select(models.NetDevice)
            .where(models.NetDevice.parent_device_id == olt.id, 
                   models.NetDevice.device_type == "onu",
                   models.NetDevice.olt_port == port_id)
            .order_by(models.NetDevice.onu_id)
        ).all()

        html = f"""
        <table class="w-full text-sm text-left mt-2">
            <thead class="bg-blue-900 text-blue-100 text-xs uppercase border-b border-blue-800">
                <tr>
                    <th class="px-3 py-2">ID ONU</th>
                    <th class="px-3 py-2">Nazwa / Serial</th>
                    <th class="px-3 py-2">Sygnał RX</th>
                    <th class="px-3 py-2">Zarządzanie (VLAN 400)</th>
                    <th class="px-3 py-2">Klienci (Inne VLAN)</th>
                    <th class="px-3 py-2">Akcje</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
        """

        if not onus:
            html += f"<tr><td colspan='6' class='px-3 py-4 text-center italic text-slate-500'>Brak zsynchronizowanych ONU na porcie {port_id}.</td></tr>"

        for onu in onus:
            rx = rx_map.get(onu.onu_id, "<span class='text-slate-400'>Brak sygnału</span>")
            mac_info = onu_mac_map.get(onu.onu_id, {'mgmt_mac': None, 'client_macs': []})
            mgmt = f"<span class='font-mono'>{mac_info['mgmt_mac']}</span>" if mac_info['mgmt_mac'] else "<span class='text-slate-400'>Brak</span>"
            clients = "<br>".join([f"<span class='font-mono text-[10px] bg-slate-100 px-1 rounded'>{m}</span>" for m in mac_info['client_macs']])
            if not clients: clients = "<span class='text-slate-400 text-[10px]'>Brak MAC</span>"

            rx_styled = rx
            if "dBm" in rx:
                try:
                    val = float(rx.replace("dBm", "").strip())
                    if val < -28.0:
                        rx_styled = f"<span class='text-red-600 font-bold'>{rx}</span>"
                    elif val > -12.0:
                        rx_styled = f"<span class='text-yellow-600 font-bold'>{rx}</span>"
                    else:
                        rx_styled = f"<span class='text-emerald-600 font-bold'>{rx}</span>"
                except:
                    pass

            html += f"""
                <tr class="hover:bg-slate-50">
                    <td class="px-3 py-2 font-bold">{onu.onu_id}</td>
                    <td class="px-3 py-2">
                        <div class="font-medium">{onu.name}</div>
                        <div class="text-[10px] text-slate-500 font-mono">{onu.serial_number}</div>
                    </td>
                    <td class="px-3 py-2">{rx_styled}</td>
                    <td class="px-3 py-2">{mgmt}</td>
                    <td class="px-3 py-2">{clients}</td>
                    <td class="px-3 py-2">
                        <a href="/net-devices/{onu.id}/edit" target="_blank" class="text-blue-500 hover:underline text-xs"><i class="fas fa-external-link-alt"></i> Zobacz</a>
                    </td>
                </tr>
            """

        html += "</tbody></table>"
        return HTMLResponse(html)

    except Exception as e:
        logger.error(f"Live PON Port Lookup Failed: {e}")
        return HTMLResponse(f"<div class='text-red-500 p-2'>Błąd pobierania danych OLT: {str(e)}</div>")


@router.get("/{dev_id}/edit", response_class=HTMLResponse)
def netdevice_edit_form(dev_id: int, request: Request, db: Session = Depends(get_db)):
    d = db.get(models.NetDevice, dev_id)
    if not d:
        return RedirectResponse("/net-devices", status_code=302)
    nets = list(db.scalars(select(models.IpNetwork).order_by(models.IpNetwork.name)).all())
    net_nodes = list(db.scalars(select(models.NetNode).order_by(models.NetNode.name)).all())
    customers = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    producers = list(db.scalars(select(models.NetDeviceProducer).order_by(models.NetDeviceProducer.name)).all())
    device_models = list(db.scalars(select(models.NetDeviceModel).order_by(models.NetDeviceModel.name)).all())
    all_devices = list(db.scalars(select(models.NetDevice).where(models.NetDevice.id != dev_id).order_by(models.NetDevice.name)).all())

    return render(
        request,
        "netdevices/form.html",
        {
            "title": f"Edycja: {d.name}",
            "device": d,
            "networks": nets,
            "net_nodes": net_nodes,
            "customers": customers,
            "producers": producers,
            "models": device_models,
            "all_devices": all_devices,
        },
    )


@router.post("/{dev_id}/edit", dependencies=[Depends(require_business_write)])
def netdevice_edit_submit(
    dev_id: int,
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str | None = Form(None),
    serial_number: str | None = Form(None),
    mac_address: str | None = Form(None),
    management_ip: str | None = Form(None),
    management_port: str | None = Form("22502"),
    device_type: str = Form("other"),
    snmp_community: str | None = Form(None),
    login_url: str | None = Form(None),
    ip_network_id: str | None = Form(None),
    net_node_id: str | None = Form(None),
    customer_id: str | None = Form(None),
    net_device_model_id: str | None = Form(None),
    parent_device_id: str | None = Form(None),
    olt_port: str | None = Form(None),
    onu_id: str | None = Form(None),
    status: str = Form("active"),
    notes: str | None = Form(None),
    driver_type: str | None = Form(None),
    mgmt_username: str | None = Form(None),
    mgmt_password_encrypted: str | None = Form(None),
):
    d = db.get(models.NetDevice, dev_id)
    if not d:
        return RedirectResponse("/net-devices", status_code=303)
    
    mid = _opt_int(net_device_model_id)
    dtype = device_type.strip()[:64] or "other"
    
    full_ip = management_ip
    if management_ip:
        p = management_port.strip() if (management_port and management_port.strip()) else "22502"
        full_ip = f"{management_ip.strip()}:{p}"

    d.name = name.strip()[:128]
    d.hostname = (hostname or None) and hostname.strip()[:255] or None
    d.serial_number = (serial_number or None) and serial_number.strip()[:128] or None
    d.mac_address = (mac_address or None) and mac_address.strip()[:32] or None
    d.management_ip = full_ip[:64] if full_ip else None
    d.device_type = dtype
    d.snmp_community = (snmp_community or None) and snmp_community.strip()[:128] or None
    d.login_url = (login_url or None) and login_url.strip()[:512] or None
    d.ip_network_id = _opt_int(ip_network_id)
    d.net_node_id = _opt_int(net_node_id)
    d.customer_id = _opt_int(customer_id)
    d.net_device_model_id = mid
    d.parent_device_id = _opt_int(parent_device_id)
    d.olt_port = olt_port.strip() if olt_port else None
    d.onu_id = onu_id.strip() if onu_id else None
    d.status = models.NetDeviceStatus(status)
    d.notes = (notes or None) and notes.strip() or None
    d.driver_type = driver_type
    d.mgmt_username = mgmt_username
    if mgmt_password_encrypted:
        d.mgmt_password_encrypted = encrypt_password(mgmt_password_encrypted)
    db.commit()
    return RedirectResponse("/net-devices", status_code=303)


@router.post("/{dev_id}/delete", dependencies=[Depends(require_business_write)])
def netdevice_delete(dev_id: int, db: Session = Depends(get_db)):
    d = db.get(models.NetDevice, dev_id)
    if d:
        db.delete(d)
        db.commit()
    return RedirectResponse("/net-devices", status_code=303)
