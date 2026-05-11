from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import BASE_DIR, SECRET_KEY
from app.middleware_portal import PortalUserMiddleware
from app.middleware_logging import RequestLoggingMiddleware
from app.errors import setup_error_handlers
from app.init_db import init_all, run_migrations
from app.database import get_db, engine
from app.logger_utils import setup_logging
from app.deps import require_admin
from sqladmin import Admin

setup_logging()
from app.admin_auth import authentication_backend
from app.admin_views import all_views
from app.routers import (
    admin,
    auth,
    bulk,
    customer_groups,
    customers,
    dashboard,
    finances,
    ip_networks,
    netdevices,
    net_nodes,
    customer_device_groups,
    customer_devices,
    subscriptions,
    teryt,
    network_discovery,
    diagnostics,
    pit,
    helpdesk,
    documents,
    config_snms,
    snms_entities,
    addresses,
    search,
    reports,
    client_auth,
    client_portal,
    builder,
    monitoring,
    network_tools,
    monitor_config,
    legacy_node_paths,
)



from app.services.sync_service import sync_service

@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_all()
    await sync_service.start()
    yield
    await sync_service.stop()


app = FastAPI(title="CRM Portal", lifespan=lifespan)
setup_error_handlers(app)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(PortalUserMiddleware)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# Initialize SQLAdmin
sql_admin = Admin(
    app, 
    engine, 
    authentication_backend=authentication_backend,
    base_url="/db-admin",
    title="SNMS DB Admin",
    logo_url="/static/img/logo.png" # Assuming there is a logo, or we can use text
)

for view in all_views:
    sql_admin.add_view(view)

static_dir = BASE_DIR / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Strictly Core Routers
app.include_router(auth.router)
app.include_router(bulk.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(customers.router)
app.include_router(customer_groups.router)
app.include_router(net_nodes.router)
app.include_router(customer_devices.router)
app.include_router(customer_device_groups.router)
app.include_router(subscriptions.router)
app.include_router(finances.router)
app.include_router(ip_networks.router)
app.include_router(netdevices.router)
app.include_router(teryt.router)
app.include_router(teryt.public_api)
app.include_router(reports.router)
app.include_router(legacy_node_paths.router)

# Client Portal Routers
app.include_router(client_auth.router)
app.include_router(client_portal.router)

app.include_router(network_discovery.router)
app.include_router(diagnostics.router)
app.include_router(pit.router)
app.include_router(helpdesk.router)
app.include_router(documents.router)
app.include_router(config_snms.router)
app.include_router(snms_entities.router)
app.include_router(addresses.router)
app.include_router(search.router)
from app.generated import office_equipment, vehicles_cli, vehicles_visual, ext_services_cli, ext_services_visual
from app.routers import stats
app.include_router(builder.router)
app.include_router(office_equipment.router)
app.include_router(vehicles_cli.router)
app.include_router(vehicles_visual.router)
app.include_router(ext_services_cli.router)
app.include_router(ext_services_visual.router)
app.include_router(stats.router)
app.include_router(monitoring.router)
app.include_router(network_tools.router)
app.include_router(monitor_config.router)





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
