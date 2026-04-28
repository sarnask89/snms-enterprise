from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, joinedload

from app import models
from app.database import get_db
from app.deps import require_business_write, verify_session
from app.templating import render
from app.audit import record_audit
from app.logger_utils import get_logger

router = APIRouter(prefix="/net-nodes", dependencies=[Depends(verify_session)])
logger = get_logger("net_nodes")

def _get_managed_cities(db: Session):
    return list(db.scalars(select(models.LocationCity).where(models.LocationCity.is_managed == True).order_by(models.LocationCity.name)).all())

def _opt_int(raw: str | None) -> int | None:
    if raw is None or str(raw).strip() == "":
        return None
    try:
        return int(str(raw).strip())
    except ValueError:
        return None

@router.get("", response_class=HTMLResponse)
def net_nodes_list(request: Request, search_q: str = "", db: Session = Depends(get_db)):
    stmt = select(models.NetNode).options(joinedload(models.NetNode.division))
    if search_q:
        term = f"%{search_q}%"
        stmt = stmt.where(or_(
            models.NetNode.name.ilike(term),
            models.NetNode.location_detail.ilike(term)
        ))
    items = list(db.scalars(stmt.order_by(models.NetNode.name)).all())
    
    # Mapowanie dywizji dla szybkiego dostępu w szablonie
    divisions = {d.id: d for d in db.scalars(select(models.Division)).all()}
    
    return render(request, "net_nodes/list.html", {
        "title": "Infrastruktura (Węzły)", 
        "items": items,
        "divisions": divisions,
        "search_q": search_q
    })

@router.get("/topology", response_class=HTMLResponse)
def network_topology_map(request: Request, db: Session = Depends(get_db)):
    nodes = db.scalars(select(models.NetNode)).all()
    links = db.scalars(select(models.NetNodeLink).options(joinedload(models.NetNodeLink.source_node), joinedload(models.NetNodeLink.target_node))).all()
    return render(request, "net_nodes/map.html", {
        "title": "Mapa Topologii Sieci",
        "nodes": nodes,
        "links": links
    })

@router.get("/new", response_class=HTMLResponse)
def net_node_new_form(request: Request, db: Session = Depends(get_db)):
    divisions = list(db.scalars(select(models.Division).where(models.Division.active.is_(True))).all())
    return render(request, "net_nodes/form.html", {
        "title": "Nowy węzeł", 
        "node": None, 
        "divisions": divisions,
        "managed_cities": _get_managed_cities(db)
    })

@router.post("/new", dependencies=[Depends(require_business_write)])
def net_node_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    division_id: str | None = Form(None),
    location_city_id: str | None = Form(None),
    location_street_id: str | None = Form(None),
    street_number: str | None = Form(None),
    latitude: str | None = Form(None),
    longitude: str | None = Form(None),
    node_type: str | None = Form(None),
    owner_type: str | None = Form(None),
    sidusis_id: str | None = Form(None),
    has_power: str | None = Form(None),
    has_env_control: str | None = Form(None),
    uke_node_kind: str | None = Form(None),
    uke_access_rules: str | None = Form(None),
):
    try:
        from decimal import Decimal
        lat_dec = Decimal(latitude.replace(",", ".")) if latitude and latitude.strip() else None
        lng_dec = Decimal(longitude.replace(",", ".")) if longitude and longitude.strip() else None
        
        logger.info(f"NET-NODE NEW SUBMIT: street_id={location_street_id}, lat={lat_dec}, lng={lng_dec}")
        
        n = models.NetNode(
            name=name.strip(),
            division_id=_opt_int(division_id),
            location_city_id=_opt_int(location_city_id),
            location_street_id=_opt_int(location_street_id),
            street_number=street_number,
            latitude=lat_dec,
            longitude=lng_dec,
            node_type=node_type,
            owner_type=owner_type,
            sidusis_id=sidusis_id,
            has_power=has_power in ("on", "true", "1"),
            has_env_control=has_env_control in ("on", "true", "1"),
            uke_node_kind=uke_node_kind,
            uke_access_rules=uke_access_rules,
        )
        db.add(n)
        db.flush()
        record_audit(db, "create", "net_node", n.id, f"Node: {n.name}", request)
        db.commit()
        return RedirectResponse("/net-nodes", status_code=303)
    except Exception as e:
        logger.error(f"Failed to create net node: {e}", exc_info=True)
        db.rollback()
        raise

