import asyncio
import logging
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

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/diagnostics", dependencies=[Depends(verify_session)])

@router.post("/check/{device_id}", response_class=HTMLResponse)
async def diagnostic_check(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.CustomerDevice, device_id)
    if not device or not device.net_device or not device.ip_address:
        return HTMLResponse("<div class='text-danger'>Błąd: Brak danych do diagnostyki (IP lub Router).</div>")
    
    router_device = device.net_device
    password = decrypt_password(router_device.mgmt_password_encrypted)
    mt = MikrotikService(router_device.management_ip, router_device.mgmt_username, password)
    
    # 1. ICMP Ping
    icmp_task = mt.remote_ping(device.ip_address, count=3)
    # 2. ARP Ping
    arp_task = mt.remote_arp_ping(device.ip_address, count=3)
    # 3. DHCP Lease Status
    lease_task = mt.get_lease_info(device.mac_address)
    # 4. Bridge Host Status
    bridge_task = mt.get_bridge_host_info(device.mac_address)
    
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
            html += f'<div>{device.ip_address}: {status} time={r.get("time", "N/A")} size={r.get("size", "N/A")}</div>'
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
            html += f'<div>{device.ip_address}: {status} time={r.get("time", "N/A")}</div>'
    html += '</div>'
    
    html += "</div>"
    return HTMLResponse(html)

@router.post("/olt-lookup/{device_id}", response_class=HTMLResponse)
async def diagnostic_olt_lookup(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.CustomerDevice, device_id)
    if not device or not device.mac_address:
        return HTMLResponse("<div class='text-danger text-xs p-2 bg-red-50 rounded'>Błąd: Brak adresu MAC dla tego urządzenia.</div>")

    # W nowej architekturze CustomerDevice -> NetDevice(ONU) -> NetDevice(OLT)
    if not device.net_device_id:
        return HTMLResponse(f"""
            <div class='mt-2 p-3 bg-slate-900 text-slate-300 border border-slate-700 rounded font-mono text-[10px]'>
                <div class='text-yellow-400 mb-1'>[ OLT Lookup ]</div>
                <div>Urządzenie nie zostało powiązane z żadnym ONU/OLT. 
                Uruchom skrypt synchronizacji OLT.</div>
            </div>
        """)

    onu = db.get(models.NetDevice, device.net_device_id)
    
    if not onu or onu.device_type != "onu":
        return HTMLResponse("<div class='text-danger text-xs p-2 bg-red-50 rounded'>Błąd: Urządzenie nadrzędne nie jest typu ONU.</div>")
        
    olt = onu.parent_device
    
    if not olt or olt.driver_type != "dasan_nos":
        return HTMLResponse("<div class='text-danger text-xs p-2 bg-red-50 rounded'>Błąd: Urządzenie nadrzędne (OLT) nie jest obsługiwanym OLT-em Dasan.</div>")

    from app.security_utils import decrypt_password
    from app.services.dasan import DasanService

    try:
        password = decrypt_password(olt.mgmt_password_encrypted)
        host = olt.management_ip

        port_kwarg = {}
        if host and ":" in host:
            host_part, port_str = host.split(":")
            host = host_part
            port_kwarg['port'] = int(port_str)
        else:
            port_kwarg['port'] = 22502

        ds = DasanService(host, olt.mgmt_username, password, **port_kwarg)

        # Pobierz zaawansowane detale ONU (Serial, Sygnał, Status itp) z użyciem zapisanych olt_port i onu_id
        details = ds.get_onu_details(onu.olt_port, onu.onu_id)
        
        # Pobierz MAC adresy z OLT (i poszukaj VLAN 400 managementu)
        macs = ds.get_onu_macs(onu.olt_port, onu.onu_id)

        # Wykryj IP z VLAN 400 (jesli dostepne w MAC table)
        mgmt_mac = "Brak (nie wykryto na VLAN 400)"
        for m in macs:
            if str(m.get('vid')) == "400":
                mgmt_mac = m.get('mac')

        html = f"""
        <div class="mt-2 p-3 bg-blue-950 text-blue-200 border border-blue-800 rounded font-mono text-[10px] space-y-3">
            <div class="border-b border-blue-800 pb-2 flex justify-between items-center">
                <span class="font-bold text-white uppercase text-xs">[ OLT: {olt.name} ]</span>
                <span class="bg-blue-900 px-2 py-1 rounded text-blue-300">Port OLT: <span class="text-white font-bold">{onu.olt_port}</span> | ONU ID: <span class="text-white font-bold">{onu.onu_id}</span></span>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <div class="text-blue-400 text-[9px] uppercase tracking-wide">Status Operacyjny</div>
                    <div class="text-white font-bold">{details['status']}</div>
                </div>
                <div>
                    <div class="text-blue-400 text-[9px] uppercase tracking-wide">Uptime</div>
                    <div class="text-white font-bold">{details['uptime']}</div>
                </div>
                <div>
                    <div class="text-blue-400 text-[9px] uppercase tracking-wide">Numer Seryjny</div>
                    <div class="text-white font-bold">{details['serial']}</div>
                </div>
                <div>
                    <div class="text-blue-400 text-[9px] uppercase tracking-wide">Sygnał (Rx Power)</div>
                    <div class="text-emerald-400 font-bold">{details['signal_rx']}</div>
                </div>
            </div>

            <div class="pt-2 border-t border-blue-900/50">
                <div class="text-blue-400 text-[9px] uppercase tracking-wide mb-1">Zarządzanie (VLAN 400)</div>
                <div class="text-white">MAC: {mgmt_mac}</div>
            </div>

            <div class="pt-2 border-t border-blue-900/50">
                <div class="text-blue-400 text-[9px] uppercase tracking-wide mb-1">Aktywne Adresy MAC klienta:</div>
                <div class="space-y-1">
        """

        client_macs_found = False
        if macs:
            for m in macs:
                if str(m.get('vid')) != "400": 
                    client_macs_found = True
                    is_target = " <span class='bg-emerald-900 text-emerald-300 px-1 rounded ml-2 font-bold'>TEN KLIENT</span>" if m['mac'].lower() == device.mac_address.lower() else ""
                    html += f"<div class='bg-blue-900/30 p-1 rounded'>• {m['mac']} <span class='text-blue-400 ml-2'>VLAN: {m['vid']}</span>{is_target}</div>"
        
        if not client_macs_found:
            html += "<div class='italic text-blue-500'>Brak aktywnych urządzeń klienckich na portach użytkowych (LAN).</div>"

        html += """
                </div>
            </div>
        </div>
        """
        return HTMLResponse(html)

    except Exception as e:
        logger.error(f"Live OLT Lookup Failed: {e}")
        return HTMLResponse(f"<div class='text-red-500 text-[10px] p-2'>Błąd komunikacji podczas pobierania statusu na żywo: {str(e)}</div>")

