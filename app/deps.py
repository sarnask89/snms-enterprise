import os
from fastapi import HTTPException, Request, status

from app.models import UserRole


def _auth_enabled() -> bool:
    """Reads AUTH_ENABLED env var at call time — not cached, always fresh."""
    val = os.environ.get("AUTH_ENABLED", "true")
    return val.lower() not in ("false", "0", "no", "off")


def login_required(request: Request) -> None:
    if not _auth_enabled():
        return
    if not getattr(request.state, "portal_user", None):
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/login"},
        )


def verify_session(request: Request) -> None:
    login_required(request)


def require_can_mutate(request: Request) -> None:
    """Kompatybilność: jak require_business_write (CRM, nie helpdesk)."""
    require_business_write(request)


def require_business_write(request: Request) -> None:
    """Zapis danych biznesowych (klienci, finanse, dokumenty, sieci, urządzenia) — admin lub manager."""
    if not _auth_enabled():
        return
    verify_session(request)
    r = request.state.portal_user.role
    if r == UserRole.view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Twoja rola ma tylko podgląd.",
        )
    if r == UserRole.service:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Obsługa zgłoszeń: użyj modułu Helpdesk. Zapis do tej sekcji mają administrator i manager.",
        )


def require_helpdesk_write(request: Request) -> None:
    """Tworzenie i edycja zgłoszeń — admin, manager lub service."""
    if not _auth_enabled():
        return
    verify_session(request)
    if request.state.portal_user.role == UserRole.view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Twoja rola ma tylko podgląd.",
        )


def require_messaging_write(request: Request) -> None:
    """Wiadomości i szablony — admin, manager, service (nie view)."""
    if not _auth_enabled():
        return
    verify_session(request)
    if request.state.portal_user.role == UserRole.view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Twoja rola ma tylko podgląd.",
        )


def require_admin(request: Request) -> None:
    if not _auth_enabled():
        return
    verify_session(request)
    if request.state.portal_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Wymagana rola administratora.",
        )


def require_admin_or_manager(request: Request) -> None:
    if not _auth_enabled():
        return
    verify_session(request)
    if request.state.portal_user.role not in (UserRole.admin, UserRole.manager):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Wymagana rola administratora lub manager.",
        )

def require_client(request: Request) -> None:
    if not _auth_enabled():
        return
    if not getattr(request.state, "client_user", None):
        from fastapi import status
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/client/login"},
        )

