import asyncio
from decimal import Decimal
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from app import models
from app.database import get_db
from app.deps import verify_session, require_business_write
from app.templating import render
from app.services.mikrotik_discovery import get_discoverable_leases
from app.audit import record_audit

router = APIRouter(prefix="/admin/discovery", dependencies=[Depends(verify_session)])

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
    
    discovered = await get_discoverable_leases(db, device)
    return render(request, "admin/discovery_results.html", {
        "device": device,
        "discovered": discovered
    })

def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
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
    status: str = Form("active")
):
    # 1. Jeśli nie ma customer_id, utwórz klienta
    cid = _opt_int(customer_id)
    sid = _opt_int(street_id)
    
    if not cid:
        city_id = None
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
            status=models.CustomerStatus.active
        )
        db.add(customer)
        db.flush()
        cid = customer.id
        record_audit(db, "import_create_customer", "customer", customer.id, f"Imported from {mac}", request)
    
    # 2. Utwórz Node (Urządzenie Klienta)
    node = models.Node(
        customer_id=cid,
        hostname=f"node-{mac.replace(':', '')[-4:]}",
        ip_address=ip,
        mac_address=mac,
        net_device_id=device_id,
        status=models.NodeStatus(status),
    )
    db.add(node)
    
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
            node_id=node.id,
            tariff_id=tariff.id,
            speed_up_mbps=up,
            speed_down_mbps=down,
            active=True
        )
        db.add(sub)

    db.commit()
    
    record_audit(db, "import_lease", "node", node.id, f"Linked {mac} to customer {cid} (Tariff: {rate_limit})", request)
    
    return HTMLResponse(f"""
        <div class="text-success p-2 bg-green-50 rounded border border-green-200 flex items-center justify-between">
            <span><i class="fas fa-check-circle mr-2"></i>Zaimportowano pomyślnie!</span>
            <a href="/customers/{cid}/edit" class="ml-4 px-3 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 transition-colors">
                UZUPEŁNIJ DANE KLIENTA
            </a>
        </div>
    """)
