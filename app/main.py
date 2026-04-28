from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.config import BASE_DIR, SECRET_KEY
from app.middleware_portal import PortalUserMiddleware
from app.middleware_logging import RequestLoggingMiddleware
from app.errors import setup_error_handlers
from app.init_db import init_all
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
