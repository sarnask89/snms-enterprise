from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import require_admin
from app.templating import render
from app import models
import io
import csv

router = APIRouter(prefix="/admin", dependencies=[Depends(require_admin)])

@router.get("/pit", response_class=HTMLResponse)
def pit_uke_report_page(request: Request, db: Session = Depends(get_db)):
    from sqlalchemy import func, select
    nodes_count = db.scalar(select(func.count()).select_from(models.CustomerDevice)) or 0
    return render(request, "admin/pit_uke.html", {
        "title": "Eksport PIT UKE",
        "nodes_count": nodes_count
    })

@router.get("/pit/export")
def pit_uke_export_csv(db: Session = Depends(get_db)):
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload
    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    writer.writerow(['ID', 'IP', 'MAC', 'Customer', 'Street', 'Number'])
    
    stmt = (
        select(models.CustomerDevice)
        .options(
            joinedload(models.CustomerDevice.customer)
            .joinedload(models.Customer.street)
        )
    )
    nodes = db.scalars(stmt).all()
    
    for n in nodes:
        cust = n.customer
        cust_name = f"{cust.first_name} {cust.last_name}" if cust else "—"
        street_name = cust.street.name if (cust and cust.street) else ""
        street_num = cust.street_number if cust else ""
        
        writer.writerow([
            n.id, 
            n.ip_address or "", 
            n.mac_address or "", 
            cust_name,
            street_name,
            street_num
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=pit_uke_export.csv"}
    )

@router.get("/passport/map", response_class=HTMLResponse)
def network_map_page(request: Request, db: Session = Depends(get_db)):
    from sqlalchemy import select
    from sqlalchemy.orm import joinedload
    # Fetch nodes with coordinates
    stmt = select(models.NetNode).options(joinedload(models.NetNode.location_city))
    nodes = db.scalars(stmt).all()
    # Convert to simple list for JSON
    nodes_data = []
    for n in nodes:
        if n.latitude and n.longitude:
            nodes_data.append({
                "name": n.name,
                "lat": float(n.latitude),
                "lon": float(n.longitude),
                "type": "net_node",
                "address": f"{n.location_city.name if n.location_city else ''} {n.street_number or ''}"
            })
            
    import json
    return render(request, "net_map.html", {
        "title": "Mapa Sieci",
        "nodes_json": json.dumps(nodes_data)
    })
