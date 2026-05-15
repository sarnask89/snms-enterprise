import { Router } from 'express';
import { router as customersRouter } from './routers/customers.js';
import { router as customerGroupsRouter } from './routers/customer_groups.js';
import { router as customerDevicesRouter } from './routers/customer_devices.js';
import { router as addressesRouter } from './routers/addresses.js';
import { router as adminRouter } from './routers/admin.js';
import { router as documentsRouter } from './routers/documents.js';
import { router as diagnosticsRouter } from './routers/diagnostics.js';
import { router as financesRouter } from './routers/finances.js';
import { router as helpdeskRouter } from './routers/helpdesk.js';
import { router as netNodesRouter } from './routers/net_nodes.js';
import { router as ipNetworksRouter } from './routers/ip_networks.js';
import { router as netDevicesRouter } from './routers/netdevices.js';
import { router as networkDiscoveryRouter } from './routers/network_discovery.js';
import { router as pitRouter } from './routers/pit.js';
import { router as subscriptionsRouter } from './routers/subscriptions.js';
import { router as architectRouter } from './routers/architect.js';
import { router as dashboardRouter } from './routers/dashboard.js';
import { router as terytRouter } from './routers/teryt.js';
import { ACTIVE_RUNTIME_MODULES, MODULE_MIGRATION_STATUS } from './module_status.js';

export function getCoreRouter(): Router {
    const router = Router();

    // v1 API routes
    const v1Router = Router();
    v1Router.get('/module-status', (_req, res) => {
        res.json({
            activeModules: ACTIVE_RUNTIME_MODULES,
            migrationStatus: MODULE_MIGRATION_STATUS
        });
    });
    v1Router.use('/admin', adminRouter);
    v1Router.use('/dashboard', dashboardRouter);
    v1Router.use('/addresses', addressesRouter);
    v1Router.use('/customers', customersRouter);
    v1Router.use('/customer-groups', customerGroupsRouter);
    v1Router.use('/customer-devices', customerDevicesRouter);
    v1Router.use('/documents', documentsRouter);
    v1Router.use('/diagnostics', diagnosticsRouter);
    v1Router.use('/finances', financesRouter);
    v1Router.use('/helpdesk', helpdeskRouter);
    v1Router.use('/net-nodes', netNodesRouter);
    v1Router.use('/ip-networks', ipNetworksRouter);
    v1Router.use('/net-devices', netDevicesRouter);
    v1Router.use('/network-discovery', networkDiscoveryRouter);
    v1Router.use('/pit', pitRouter);
    v1Router.use('/subscriptions', subscriptionsRouter);
    v1Router.use('/teryt', terytRouter);
    v1Router.use('/architect', architectRouter);

    router.use('/v1', v1Router);

    return router;
}
