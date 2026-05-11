from fastapi import Request
from fastapi.templating import Jinja2Templates
import jinja2

from app.config import APP_DISPLAY_NAME, BASE_DIR
from app.database import db_manager
from app.models import UserRole
from app.nav_access import grouped_visible_nav, visible_nav_items
from app.services.ui_service import ui_service

# Preconfigure Jinja2 environment to avoid DeprecationWarning
env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(str(BASE_DIR / "templates")),
    extensions=["jinja2.ext.do"]
)

templates = Jinja2Templates(env=env)


def render(
    request: Request,
    name: str,
    context: dict | None = None,
    *,
    status_code: int | None = None,
):
    """Render szablonu z kontekstem nawigacji i flagą zapisu (rola view = tylko odczyt)."""
    ctx = dict(context or {})
    u = getattr(request.state, "portal_user", None)
    ctx["portal_user"] = u
    c = getattr(request.state, "client_user", None)
    ctx["client_user"] = c

    cached = getattr(request.state, "nav_items_for_template", None)
    if u:
        if cached is not None:
            ctx["nav_items"] = cached
            ctx["nav_groups"] = grouped_visible_nav(cached)
        else:
            db = db_manager.SessionLocal()
            try:
                items = visible_nav_items(db, u.role)
                ctx["nav_items"] = items
                ctx["nav_groups"] = grouped_visible_nav(items)
            finally:
                db.close()
        r = u.role
        ctx["can_write_crm"] = r in (UserRole.admin, UserRole.manager)
        ctx["can_write_helpdesk"] = r in (UserRole.admin, UserRole.manager, UserRole.service)
        ctx["can_write_messages"] = r in (UserRole.admin, UserRole.manager, UserRole.service)
        ctx["can_mutate"] = ctx["can_write_crm"]
        ctx["visible_menu_keys"] = getattr(request.state, "visible_menu_keys", set())
    else:
        ctx["nav_items"] = []
        ctx["nav_groups"] = []
        ctx["can_write_crm"] = False
        ctx["can_write_helpdesk"] = False
        ctx["can_write_messages"] = False
        ctx["can_mutate"] = False
        ctx["visible_menu_keys"] = set()
    ctx.setdefault("title", "")
    ctx.setdefault("app_name", APP_DISPLAY_NAME)
    
    # UI Plugin Integration
    ctx["ui"] = ui_service.get_theme_assets(request)
    ctx["breadcrumbs"] = ui_service.get_breadcrumb(request, ctx["title"])
    
    resp = templates.TemplateResponse(request, name, ctx)
    if status_code is not None:
        resp.status_code = status_code
    return resp
