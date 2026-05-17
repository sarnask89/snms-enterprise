import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
test("server starts and customers/groups parity baseline works", async (t) => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-"));
    const dbPath = join(tempDir, "baseline.sqlite");
    const previousEnv = {
        CRM_PORTAL_TS_DB_PATH: process.env.CRM_PORTAL_TS_DB_PATH,
        CRM_PORTAL_TS_UPLOAD_ROOT: process.env.CRM_PORTAL_TS_UPLOAD_ROOT,
        CRM_PORTAL_TS_BACKUP_ROOT: process.env.CRM_PORTAL_TS_BACKUP_ROOT,
        CRM_PORTAL_TS_SESSION_SECRET: process.env.CRM_PORTAL_TS_SESSION_SECRET,
        CRM_ENCRYPTION_KEY: process.env.CRM_ENCRYPTION_KEY,
        CRM_ADMIN_USER: process.env.CRM_ADMIN_USER,
        CRM_ADMIN_PASSWORD: process.env.CRM_ADMIN_PASSWORD,
        CRM_ENV: process.env.CRM_ENV,
        NODE_ENV: process.env.NODE_ENV,
        CRM_NETWORK_DISCOVERY_FIXTURES: process.env.CRM_NETWORK_DISCOVERY_FIXTURES,
    };
    process.env.CRM_PORTAL_TS_DB_PATH = dbPath;
    process.env.CRM_PORTAL_TS_UPLOAD_ROOT = join(tempDir, "uploads");
    process.env.CRM_PORTAL_TS_BACKUP_ROOT = join(tempDir, "backups");
    process.env.CRM_PORTAL_TS_SESSION_SECRET = "test-session-secret-for-smoke";
    process.env.CRM_ENCRYPTION_KEY = "test-encryption-key";
    process.env.CRM_ADMIN_USER = "admin";
    process.env.CRM_ADMIN_PASSWORD = "Admin123!";
    process.env.CRM_ENV = "production";
    process.env.NODE_ENV = "production";
    process.env.CRM_NETWORK_DISCOVERY_FIXTURES = "1";
    const [{ startServer }, { AppDataSource }, { hashPassword }, { PortalUser }, { UserRole }, { getSchemaMigrationStatus }] = await Promise.all([
        import("../app.js"),
        import("../database.js"),
        import("../security.js"),
        import("../models/system.js"),
        import("../models/common.js"),
        import("../schema_migrations.js"),
    ]);
    const server = await startServer(0);
    const schemaMigrationStatus = await getSchemaMigrationStatus(AppDataSource);
    assert.equal(schemaMigrationStatus.applied.length, 6);
    assert.equal(schemaMigrationStatus.pending.length, 0);
    const portalUserRepo = AppDataSource.getRepository(PortalUser);
    const adminUser = await portalUserRepo.findOneBy({ username: "admin" });
    assert.ok(adminUser);
    assert.equal(adminUser.role, UserRole.admin);
    assert.equal(adminUser.active, true);
    const viewUser = new PortalUser();
    viewUser.username = "viewer";
    viewUser.passwordHash = hashPassword("Viewer123!");
    viewUser.role = UserRole.view;
    viewUser.active = true;
    await portalUserRepo.save(viewUser);
    t.after(async () => {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        for (const [key, value] of Object.entries(previousEnv)) {
            if (value === undefined) {
                delete process.env[key];
                continue;
            }
            process.env[key] = value;
        }
        await rm(tempDir, { recursive: true, force: true });
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;
    let authCookie = "";
    const captureCookie = (response) => {
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            authCookie = setCookie.split(";")[0] ?? "";
        }
    };
    const fetchWithAuth = (input, init = {}) => {
        const headers = new Headers(init.headers ?? {});
        if (authCookie) {
            headers.set("Cookie", authCookie);
        }
        return fetch(input, {
            ...init,
            headers,
        });
    };
    const loginAndCapture = async (username, password) => {
        const response = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        return {
            response,
            cookie: response.headers.get("set-cookie")?.split(";")[0] ?? "",
        };
    };
    const fetchWithCookie = (cookie, input, init = {}) => {
        const headers = new Headers(init.headers ?? {});
        if (cookie) {
            headers.set("Cookie", cookie);
        }
        return fetch(input, {
            ...init,
            headers,
        });
    };
    const healthResponse = await fetch(`${baseUrl}/health`);
    assert.equal(healthResponse.status, 200);
    assert.deepEqual(await healthResponse.json(), { status: "ok", engine: "TypeScript" });
    const liveResponse = await fetch(`${baseUrl}/health/live`);
    assert.equal(liveResponse.status, 200);
    assert.deepEqual(await liveResponse.json(), { status: "ok", engine: "TypeScript", live: true });
    const readyResponse = await fetch(`${baseUrl}/health/ready`);
    assert.equal(readyResponse.status, 200);
    const readyPayload = await readyResponse.json();
    assert.equal(readyPayload.status, "ok");
    assert.equal(readyPayload.ready, true);
    assert.equal(readyPayload.checks.database, true);
    assert.equal(readyPayload.checks.schema, true);
    assert.equal(readyPayload.checks.databaseDirectory, true);
    assert.equal(readyPayload.checks.uploadRoot, true);
    assert.equal(readyPayload.checks.backupRoot, true);
    const statusResponse = await fetchWithAuth(`${baseUrl}/api/v1/module-status`);
    assert.equal(statusResponse.status, 200);
    const statusPayload = await statusResponse.json();
    assert.ok(statusPayload.activeModules.includes("customers"));
    assert.ok(statusPayload.activeModules.includes("admin"));
    assert.ok(statusPayload.activeModules.includes("auth"));
    assert.ok(statusPayload.activeModules.includes("config-snms"));
    assert.ok(statusPayload.activeModules.includes("customer-groups"));
    assert.ok(statusPayload.activeModules.includes("documents"));
    assert.ok(statusPayload.activeModules.includes("net-nodes"));
    assert.ok(statusPayload.activeModules.includes("ip-networks"));
    assert.ok(statusPayload.activeModules.includes("monitoring"));
    assert.ok(statusPayload.activeModules.includes("net-devices"));
    assert.ok(statusPayload.activeModules.includes("finances"));
    assert.ok(statusPayload.activeModules.includes("helpdesk"));
    assert.ok(statusPayload.activeModules.includes("subscriptions"));
    assert.ok(statusPayload.activeModules.includes("teryt"));
    assert.ok(statusPayload.activeModules.includes("addresses"));
    assert.ok(statusPayload.activeModules.includes("diagnostics"));
    assert.ok(statusPayload.activeModules.includes("network-discovery"));
    assert.ok(statusPayload.activeModules.includes("pit"));
    assert.ok(statusPayload.activeModules.includes("reports"));
    assert.ok(statusPayload.activeModules.includes("search"));
    assert.ok(statusPayload.activeModules.includes("snms-entities"));
    assert.ok(statusPayload.activeModules.includes("stats"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "customer-groups" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "admin" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "auth" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "audit" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "backups" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "config-snms" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "documents" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "net-nodes" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "ip-networks" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "monitoring" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "net-devices" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "reload" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "finances" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "helpdesk" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "subscriptions" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "teryt" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "addresses" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "diagnostics" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "network-discovery" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "pit" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "reports" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "search" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "snms-entities" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "stats" && entry.status === "works_in_ts"));
    const dashboardBeforeLogin = await fetchWithAuth(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardBeforeLogin.status, 401);
    const baselineNetworkHealthBeforeLogin = await fetchWithAuth(`${baseUrl}/api/v1/stats/network-health`);
    assert.equal(baselineNetworkHealthBeforeLogin.status, 401);
    const authMeBeforeLogin = await fetchWithAuth(`${baseUrl}/api/v1/auth/me`);
    assert.equal(authMeBeforeLogin.status, 401);
    const customersBeforeLogin = await fetchWithAuth(`${baseUrl}/api/v1/customers`);
    assert.equal(customersBeforeLogin.status, 401);
    const adminInfoBeforeLogin = await fetchWithAuth(`${baseUrl}/api/v1/admin/info`);
    assert.equal(adminInfoBeforeLogin.status, 401);
    const viewerLogin = await loginAndCapture("viewer", "Viewer123!");
    assert.equal(viewerLogin.response.status, 200);
    const viewerCustomers = await fetchWithCookie(viewerLogin.cookie, `${baseUrl}/api/v1/customers`);
    assert.equal(viewerCustomers.status, 200);
    const viewerDashboard = await fetchWithCookie(viewerLogin.cookie, `${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(viewerDashboard.status, 200);
    assert.deepEqual(await viewerDashboard.json(), {
        customers: 0,
        nodes: 0,
        devices: 0,
        tickets: 0,
    });
    const viewerNetworkHealth = await fetchWithCookie(viewerLogin.cookie, `${baseUrl}/api/v1/stats/network-health`);
    assert.equal(viewerNetworkHealth.status, 200);
    const viewerNetworkHealthPayload = await viewerNetworkHealth.json();
    assert.equal(viewerNetworkHealthPayload.totalDevices, 0);
    assert.equal(viewerNetworkHealthPayload.history.length, 24);
    const viewerCreateCustomer = await fetchWithCookie(viewerLogin.cookie, `${baseUrl}/api/v1/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerCode: "VIEW-001",
            firstName: "Read",
            lastName: "Only",
            status: "active",
        }),
    });
    assert.equal(viewerCreateCustomer.status, 403);
    const viewerAdminInfo = await fetchWithCookie(viewerLogin.cookie, `${baseUrl}/api/v1/admin/info`);
    assert.equal(viewerAdminInfo.status, 403);
    const loginResponse = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "admin",
            password: "Admin123!",
        }),
    });
    assert.equal(loginResponse.status, 200);
    assert.match(loginResponse.headers.get("set-cookie") ?? "", /;\s*Secure/i);
    captureCookie(loginResponse);
    const loginPayload = await loginResponse.json();
    assert.equal(loginPayload.user.username, "admin");
    assert.equal(loginPayload.user.role, "admin");
    const authMeAfterLogin = await fetchWithAuth(`${baseUrl}/api/v1/auth/me`);
    assert.equal(authMeAfterLogin.status, 200);
    const authMePayload = await authMeAfterLogin.json();
    assert.equal(authMePayload.user.username, "admin");
    const changedPassword = await fetchWithAuth(`${baseUrl}/api/v1/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            currentPassword: "Admin123!",
            newPassword: "Admin456!",
            newPassword2: "Admin456!",
        }),
    });
    assert.equal(changedPassword.status, 200);
    assert.deepEqual(await changedPassword.json(), { ok: true });
    const logoutResponse = await fetchWithAuth(`${baseUrl}/api/v1/auth/logout`, {
        method: "POST",
    });
    assert.equal(logoutResponse.status, 204);
    captureCookie(logoutResponse);
    const authMeAfterLogout = await fetchWithAuth(`${baseUrl}/api/v1/auth/me`);
    assert.equal(authMeAfterLogout.status, 401);
    const oldPasswordLogin = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "admin",
            password: "Admin123!",
        }),
    });
    assert.equal(oldPasswordLogin.status, 401);
    const loginAfterPasswordChange = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "admin",
            password: "Admin456!",
        }),
    });
    assert.equal(loginAfterPasswordChange.status, 200);
    captureCookie(loginAfterPasswordChange);
    const createdCustomer = await fetchWithAuth(`${baseUrl}/api/v1/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerCode: "CUST-001",
            firstName: "Jan",
            lastName: "Kowalski",
            email: "jan@example.com",
            status: "active",
        }),
    });
    assert.equal(createdCustomer.status, 201);
    const customerPayload = await createdCustomer.json();
    assert.ok(customerPayload.id > 0);
    assert.equal(customerPayload.groupCount, 0);
    const createdGroup = await fetchWithAuth(`${baseUrl}/api/v1/customer-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "VIP",
            description: "Klienci premium",
            memberIds: [customerPayload.id],
        }),
    });
    assert.equal(createdGroup.status, 201);
    const groupPayload = await createdGroup.json();
    assert.ok(groupPayload.id > 0);
    assert.equal(groupPayload.customerCount, 1);
    assert.deepEqual(groupPayload.memberIds, [customerPayload.id]);
    const groupList = await fetchWithAuth(`${baseUrl}/api/v1/customer-groups`);
    assert.equal(groupList.status, 200);
    const groupListPayload = await groupList.json();
    assert.equal(groupListPayload.length, 1);
    assert.equal(groupListPayload[0]?.name, "VIP");
    assert.equal(groupListPayload[0]?.customerCount, 1);
    const updatedGroup = await fetchWithAuth(`${baseUrl}/api/v1/customer-groups/${groupPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "VIP Plus",
            description: "Najważniejsi klienci",
            memberIds: [customerPayload.id],
        }),
    });
    assert.equal(updatedGroup.status, 200);
    const updatedGroupPayload = await updatedGroup.json();
    assert.equal(updatedGroupPayload.name, "VIP Plus");
    const filteredCustomers = await fetchWithAuth(`${baseUrl}/api/v1/customers?q=Kow&status=active`);
    assert.equal(filteredCustomers.status, 200);
    const filteredCustomersPayload = await filteredCustomers.json();
    assert.equal(filteredCustomersPayload.length, 1);
    assert.equal(filteredCustomersPayload[0]?.id, customerPayload.id);
    assert.equal(filteredCustomersPayload[0]?.groupCount, 1);
    const customerDetails = await fetchWithAuth(`${baseUrl}/api/v1/customers/${customerPayload.id}`);
    assert.equal(customerDetails.status, 200);
    const customerDetailsPayload = await customerDetails.json();
    assert.equal(customerDetailsPayload.groups[0]?.name, "VIP Plus");
    const createdNode = await fetchWithAuth(`${baseUrl}/api/v1/net-nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Warszawa POP-1",
            locationDetail: "Piwnica A",
            locationType: "basement",
            nodeType: "POP",
            ownerType: "own",
            latitude: 52.2297,
            longitude: 21.0122,
            x1992: 486430.25,
            y1992: 637515.5,
            hasPower: true,
            hasEnvControl: false,
            info: "Główny punkt dystrybucyjny",
        }),
    });
    assert.equal(createdNode.status, 201);
    const nodePayload = await createdNode.json();
    assert.ok(nodePayload.id > 0);
    assert.equal(nodePayload.name, "Warszawa POP-1");
    assert.equal(nodePayload.hasPower, true);
    const createdNetwork = await fetchWithAuth(`${baseUrl}/api/v1/ip-networks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Backbone VLAN 100",
            cidr: "10.10.100.0/24",
            gateway: "10.10.100.1",
            vlanId: 100,
            description: "Sieć management",
            active: true,
        }),
    });
    assert.equal(createdNetwork.status, 201);
    const networkPayload = await createdNetwork.json();
    assert.ok(networkPayload.id > 0);
    assert.equal(networkPayload.cidr, "10.10.100.0/24");
    assert.equal(networkPayload.active, true);
    const createdNetDevice = await fetchWithAuth(`${baseUrl}/api/v1/net-devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Core Router 1",
            hostname: "cr1",
            serialNumber: "ABC123",
            managementIp: "10.10.100.2",
            deviceType: "router",
            driverType: "mikrotik_api",
            mgmtUsername: "router-admin",
            snmpCommunity: "public-ro",
            loginUrl: "https://10.10.100.2",
            status: "active",
            ipNetworkId: networkPayload.id,
            netNodeId: nodePayload.id,
            customerId: customerPayload.id,
            notes: "Router brzegowy",
        }),
    });
    assert.equal(createdNetDevice.status, 201);
    const netDevicePayload = await createdNetDevice.json();
    assert.ok(netDevicePayload.id > 0);
    assert.equal(netDevicePayload.driverType, "mikrotik_api");
    assert.equal(netDevicePayload.mgmtUsername, "router-admin");
    assert.equal(netDevicePayload.snmpCommunity, "public-ro");
    assert.equal(netDevicePayload.loginUrl, "https://10.10.100.2");
    assert.equal(netDevicePayload.customer?.id, customerPayload.id);
    assert.equal(netDevicePayload.ipNetwork?.id, networkPayload.id);
    assert.equal(netDevicePayload.netNode?.id, nodePayload.id);
    const createdMikrotikProfile = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/access-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            netDeviceId: netDevicePayload.id,
            driver: "mikrotik_api",
            host: "10.0.222.86",
            port: 8728,
            username: "admin",
            password: "fixture-password",
        }),
    });
    assert.equal(createdMikrotikProfile.status, 201);
    const mikrotikProfilePayload = await createdMikrotikProfile.json();
    assert.ok(mikrotikProfilePayload.id > 0);
    assert.equal(mikrotikProfilePayload.driver, "mikrotik_api");
    assert.equal(mikrotikProfilePayload.host, "10.0.222.86");
    assert.equal(mikrotikProfilePayload.port, 8728);
    assert.equal(mikrotikProfilePayload.hasPassword, true);
    const mikrotikProfileTest = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/access-profiles/${mikrotikProfilePayload.id}/test`, {
        method: "POST",
    });
    assert.equal(mikrotikProfileTest.status, 200);
    const mikrotikProfileTestPayload = await mikrotikProfileTest.json();
    assert.equal(mikrotikProfileTestPayload.result.driver, "mikrotik_api");
    assert.equal(mikrotikProfileTestPayload.result.ok, true);
    assert.ok(mikrotikProfileTestPayload.result.summary.leaseCount > 0);
    assert.ok(mikrotikProfileTestPayload.result.summary.networkCount > 0);
    const discoveryDevices = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/devices`);
    assert.equal(discoveryDevices.status, 200);
    const discoveryDevicesPayload = await discoveryDevices.json();
    assert.ok(discoveryDevicesPayload.some((entry) => entry.id === netDevicePayload.id && entry.readyForDiscovery && entry.accessProfile?.driver === "mikrotik_api"));
    const discoveryRouters = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/routers`);
    assert.equal(discoveryRouters.status, 200);
    const discoveryRoutersPayload = await discoveryRouters.json();
    assert.equal(discoveryRoutersPayload.length, 1);
    assert.equal(discoveryRoutersPayload[0]?.id, netDevicePayload.id);
    assert.equal(discoveryRoutersPayload[0]?.managementIp, "10.10.100.2");
    assert.equal(discoveryRoutersPayload[0]?.readyForDiscovery, true);
    assert.equal(discoveryRoutersPayload[0]?.accessProfileDriver, "mikrotik_api");
    const nodeList = await fetchWithAuth(`${baseUrl}/api/v1/net-nodes?q=POP`);
    assert.equal(nodeList.status, 200);
    const nodeListPayload = await nodeList.json();
    assert.equal(nodeListPayload.length, 1);
    assert.equal(nodeListPayload[0]?.id, nodePayload.id);
    assert.equal(nodeListPayload[0]?.deviceCount, 1);
    const networkList = await fetchWithAuth(`${baseUrl}/api/v1/ip-networks?q=100`);
    assert.equal(networkList.status, 200);
    const networkListPayload = await networkList.json();
    assert.equal(networkListPayload.length, 1);
    assert.equal(networkListPayload[0]?.id, networkPayload.id);
    assert.equal(networkListPayload[0]?.deviceCount, 1);
    const updatedNode = await fetchWithAuth(`${baseUrl}/api/v1/net-nodes/${nodePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            locationDetail: "Serwerownia B",
            hasEnvControl: true,
        }),
    });
    assert.equal(updatedNode.status, 200);
    const updatedNodePayload = await updatedNode.json();
    assert.equal(updatedNodePayload.locationDetail, "Serwerownia B");
    assert.equal(updatedNodePayload.hasEnvControl, true);
    const updatedNetDevice = await fetchWithAuth(`${baseUrl}/api/v1/net-devices/${netDevicePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "maintenance",
            driverType: "mikrotik_api_tls",
            mgmtUsername: "noc-user",
            snmpCommunity: "noc-rw",
            loginUrl: "https://router.example.local",
            notes: "Planowany serwis",
        }),
    });
    assert.equal(updatedNetDevice.status, 200);
    const updatedNetDevicePayload = await updatedNetDevice.json();
    assert.equal(updatedNetDevicePayload.status, "maintenance");
    assert.equal(updatedNetDevicePayload.driverType, "mikrotik_api_tls");
    assert.equal(updatedNetDevicePayload.mgmtUsername, "noc-user");
    assert.equal(updatedNetDevicePayload.snmpCommunity, "noc-rw");
    assert.equal(updatedNetDevicePayload.loginUrl, "https://router.example.local");
    assert.equal(updatedNetDevicePayload.notes, "Planowany serwis");
    const networkUsage = await fetchWithAuth(`${baseUrl}/api/v1/ip-networks/${networkPayload.id}`);
    assert.equal(networkUsage.status, 200);
    const networkDetailsPayload = await networkUsage.json();
    assert.equal(networkDetailsPayload.id, networkPayload.id);
    assert.equal(networkDetailsPayload.deviceCount, 1);
    assert.equal(networkDetailsPayload.customerDeviceCount, 0);
    const dashboardAfterNetwork = await fetchWithAuth(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardAfterNetwork.status, 200);
    assert.deepEqual(await dashboardAfterNetwork.json(), {
        customers: 1,
        nodes: 1,
        devices: 1,
        tickets: 0,
    });
    const mikrotikScan = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/scan/${netDevicePayload.id}`, {
        method: "POST",
    });
    assert.equal(mikrotikScan.status, 201);
    const mikrotikScanPayload = await mikrotikScan.json();
    assert.ok(mikrotikScanPayload.session.id > 0);
    assert.equal(mikrotikScanPayload.session.status, "succeeded");
    assert.ok(mikrotikScanPayload.records.some((record) => record.recordKind === "mikrotik_lease"));
    assert.ok(mikrotikScanPayload.records.some((record) => record.recordKind === "mikrotik_network"));
    const mikrotikSessionList = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/sessions?netDeviceId=${netDevicePayload.id}`);
    assert.equal(mikrotikSessionList.status, 200);
    const mikrotikSessionListPayload = await mikrotikSessionList.json();
    assert.equal(mikrotikSessionListPayload.length, 1);
    assert.equal(mikrotikSessionListPayload[0]?.driver, "mikrotik_api");
    const mikrotikSessionRecords = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/sessions/${mikrotikScanPayload.session.id}/records`);
    assert.equal(mikrotikSessionRecords.status, 200);
    const mikrotikSessionRecordsPayload = await mikrotikSessionRecords.json();
    assert.equal(mikrotikSessionRecordsPayload.length, mikrotikScanPayload.records.length);
    const mikrotikLeaseRecord = mikrotikSessionRecordsPayload.find((record) => record.recordKind === "mikrotik_lease" && record.ipAddress === "10.0.222.150");
    assert.ok(mikrotikLeaseRecord);
    const mikrotikNetworkRecord = mikrotikSessionRecordsPayload.find((record) => record.recordKind === "mikrotik_network" && record.ipAddress === "10.0.222.0/24");
    assert.ok(mikrotikNetworkRecord);
    const importedLease = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/import-record/${mikrotikLeaseRecord?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            ipNetworkId: networkPayload.id,
            comment: "Imported from Mikrotik discovery",
        }),
    });
    assert.equal(importedLease.status, 201);
    const importedLeasePayload = await importedLease.json();
    assert.ok(importedLeasePayload.customerDevice.id > 0);
    assert.equal(importedLeasePayload.customerDevice.customerId, customerPayload.id);
    assert.equal(importedLeasePayload.customerDevice.ipAddress, "10.0.222.150");
    assert.equal(importedLeasePayload.customerDevice.netDeviceId, netDevicePayload.id);
    assert.equal(importedLeasePayload.customerDevice.ipNetworkId, networkPayload.id);
    assert.equal(importedLeasePayload.diagnostics.ready, true);
    assert.equal(importedLeasePayload.diagnostics.blockingChecks, 0);
    const importedDiscoveredNetwork = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/import-record/${mikrotikNetworkRecord?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Discovery Clients",
        }),
    });
    assert.equal(importedDiscoveredNetwork.status, 201);
    const importedDiscoveredNetworkPayload = await importedDiscoveredNetwork.json();
    assert.equal(importedDiscoveredNetworkPayload.imported, "ip_network");
    assert.equal(importedDiscoveredNetworkPayload.network.cidr, "10.0.222.0/24");
    assert.equal(importedDiscoveredNetworkPayload.network.sourceDeviceId, netDevicePayload.id);
    const diagnosticsCheck = await fetchWithAuth(`${baseUrl}/api/v1/diagnostics/check/${importedLeasePayload.customerDevice.id}`, {
        method: "POST",
    });
    assert.equal(diagnosticsCheck.status, 200);
    const diagnosticsCheckPayload = await diagnosticsCheck.json();
    assert.equal(diagnosticsCheckPayload.customerDeviceId, importedLeasePayload.customerDevice.id);
    assert.equal(diagnosticsCheckPayload.ready, true);
    assert.ok(diagnosticsCheckPayload.checks.some((entry) => entry.key === "net_device_management_ip" && entry.ok));
    const diagnosticsRemoteTest = await fetchWithAuth(`${baseUrl}/api/v1/diagnostics/remote-test/${importedLeasePayload.customerDevice.id}`, {
        method: "POST",
    });
    assert.equal(diagnosticsRemoteTest.status, 200);
    const diagnosticsRemoteTestPayload = await diagnosticsRemoteTest.json();
    assert.equal(diagnosticsRemoteTestPayload.remoteDiagnostics.driver, "mikrotik_api");
    assert.equal(diagnosticsRemoteTestPayload.remoteDiagnostics.ok, true);
    assert.ok(diagnosticsRemoteTestPayload.remoteDiagnostics.checks.some((entry) => entry.key === "mikrotik_lease_exists" && entry.ok));
    const diagnosticsSyncLease = await fetchWithAuth(`${baseUrl}/api/v1/diagnostics/sync-lease/${importedLeasePayload.customerDevice.id}`, {
        method: "POST",
    });
    assert.equal(diagnosticsSyncLease.status, 200);
    const diagnosticsSyncLeasePayload = await diagnosticsSyncLease.json();
    assert.equal(diagnosticsSyncLeasePayload.customerDeviceId, importedLeasePayload.customerDevice.id);
    assert.equal(diagnosticsSyncLeasePayload.synced, false);
    assert.equal(diagnosticsSyncLeasePayload.reason, "no_changes");
    assert.equal(diagnosticsSyncLeasePayload.diagnostics.ready, true);
    assert.equal(diagnosticsSyncLeasePayload.diagnostics.blockingChecks, 0);
    const importedLeaseList = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/imported-leases?q=10.0.222.150`);
    assert.equal(importedLeaseList.status, 200);
    const importedLeaseListPayload = await importedLeaseList.json();
    assert.equal(importedLeaseListPayload.length, 1);
    assert.equal(importedLeaseListPayload[0]?.id, importedLeasePayload.customerDevice.id);
    const monitoringSummary = await fetchWithAuth(`${baseUrl}/api/v1/monitoring/summary`);
    assert.equal(monitoringSummary.status, 200);
    const monitoringSummaryPayload = await monitoringSummary.json();
    assert.equal(monitoringSummaryPayload.totalDevices, 1);
    assert.equal(monitoringSummaryPayload.onlineDevices, 0);
    assert.equal(monitoringSummaryPayload.customerDevices, 1);
    assert.equal(monitoringSummaryPayload.devices[0]?.id, netDevicePayload.id);
    const monitoringDeviceStats = await fetchWithAuth(`${baseUrl}/api/v1/monitoring/devices/${netDevicePayload.id}/stats`);
    assert.equal(monitoringDeviceStats.status, 200);
    const monitoringDeviceStatsPayload = await monitoringDeviceStats.json();
    assert.equal(monitoringDeviceStatsPayload.labels.length, 24);
    assert.equal(monitoringDeviceStatsPayload.datasets.length, 3);
    assert.equal(monitoringDeviceStatsPayload.datasets[0]?.data.length, 24);
    const monitoringCustomerStats = await fetchWithAuth(`${baseUrl}/api/v1/monitoring/customer-devices/${importedLeasePayload.customerDevice.id}/stats`);
    assert.equal(monitoringCustomerStats.status, 200);
    const monitoringCustomerStatsPayload = await monitoringCustomerStats.json();
    assert.equal(monitoringCustomerStatsPayload.labels.length, 24);
    assert.equal(monitoringCustomerStatsPayload.in_mbps.length, 24);
    assert.equal(monitoringCustomerStatsPayload.out_mbps.length, 24);
    const monitoringGlobalStats = await fetchWithAuth(`${baseUrl}/api/v1/monitoring/global/stats`);
    assert.equal(monitoringGlobalStats.status, 200);
    const monitoringGlobalStatsPayload = await monitoringGlobalStats.json();
    assert.equal(monitoringGlobalStatsPayload.labels.length, 24);
    assert.equal(monitoringGlobalStatsPayload.total_mbps.length, 24);
    const createdMessageTemplate = await fetchWithAuth(`${baseUrl}/api/v1/snms/messages/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Awaria FTTH",
            subject: "Przerwa techniczna",
            body: "Planowana przerwa w dostepie do uslugi.",
        }),
    });
    assert.equal(createdMessageTemplate.status, 201);
    const messageTemplatePayload = await createdMessageTemplate.json();
    assert.ok(messageTemplatePayload.id > 0);
    assert.equal(messageTemplatePayload.name, "Awaria FTTH");
    const templatePreview = await fetchWithAuth(`${baseUrl}/api/v1/snms/messages/template-preview/${messageTemplatePayload.id}`);
    assert.equal(templatePreview.status, 200);
    const templatePreviewPayload = await templatePreview.json();
    assert.equal(templatePreviewPayload.subject, "Przerwa techniczna");
    assert.equal(templatePreviewPayload.body, "Planowana przerwa w dostepie do uslugi.");
    const createdMessage = await fetchWithAuth(`${baseUrl}/api/v1/snms/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            templateId: messageTemplatePayload.id,
            sent: true,
        }),
    });
    assert.equal(createdMessage.status, 201);
    const messagePayload = await createdMessage.json();
    assert.ok(messagePayload.id > 0);
    assert.equal(messagePayload.status, "sent");
    assert.equal(messagePayload.customer?.id, customerPayload.id);
    assert.equal(messagePayload.template?.id, messageTemplatePayload.id);
    assert.equal(messagePayload.subject, "Przerwa techniczna");
    const snmsMessages = await fetchWithAuth(`${baseUrl}/api/v1/snms/messages?q=Przerwa`);
    assert.equal(snmsMessages.status, 200);
    const snmsMessagesPayload = await snmsMessages.json();
    assert.equal(snmsMessagesPayload.length, 1);
    assert.equal(snmsMessagesPayload[0]?.id, messagePayload.id);
    const createdCalendarEvent = await fetchWithAuth(`${baseUrl}/api/v1/snms/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: "Wizyta serwisowa",
            description: "Diagnostyka klienta FTTH",
            startsAt: "2026-05-16T09:00:00.000Z",
            endsAt: "2026-05-16T10:00:00.000Z",
            customerId: customerPayload.id,
            done: false,
        }),
    });
    assert.equal(createdCalendarEvent.status, 201);
    const calendarEventPayload = await createdCalendarEvent.json();
    assert.ok(calendarEventPayload.id > 0);
    assert.equal(calendarEventPayload.customer?.id, customerPayload.id);
    const snmsTimetable = await fetchWithAuth(`${baseUrl}/api/v1/snms/timetable`);
    assert.equal(snmsTimetable.status, 200);
    const snmsTimetablePayload = await snmsTimetable.json();
    assert.equal(snmsTimetablePayload.length, 1);
    assert.equal(snmsTimetablePayload[0]?.id, calendarEventPayload.id);
    const createdTrafficStat = await fetchWithAuth(`${baseUrl}/api/v1/snms/traffic-stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            deviceId: importedLeasePayload.customerDevice.id,
            periodStart: "2026-05-01",
            periodEnd: "2026-05-31",
            bytesIn: 123456,
            bytesOut: 654321,
            note: "Majowy billing",
        }),
    });
    assert.equal(createdTrafficStat.status, 201);
    const trafficStatPayload = await createdTrafficStat.json();
    assert.ok(trafficStatPayload.id > 0);
    assert.equal(trafficStatPayload.device?.id, importedLeasePayload.customerDevice.id);
    const snmsTrafficStats = await fetchWithAuth(`${baseUrl}/api/v1/snms/traffic-stats?deviceId=${importedLeasePayload.customerDevice.id}`);
    assert.equal(snmsTrafficStats.status, 200);
    const snmsTrafficStatsPayload = await snmsTrafficStats.json();
    assert.equal(snmsTrafficStatsPayload.length, 1);
    assert.equal(snmsTrafficStatsPayload[0]?.id, trafficStatPayload.id);
    assert.equal(snmsTrafficStatsPayload[0]?.bytesIn, 123456);
    const createdSnmsSetting = await fetchWithAuth(`${baseUrl}/api/v1/snms/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            key: "snms.default_sender",
            value: "noc@snms.local",
        }),
    });
    assert.equal(createdSnmsSetting.status, 201);
    const snmsSettingPayload = await createdSnmsSetting.json();
    assert.ok(snmsSettingPayload.id > 0);
    assert.equal(snmsSettingPayload.key, "snms.default_sender");
    const snmsConfig = await fetchWithAuth(`${baseUrl}/api/v1/snms/config`);
    assert.equal(snmsConfig.status, 200);
    const snmsConfigPayload = await snmsConfig.json();
    assert.ok(snmsConfigPayload.some((entry) => entry.id === snmsSettingPayload.id && entry.value === "noc@snms.local"));
    const createdDivision = await fetchWithAuth(`${baseUrl}/api/v1/config/divisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "SNMS Central",
            shortName: "CENTR",
            city: "Warszawa",
            postalCode: "00-001",
            nip: "1234567890",
            active: true,
            isDefault: true,
        }),
    });
    assert.equal(createdDivision.status, 201);
    const divisionPayload = await createdDivision.json();
    assert.ok(divisionPayload.id > 0);
    assert.equal(divisionPayload.isDefault, true);
    assert.equal(divisionPayload.city, "Warszawa");
    const updatedDivision = await fetchWithAuth(`${baseUrl}/api/v1/config/divisions/${divisionPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            city: "Łódź",
        }),
    });
    assert.equal(updatedDivision.status, 200);
    const updatedDivisionPayload = await updatedDivision.json();
    assert.equal(updatedDivisionPayload.city, "Łódź");
    const createdVatRate = await fetchWithAuth(`${baseUrl}/api/v1/config/vat-rates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            label: "VAT 23%",
            ratePercent: 23,
            sortOrder: 10,
            isDefault: true,
        }),
    });
    assert.equal(createdVatRate.status, 201);
    const vatRatePayload = await createdVatRate.json();
    assert.ok(vatRatePayload.id > 0);
    assert.equal(vatRatePayload.ratePercent, 23);
    assert.equal(vatRatePayload.isDefault, true);
    const updatedVatRate = await fetchWithAuth(`${baseUrl}/api/v1/config/vat-rates/${vatRatePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ratePercent: 8,
            sortOrder: 1,
        }),
    });
    assert.equal(updatedVatRate.status, 200);
    const updatedVatRatePayload = await updatedVatRate.json();
    assert.equal(updatedVatRatePayload.ratePercent, 8);
    assert.equal(updatedVatRatePayload.sortOrder, 1);
    const createdNumberPlan = await fetchWithAuth(`${baseUrl}/api/v1/config/number-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Faktury 2026",
            docType: "invoice",
            patternTemplate: "FV/{year}/{n}",
            nextNumber: 1,
            divisionId: divisionPayload.id,
            active: true,
            isDefault: true,
        }),
    });
    assert.equal(createdNumberPlan.status, 201);
    const numberPlanPayload = await createdNumberPlan.json();
    assert.ok(numberPlanPayload.id > 0);
    assert.equal(numberPlanPayload.docType, "invoice");
    assert.equal(numberPlanPayload.division?.id, divisionPayload.id);
    assert.equal(numberPlanPayload.isDefault, true);
    const updatedNumberPlan = await fetchWithAuth(`${baseUrl}/api/v1/config/number-plans/${numberPlanPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nextNumber: 17,
        }),
    });
    assert.equal(updatedNumberPlan.status, 200);
    const updatedNumberPlanPayload = await updatedNumberPlan.json();
    assert.equal(updatedNumberPlanPayload.nextNumber, 17);
    const divisions = await fetchWithAuth(`${baseUrl}/api/v1/config/divisions`);
    assert.equal(divisions.status, 200);
    const divisionsPayload = await divisions.json();
    assert.ok(divisionsPayload.some((entry) => entry.id === divisionPayload.id && entry.city === "Łódź"));
    const vatRates = await fetchWithAuth(`${baseUrl}/api/v1/config/vat-rates`);
    assert.equal(vatRates.status, 200);
    const vatRatesPayload = await vatRates.json();
    assert.ok(vatRatesPayload.some((entry) => entry.id === vatRatePayload.id && entry.ratePercent === 8));
    const numberPlans = await fetchWithAuth(`${baseUrl}/api/v1/config/number-plans`);
    assert.equal(numberPlans.status, 200);
    const numberPlansPayload = await numberPlans.json();
    assert.ok(numberPlansPayload.some((entry) => entry.id === numberPlanPayload.id && entry.nextNumber === 17));
    const searchByName = await fetchWithAuth(`${baseUrl}/api/v1/search?q=Kow`);
    assert.equal(searchByName.status, 200);
    const searchByNamePayload = await searchByName.json();
    assert.equal(searchByNamePayload.searchType, "name");
    assert.equal(searchByNamePayload.customers[0]?.id, customerPayload.id);
    const searchByIp = await fetchWithAuth(`${baseUrl}/api/v1/search?q=10.0.222.150`);
    assert.equal(searchByIp.status, 200);
    const searchByIpPayload = await searchByIp.json();
    assert.equal(searchByIpPayload.searchType, "ip");
    assert.equal(searchByIpPayload.devices[0]?.id, importedLeasePayload.customerDevice.id);
    const discoveredNetwork = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/import-network`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            deviceId: netDevicePayload.id,
            name: "Discovered VLAN 200",
            cidr: "10.10.200.0/24",
            gateway: "10.10.200.1",
            vlanId: 200,
            comment: "Imported from discovery",
        }),
    });
    assert.equal(discoveredNetwork.status, 201);
    const discoveredNetworkPayload = await discoveredNetwork.json();
    assert.ok(discoveredNetworkPayload.id > 0);
    assert.equal(discoveredNetworkPayload.cidr, "10.10.200.0/24");
    assert.equal(discoveredNetworkPayload.sourceDeviceId, netDevicePayload.id);
    const pitExport = await fetchWithAuth(`${baseUrl}/api/v1/pit/export/nodes`);
    assert.equal(pitExport.status, 200);
    assert.ok(pitExport.headers.get("content-type")?.includes("application/gml+xml"));
    const pitGml = await pitExport.text();
    assert.ok(pitGml.includes("EPSG:2180"));
    assert.ok(pitGml.includes("Warszawa POP-1"));
    assert.ok(pitGml.includes("486430.25 637515.5"));
    const pitSync = await fetchWithAuth(`${baseUrl}/api/v1/pit/sync`, { method: "POST" });
    assert.equal(pitSync.status, 200);
    const pitSyncPayload = await pitSync.json();
    assert.equal(pitSyncPayload.totalNodes, 1);
    assert.equal(pitSyncPayload.exportableNodes, 1);
    assert.equal(pitSyncPayload.missingCoordinates, 0);
    const pitUkeSummary = await fetchWithAuth(`${baseUrl}/api/v1/reports/pit-uke/summary`);
    assert.equal(pitUkeSummary.status, 200);
    assert.deepEqual(await pitUkeSummary.json(), {
        customerDeviceCount: 1,
    });
    const pitUkeExport = await fetchWithAuth(`${baseUrl}/api/v1/reports/pit-uke/export`);
    assert.equal(pitUkeExport.status, 200);
    assert.ok(pitUkeExport.headers.get("content-type")?.includes("text/csv"));
    const pitUkeCsv = await pitUkeExport.text();
    assert.ok(pitUkeCsv.includes("\"ID\";\"IP\";\"MAC\""));
    assert.ok(pitUkeCsv.includes("lease-a1b2.snms") === false);
    assert.ok(pitUkeCsv.includes("10.0.222.150"));
    const passportMap = await fetchWithAuth(`${baseUrl}/api/v1/reports/passport/map`);
    assert.equal(passportMap.status, 200);
    const passportMapPayload = await passportMap.json();
    assert.equal(passportMapPayload.length, 1);
    assert.equal(passportMapPayload[0]?.id, nodePayload.id);
    assert.equal(passportMapPayload[0]?.name, "Warszawa POP-1");
    const createdTariff = await fetchWithAuth(`${baseUrl}/api/v1/finances/tariffs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "FTTH 600",
            monthlyPrice: 89.99,
            description: "Plan FTTH 600/100",
            speedDownMbps: 600,
            speedUpMbps: 100,
            active: true,
        }),
    });
    assert.equal(createdTariff.status, 201);
    const tariffPayload = await createdTariff.json();
    assert.ok(tariffPayload.id > 0);
    assert.equal(tariffPayload.monthlyPrice, 89.99);
    assert.equal(tariffPayload.active, true);
    const tariffList = await fetchWithAuth(`${baseUrl}/api/v1/finances/tariffs?q=FTTH`);
    assert.equal(tariffList.status, 200);
    const tariffListPayload = await tariffList.json();
    assert.equal(tariffListPayload.length, 1);
    assert.equal(tariffListPayload[0]?.id, tariffPayload.id);
    const createdSubscription = await fetchWithAuth(`${baseUrl}/api/v1/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            deviceId: null,
            tariffId: tariffPayload.id,
            startDate: "2026-05-14",
            active: true,
            technology: "FTTH",
            speedDownMbps: 600,
            speedUpMbps: 100,
        }),
    });
    assert.equal(createdSubscription.status, 201);
    const subscriptionPayload = await createdSubscription.json();
    assert.ok(subscriptionPayload.id > 0);
    assert.equal(subscriptionPayload.customer?.id, customerPayload.id);
    assert.equal(subscriptionPayload.tariff?.id, tariffPayload.id);
    assert.equal(subscriptionPayload.active, true);
    const subscriptionList = await fetchWithAuth(`${baseUrl}/api/v1/subscriptions`);
    assert.equal(subscriptionList.status, 200);
    const subscriptionListPayload = await subscriptionList.json();
    assert.equal(subscriptionListPayload.length, 1);
    assert.equal(subscriptionListPayload[0]?.id, subscriptionPayload.id);
    assert.equal(subscriptionListPayload[0]?.technology, "FTTH");
    const toggledSubscription = await fetchWithAuth(`${baseUrl}/api/v1/subscriptions/${subscriptionPayload.id}/toggle`, {
        method: "POST",
    });
    assert.equal(toggledSubscription.status, 200);
    const toggledSubscriptionPayload = await toggledSubscription.json();
    assert.equal(toggledSubscriptionPayload.active, false);
    const createdInvoice = await fetchWithAuth(`${baseUrl}/api/v1/finances/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            number: "FV/2026/05/0001",
            customerId: customerPayload.id,
            amount: 89.99,
            status: "draft",
            documentKind: "invoice",
            issueDate: "2026-05-14",
        }),
    });
    assert.equal(createdInvoice.status, 201);
    const invoicePayload = await createdInvoice.json();
    assert.ok(invoicePayload.id > 0);
    assert.equal(invoicePayload.number, "FV/2026/05/0001");
    assert.equal(invoicePayload.status, "draft");
    const invoiceList = await fetchWithAuth(`${baseUrl}/api/v1/finances/invoices?q=FV/2026`);
    assert.equal(invoiceList.status, 200);
    const invoiceListPayload = await invoiceList.json();
    assert.equal(invoiceListPayload.length, 1);
    assert.equal(invoiceListPayload[0]?.id, invoicePayload.id);
    const createdPayment = await fetchWithAuth(`${baseUrl}/api/v1/finances/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            name: "Stała opłata FTTH",
            amount: 89.99,
            intervalMonths: 1,
            dayOfMonth: 10,
            active: true,
            nextRun: "2026-06-10",
        }),
    });
    assert.equal(createdPayment.status, 201);
    const paymentPayload = await createdPayment.json();
    assert.ok(paymentPayload.id > 0);
    assert.equal(paymentPayload.amount, 89.99);
    assert.equal(paymentPayload.customer?.id, customerPayload.id);
    const paymentList = await fetchWithAuth(`${baseUrl}/api/v1/finances/payments`);
    assert.equal(paymentList.status, 200);
    const paymentListPayload = await paymentList.json();
    assert.equal(paymentListPayload.length, 1);
    assert.equal(paymentListPayload[0]?.id, paymentPayload.id);
    assert.equal(paymentListPayload[0]?.active, true);
    const createdLedger = await fetchWithAuth(`${baseUrl}/api/v1/finances/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            amount: 89.99,
            kind: "debit",
            description: "Naliczona subskrypcja maj",
        }),
    });
    assert.equal(createdLedger.status, 201);
    const ledgerPayload = await createdLedger.json();
    assert.ok(ledgerPayload.id > 0);
    assert.equal(ledgerPayload.kind, "debit");
    assert.equal(ledgerPayload.amount, 89.99);
    const ledgerList = await fetchWithAuth(`${baseUrl}/api/v1/finances/balance`);
    assert.equal(ledgerList.status, 200);
    const ledgerListPayload = await ledgerList.json();
    assert.equal(ledgerListPayload.length, 1);
    assert.equal(ledgerListPayload[0]?.customer?.id, customerPayload.id);
    const createdCash = await fetchWithAuth(`${baseUrl}/api/v1/finances/cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            amount: 89.99,
            description: "Wpłata gotówkowa",
        }),
    });
    assert.equal(createdCash.status, 201);
    const cashPayload = await createdCash.json();
    assert.ok(cashPayload.id > 0);
    assert.equal(cashPayload.amount, 89.99);
    const cashList = await fetchWithAuth(`${baseUrl}/api/v1/finances/cash`);
    assert.equal(cashList.status, 200);
    const cashListPayload = await cashList.json();
    assert.equal(cashListPayload.length, 1);
    assert.equal(cashListPayload[0]?.description, "Wpłata gotówkowa");
    const customerTraffic = await fetchWithAuth(`${baseUrl}/api/v1/stats/customer-traffic/${customerPayload.id}`);
    assert.equal(customerTraffic.status, 200);
    const customerTrafficPayload = await customerTraffic.json();
    assert.equal(customerTrafficPayload.labels.length, 24);
    assert.equal(customerTrafficPayload.series.length, 2);
    assert.equal(customerTrafficPayload.series[0]?.data.length, 24);
    const financialSummary = await fetchWithAuth(`${baseUrl}/api/v1/stats/financial-summary`);
    assert.equal(financialSummary.status, 200);
    const financialSummaryPayload = await financialSummary.json();
    assert.equal(financialSummaryPayload.labels.length, 12);
    assert.equal(financialSummaryPayload.series.length, 2);
    assert.equal(financialSummaryPayload.series[0]?.data.length, 12);
    const inventorySummary = await fetchWithAuth(`${baseUrl}/api/v1/stats/inventory-summary`);
    assert.equal(inventorySummary.status, 200);
    const inventorySummaryPayload = await inventorySummary.json();
    assert.ok(inventorySummaryPayload.labels.includes("router"));
    assert.equal(inventorySummaryPayload.series.length, inventorySummaryPayload.labels.length);
    const customerGrowth = await fetchWithAuth(`${baseUrl}/api/v1/stats/customer-growth`);
    assert.equal(customerGrowth.status, 200);
    const customerGrowthPayload = await customerGrowth.json();
    assert.equal(customerGrowthPayload.labels.length, 6);
    assert.equal(customerGrowthPayload.values.length, 6);
    const createdQueue = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/queues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "default",
            description: "Kolejka domyślna",
        }),
    });
    assert.equal(createdQueue.status, 201);
    const queuePayload = await createdQueue.json();
    assert.ok(queuePayload.id > 0);
    assert.equal(queuePayload.name, "default");
    const createdCategory = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            queueId: queuePayload.id,
            name: "Awaria",
            description: "Problemy z usługą",
        }),
    });
    assert.equal(createdCategory.status, 201);
    const categoryPayload = await createdCategory.json();
    assert.ok(categoryPayload.id > 0);
    assert.equal(categoryPayload.queueId, queuePayload.id);
    const createdTicket = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            queueId: queuePayload.id,
            categoryId: categoryPayload.id,
            title: "Brak sygnału FTTH",
            body: "Klient zgłasza całkowity brak sygnału od rana.",
            status: "open",
        }),
    });
    assert.equal(createdTicket.status, 201);
    const ticketPayload = await createdTicket.json();
    assert.ok(ticketPayload.id > 0);
    assert.equal(ticketPayload.status, "open");
    assert.equal(ticketPayload.queue?.id, queuePayload.id);
    assert.equal(ticketPayload.category?.id, categoryPayload.id);
    assert.equal(ticketPayload.customer?.id, customerPayload.id);
    const ticketList = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/tickets?q=FTTH&status=open&queueId=${queuePayload.id}`);
    assert.equal(ticketList.status, 200);
    const ticketListPayload = await ticketList.json();
    assert.equal(ticketListPayload.length, 1);
    assert.equal(ticketListPayload[0]?.id, ticketPayload.id);
    const updatedTicketStatus = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/tickets/${ticketPayload.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
    });
    assert.equal(updatedTicketStatus.status, 200);
    const updatedTicketStatusPayload = await updatedTicketStatus.json();
    assert.equal(updatedTicketStatusPayload.status, "pending");
    const assignedTicket = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/tickets/${ticketPayload.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId: 101 }),
    });
    assert.equal(assignedTicket.status, 200);
    const assignedTicketPayload = await assignedTicket.json();
    assert.equal(assignedTicketPayload.assigneeId, 101);
    const helpdeskReports = await fetchWithAuth(`${baseUrl}/api/v1/helpdesk/reports`);
    assert.equal(helpdeskReports.status, 200);
    const helpdeskReportsPayload = await helpdeskReports.json();
    assert.equal(helpdeskReportsPayload.totalTickets, 1);
    assert.equal(helpdeskReportsPayload.byStatus.pending, 1);
    assert.equal(helpdeskReportsPayload.byQueue[0]?.queueId, queuePayload.id);
    assert.equal(helpdeskReportsPayload.byQueue[0]?.count, 1);
    const dashboardAfterHelpdesk = await fetchWithAuth(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardAfterHelpdesk.status, 200);
    assert.deepEqual(await dashboardAfterHelpdesk.json(), {
        customers: 1,
        nodes: 1,
        devices: 2,
        tickets: 1,
    });
    const createdDasanDevice = await fetchWithAuth(`${baseUrl}/api/v1/net-devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Dasan OLT 1",
            hostname: "olt-1",
            serialNumber: "DASAN-OLT-1",
            managementIp: "10.0.222.16",
            deviceType: "dasan_v5816",
            status: "active",
            netNodeId: nodePayload.id,
            notes: "OLT testowa",
        }),
    });
    assert.equal(createdDasanDevice.status, 201);
    const dasanDevicePayload = await createdDasanDevice.json();
    assert.ok(dasanDevicePayload.id > 0);
    const createdDasanProfile = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/access-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            netDeviceId: dasanDevicePayload.id,
            driver: "dasan_ssh",
            host: "10.0.222.16",
            port: 22502,
            username: "admin",
            password: "fixture-password",
            enablePassword: "fixture-enable",
        }),
    });
    assert.equal(createdDasanProfile.status, 201);
    const dasanProfilePayload = await createdDasanProfile.json();
    assert.equal(dasanProfilePayload.driver, "dasan_ssh");
    const dasanProfileTest = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/access-profiles/${dasanProfilePayload.id}/test`, {
        method: "POST",
    });
    assert.equal(dasanProfileTest.status, 200);
    const dasanProfileTestPayload = await dasanProfileTest.json();
    assert.equal(dasanProfileTestPayload.result.driver, "dasan_ssh");
    assert.equal(dasanProfileTestPayload.result.ok, true);
    assert.ok(dasanProfileTestPayload.result.summary.onuCount > 0);
    assert.ok(dasanProfileTestPayload.result.summary.macCount > 0);
    assert.ok(dasanProfileTestPayload.result.summary.activeOnuCount > 0);
    const dasanScan = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/scan/${dasanDevicePayload.id}`, {
        method: "POST",
    });
    assert.equal(dasanScan.status, 201);
    const dasanScanPayload = await dasanScan.json();
    assert.equal(dasanScanPayload.session.status, "succeeded");
    assert.ok(dasanScanPayload.records.some((record) => record.recordKind === "dasan_onu"));
    assert.ok(dasanScanPayload.records.some((record) => record.recordKind === "dasan_mac"));
    const dasanOnuRecord = dasanScanPayload.records.find((record) => record.recordKind === "dasan_onu" && record.serialNumber === "DSNW276d9298");
    assert.ok(dasanOnuRecord);
    const importedDasanDevice = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/import-record/${dasanOnuRecord?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            comment: "Imported from Dasan discovery",
        }),
    });
    assert.equal(importedDasanDevice.status, 201);
    const importedDasanPayload = await importedDasanDevice.json();
    assert.ok(importedDasanPayload.customerDevice.id > 0);
    assert.equal(importedDasanPayload.customerDevice.deviceType, "onu");
    assert.equal(importedDasanPayload.customerDevice.remoteVendor, "dasan");
    assert.equal(importedDasanPayload.customerDevice.remoteSerialNumber, "DSNW276d9298");
    assert.equal(importedDasanPayload.customerDevice.remoteOlt, 1);
    assert.equal(importedDasanPayload.customerDevice.remoteOnu, 1);
    const updatedDasanCustomerDevice = await fetchWithAuth(`${baseUrl}/api/v1/customer-devices/${importedDasanPayload.customerDevice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            macAddress: "54:db:a2:18:ce:99",
        }),
    });
    assert.equal(updatedDasanCustomerDevice.status, 200);
    const dasanRemoteTest = await fetchWithAuth(`${baseUrl}/api/v1/diagnostics/remote-test/${importedDasanPayload.customerDevice.id}`, {
        method: "POST",
    });
    assert.equal(dasanRemoteTest.status, 200);
    const dasanRemoteTestPayload = await dasanRemoteTest.json();
    assert.equal(dasanRemoteTestPayload.remoteDiagnostics.driver, "dasan_ssh");
    assert.equal(dasanRemoteTestPayload.remoteDiagnostics.ok, true);
    assert.ok(dasanRemoteTestPayload.remoteDiagnostics.checks.some((entry) => entry.key === "dasan_onu_active" && entry.ok));
    assert.ok(dasanRemoteTestPayload.remoteDiagnostics.checks.some((entry) => entry.key === "dasan_mac_presence" && entry.ok));
    const documentContent = "Umowa testowa SNMS";
    const createdDocument = await fetchWithAuth(`${baseUrl}/api/v1/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: "Umowa klienta",
            docType: "contract",
            customerId: customerPayload.id,
            notes: "Dokument podpisany elektronicznie",
            originalFilename: "umowa.txt",
            mimeType: "text/plain",
            contentBase64: Buffer.from(documentContent, "utf8").toString("base64"),
        }),
    });
    assert.equal(createdDocument.status, 201);
    const documentPayload = await createdDocument.json();
    assert.ok(documentPayload.id > 0);
    assert.equal(documentPayload.title, "Umowa klienta");
    assert.equal(documentPayload.customer?.id, customerPayload.id);
    assert.equal(documentPayload.originalFilename, "umowa.txt");
    const documentList = await fetchWithAuth(`${baseUrl}/api/v1/documents?q=Umowa`);
    assert.equal(documentList.status, 200);
    const documentListPayload = await documentList.json();
    assert.equal(documentListPayload.length, 1);
    assert.equal(documentListPayload[0]?.id, documentPayload.id);
    assert.ok((documentListPayload[0]?.fileSize ?? 0) > 0);
    const downloadedDocument = await fetchWithAuth(`${baseUrl}/api/v1/documents/${documentPayload.id}/download`);
    assert.equal(downloadedDocument.status, 200);
    assert.equal(downloadedDocument.headers.get("content-type"), "text/plain");
    assert.equal(await downloadedDocument.text(), documentContent);
    const deletedDocument = await fetchWithAuth(`${baseUrl}/api/v1/documents/${documentPayload.id}`, {
        method: "DELETE",
    });
    assert.equal(deletedDocument.status, 204);
    const documentListAfterDelete = await fetchWithAuth(`${baseUrl}/api/v1/documents`);
    assert.equal(documentListAfterDelete.status, 200);
    const documentListAfterDeletePayload = await documentListAfterDelete.json();
    assert.equal(documentListAfterDeletePayload.length, 0);
    const tercXml = `
        <root>
            <row><WOJ>14</WOJ><POW></POW><GMI></GMI><NAZWA>mazowieckie</NAZWA></row>
            <row><WOJ>14</WOJ><POW>65</POW><GMI></GMI><NAZWA>warszawski zachodni</NAZWA></row>
        </root>
    `;
    const simcXml = `
        <root>
            <row><WOJ>14</WOJ><POW>65</POW><GMI>01</GMI><RODZ_GMI>1</RODZ_GMI><NAZWA>Ożarów Mazowiecki</NAZWA><SYM>0982950</SYM></row>
        </root>
    `;
    const ulicXml = `
        <root>
            <row><SYM>0982950</SYM><CECHA>ul.</CECHA><NAZWA_1>Poznańska</NAZWA_1><NAZWA_2></NAZWA_2><SYM_UL>15566</SYM_UL></row>
        </root>
    `;
    const importedTerc = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/terc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: tercXml }),
    });
    assert.equal(importedTerc.status, 200);
    assert.deepEqual(await importedTerc.json(), {
        importedStates: 1,
        importedDistricts: 1,
        importedCommunes: 0,
    });
    const importedSimc = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/simc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: simcXml }),
    });
    assert.equal(importedSimc.status, 200);
    assert.deepEqual(await importedSimc.json(), {
        importedCities: 1,
    });
    const importedUlic = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/ulic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: ulicXml }),
    });
    assert.equal(importedUlic.status, 200);
    assert.deepEqual(await importedUlic.json(), {
        importedStreets: 1,
    });
    const terytCities = await fetchWithAuth(`${baseUrl}/api/v1/teryt/cities?q=Oża`);
    assert.equal(terytCities.status, 200);
    const terytCitiesPayload = await terytCities.json();
    assert.equal(terytCitiesPayload.length, 1);
    assert.equal(terytCitiesPayload[0]?.name, "Ożarów Mazowiecki");
    assert.equal(terytCitiesPayload[0]?.district?.name, "Warszawski Zachodni");
    assert.equal(terytCitiesPayload[0]?.streetCount, 1);
    assert.equal(terytCitiesPayload[0]?.isManaged, false);
    assert.equal(terytCitiesPayload[0]?.isDefault, false);
    const cityId = terytCitiesPayload[0]?.id ?? 0;
    assert.ok(cityId > 0);
    const citySuggestions = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=city&q=Oża`);
    assert.equal(citySuggestions.status, 200);
    const citySuggestionsPayload = await citySuggestions.json();
    assert.equal(citySuggestionsPayload.length, 1);
    assert.equal(citySuggestionsPayload[0]?.text, "Ożarów Mazowiecki");
    assert.equal(citySuggestionsPayload[0]?.type, "city");
    const streetSuggestions = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=street&cityId=${cityId}&q=Poz`);
    assert.equal(streetSuggestions.status, 200);
    const streetSuggestionsPayload = await streetSuggestions.json();
    assert.equal(streetSuggestionsPayload.length, 1);
    assert.equal(streetSuggestionsPayload[0]?.text, "ul. Poznańska");
    assert.equal(streetSuggestionsPayload[0]?.type, "street");
    const setManaged = await fetchWithAuth(`${baseUrl}/api/v1/addresses/cities/${cityId}/toggle-managed`, {
        method: "POST",
    });
    assert.equal(setManaged.status, 200);
    const setManagedPayload = await setManaged.json();
    assert.equal(setManagedPayload.id, cityId);
    assert.equal(setManagedPayload.isManaged, true);
    assert.equal(setManagedPayload.isDefault, false);
    const setDefault = await fetchWithAuth(`${baseUrl}/api/v1/addresses/cities/${cityId}/set-default`, {
        method: "POST",
    });
    assert.equal(setDefault.status, 200);
    const setDefaultPayload = await setDefault.json();
    assert.equal(setDefaultPayload.id, cityId);
    assert.equal(setDefaultPayload.isManaged, true);
    assert.equal(setDefaultPayload.isDefault, true);
    const managedCities = await fetchWithAuth(`${baseUrl}/api/v1/addresses/cities?managedOnly=true`);
    assert.equal(managedCities.status, 200);
    const managedCitiesPayload = await managedCities.json();
    assert.equal(managedCitiesPayload.length, 1);
    assert.equal(managedCitiesPayload[0]?.id, cityId);
    assert.equal(managedCitiesPayload[0]?.isManaged, true);
    assert.equal(managedCitiesPayload[0]?.isDefault, true);
    const addressSearch = await fetchWithAuth(`${baseUrl}/api/v1/addresses/search-teryt?q=Oża`);
    assert.equal(addressSearch.status, 200);
    const addressSearchPayload = await addressSearch.json();
    assert.equal(addressSearchPayload.length, 1);
    assert.equal(addressSearchPayload[0]?.id, cityId);
    assert.equal(addressSearchPayload[0]?.name, "Ożarów Mazowiecki");
    const adminInfo = await fetchWithAuth(`${baseUrl}/api/v1/admin/info`);
    assert.equal(adminInfo.status, 200);
    const adminInfoPayload = await adminInfo.json();
    assert.equal(adminInfoPayload.engine, "TypeScript");
    assert.equal(adminInfoPayload.dbKind, "SQLite");
    const createdReload = await fetchWithAuth(`${baseUrl}/api/v1/admin/reload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Smoke reload test" }),
    });
    assert.equal(createdReload.status, 201);
    const reloadPayload = await createdReload.json();
    assert.ok(reloadPayload.id > 0);
    assert.equal(reloadPayload.note, "Smoke reload test");
    const reloadList = await fetchWithAuth(`${baseUrl}/api/v1/admin/reload`);
    assert.equal(reloadList.status, 200);
    const reloadListPayload = await reloadList.json();
    assert.equal(reloadListPayload.length, 1);
    assert.equal(reloadListPayload[0]?.id, reloadPayload.id);
    const createdBackup = await fetchWithAuth(`${baseUrl}/api/v1/admin/backups/create`, {
        method: "POST",
    });
    assert.equal(createdBackup.status, 201);
    const backupPayload = await createdBackup.json();
    assert.ok(backupPayload.filename.endsWith(".sqlite"));
    assert.ok(backupPayload.sizeBytes > 0);
    const backupList = await fetchWithAuth(`${baseUrl}/api/v1/admin/backups`);
    assert.equal(backupList.status, 200);
    const backupListPayload = await backupList.json();
    assert.equal(backupListPayload.length, 1);
    assert.equal(backupListPayload[0]?.filename, backupPayload.filename);
    const downloadedBackup = await fetchWithAuth(`${baseUrl}${backupPayload.downloadUrl}`);
    assert.equal(downloadedBackup.status, 200);
    assert.ok((await downloadedBackup.arrayBuffer()).byteLength > 0);
    const auditLogs = await fetchWithAuth(`${baseUrl}/api/v1/admin/audit-logs`);
    assert.equal(auditLogs.status, 200);
    const auditLogsPayload = await auditLogs.json();
    assert.ok(auditLogsPayload.some((entry) => entry.action === "config_reload" && entry.details === "Smoke reload test" && entry.actorId === adminUser?.id));
    assert.ok(auditLogsPayload.some((entry) => entry.action === "backup_create" && entry.details?.includes(backupPayload.filename) && entry.actorId === adminUser?.id));
    const deletedBackup = await fetchWithAuth(`${baseUrl}/api/v1/admin/backups/${encodeURIComponent(backupPayload.filename)}`, {
        method: "DELETE",
    });
    assert.equal(deletedBackup.status, 204);
    const backupListAfterDelete = await fetchWithAuth(`${baseUrl}/api/v1/admin/backups`);
    assert.equal(backupListAfterDelete.status, 200);
    const backupListAfterDeletePayload = await backupListAfterDelete.json();
    assert.equal(backupListAfterDeletePayload.length, 0);
    const deleteGroup = await fetchWithAuth(`${baseUrl}/api/v1/customer-groups/${groupPayload.id}`, {
        method: "DELETE",
    });
    assert.equal(deleteGroup.status, 204);
});
//# sourceMappingURL=smoke.test.js.map