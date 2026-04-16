from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.config import BASE_DIR, SECRET_KEY
from app.middleware_portal import PortalUserMiddleware
from app.init_db import init_all
from app.routers import (
    admin,
    auth,
    config_snms,
    customer_groups,
    customers,
    dashboard,
    documents,
    finances,
    helpdesk,
    ip_networks,
    legacy_node_paths,
    netdevices,
    net_nodes,
    node_groups,
    nodes,
    snms_entities,
    subscriptions,
    teryt,
    addresses,
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_all()
    yield


app = FastAPI(title="CRM Portal", lifespan=lifespan)
# PortalUserMiddleware musi być wewnętrzny względem SessionMiddleware (dodany wcześniej).
app.add_middleware(PortalUserMiddleware)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

static_dir = BASE_DIR / "static"
if static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(customers.router)
app.include_router(customer_groups.router)
app.include_router(legacy_node_paths.router)
app.include_router(net_nodes.router)
app.include_router(nodes.router)
app.include_router(node_groups.router)
app.include_router(subscriptions.router)
app.include_router(finances.router)
app.include_router(helpdesk.router)
app.include_router(documents.router)
app.include_router(ip_networks.router)
app.include_router(netdevices.router)
app.include_router(teryt.router)
app.include_router(teryt.public_api)
app.include_router(addresses.router)
app.include_router(config_snms.router)
app.include_router(snms_entities.router)