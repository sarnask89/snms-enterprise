import asyncio
from decimal import Decimal
from fastapi import APIRouter, Depends, Request, Form
from datetime import datetime
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from app import models
from app.database import get_db
from app.deps import verify_session, require_business_write
from app.templating import render
from app.services.mikrotik_discovery import get_discoverable_leases, get_discoverable_networks
from app.audit import record_audit
from app.utils.string_utils import generate_login, generate_password

from app.services.gemini import gemini

router = APIRouter(prefix="/admin/discovery", dependencies=[Depends(verify_session)])

@router.post("/webhook/gemini", dependencies=[]) # Publiczny endpoint dla Google Cloud
async def gemini_webhook(request: Request):
    payload = await request.json()
    logger.info(f"Otrzymano powiadomienie z Gemini: {payload}")
    # Tutaj logika przetwarzania wyniku (np. zapis do bazy, wysłanie maila)
    return {"status": "ok"}

@router.get("", response_class=HTMLResponse)
async def discovery_index(request: Request, db: Session = Depends(get_db)):
    # Pobierz listę urządzeń obsługujących mikrotik_v7
    routers = db.scalars(select(models.NetDevice).where(models.NetDevice.driver_type == "mikrotik_v7")).all()
    return render(request, "admin/discovery_list.html", {"routers": routers})

@router.get("/{device_id}", response_class=HTMLResponse)
async def discovery_results(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.NetDevice, device_id)
    if not device:
        return RedirectResponse("/admin/discovery", status_code=303)
    
    # Sprawdź czy urządzenie ma przypisane jakiekolwiek sieci w CRM
    net_count = db.scalar(
        select(models.IpNetwork.id)
        .where(models.IpNetwork.net_device_id == device_id, models.IpNetwork.active == True)
        .limit(1)
    )
    has_networks = net_count is not None
    
    discovered = await get_discoverable_leases(db, device)
    discovered_nets = await get_discoverable_networks(db, device)
    
    return render(request, "admin/discovery_results.html", {
        "device": device,
        "discovered": discovered,
        "discovered_nets": discovered_nets,
        "has_networks": has_networks
    })

def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None

import ipaddress

def _get_net_cache(db: Session):
    all_networks = db.scalars(select(models.IpNetwork).where(models.IpNetwork.active == True)).all()
    net_cache = []
    for n in all_networks:
        try:
            net_cache.append((ipaddress.ip_network(n.cidr, strict=False), n.id, n.net_device_id))
        except ValueError:
            pass
    return net_cache

def _find_ip_network(ip_str: str, device_id: int, net_cache: list) -> int | None:
    if not ip_str:
        return None
    try:
        ip = ipaddress.ip_address(ip_str)
        # Priority 1: Match network assigned to this device
        for net, nid, did in net_cache:
            if did == device_id and ip in net:
                return nid
        # Priority 2: Match any other network
        for net, nid, did in net_cache:
            if ip in net:
                return nid
    except ValueError:
        pass
    return None

def _parse_rate_limit(rl: str | None) -> tuple[int | None, int | None]:
    """Parsuje format Mikrotik 'rx/tx' (upload/download) na (up_mbps, down_mbps)."""
    if not rl or "/" not in rl:
        return None, None
    
    try:
        def to_mbps(val: str) -> int:
            val = val.lower().strip()
            if 'm' in val:
                return int(float(val.replace('m', '')))
            if 'k' in val:
                return int(float(val.replace('k', '')) / 1024)
            return int(int(val) / (1024 * 1024))

        rx, tx = rl.split('/')
        return to_mbps(rx), to_mbps(tx)
    except Exception:
        return None, None

