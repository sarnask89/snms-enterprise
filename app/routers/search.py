from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import verify_session
from app.templating import render
from app import models

import re

router = APIRouter(prefix="/api/search", dependencies=[Depends(verify_session)])

# Pre-compiled regular expressions at the module level to avoid re-compilation on every search query.
RE_MAC_LIKE_1 = re.compile(r'^[0-9a-f]{2}[:.-]')
RE_MAC_LIKE_2 = re.compile(r'^[0-9a-f]{4,12}$')
RE_IP_LIKE_1 = re.compile(r'^\d{1,3}\.')
RE_IP_LIKE_2 = re.compile(r'\d')

@router.get("", response_class=HTMLResponse)
def global_search(request: Request, q: str = Query(""), db: Session = Depends(get_db)):
    if not q or len(q) < 3:
        return "" # Return empty for too short queries
        
    terms = q.split()
    customer_filters = []
    for t in terms:
        ft = f"%{t}%"
        customer_filters.append(or_(
            models.Customer.last_name.ilike(ft),
            models.Customer.first_name.ilike(ft),
            models.Customer.customer_code.ilike(ft)
        ))
    
    customers = db.scalars(
        select(models.Customer)
        .where(*customer_filters)
        .limit(10)
    ).all()
    
    # Search Nodes
    node_filters = []
    for t in terms:
        ft = f"%{t}%"
        node_filters.append(or_(
            models.CustomerDevice.hostname.ilike(ft),
            models.CustomerDevice.ip_address.ilike(ft),
            models.CustomerDevice.mac_address.ilike(ft)
        ))

    nodes = db.scalars(
        select(models.CustomerDevice)
        .where(*node_filters)
        .limit(10)
    ).all()
    
    search_type = "name"
    if q:
        clean_q = q.lower().strip()
        # Look for MAC-like: hex pairs with separators or long hex strings using pre-compiled regex
        if RE_MAC_LIKE_1.search(clean_q) or RE_MAC_LIKE_2.search(clean_q) or ":" in clean_q:
            search_type = "mac"
        # Look for IP-like: digits followed by dots using pre-compiled regex
        elif RE_IP_LIKE_1.search(clean_q) or (RE_IP_LIKE_2.search(clean_q) and "." in clean_q):
            search_type = "ip"

    return render(request, "components/search_results.html", {
        "customers": customers,
        "nodes": nodes,
        "q": q,
        "search_type": search_type
    })
