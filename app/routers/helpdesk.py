import csv
import io

from fastapi import APIRouter, Depends, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.responses import Response
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.audit import record_audit
from app.database import get_db
from app.deps import require_helpdesk_write, verify_session
from app.templating import render

router = APIRouter(prefix="/helpdesk", dependencies=[Depends(verify_session)])


@router.get("", response_class=HTMLResponse)
def helpdesk_root():
    return RedirectResponse("/helpdesk/tickets", status_code=302)


def _service_staff(db: Session) -> list[models.PortalUser]:
    return list(
        db.scalars(
            select(models.PortalUser)
            .where(
                models.PortalUser.role == models.UserRole.service,
                models.PortalUser.active.is_(True),
            )
            .order_by(models.PortalUser.username)
        ).all()
    )


def _set_ticket_queue_fields(
    db: Session,
    t: models.SupportTicket,
    queue_id: int | None,
    category_id: int | None,
) -> None:
    qrow = None
    if queue_id:
        qrow = db.get(models.HelpdeskQueue, queue_id)
    if not qrow:
        qrow = db.scalars(
            select(models.HelpdeskQueue).where(models.HelpdeskQueue.name == "default")
        ).first()
    t.queue_id = qrow.id if qrow else None
    t.queue = qrow.name if qrow else "default"
    t.category_id = category_id


@router.get("/tickets", response_class=HTMLResponse)
def ticket_list(
    request: Request,
    db: Session = Depends(get_db),
    assigned: str | None = Query(None),
    q: str | None = Query(None),
):
    # Optymalizacja SQLAlchemy: ładowanie relacji
    stmt = select(models.SupportTicket).options(
        selectinload(models.SupportTicket.customer),
        selectinload(models.SupportTicket.assignee)
    ).order_by(models.SupportTicket.id.desc())

    me = request.state.portal_user
    if assigned == "me" and me.role == models.UserRole.service:
        stmt = stmt.where(models.SupportTicket.assignee_id == me.id)
    
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(
            models.SupportTicket.title.ilike(term),
            models.SupportTicket.body.ilike(term)
        ))

    rows = list(db.scalars(stmt).all())
    
    # Do mapowania w szablonie (tradycyjne)
    customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    users_map = {u.id: u.username for u in db.scalars(select(models.PortalUser)).all()}

    # HTMX partial
    if request.headers.get("HX-Request"):
        return render(
            request,
            "helpdesk/ticket_list_rows.html",
            {"tickets": rows, "customers": customers, "users_map": users_map},
        )

    return render(
        request,
        "helpdesk/tickets.html",
        {
            "title": "Helpdesk — zgłoszenia",
            "tickets": rows,
            "customers": customers,
            "users_map": users_map,
            "filter_assigned": assigned or "",
            "search_q": q or "",
        },
    )


@router.get("/queues", response_class=HTMLResponse)
def queue_list(request: Request, db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.HelpdeskQueue).order_by(models.HelpdeskQueue.sort_order)).all())
    return render(request, "helpdesk/queues.html", {"title": "Helpdesk — kolejki", "queues": rows})


@router.get("/queues/new", response_class=HTMLResponse)
def queue_new_form(request: Request):
    return render(request, "helpdesk/queue_form.html", {"title": "Nowa kolejka", "queue": None})


@router.post("/queues/new", dependencies=[Depends(require_helpdesk_write)])
def queue_new_submit(db: Session = Depends(get_db), name: str = Form(...), description: str | None = Form(None)):
    q = models.HelpdeskQueue(name=name.strip()[:64], description=(description or None) and description.strip() or None, sort_order=0)
    db.add(q)
    db.commit()
    return RedirectResponse("/helpdesk/queues", status_code=303)


@router.post("/queues/{queue_id}/delete", dependencies=[Depends(require_helpdesk_write)])
def queue_delete(queue_id: int, db: Session = Depends(get_db)):
    q = db.get(models.HelpdeskQueue, queue_id)
    if q and q.name != "default":
        db.delete(q)
        db.commit()
    return RedirectResponse("/helpdesk/queues", status_code=303)


