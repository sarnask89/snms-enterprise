from fastapi import APIRouter
from app.routers import (
    admin, auth, bulk, customer_groups, customers, dashboard, finances,
    ip_networks, netdevices, net_nodes, customer_device_groups,
    customer_devices, subscriptions, teryt, network_discovery,
    diagnostics, pit, helpdesk, documents, config_snms, snms_entities,
    addresses, search, reports, client_auth,
    client_portal, builder, monitoring, network_tools,
    monitor_config, legacy_node_paths, olt_discovery, api_v1
)
# from app.generated import office_equipment, vehicles_cli, vehicles_visual, ext_services_cli, ext_services_visual
from app.routers import stats
from app.api.v2.aggregator import get_api_v2_router

def get_core_router():
    router = APIRouter()
    router.include_router(get_api_v2_router())
    router.include_router(api_v1.router)
    router.include_router(auth.router)
    router.include_router(bulk.router)
    router.include_router(dashboard.router)
    router.include_router(admin.router)
    router.include_router(customers.router)
    router.include_router(customer_groups.router)
    router.include_router(net_nodes.router)
    router.include_router(customer_devices.router)
    router.include_router(customer_device_groups.router)
    router.include_router(subscriptions.router)
    router.include_router(finances.router)
    router.include_router(ip_networks.router)
    router.include_router(netdevices.router)
    router.include_router(teryt.router)
    router.include_router(teryt.public_api)
    router.include_router(reports.router)
    router.include_router(legacy_node_paths.router)
    
    # Client Portal
    router.include_router(client_auth.router)
    router.include_router(client_portal.router)
    
    # Advanced / Tools
    router.include_router(network_discovery.router)
    router.include_router(diagnostics.router)
    router.include_router(pit.router)
    router.include_router(helpdesk.router)
    router.include_router(documents.router)
    router.include_router(config_snms.router)
    router.include_router(snms_entities.router)
    router.include_router(addresses.router)
    router.include_router(search.router)
    router.include_router(builder.router)
    
    # Monitoring & Stats
    router.include_router(stats.router)
    router.include_router(monitoring.router)
    router.include_router(network_tools.router)
    router.include_router(monitor_config.router)
    router.include_router(olt_discovery.router)
    
    return router
