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

@router.post("/import", dependencies=[Depends(require_business_write)])
async def import_lease(
    request: Request,
    db: Session = Depends(get_db),
    mac: str = Form(...),
    ip: str = Form(...),
    customer_id: int | None = Form(None),
    last_name: str = Form(None),
    street_id: int | None = Form(None),
    street_number: str = Form(None),
    apartment_number: str = Form(None),
    device_id: int = Form(...)
):
    # 1. Jeśli nie ma customer_id, utwórz klienta
    if not customer_id:
        customer = models.Customer(
            customer_code=f"IMP-{mac.replace(':', '')[-6:]}",
            first_name="Abonent",
            last_name=last_name or "Importowany",
            location_street_id=street_id,
            street_number=street_number,
            apartment_number=apartment_number,
            status=models.CustomerStatus.active
        )
        db.add(customer)
        db.flush()
        customer_id = customer.id
        record_audit(db, "import_create_customer", "customer", customer.id, f"Imported from {mac}", request)
    
    # 2. Utwórz Node (Urządzenie Klienta)
    node = models.Node(
        customer_id=customer_id,
        hostname=f"node-{mac.replace(':', '')[-4:]}",
        ip_address=ip,
        mac_address=mac,
        net_device_id=device_id,
        status=models.NodeStatus.active,
        provisioning_status=models.ProvisioningStatus.idle
    )
    db.add(node)
    db.commit()
    
    record_audit(db, "import_lease", "node", node.id, f"Linked {mac} to customer {customer_id}", request)
    
    return HTMLResponse(f'<div class="text-success p-2">Zaimportowano!</div>')