@router.get("/categories", response_class=HTMLResponse)
def category_list(request: Request, db: Session = Depends(get_db)):
    queues = list(db.scalars(select(models.HelpdeskQueue).order_by(models.HelpdeskQueue.sort_order)).all())
    rows = list(db.scalars(select(models.HelpdeskCategory).options(selectinload(models.HelpdeskCategory.queue)).order_by(models.HelpdeskCategory.queue_id)).all())
    return render(request, "helpdesk/categories.html", {"title": "Helpdesk — kategorie", "categories": rows, "queues": queues})


@router.get("/categories/new", response_class=HTMLResponse)
def category_new_form(request: Request, db: Session = Depends(get_db)):
    queues = list(db.scalars(select(models.HelpdeskQueue).order_by(models.HelpdeskQueue.sort_order)).all())
    return render(request, "helpdesk/category_form.html", {"title": "Nowa kategoria", "queues": queues})


@router.post("/categories/new", dependencies=[Depends(require_helpdesk_write)])
def category_new_submit(request: Request, db: Session = Depends(get_db), name: str = Form(...), queue_id: int = Form(...)):
    c = models.HelpdeskCategory(name=name.strip()[:128], queue_id=queue_id, sort_order=0)
    db.add(c)
    db.flush()
    record_audit(db, "create", resource_type="helpdesk_category", resource_id=c.id, details=f"name: {c.name}", request=request)
    db.commit()
    return RedirectResponse("/helpdesk/categories", status_code=303)


@router.post("/categories/{cat_id}/delete", dependencies=[Depends(require_helpdesk_write)])
def category_delete(cat_id: int, request: Request, db: Session = Depends(get_db)):
    c = db.get(models.HelpdeskCategory, cat_id)
    if c:
        record_audit(db, "delete", resource_type="helpdesk_category", resource_id=c.id, details=f"name: {c.name}", request=request)
        db.delete(c)
        db.commit()
    return RedirectResponse("/helpdesk/categories", status_code=303)


@router.get("/search", response_class=HTMLResponse)
def helpdesk_search(
    request: Request,
    db: Session = Depends(get_db),
    q: str | None = Query(None),
    status: str | None = Query(None),
    queue_id: int | None = Query(None),
):
    stmt = select(models.SupportTicket).options(selectinload(models.SupportTicket.customer)).order_by(models.SupportTicket.id.desc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(models.SupportTicket.title.ilike(term), models.SupportTicket.body.ilike(term)))
    if status and status in [s.value for s in models.TicketStatus]:
        stmt = stmt.where(models.SupportTicket.status == models.TicketStatus(status))
    if queue_id:
        stmt = stmt.where(models.SupportTicket.queue_id == queue_id)
    
    rows = list(db.scalars(stmt).all())
    custs = {c.id: c for c in db.scalars(select(models.Customer)).all()}
    queues = list(db.scalars(select(models.HelpdeskQueue).order_by(models.HelpdeskQueue.sort_order)).all())
    return render(request, "helpdesk/search.html", {
        "title": "Szukaj zgłoszeń", "tickets": rows, "customers": custs, "queues": queues,
        "search_q": q or "", "search_status": status or "", "search_queue_id": queue_id
    })


@router.get("/reports", response_class=HTMLResponse)
def helpdesk_reports(request: Request, db: Session = Depends(get_db)):
    status_rows = list(db.execute(select(models.SupportTicket.status, func.count(models.SupportTicket.id)).group_by(models.SupportTicket.status)).all())
    total = db.scalar(select(func.count()).select_from(models.SupportTicket)) or 0
    return render(request, "helpdesk/reports.html", {"title": "Helpdesk — raporty", "by_status": status_rows, "total_tickets": total})


