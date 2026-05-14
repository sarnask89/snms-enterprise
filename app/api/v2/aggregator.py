from fastapi import APIRouter
from app.api.v2 import auth, dashboard, customers, network, finances, helpdesk, devices, assistant

def get_api_v2_router():
    router = APIRouter(prefix="/api/v2")
    router.include_router(auth.router)
    router.include_router(dashboard.router)
    router.include_router(customers.router)
    router.include_router(network.router)
    router.include_router(finances.router)
    router.include_router(helpdesk.router)
    # Device configuration import/export endpoints
    router.include_router(devices.router)
    # AI assistant endpoints
    router.include_router(assistant.router)
    return router
