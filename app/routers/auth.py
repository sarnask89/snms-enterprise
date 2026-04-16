from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.audit import record_audit
from app.database import get_db
from app.deps import verify_session
from app.security import hash_password, verify_password
from app.templating import render

router = APIRouter()


@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    if request.session.get("user_id"):
        return RedirectResponse("/", status_code=302)
    return render(request, "login.html", {"error": None})


@router.post("/login", response_class=HTMLResponse)
def login_submit(
    request: Request,
    db: Session = Depends(get_db),
    username: str = Form(...),
    password: str = Form(...),
):
    row = db.scalars(
        select(models.PortalUser).where(models.PortalUser.username == username.strip())
    ).first()
    if row and row.active and verify_password(password, row.password_hash):
        request.session["user_id"] = row.id
        request.session.pop("user", None)
        record_audit(db, "login", resource_type="portal_user", resource_id=row.id, actor=row, request=request)
        db.commit()
        return RedirectResponse("/", status_code=302)
    record_audit(db, "login_failure", details=f"user: {username}", request=request)
    db.commit()
    return render(
        request,
        "login.html",
        {"error": "Nieprawidłowy login lub hasło."},
        status_code=401,
    )


@router.get("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    record_audit(db, "logout", request=request)
    db.commit()
    request.session.clear()
    return RedirectResponse("/login", status_code=302)


@router.get("/auth/change-password", response_class=HTMLResponse, dependencies=[Depends(verify_session)])
def change_password_form(request: Request):
    return render(request, "auth/change_password.html", {"title": "Zmiana hasła", "error": None})


@router.post("/auth/change-password", response_class=HTMLResponse, dependencies=[Depends(verify_session)])
def change_password_submit(
    request: Request,
    db: Session = Depends(get_db),
    current_password: str = Form(...),
    new_password: str = Form(...),
    new_password_2: str = Form(...),
):
    uid = request.session.get("user_id")
    u = db.get(models.PortalUser, int(uid)) if uid else None
    if not u:
        return RedirectResponse("/login", status_code=302)
    if new_password != new_password_2:
        return render(
            request,
            "auth/change_password.html",
            {"title": "Zmiana hasła", "error": "Nowe hasła nie są takie same."},
            status_code=400,
        )
    if len(new_password.strip()) < 6:
        return render(
            request,
            "auth/change_password.html",
            {"title": "Zmiana hasła", "error": "Nowe hasło min. 6 znaków."},
            status_code=400,
        )
    if not verify_password(current_password, u.password_hash):
        return render(
            request,
            "auth/change_password.html",
            {"title": "Zmiana hasła", "error": "Aktualne hasło jest nieprawidłowe."},
            status_code=400,
        )
    u.password_hash = hash_password(new_password.strip())
    record_audit(db, "change_password", resource_type="portal_user", resource_id=u.id, actor=u, request=request)
    db.commit()
    return render(
        request,
        "auth/change_password.html",
        {"title": "Zmiana hasła", "error": None, "ok": True},
    )