@router.post("/import", dependencies=[Depends(require_business_write)])
async def import_lease(
    request: Request,
    db: Session = Depends(get_db),
    mac: str = Form(...),
    ip: str = Form(...),
    rate_limit: str | None = Form(None),
    customer_id: str | None = Form(None),
    last_name: str | None = Form(None),
    street_id: str | None = Form(None),
    street_number: str | None = Form(None),
    apartment_number: str | None = Form(None),
    device_id: int = Form(...),
    status: str = Form("active"),
    comment: str | None = Form(None)
):
    # 1. Jeśli nie ma customer_id, utwórz klienta
    cid = _opt_int(customer_id)
    sid = _opt_int(street_id)
    
    if not cid:
        city_id = 2  # Domyślnie Sandomierz
        if sid:
            street = db.get(models.LocationStreet, sid)
            if street:
                city_id = street.city_id
                
        customer = models.Customer(
            customer_code=f"IMP-{mac.replace(':', '')[-6:]}",
            first_name="Abonent",
            last_name=last_name or "Importowany",
            location_city_id=city_id,
            location_street_id=sid,
            street_number=street_number,
            apartment_number=apartment_number,
            status=models.CustomerStatus.active,
            notes=comment if comment else None
        )
        db.add(customer)
        db.flush()
        cid = customer.id
        record_audit(db, "import_create_customer", "customer", customer.id, f"Imported from {mac}", request)
    
    # 2. Utwórz CustomerDevice (Urządzenie Klienta)
    net_cache = _get_net_cache(db)
    ip_network_id = _find_ip_network(ip, device_id, net_cache)
    
    # Pobierz dane adresowe do generowania loginu
    if not cid:
        # Nowy klient (zmienne z góry)
        s_name = ""
        if sid:
            street = db.get(models.LocationStreet, sid)
            s_name = street.name if street else ""
        l_name = last_name or "Importowany"
        s_num = street_number
        a_num = apartment_number
    else:
        # Istniejący klient
        customer = db.get(models.Customer, cid)
        l_name = customer.last_name
        s_name = customer.street.name if customer.street else ""
        s_num = customer.street_number
        a_num = customer.apartment_number

    device_record = models.CustomerDevice(
        customer_id=cid,
        hostname=f"node-{mac.replace(':', '')[-4:]}",
        login=generate_login(l_name, s_name, s_num, a_num),
        passwd=generate_password(),
        ip_address=ip,
        mac_address=mac,
        net_device_id=device_id,
        ip_network_id=ip_network_id,
        status=models.CustomerDeviceStatus(status),
        notes=comment if comment else None
    )
    db.add(device_record)
    db.flush() # Ensure ID is available for audit
    
    # 3. Import Taryfy i Subskrypcji jeśli jest rate-limit
    up, down = _parse_rate_limit(rate_limit)
    if up is not None and down is not None:
        # Sprawdź czy taryfa o takich parametrach istnieje
        tariff = db.scalar(
            select(models.Tariff)
            .where(models.Tariff.speed_up_mbps == up, models.Tariff.speed_down_mbps == down)
        )
        
        if not tariff:
            # Znajdź domyślny VAT
            def_vat = db.scalar(select(models.VatRate).where(models.VatRate.is_default == True))
            def_vat_id = def_vat.id if def_vat else None

            tariff = models.Tariff(
                name=f"Import {down}/{up} Mbps",
                monthly_price=Decimal("0.00"),
                vat_rate_id=def_vat_id,
                speed_up_mbps=up,
                speed_down_mbps=down,
                description=f"Automatycznie zaimportowana z Mikrotika ({rate_limit})"
            )
            db.add(tariff)
            db.flush()
            
        # Utwórz subskrypcję
        sub = models.Subscription(
            customer_id=cid,
            device_id=device_record.id,
            tariff_id=tariff.id,
            speed_up_mbps=up,
            speed_down_mbps=down,
            active=True
        )
        db.add(sub)

    db.commit()
    
    record_audit(db, "import_lease", "customer_device", device_record.id, f"Linked {mac} to customer {cid} (Tariff: {rate_limit})", request)
    
    return HTMLResponse(f"""
        <div class="text-success p-2 bg-green-50 rounded border border-green-200 flex items-center justify-between">
            <span><i class="fas fa-check-circle mr-2"></i>Zaimportowano pomyślnie!</span>
            <a href="/customers/{cid}/edit" class="ml-4 px-3 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 transition-colors">
                UZUPEŁNIJ DANE KLIENTA
            </a>
        </div>
    """)

from fastapi import BackgroundTasks
from app.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

