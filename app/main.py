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
from app.database import get_db
from app.deps import require_admin
from app.routers import (
    admin,
    auth,
    customer_groups,
    customers,
    dashboard,
    finances,
    ip_networks,
    netdevices,
    net_nodes,
    node_groups,
    nodes,
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
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_all()
    yield


app = FastAPI(title="CRM Portal", lifespan=lifespan)
setup_error_handlers(app)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(PortalUserMiddleware)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

static_dir = BASE_DIR / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Strictly Core Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(customers.router)
app.include_router(customer_groups.router)
app.include_router(net_nodes.router)
app.include_router(nodes.router)
app.include_router(node_groups.router)
app.include_router(subscriptions.router)
app.include_router(finances.router)
app.include_router(ip_networks.router)
app.include_router(netdevices.router)
app.include_router(teryt.router)
app.include_router(teryt.public_api)
app.include_router(network_discovery.router)
app.include_router(diagnostics.router)
app.include_router(pit.router)
app.include_router(helpdesk.router)
app.include_router(documents.router)
app.include_router(config_snms.router)
app.include_router(snms_entities.router)
app.include_router(addresses.router)

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
