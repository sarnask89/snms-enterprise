from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app import models
from app.audit import record_audit
from app.database import get_db
from app.security import verify_password
from app.templating import render

router = APIRouter(prefix="/client")

@router.get("/login", response_class=HTMLResponse)
def client_login_page(request: Request):
    if request.session.get("client_id"):
        return RedirectResponse("/client/dashboard", status_code=302)
    return render(request, "client/login.html", {"error": None})

@router.post("/login", response_class=HTMLResponse)
def client_login_submit(
    request: Request,
    db: Session = Depends(get_db),
    login: str = Form(...),
    password: str = Form(...),
):
    # Search for customer by portal_login or customer_code
    customer = db.scalars(
        select(models.Customer).where(
            (models.Customer.portal_login == login.strip()) | 
            (models.Customer.customer_code == login.strip())
        )
    ).first()
    
    if customer and customer.status == models.CustomerStatus.active:
        if customer.portal_password_hash and verify_password(password, customer.portal_password_hash):
            request.session["client_id"] = customer.id
            customer.last_portal_login = datetime.now(timezone.utc)
            db.commit()
            return RedirectResponse("/client/dashboard", status_code=302)
    
    return render(
        request,
        "client/login.html",
        {"error": "Nieprawidłowy login lub hasło."},
        status_code=401,
    )

@router.get("/logout")
def client_logout(request: Request):
    request.session.pop("client_id", None)
    return RedirectResponse("/client/login", status_code=302)
