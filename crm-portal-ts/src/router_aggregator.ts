import { Router } from 'express';
import {
    ADMIN_ONLY_ROLES,
    createAccessMiddleware,
    FINANCE_WRITE_ROLES,
    INTERNAL_READ_ROLES,
    INTERNAL_WRITE_ROLES,
    type AccessPolicy,
} from './access_control.js';
import { router as customersRouter } from './routers/customers.js';
import { router as customerGroupsRouter } from './routers/customer_groups.js';
import { router as customerDevicesRouter } from './routers/customer_devices.js';
import { router as addressesRouter } from './routers/addresses.js';
import { router as adminRouter } from './routers/admin.js';
import { router as authRouter } from './routers/auth.js';
import { router as configSnmsRouter } from './routers/config_snms.js';
import { router as documentsRouter } from './routers/documents.js';
import { router as diagnosticsRouter } from './routers/diagnostics.js';
import { router as financesRouter } from './routers/finances.js';
import { router as helpdeskRouter } from './routers/helpdesk.js';
import { router as netNodesRouter } from './routers/net_nodes.js';
import { router as ipNetworksRouter } from './routers/ip_networks.js';
import { router as monitoringRouter } from './routers/monitoring.js';
import { router as netDevicesRouter } from './routers/netdevices.js';
import { router as networkDiscoveryRouter } from './routers/network_discovery.js';
import { router as pitRouter } from './routers/pit.js';
import { router as reportsRouter } from './routers/reports.js';
import { router as searchRouter } from './routers/search.js';
import { router as snmsEntitiesRouter } from './routers/snms_entities.js';
import { router as statsRouter } from './routers/stats.js';
import { router as subscriptionsRouter } from './routers/subscriptions.js';
import { router as architectRouter } from './routers/architect.js';
import { router as dashboardRouter } from './routers/dashboard.js';
import { router as terytRouter } from './routers/teryt.js';
import { ACTIVE_RUNTIME_MODULES, MODULE_MIGRATION_STATUS } from './module_status.js';

const standardPolicy: AccessPolicy = {
    readRoles: [...INTERNAL_READ_ROLES],
    writeRoles: [...INTERNAL_WRITE_ROLES],
};

const financePolicy: AccessPolicy = {
    readRoles: [...INTERNAL_READ_ROLES],
    writeRoles: [...FINANCE_WRITE_ROLES],
};

const adminPolicy: AccessPolicy = {
    readRoles: [...ADMIN_ONLY_ROLES],
    writeRoles: [...ADMIN_ONLY_ROLES],
};

const internalReadOnlyPolicy: AccessPolicy = {
    readRoles: [...INTERNAL_READ_ROLES],
    writeRoles: [...INTERNAL_READ_ROLES],
};

function mountProtectedRouter(parent: Router, path: string, policy: AccessPolicy, child: Router) {
    parent.use(path, createAccessMiddleware(policy), child);
}

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
    v1Router.use('/auth', authRouter);
    mountProtectedRouter(v1Router, '/admin', adminPolicy, adminRouter);
    mountProtectedRouter(v1Router, '/config', adminPolicy, configSnmsRouter);
    mountProtectedRouter(v1Router, '/dashboard', internalReadOnlyPolicy, dashboardRouter);
    mountProtectedRouter(v1Router, '/addresses', standardPolicy, addressesRouter);
    mountProtectedRouter(v1Router, '/customers', standardPolicy, customersRouter);
    mountProtectedRouter(v1Router, '/customer-groups', standardPolicy, customerGroupsRouter);
    mountProtectedRouter(v1Router, '/customer-devices', standardPolicy, customerDevicesRouter);
    mountProtectedRouter(v1Router, '/documents', standardPolicy, documentsRouter);
    mountProtectedRouter(v1Router, '/diagnostics', standardPolicy, diagnosticsRouter);
    mountProtectedRouter(v1Router, '/finances', financePolicy, financesRouter);
    mountProtectedRouter(v1Router, '/helpdesk', standardPolicy, helpdeskRouter);
    mountProtectedRouter(v1Router, '/net-nodes', standardPolicy, netNodesRouter);
    mountProtectedRouter(v1Router, '/ip-networks', standardPolicy, ipNetworksRouter);
    mountProtectedRouter(v1Router, '/monitoring', internalReadOnlyPolicy, monitoringRouter);
    mountProtectedRouter(v1Router, '/net-devices', standardPolicy, netDevicesRouter);
    mountProtectedRouter(v1Router, '/network-discovery', standardPolicy, networkDiscoveryRouter);
    mountProtectedRouter(v1Router, '/pit', standardPolicy, pitRouter);
    mountProtectedRouter(v1Router, '/reports', internalReadOnlyPolicy, reportsRouter);
    mountProtectedRouter(v1Router, '/search', internalReadOnlyPolicy, searchRouter);
    mountProtectedRouter(v1Router, '/snms', standardPolicy, snmsEntitiesRouter);
    mountProtectedRouter(v1Router, '/stats', internalReadOnlyPolicy, statsRouter);
    mountProtectedRouter(v1Router, '/subscriptions', standardPolicy, subscriptionsRouter);
    mountProtectedRouter(v1Router, '/teryt', standardPolicy, terytRouter);
    mountProtectedRouter(v1Router, '/architect', standardPolicy, architectRouter);

    router.use('/v1', v1Router);

    return router;
}
