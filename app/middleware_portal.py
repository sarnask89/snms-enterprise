"""Ładuje użytkownika portalu z sesji i sprawdza dostęp do ścieżki wg widocznego menu."""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import HTMLResponse

from app.database import SessionLocal
from app import models
from app.nav_access import path_allowed_for_portal, visible_nav_items


def _path_open(path: str) -> bool:
    p = path.split("?", 1)[0]
    if p.startswith("/static"):
        return True
    if p.startswith("/teryt/"):
        return True
    if p in ("/login", "/logout", "/favicon.ico"):
        return True
    if p.startswith("/docs") or p.startswith("/redoc") or p == "/openapi.json":
        return True
    return False


class PortalUserMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.portal_user = None
        request.state.visible_url_prefixes = []
        request.state.visible_menu_keys: set[str] = set()
        request.state.nav_items_for_template = None

        uid = request.session.get("user_id")
        if uid is not None:
            db = SessionLocal()
            try:
                user = db.get(models.PortalUser, int(uid))
                if user and user.active:
                    request.state.portal_user = user
                    items = visible_nav_items(db, user.role)
                    request.state.nav_items_for_template = items
                    request.state.visible_url_prefixes = [i.url_path for i in items]
                    request.state.visible_menu_keys = {i.key for i in items}
            except (TypeError, ValueError):
                pass
            finally:
                db.close()

        path = request.url.path
        if request.method in ("GET", "HEAD") and not _path_open(path):
            u = request.state.portal_user
            if u is not None:
                urls = request.state.visible_url_prefixes
                keys = request.state.visible_menu_keys
                allowed = path_allowed_for_portal(path, urls, keys)
                if not allowed and "teryt" in keys:
                    if path.startswith("/teryt/partials") or path.startswith("/teryt/ws"):
                        allowed = True
                # Legacy `/nodes/*` → `/customer-devices/*` — dostęp jak do modułu komputerów (klucz lub stary URL w menu).
                if not allowed and path.startswith("/nodes"):
                    allowed = bool(
                        keys & {
                            "nodes",
                            "node_add",
                            "nodes_search",
                            "node_sessions",
                            "node_notices",
                            "node_reports",
                        }
                    ) or any(
                        vu.rstrip("/") == "/customer-devices"
                        or vu.startswith("/customer-devices/")
                        or vu.rstrip("/") == "/nodes"
                        or vu.startswith("/nodes/")
                        for vu in urls
                    )
                if not allowed:
                    return HTMLResponse(
                        "<!DOCTYPE html><html><body><h1>403</h1><p>Brak dostępu do tej ścieżki w menu dla Twojej roli.</p>"
                        '<p><a href="/">Pulpit</a></p></body></html>',
                        status_code=403,
                    )

        return await call_next(request)
