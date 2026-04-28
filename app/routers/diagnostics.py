import asyncio
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from app import models
from app.database import get_db
from app.deps import verify_session
from app.services.mikrotik import MikrotikService
from app.services.dasan import DasanService
from app.security_utils import decrypt_password

router = APIRouter(prefix="/diagnostics", dependencies=[Depends(verify_session)])

@router.post("/check/{node_id}", response_class=HTMLResponse)
async def diagnostic_check(node_id: int, request: Request, db: Session = Depends(get_db)):
    node = db.get(models.Node, node_id)
    if not node or not node.net_device or not node.ip_address:
        return HTMLResponse("<div class='text-danger'>Błąd: Brak danych do diagnostyki (IP lub Router).</div>")
    
    device = node.net_device
    password = decrypt_password(device.mgmt_password_encrypted)
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    # 1. ICMP Ping
    icmp_task = mt.remote_ping(node.ip_address, count=3)
    # 2. ARP Ping
    arp_task = mt.remote_arp_ping(node.ip_address, count=3)
    # 3. DHCP Lease Status
    lease_task = mt.get_lease_info(node.mac_address)
    # 4. Bridge Host Status
    bridge_task = mt.get_bridge_host_info(node.mac_address)
    
    icmp_results, arp_results, lease_info, bridge_results = await asyncio.gather(
        icmp_task, arp_task, lease_task, bridge_task
    )
    
    # Render logic
    html = '<div class="bg-black text-green-500 p-3 font-mono text-[10px] rounded mt-2 space-y-3 border border-green-900/30">'
    
    # Section: Lease & Bridge (Status summary)
    html += '<div class="grid grid-cols-2 gap-2 border-b border-green-900/20 pb-2">'
    html += '<div><span class="text-white font-bold uppercase">[ DHCP Lease ]</span><br>'
    if lease_info:
        status_color = "text-green-400" if lease_info.get("status") == "bound" else "text-yellow-400"
        html += f'Status: <span class="{status_color}">{lease_info.get("status", "unknown")}</span><br>'
        html += f'Last seen: {lease_info.get("last-seen", "N/A")}'
    else:
        html += '<span class="text-red-400 italic">Brak aktywnej dzierżawy</span>'
    html += '</div>'
    
    html += '<div><span class="text-white font-bold uppercase">[ Bridge Host ]</span><br>'
    if bridge_results:
        for br in bridge_results:
            html += f'Interface: <span class="text-blue-300">{br.get("interface", "N/A")}</span><br>'
            html += f'On-Bridge: <span class="text-blue-300">{br.get("bridge", "N/A")}</span>'
    else:
        html += '<span class="text-yellow-500 italic">Nie znaleziono w tablicy bridge</span>'
    html += '</div>'
    html += '</div>'

    # Section: ICMP
    html += '<div><span class="text-white font-bold">[ ICMP PING ]</span>'
    if not icmp_results:
        html += '<div class="text-red-400">Brak odpowiedzi / Błąd połączenia</div>'
    else:
        for r in icmp_results:
            status = "UP" if r.get("sent") == r.get("received") or r.get("received", "0") != "0" else "TIMEOUT"
            html += f'<div>{node.ip_address}: {status} time={r.get("time", "N/A")} size={r.get("size", "N/A")}</div>'
    html += '</div>'

    # Section: ARP
    html += '<div><span class="text-white font-bold">[ ARP PING ]</span>'
    if not arp_results:
         html += '<div class="text-yellow-400">Brak odpowiedzi (Możliwy brak w tablicy ARP)</div>'
    elif arp_results[0].get("status") == "ARP entry not found":
         html += '<div class="text-yellow-400">Błąd: Brak wpisu w tablicy ARP (Urządzenie offline?)</div>'
    else:
        interface = arp_results[0].get("interface", "unknown")
        html += f'<div class="text-blue-300 italic mb-1">Via Interface: {interface}</div>'
        for r in arp_results:
            status = "UP" if r.get("received", "0") != "0" else "TIMEOUT"
            html += f'<div>{node.ip_address}: {status} time={r.get("time", "N/A")}</div>'
    html += '</div>'
    
    html += "</div>"
    return HTMLResponse(html)

@router.post("/olt-lookup/{node_id}", response_class=HTMLResponse)
async def diagnostic_olt_lookup(node_id: int, request: Request, db: Session = Depends(get_db)):
    node = db.get(models.Node, node_id)
    if not node or not node.mac_address:
        return HTMLResponse("<div class='text-danger'>Błąd: Brak adresu MAC.</div>")
    
    # Znajdź OLT przypisany do węzła klienta (jeśli istnieje) lub przeskanuj wszystkie
    # Dla uproszczenia: szukamy urządzenia typu dasan_nos w tym samym węźle (NetNode)
    olt = db.scalar(
        select(models.NetDevice)
        .where(models.NetDevice.driver_type == "dasan_nos", models.NetDevice.net_node_id == node.net_device.net_node_id)
    )
    
    if not olt:
        return HTMLResponse("<div class='text-warning text-xs italic'>Nie znaleziono OLT DASAN w tym węźle.</div>")

    password = decrypt_password(olt.mgmt_password_encrypted)
    ds = DasanService(olt.management_ip, olt.mgmt_username, password)
    path = ds.get_onu_path(node.mac_address)
    
    if "error" in path:
        return HTMLResponse(f"<div class='text-muted text-[10px] italic'>{path['error']}</div>")
    
    html = f"""
    <div class="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
        <strong>Lokalizacja GPON:</strong> Port {path['port']}, ONU ID: {path['onu_id']}, Status: {path['status']}
    </div>
    """
    return HTMLResponse(html)

@router.post("/sync-lease/{node_id}", response_class=HTMLResponse)
async def diagnostic_sync_lease(node_id: int, request: Request, db: Session = Depends(get_db)):
    node = db.get(models.Node, node_id)
    if not node or not node.net_device:
        return HTMLResponse("<div class='text-danger'>Błąd: Brak danych urządzenia.</div>")
    
    # Znajdź aktywną subskrypcję klienta
    sub = db.scalar(
        select(models.Subscription)
        .where(models.Subscription.customer_id == node.customer_id, models.Subscription.active == True)
    )
    
    if not sub:
        return HTMLResponse("<div class='text-warning text-[10px]'>Brak aktywnej subskrypcji (prędkości).</div>")

    device = node.net_device
    password = decrypt_password(device.mgmt_password_encrypted)
    
    mt = MikrotikService(device.management_ip, device.mgmt_username, password)
    
    # Format rate-limit: Rx/Tx (Download/Upload na Mikrotiku to odwrotnie niż w CRM)
    # Zazwyczaj speed_up/speed_down
    limit = f"{sub.speed_up_mbps or 0}M/{sub.speed_down_mbps or 0}M"
    comment = f"CRM:ID:{node.customer_id} | {node.customer.last_name}"
    
    success, result = await mt.upsert_static_lease(
        mac=node.mac_address,
        address=node.ip_address,
        comment=comment,
        rate_limit=limit
    )
    
    if success:
        return HTMLResponse(f"""
            <div class='mt-2 p-2 bg-green-50 text-green-700 rounded text-[10px]'>
                <i class='fas fa-check mr-1'></i> Zsynchronizowano: {limit}
            </div>
        """)
    else:
        return HTMLResponse(f"<div class='mt-2 p-2 bg-red-50 text-red-700 rounded text-[10px]'>Błąd: {result}</div>")
