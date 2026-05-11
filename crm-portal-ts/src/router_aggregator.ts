import { APIRouter } from 'express';
import * as admin from './routers/admin';
import * as auth from './routers/auth';
import * as bulk from './routers/bulk';
import * as customer_groups from './routers/customer-groups';
import * as customers from './routers/customers';
import * as dashboard from './routers/dashboard';
import * as finances from './routers/finances';
import * as ip_networks from './routers/ip-networks';
import * as netdevices from './routers/netdevices';
import * as net_nodes from './routers/net-nodes';
import * as customer_device_groups from './routers/customer-device-groups';
import * as customer_devices from './routers/customer-devices';
import * as subscriptions from './routers/subscriptions';
import * as teryt from './routers/teryt';
import * as network_discovery from './routers/network-discovery';
import * as diagnostics from './routers/diagnostics';
import * as pit from './routers/pit';
import * as helpdesk from './routers/helpdesk';
import * as documents from './routers/documents';
import * as config_snms from './routers/config-snms';
import * as snms_entities from './routers/snms-entities';
import * as addresses from './routers/addresses';
import * as search from './routers/search';
import * as reports from './routers/reports';
import * as client_auth from './routers/client-auth';
import * as client_portal from './routers/client-portal';
import * as builder from './routers/builder';
import * as monitoring from './routers/monitoring';
import * as network_tools from './routers/network-tools';
import * as monitor_config from './routers/monitor-config';
import * as olt_discovery from './routers/olt-discovery';

function getCoreRouter(): APIRouter {
    const router = new APIRouter();
    router.use(auth.router);
    router.use(bulk.router);
    router.use(dashboard.router);
    router.use(admin.router);
    router.use(customers.router);
    router.use(customer_groups.router);
    router.use(net_nodes.router);
    router.use(customer_devices.router);
    router.use(customer_device_groups.router);
    router.use(subscriptions.router);
    router.use(finances.router);
    router.use(ip_networks.router);
    router.use(netdevices.router);
    router.use(teryt.router);
    router.use(teryt.public_api);
    router.use(reports.router);
    router.use(legacy_node_paths.router);

    // Client Portal
    router.use(client_auth.router);
    router.use(client_portal.router);

    // Advanced / Tools
    router.use(network_discovery.router);
    router.use(diagnostics.router);
    router.use(pit.router);
    router.use(helpdesk.router);
    router.use(documents.router);
    router.use(config_snms.router);
    router.use(snms_entities.router);
    router.use(addresses.router);
    router.use(search.router);
    router.use(builder.router);

    // Monitoring & Stats
    router.use(stats.router);
    router.use(monitoring.router);
    router.use(network_tools.router);
    router.use(monitor_config.router);
    router.use(olt_discovery.router);

    return router;
}
