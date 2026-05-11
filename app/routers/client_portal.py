from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime

from app import models
from app.database import get_db
from app.deps import require_client
from app.templating import render
import asyncio

router = APIRouter(prefix="/client", dependencies=[Depends(require_client)])

# Popular Polish Banks for Payment Redirect Mockup
POLISH_BANKS = [
    {"id": "pkobp", "name": "PKO Bank Polski (iPKO)", "logo": "https://www.pkobp.pl/favicon.ico"},
    {"id": "pekao", "name": "Bank Pekao S.A. (Pekao24)", "logo": "https://www.pekao.com.pl/favicon.ico"},
    {"id": "santander", "name": "Santander Bank Polska", "logo": "https://www.santander.pl/favicon.ico"},
    {"id": "mbank", "name": "mBank", "logo": "https://www.mbank.pl/favicon.ico"},
    {"id": "ing", "name": "ING Bank Śląski", "logo": "https://www.ing.pl/favicon.ico"},
    {"id": "alior", "name": "Alior Bank", "logo": "https://www.aliorbank.pl/favicon.ico"},
]


@router.get("/dashboard", response_class=HTMLResponse)
async def client_dashboard(request: Request, db: Session = Depends(get_db)):
    client = request.state.client_user
    # Get recent invoices
    invoices = db.scalars(
        select(models.Invoice)
        .where(models.Invoice.customer_id == client.id)
        .order_by(models.Invoice.issue_date.desc())
        .limit(5)
    ).all()
    
    # Get active subscriptions
    subs = db.scalars(
        select(models.Subscription)
        .where(models.Subscription.customer_id == client.id, models.Subscription.active == True)
    ).all()
    
    # Get recent tickets
    tickets = db.scalars(
        select(models.SupportTicket)
        .where(models.SupportTicket.customer_id == client.id)
        .order_by(models.SupportTicket.created_at.desc())
        .limit(3)
    ).all()

    return render(request, "client/dashboard.html", {
        "title": "Pulpit klienta",
        "invoices": invoices,
        "subscriptions": subs,
        "tickets": tickets
    })

@router.get("/payments", response_class=HTMLResponse)
async def client_payments(request: Request, db: Session = Depends(get_db)):
    client = request.state.client_user
    invoices = db.scalars(
        select(models.Invoice)
        .where(models.Invoice.customer_id == client.id)
        .order_by(models.Invoice.issue_date.desc())
    ).all()
    return render(request, "client/payments.html", {
        "title": "Moje płatności", 
        "invoices": invoices,
        "banks": POLISH_BANKS
    })

@router.get("/subscriptions", response_class=HTMLResponse)
async def client_subscriptions(request: Request, db: Session = Depends(get_db)):
    client = request.state.client_user
    subs = db.scalars(
        select(models.Subscription)
        .where(models.Subscription.customer_id == client.id)
    ).all()
    return render(request, "client/subscriptions.html", {"title": "Moje usługi", "subscriptions": subs})

@router.get("/helpdesk", response_class=HTMLResponse)
async def client_helpdesk(request: Request, db: Session = Depends(get_db)):
    client = request.state.client_user
    tickets = db.scalars(
        select(models.SupportTicket)
        .where(models.SupportTicket.customer_id == client.id)
        .order_by(models.SupportTicket.created_at.desc())
    ).all()
    return render(request, "client/helpdesk.html", {"title": "Zgłoszenia serwisowe", "tickets": tickets})

@router.get("/devices", response_class=HTMLResponse)
async def client_devices(request: Request, db: Session = Depends(get_db)):
    client = request.state.client_user
    devices = db.scalars(
        select(models.CustomerDevice)
        .where(models.CustomerDevice.customer_id == client.id)
    ).all()
    
    # Mocking status check
    device_statuses = {}
    for d in devices:
        is_up = False
        if d.ip_address:
            try:
                last_octet = int(d.ip_address.split('.')[-1])
                is_up = (last_octet % 2 == 0) # Even IPs are 'up' for demo
            except:
                pass
        device_statuses[d.id] = "Osiągalne" if is_up else "Nieosiągalne"

    return render(request, "client/devices.html", {
        "title": "Moje urządzenia", 
        "devices": devices,
        "statuses": device_statuses
    })


    from app.models.finance import Tariff
    tariffs = db.scalars(select(Tariff).where(Tariff.active == True)).all()
    return render(request, "client/shop.html", {"title": "Oferta i sklep", "tariffs": tariffs})

@router.get("/profile", response_class=HTMLResponse)
async def client_profile(request: Request):
    return render(request, "client/profile.html", {"title": "Moje dane i profil"})

@router.post("/profile")
async def client_profile_update(
    request: Request,
    db: Session = Depends(get_db),
    email: str | None = Form(None),
    phone: str | None = Form(None),
):
    client = request.state.client_user
    c = db.get(models.Customer, client.id)
    if c:
        if email: c.email = email.strip()
        if phone: c.phone = phone.strip()
        db.commit()
    return RedirectResponse("/client/profile?success=1", status_code=303)