@router.get("/{node_id}/edit", response_class=HTMLResponse)
def net_node_edit_form(node_id: int, request: Request, db: Session = Depends(get_db)):
    n = db.get(models.NetNode, node_id)
    if not n: return RedirectResponse("/net-nodes", status_code=302)
    
    divisions = list(db.scalars(select(models.Division).where(models.Division.active.is_(True))).all())
    all_nodes = list(db.scalars(select(models.NetNode).where(models.NetNode.id != node_id)).all())
    
    # Pobieranie połączeń
    links = db.scalars(
        select(models.NetNodeLink)
        .where(models.NetNodeLink.source_node_id == node_id)
        .options(joinedload(models.NetNodeLink.target_node))
    ).all()

    return render(request, "net_nodes/form.html", {
        "title": f"Edycja węzła: {n.name}", 
        "node": n, 
        "divisions": divisions,
        "all_nodes": all_nodes,
        "links": links,
        "managed_cities": _get_managed_cities(db)
    })

@router.post("/{node_id}/links/add", dependencies=[Depends(require_business_write)])
def net_node_add_link(
    node_id: int,
    request: Request,
    target_node_id: int = Form(...),
    medium_type: str = Form("Fiber"),
    capacity: int | None = Form(None),
    db: Session = Depends(get_db)
):
    link = models.NetNodeLink(
        source_node_id=node_id,
        target_node_id=target_node_id,
        medium_type=medium_type,
        capacity_mbps=capacity
    )
    db.add(link)
    db.commit()
    return RedirectResponse(f"/net-nodes/{node_id}/edit", status_code=303)

@router.post("/{node_id}/edit", dependencies=[Depends(require_business_write)])
def net_node_edit_submit(
    node_id: int,
    request: Request,
    db: Session = Depends(get_db),
    name: str = Form(...),
    division_id: str | None = Form(None),
    location_city_id: str | None = Form(None),
    location_street_id: str | None = Form(None),
    street_number: str | None = Form(None),
    latitude: str | None = Form(None),
    longitude: str | None = Form(None),
    node_type: str | None = Form(None),
    owner_type: str | None = Form(None),
    sidusis_id: str | None = Form(None),
    has_power: str | None = Form(None),
    has_env_control: str | None = Form(None),
    uke_node_kind: str | None = Form(None),
    uke_access_rules: str | None = Form(None),
):
    try:
        from decimal import Decimal
        lat_dec = Decimal(latitude.replace(",", ".")) if latitude and latitude.strip() else None
        lng_dec = Decimal(longitude.replace(",", ".")) if longitude and longitude.strip() else None

        logger.info(f"NET-NODE EDIT SUBMIT: id={node_id}, street_id={location_street_id}, lat={lat_dec}, lng={lng_dec}")
        n = db.get(models.NetNode, node_id)
        if not n: return RedirectResponse("/net-nodes", status_code=303)
        n.name = name.strip()
        n.division_id = _opt_int(division_id)
        n.location_city_id = _opt_int(location_city_id)
        n.location_street_id = _opt_int(location_street_id)
        n.street_number = street_number
        n.latitude = lat_dec
        n.longitude = lng_dec
        n.node_type = node_type
        n.owner_type = owner_type
        n.sidusis_id = sidusis_id
        n.has_power = has_power in ("on", "true", "1")
        n.has_env_control = has_env_control in ("on", "true", "1")
        n.uke_node_kind = uke_node_kind
        n.uke_access_rules = uke_access_rules
        db.commit()
        record_audit(db, "update", "net_node", n.id, f"Node: {n.name}", request)
        return RedirectResponse("/net-nodes", status_code=303)
    except Exception as e:
        logger.error(f"Failed to update net node {node_id}: {e}", exc_info=True)
        db.rollback()
        raise

@router.post("/{node_id}/delete", dependencies=[Depends(require_business_write)])
def net_node_delete(node_id: int, request: Request, db: Session = Depends(get_db)):
    n = db.get(models.NetNode, node_id)
    if n:
        record_audit(db, "delete", "net_node", n.id, f"Node: {n.name}", request)
        db.delete(n)
        db.commit()
    return RedirectResponse("/net-nodes", status_code=303)