@router.post("/{device_id}/import-all", dependencies=[Depends(require_business_write)])
async def import_all_leases(device_id: int, request: Request, db: Session = Depends(get_db)):
    import uuid
    import ipaddress
    import random
    
    logger.info(f"Rozpoczęcie masowego auto-importu dla urządzenia {device_id}")

    # Lista losowych przymiotników dla nieznanych klientów
    _RANDOM_NAMES = [
        "Alfa", "Beta", "Gamma", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
        "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
        "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey",
        "Xray", "Yankee", "Zulu", "Aries", "Cetus", "Draco", "Eridanus",
        "Hydra", "Lepus", "Lyra", "Orion", "Perseus", "Sculptor", "Vela",
    ]

    device = db.get(models.NetDevice, device_id)
    if not device:
        logger.error(f"Auto-import anulowany: Nie znaleziono urządzenia {device_id}")
        return

    discovered = await get_discoverable_leases(db, device)
    imported_count = 0
    seen_macs = set()

    # Załaduj wszystkie sieci IP raz (do dopasowania po CIDR)
    net_cache = _get_net_cache(db)

    def unique_customer_code(mac: str) -> str:
        base = f"IMP-{mac.replace(':', '')[-6:]}"
        if not db.scalar(select(models.Customer).where(models.Customer.customer_code == base)):
            return base
        return f"{base}-{uuid.uuid4().hex[:4]}"

    # Załaduj istniejące "Nieznany" nazwy, aby unikać N+1 queries
    existing_unknowns = db.scalars(
        select(models.Customer.last_name).where(models.Customer.first_name == "Nieznany")
    ).all()
    used_names = set(existing_unknowns)

    def random_unique_name() -> str:
        shuffled = random.sample(_RANDOM_NAMES, len(_RANDOM_NAMES))
        for name in shuffled:
            if name not in used_names:
                used_names.add(name)
                return name
        # Fallback
        new_name = f"{random.choice(_RANDOM_NAMES)}-{uuid.uuid4().hex[:4]}"
        used_names.add(new_name)
        return new_name

    for item in discovered:
        mac = item.get('mac')
        if not mac or mac in seen_macs:
            continue
        seen_macs.add(mac)

        ip              = item.get('ip')
        rate_limit      = item.get('rate_limit')
        comment         = item.get('comment')
        parsed          = item.get('parsed') or {}
        dhcp_server     = item.get('dhcp_server') or ''
        dhcp_interface  = item.get('dhcp_interface') or ''
        status          = item.get('status').value
        
        # Avoid duplicates if already imported by background sync
        existing_device = db.scalar(select(models.CustomerDevice).where(models.CustomerDevice.mac_address == mac))
        if existing_device:
            continue

        cid             = item.get('customer_id')
        sid             = item.get('street_id')

        last_name       = parsed.get('last_name') or random_unique_name()
        first_name      = "Abonent" if parsed.get('last_name') else "Nieznany"
        street_number   = parsed.get('street_number')
        apartment_number = parsed.get('apartment_number')

        mac_suffix      = mac.replace(':', '').replace('-', '').replace('.', '').lower()[-6:]
        host_slug       = last_name.lower().strip().replace(' ', '-') \
                                          .replace('ą','a').replace('ę','e') \
                                          .replace('ó','o').replace('ś','s').replace('ł','l') \
                                          .replace('ż','z').replace('ź','z').replace('ć','c') \
                                          .replace('ń','n')
        hostname        = f"{host_slug}{mac_suffix}.snms"

        ip_network_id   = _find_ip_network(ip, device_id, net_cache)
        if not ip_network_id:
            logger.warning(f"Pominięto dzierżawę {ip} ({mac}): Brak przypisanej sieci w CRM dla tego urządzenia.")
            continue

        if not cid:
            # 1. Start with fallback city (Sandomierz = 2)
            city_id = 2 
            
            # 2. Try to get city from the device's NetNode if available
            if device.net_node and device.net_node.location_city_id:
                city_id = device.net_node.location_city_id
            
            # 3. If street is recognized, it's the most accurate
            if sid:
                street = db.get(models.LocationStreet, sid)
                if street:
                    city_id = street.city_id or city_id
 
            customer = models.Customer(
                customer_code=unique_customer_code(mac),
                first_name=first_name,
                last_name=last_name,
                location_city_id=city_id,
                location_street_id=sid,
                street_number=street_number,
                apartment_number=apartment_number,
                status=models.CustomerStatus.active,
                notes=comment if comment else None
            )
            db.add(customer)
            db.flush()
            cid = customer.id

        s_name = ""
        if sid:
            street = db.get(models.LocationStreet, sid)
            s_name = street.name if street else ""

        device_record = models.CustomerDevice(
            customer_id=cid,
            hostname=hostname,
            login=generate_login(last_name, s_name, street_number, apartment_number),
            passwd=generate_password(),
            ip_address=ip,
            mac_address=mac,
            net_device_id=device_id,
            ip_network_id=ip_network_id,
            dhcp_server=dhcp_server or None,
            dhcp_interface=dhcp_interface or None,
            status=models.CustomerDeviceStatus(status),
            notes=comment if comment else None
        )
        db.add(device_record)
        db.flush() 

        up, down = _parse_rate_limit(rate_limit)
        # Fallback for missing/invalid rate-limit: 100/100 Mbps Standard
        if not up or not down:
            up, down = 100, 100
            rate_limit = "100M/100M"
            
        if up is not None and down is not None:
            tariff = db.scalar(
                select(models.Tariff)
                .where(models.Tariff.speed_up_mbps == up, models.Tariff.speed_down_mbps == down)
            )
            if not tariff:
                def_vat = db.scalar(select(models.VatRate).where(models.VatRate.is_default == True))
                def_vat_id = def_vat.id if def_vat else None
                tariff = models.Tariff(
                    name=f"Import {down}/{up} Mbps",
                    monthly_price=Decimal("0.00"),
                    vat_rate_id=def_vat_id,
                    speed_up_mbps=up,
                    speed_down_mbps=down,
                    description=f"Automatycznie zaimportowana z Mikrotika ({rate_limit})"
                )
                db.add(tariff)
                db.flush()

            sub = models.Subscription(
                customer_id=cid,
                device_id=device_record.id,
                tariff_id=tariff.id,
                speed_up_mbps=up,
                speed_down_mbps=down,
                active=True
            )
            db.add(sub)

        imported_count += 1

    db.commit()
    logger.info(f"Zakończono masowy auto-import dla urządzenia {device_id}. Zaimportowano {imported_count} dzierżaw.")
    
    # Return OOB Swap for persistent logs and trigger refresh
    response = HTMLResponse(f"""
        <div id="discovery-log-container" hx-swap-oob="afterbegin">
            <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4 animate-in fade-in slide-in-from-left-4">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <i class="fas fa-check text-xs"></i>
                    </div>
                    <div>
                        <div class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">Operacja Zakończona</div>
                        <div class="text-sm font-bold text-emerald-900">Masowy Import: Zaimportowano {imported_count} pozycji</div>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-emerald-500/10 flex items-center justify-between">
                    <span class="text-[9px] font-mono text-emerald-600/60 uppercase">{datetime.now().strftime('%H:%M:%S')} • Device ID: {device_id}</span>
                    <a href="/customers" class="text-[9px] font-black uppercase tracking-widest text-emerald-700 hover:underline">Pokaż bazę klientów</a>
                </div>
            </div>
        </div>
        
        <div class="p-3 bg-muted/20 border border-dashed rounded-xl text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <i class="fas fa-history"></i> Ostatni import: {imported_count} pozycji ({datetime.now().strftime('%H:%M:%S')})
        </div>
    """)
    response.headers["HX-Trigger"] = "refresh-discovery"
    return response


