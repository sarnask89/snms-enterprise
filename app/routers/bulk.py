from datetime import date
from decimal import Decimal
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import require_admin, verify_session
from app.templating import render
from app import models
from app.snms_numbering import allocate_next_document_number

router = APIRouter(prefix="/bulk", dependencies=[Depends(verify_session)])

@router.get("/invoicing", response_class=HTMLResponse)
def bulk_invoicing_page(request: Request, db: Session = Depends(get_db)):
    # Count active subscriptions that might need invoicing
    sub_count = db.query(models.Subscription).filter(models.Subscription.active == True).count()
    return render(request, "bulk/invoicing.html", {
        "title": "Masowe fakturowanie",
        "customers_count": db.query(models.Customer).count(),
        "active_subscriptions": sub_count,
        "current_month": date.today().strftime("%m/%Y")
    })

@router.post("/invoicing", dependencies=[Depends(require_admin)])
def bulk_invoicing_submit(request: Request, db: Session = Depends(get_db)):
    today = date.today()
    first_day = today.replace(day=1)
    
    # Get all active subscriptions
    subscriptions = db.scalars(select(models.Subscription).where(models.Subscription.active == True)).all()
    
    invoices_created = 0
    for sub in subscriptions:
        # Check if already invoiced this month
        existing = db.scalars(
            select(models.Invoice).where(
                and_(
                    models.Invoice.customer_id == sub.customer_id,
                    models.Invoice.issue_date >= first_day
                )
            )
        ).first()
        
        if not existing:
            # Create Invoice
            # We need a number plan
            plan = db.scalars(
                select(models.NumberPlan).where(
                    and_(
                        models.NumberPlan.doc_type == models.NumberPlanDocType.invoice,
                        models.NumberPlan.is_default == True
                    )
                )
            ).first()
            
            if not plan:
                continue # Skip if no numbering plan
                
            inv_number = allocate_next_document_number(db, plan)
            
            # Calculate amounts
            gross = Decimal(str(sub.tariff.monthly_price))
            vat_rate = sub.tariff.vat_rate
            net = gross
            vat_amt = Decimal("0")
            
            if vat_rate:
                rate = Decimal(str(vat_rate.rate_percent)) / Decimal("100")
                net = (gross / (Decimal("1") + rate)).quantize(Decimal("0.01"))
                vat_amt = (gross - net).quantize(Decimal("0.01"))

            invoice = models.Invoice(
                number=inv_number,
                customer_id=sub.customer_id,
                amount=gross,
                amount_net=float(net),
                amount_vat=float(vat_amt),
                status=models.InvoiceStatus.draft,
                document_kind=models.InvoiceDocumentKind.invoice,
                issue_date=today,
                vat_rate_id=vat_rate.id if vat_rate else None
            )
            db.add(invoice)
            
            # Create Ledger Entry
            ledger = models.LedgerEntry(
                customer_id=sub.customer_id,
                amount=gross,
                kind=models.LedgerEntryKind.debit,
                description=f"Abonament: {sub.tariff.name} ({today.strftime('%m/%Y')})",
                posted_at=today
            )
            db.add(ledger)
            invoices_created += 1
            
    db.commit()
    return RedirectResponse(f"/finances/invoices?msg=Utworzono+{invoices_created}+dokumentów", status_code=303)
