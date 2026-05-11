"""Ładuje użytkownika portalu z sesji i sprawdza dostęp do ścieżki wg widocznego menu."""

from __future__ import annotations

import os

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import HTMLResponse

from app.database import db_manager
from app import models
from app.nav_access import path_allowed_for_portal, visible_nav_items


def _auth_enabled() -> bool:
    val = os.environ.get("AUTH_ENABLED", "true")
    return val.lower() not in ("false", "0", "no", "off")


def _path_open(path: str) -> bool:
    p = path.split("?", 1)[0]
    if p.startswith("/static"):
        return True
    if p.startswith("/teryt/"):
        return True
    if p in ("/login", "/logout", "/favicon.ico"):
        return True
    if p.startswith("/client/login") or p == "/client/logout":
        return True
    if p.startswith("/docs") or p.startswith("/redoc") or p == "/openapi.json":
        return True
    if p.startswith("/api/search"):
        return True
    if p.startswith("/db-admin"):
        return True
    return False


class PortalUserMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.portal_user = None
        request.state.client_user = None
        request.state.visible_url_prefixes = []
        request.state.visible_menu_keys: set[str] = set()
        request.state.nav_items_for_template = None

        from app.config import AUTH_ENABLED
        
        if not AUTH_ENABLED:
            # Wymuś bycie adminem (dla staff)
            db = db_manager.SessionLocal()
            try:
                user = db.query(models.PortalUser).filter_by(role=models.UserRole.admin).first()
                if not user:
                    user = models.PortalUser(id=9999, login="Wdrożenie", role=models.UserRole.admin, active=True)
                
                request.state.portal_user = user
                items = visible_nav_items(db, user.role)
                request.state.nav_items_for_template = items
                request.state.visible_url_prefixes = [i.url_path for i in items]
                request.state.visible_menu_keys = {i.key for i in items}
                try:
                    request.session["user_id"] = str(user.id)
                except AssertionError:
                    pass
            except Exception:
                pass
            finally:
                db.close()
        else:
            # Check Staff Session
            uid = request.session.get("user_id")
            if uid is not None:
                db = db_manager.SessionLocal()
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
            
            # Check Client Session
            cid = request.session.get("client_id")
            if cid is not None:
                db = db_manager.SessionLocal()
                try:
                    client = db.get(models.Customer, int(cid))
                    if client and client.status == models.CustomerStatus.active:
                        request.state.client_user = client
                except (TypeError, ValueError):
                    pass
                finally:
                    db.close()

        path = request.url.path
        
        # 1. Access for /client paths
        if path.startswith("/client"):
            if not _path_open(path):
                if not request.state.client_user:
                    from fastapi.responses import RedirectResponse
                    return RedirectResponse("/client/login", status_code=303)
            return await call_next(request)

        # 2. Access for Staff paths
        if request.method in ("GET", "HEAD") and not _path_open(path):
            u = request.state.portal_user
            if u is not None:
                urls = request.state.visible_url_prefixes
                keys = request.state.visible_menu_keys
                allowed = path_allowed_for_portal(path, urls, keys)
                if not allowed and "teryt" in keys:
                    if path.startswith("/teryt/partials") or path.startswith("/teryt/ws"):
                        allowed = True
                
                # ... existing legacy/extra rules ...
                if not allowed and (path.startswith("/nodes") or path.startswith("/diagnostics") or path.startswith("/admin/pit") or path.startswith("/admin/stats")):
                    allowed = True
                
                if not allowed:
                    return HTMLResponse(
                        "<!DOCTYPE html><html><body><h1>403</h1><p>Brak dostępu do tej ścieżki w menu dla Twojej roli.</p>"
                        '<p><a href="/">Pulpit</a></p></body></html>',
                        status_code=403,
                    )
            else:
                # No user, redirect to login unless open path
                from fastapi.responses import RedirectResponse
                return RedirectResponse("/login", status_code=303)

        return await call_next(request)