@router.post("/import-network", dependencies=[Depends(require_business_write)])
async def import_network(
    request: Request,
    db: Session = Depends(get_db),
    cidr: str = Form(...),
    gateway: str | None = Form(None),
    comment: str | None = Form(None),
    device_id: int = Form(...),
):
    device = db.get(models.NetDevice, device_id)
    if not device:
        return HTMLResponse("<div class='text-red-500'>Błąd: Nie znaleziono urządzenia.</div>", status_code=404)

    # Utwórz nową podsieć
    net_name = comment if comment else f"Sieć {cidr}"
    new_net = models.IpNetwork(
        name=net_name,
        cidr=cidr,
        gateway=gateway,
        description="Zaimportowano z Mikrotika (DHCP Server Network)",
        active=True,
        net_device_id=device.id,
    )
    db.add(new_net)
    db.flush()
    db.commit()

    # Zapisz audyt
    record_audit(
        db,
        "import_network",
        "ip_network",
        new_net.id,
        f"Imported DHCP Network {cidr} from {device.name}",
        request,
    )

    response = HTMLResponse(
        f"""
        <div class="text-success p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
            <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-emerald-500 text-lg"></i>
                <div class="flex flex-col">
                    <span class="font-bold text-emerald-800">Sieć {cidr} zaimportowana!</span>
                    <span class="text-[10px] text-emerald-600 uppercase font-black">Urządzenie: {device.name}</span>
                </div>
            </div>
            <a href="/ip-networks/{new_net.id}/edit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black hover:bg-emerald-700 transition-all uppercase tracking-widest shadow-lg shadow-emerald-600/20">Edytuj Sieć</a>
        </div>
        """
    )
    # Force a full refresh of the discovery page for this device
    response.headers["HX-Redirect"] = f"/admin/discovery/{device_id}"
    return response

