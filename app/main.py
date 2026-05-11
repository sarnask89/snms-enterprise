from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqladmin import Admin

from app.settings import settings
from app.router_aggregator import get_core_router
from app.init_db import init_all, run_migrations
from app.database import get_db, engine
from app.admin_auth import authentication_backend
from app.admin_views import all_views
from app.config import BASE_DIR
from app.middleware_portal import PortalUserMiddleware
from app.middleware_logging import RequestLoggingMiddleware
from app.errors import setup_error_handlers
from app.deps import require_admin
from app.logger_utils import setup_logging

from app.services.sync_service import sync_service
from app.services.netflow_service import netflow_service
from app.services.registry import service_registry

setup_logging()
service_registry.register(sync_service)
service_registry.register(netflow_service)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_all()
    await service_registry.start_all()
    yield
    await service_registry.stop_all()

app = FastAPI(title=settings.APP_DISPLAY_NAME, lifespan=lifespan)
setup_error_handlers(app)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(PortalUserMiddleware)
app.add_middleware(SessionMiddleware, secret_key=settings.CRM_SECRET_KEY)

# SQLAdmin setup
sql_admin = Admin(
    app, 
    engine, 
    authentication_backend=authentication_backend,
    base_url="/db-admin",
    title="SNMS DB Admin",
    logo_url="/static/img/logo.png"
)

for view in all_views:
    sql_admin.add_view(view)

static_dir = BASE_DIR / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

app.include_router(get_core_router())

@app.get("/health", tags=["system"])
def health_check(db: Session = Depends(get_db)):
    """Weryfikacja dostępności bazy danych."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

@app.post("/api/system/migrate", tags=["system"], dependencies=[Depends(require_admin)])
def run_system_migrations(background_tasks: BackgroundTasks):
    """Zleca uruchomienie migracji Alembic w tle, by nie blokować procesu głównego."""
    import asyncio
    background_tasks.add_task(asyncio.to_thread, run_migrations)
    return {"message": "Migracje zlecone do uruchomienia w tle."}