@router.post("/sync-lease/{device_id}", response_class=HTMLResponse)
async def diagnostic_sync_lease(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.CustomerDevice, device_id)
    if not device or not device.net_device:
        return HTMLResponse("<div class='text-danger'>Błąd: Brak danych urządzenia.</div>")
    
    # Znajdź aktywną subskrypcję klienta
    sub = db.scalar(
        select(models.Subscription)
        .where(models.Subscription.customer_id == device.customer_id, models.Subscription.active == True)
    )
    
    if not sub:
        return HTMLResponse("<div class='text-warning text-[10px]'>Brak aktywnej subskrypcji (prędkości).</div>")

    router_device = device.net_device
    password = decrypt_password(router_device.mgmt_password_encrypted)
    
    mt = MikrotikService(router_device.management_ip, router_device.mgmt_username, password)
    
    # Format rate-limit: Rx/Tx (Download/Upload na Mikrotiku to odwrotnie niż w CRM)
    # Zazwyczaj speed_up/speed_down
    limit = f"{sub.speed_up_mbps or 0}M/{sub.speed_down_mbps or 0}M"
    comment = f"CRM:ID:{device.customer_id} | {device.customer.last_name if device.customer else 'Unknown'}"
    
    success, result = await mt.upsert_static_lease(
        mac=device.mac_address,
        address=device.ip_address,
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