@router.post("/{device_id}/import-all-networks", dependencies=[Depends(require_business_write)])
async def import_all_networks(device_id: int, request: Request, db: Session = Depends(get_db)):
    device = db.get(models.NetDevice, device_id)
    if not device:
        return HTMLResponse("Device not found", status_code=404)
        
    discovered = await get_discoverable_networks(db, device)
    imported_count = 0
    
    for net in discovered:
        cidr = net.get('cidr')
        gateway = net.get('gateway')
        comment = net.get('comment')
        
        new_net = models.IpNetwork(
            name=comment if comment else f"Sieć {cidr}",
            cidr=cidr,
            gateway=gateway,
            description="Masowy import z Mikrotika (DHCP Server Network)",
            active=True,
            net_device_id=device.id,
        )
        db.add(new_net)
        imported_count += 1
        
    db.commit()
    
    record_audit(db, "import_all_networks", "net_device", device.id, f"Mass imported {imported_count} networks from {device.name}", request)
    
    response = HTMLResponse(f"""
        <div class="p-4 bg-emerald-500 text-white rounded-xl shadow-lg animate-bounce">
            <i class="fas fa-check-circle mr-2"></i> Zaimportowano {imported_count} sieci! Odświeżanie dzierżaw...
        </div>
    """)
    response.headers["HX-Refresh"] = "true"
    return response

@router.post("/smart-parse", dependencies=[Depends(require_business_write)])
async def smart_parse_comment(
    request: Request,
    comment: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Używa Gemini do inteligentnego sparsowania komentarza, gdy regex zawodzi.
    """
    parsed = await gemini.smart_parse_comment(comment)
    if not parsed:
        return HTMLResponse("""
            <div class="p-3 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 flex items-center gap-2">
                <i class="fas fa-exclamation-circle"></i> Gemini nie poradziło sobie z tym komentarzem.
            </div>
        """)
    
    # Próbujemy dopasować ulicę w CRM
    from app.services.mikrotik_parser import match_street_name
    street_id = match_street_name(db, parsed.get('street_name', ''))

    # Zwracamy mały fragment HTML, który podmieni przycisk / pustą analizę
    return HTMLResponse(f"""
        <div class="animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center gap-2 mb-3">
                <div class="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black rounded-md uppercase tracking-wider border border-purple-200">
                    <i class="fas fa-magic mr-1"></i> AI Parsed
                </div>
                <div class="text-[9px] text-muted-foreground font-bold">Confidence: {int(parsed.get('confidence', 0) * 100)}%</div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <div class="text-[9px] text-muted-foreground font-bold uppercase">Abonent</div>
                    <div class="font-black text-lg text-purple-700">{parsed.get('last_name') or 'Nieznany'}</div>
                </div>
                <div class="space-y-1">
                    <div class="text-[9px] text-muted-foreground font-bold uppercase">Adres</div>
                    <div class="text-sm font-bold">
                        {parsed.get('street_name', '')} {parsed.get('street_number', '')} 
                        {('m. ' + parsed.get('apartment_number')) if parsed.get('apartment_number') else ''}
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-2 bg-muted/30 rounded-lg border border-dashed text-[10px] text-muted-foreground italic">
                Sugerowana prędkość: {parsed.get('rate_limit') or 'brak danych'}
            </div>

            <!-- Ten przycisk wyzwoli pełny import z danymi z AI -->
            <form hx-post="/admin/discovery/import" hx-swap="outerHTML" class="mt-4">
                <input type="hidden" name="mac" value="{request.headers.get('X-MAC', '')}">
                <input type="hidden" name="ip" value="{request.headers.get('X-IP', '')}">
                <input type="hidden" name="device_id" value="{request.headers.get('X-Device-ID', '')}">
                <input type="hidden" name="last_name" value="{parsed.get('last_name', '')}">
                <input type="hidden" name="street_id" value="{street_id or ''}">
                <input type="hidden" name="street_number" value="{parsed.get('street_number', '')}">
                <input type="hidden" name="apartment_number" value="{parsed.get('apartment_number', '')}">
                <input type="hidden" name="rate_limit" value="{parsed.get('rate_limit', '')}">
                
                <button type="submit" class="w-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
                    Akceptuj i Importuj
                </button>
            </form>
        </div>
    """)