@router.get("/reports.csv")
def helpdesk_reports_csv(db: Session = Depends(get_db)):
    rows = list(db.scalars(select(models.SupportTicket).options(selectinload(models.SupportTicket.customer)).order_by(models.SupportTicket.id.desc())).all())
    buf = io.StringIO()
    w = csv.writer(buf, delimiter=";")
    w.writerow(["id", "tytul", "status", "klient", "data"])
    for t in rows:
        cc = t.customer.customer_code if t.customer else ""
        w.writerow([t.id, t.title, t.status.value, cc, t.created_at.isoformat() if t.created_at else ""])
    return Response(content="\ufeff" + buf.getvalue(), media_type="text/csv", headers={"Content-Disposition": 'attachment; filename="helpdesk.csv"'})


@router.get("/tickets/new", response_class=HTMLResponse)
def ticket_new_form(request: Request, db: Session = Depends(get_db)):
    custs = list(db.scalars(select(models.Customer).order_by(models.Customer.last_name)).all())
    queues = list(db.scalars(select(models.HelpdeskQueue).order_by(models.HelpdeskQueue.sort_order)).all())
    return render(request, "helpdesk/ticket_form.html", {"title": "Nowe zgłoszenie", "customers": custs, "queues": queues})


@router.post("/tickets/new", dependencies=[Depends(require_helpdesk_write)])
def ticket_new_submit(
    request: Request,
    db: Session = Depends(get_db),
    title: str = Form(...),
    queue_id: str | None = Form(None),
    category_id: str | None = Form(None),
    body: str | None = Form(None),
    customer_id: int | None = Form(None),
    status: str = Form("open"),
):
    qid = int(queue_id) if queue_id and str(queue_id).isdigit() else None
    cid = int(category_id) if category_id and str(category_id).isdigit() else None
    
    # Validate with Pydantic
    try:
        data = schemas.SupportTicketCreate(
            title=title.strip(),
            body=(body or "").strip() or None,
            customer_id=customer_id or None,
            status=models.TicketStatus(status),
            queue_id=qid,
            category_id=cid,
        )
    except Exception as e:
        raise e

    t = models.SupportTicket(
        title=data.title,
        body=data.body,
        customer_id=data.customer_id,
        status=data.status,
    )
    _set_ticket_queue_fields(db, t, data.queue_id, data.category_id)
    db.add(t)
    db.flush()
    record_audit(db, "create", resource_type="support_ticket", resource_id=t.id, details=f"title: {t.title}", request=request)
    db.commit()
    return RedirectResponse("/helpdesk/tickets", status_code=303)


@router.get("/tickets/{ticket_id}", response_class=HTMLResponse)
def ticket_detail(ticket_id: int, request: Request, db: Session = Depends(get_db)):
    t = db.scalar(
        select(models.SupportTicket)
        .options(selectinload(models.SupportTicket.customer))
        .where(models.SupportTicket.id == ticket_id)
    )
    if not t: return RedirectResponse("/helpdesk/tickets", status_code=302)
    service_staff = _service_staff(db)
    return render(request, "helpdesk/ticket_detail.html", {"title": f"Zgłoszenie #{t.id}", "ticket": t, "service_staff": service_staff})


@router.post("/tickets/{ticket_id}/status", dependencies=[Depends(require_helpdesk_write)])
def ticket_set_status(ticket_id: int, db: Session = Depends(get_db), status: str = Form(...)):
    t = db.get(models.SupportTicket, ticket_id)
    if t:
        t.status = models.TicketStatus(status)
        db.commit()
    return RedirectResponse(f"/helpdesk/tickets/{ticket_id}", status_code=303)


@router.post("/tickets/{ticket_id}/assign", dependencies=[Depends(require_helpdesk_write)])
def ticket_assign(ticket_id: int, request: Request, db: Session = Depends(get_db), assignee_id: str | None = Form(None)):
    t = db.get(models.SupportTicket, ticket_id)
    if not t: return RedirectResponse("/helpdesk/tickets", status_code=303)
    t.assignee_id = int(assignee_id) if assignee_id and str(assignee_id).isdigit() else None
    db.commit()
    return RedirectResponse(f"/helpdesk/tickets/{ticket_id}", status_code=303)

