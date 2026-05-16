import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

test("network discovery session auto-import creates parsed and fallback customers with tariff/subscription mapping", async (t) => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-auto-import-"));
    const dbPath = join(tempDir, "auto-import.sqlite");
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
    process.env.CRM_PORTAL_TS_SESSION_SECRET = "auto-import-session-secret";
    process.env.CRM_ENCRYPTION_KEY = "test-encryption-key";
    process.env.CRM_ADMIN_USER = "admin";
    process.env.CRM_ADMIN_PASSWORD = "Admin123!";
    process.env.CRM_ENV = "production";
    process.env.NODE_ENV = "production";
    process.env.CRM_NETWORK_DISCOVERY_FIXTURES = "1";

    const [{ startServer }, { AppDataSource }, { getSchemaMigrationStatus }] = await Promise.all([
        import("../app.js"),
        import("../database.js"),
        import("../schema_migrations.js"),
    ]);

    const server = await startServer(0);

    t.after(async () => {
        await new Promise<void>((resolve, reject) => {
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

    const migrationStatus = await getSchemaMigrationStatus(AppDataSource);
    assert.equal(migrationStatus.pending.length, 0);

    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;

    let authCookie = "";

    const captureCookie = (response: Response) => {
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            authCookie = setCookie.split(";")[0] ?? "";
        }
    };

    const fetchWithAuth = (input: string, init: RequestInit = {}) => {
        const headers = new Headers(init.headers ?? {});
        if (authCookie) {
            headers.set("Cookie", authCookie);
        }

        return fetch(input, {
            ...init,
            headers,
        });
    };

    const loginResponse = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "admin",
            password: "Admin123!",
        }),
    });
    assert.equal(loginResponse.status, 200);
    captureCookie(loginResponse);

    const createdNode = await fetchWithAuth(`${baseUrl}/api/v1/net-nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Auto Import Node",
            locationType: "other",
        }),
    });
    assert.equal(createdNode.status, 201);
    const nodePayload = await createdNode.json() as { id: number };

    const createdNetDevice = await fetchWithAuth(`${baseUrl}/api/v1/net-devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Mikrotik Auto Import",
            hostname: "mikrotik-auto",
            managementIp: "10.0.222.86",
            deviceType: "mikrotik",
            status: "active",
            netNodeId: nodePayload.id,
        }),
    });
    assert.equal(createdNetDevice.status, 201);
    const netDevicePayload = await createdNetDevice.json() as { id: number };

    const createdProfile = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/access-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            netDeviceId: netDevicePayload.id,
            driver: "mikrotik_api",
            host: "10.0.222.86",
            port: 8728,
            username: "admin",
            password: "fixture-password",
            useTls: false,
        }),
    });
    assert.equal(createdProfile.status, 201);

    const scanResponse = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/scan/${netDevicePayload.id}`, {
        method: "POST",
    });
    assert.equal(scanResponse.status, 201);
    const scanPayload = await scanResponse.json() as {
        session: { id: number };
        records: Array<{ recordKind: string }>;
    };
    assert.ok(scanPayload.records.some((record) => record.recordKind === "mikrotik_lease"));

    const autoImportResponse = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/sessions/${scanPayload.session.id}/auto-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            importTariffsAndSubscriptions: true,
        }),
    });
    assert.equal(autoImportResponse.status, 200);
    const autoImportPayload = await autoImportResponse.json() as {
        summary: {
            importedCustomerDevices: number;
            createdCustomers: number;
            autoGeneratedCustomers: number;
            createdTariffs: number;
            createdSubscriptions: number;
            skippedRecords: number;
        };
    };
    assert.equal(autoImportPayload.summary.importedCustomerDevices, 2);
    assert.equal(autoImportPayload.summary.createdCustomers, 2);
    assert.equal(autoImportPayload.summary.autoGeneratedCustomers, 1);
    assert.equal(autoImportPayload.summary.createdTariffs, 1);
    assert.equal(autoImportPayload.summary.createdSubscriptions, 2);

    const allCustomersResponse = await fetchWithAuth(`${baseUrl}/api/v1/customers?limit=20`);
    assert.equal(allCustomersResponse.status, 200);
    const allCustomers = await allCustomersResponse.json() as Array<{
        id: number;
        firstName: string;
        lastName: string;
        isAutoGenerated: boolean;
        autoImportSource: string | null;
    }>;
    assert.equal(allCustomers.length, 2);
    assert.ok(allCustomers.some((customer) => customer.lastName === "Kowalski" && customer.isAutoGenerated === false));
    assert.ok(allCustomers.some((customer) => customer.firstName === "Nieznany" && customer.isAutoGenerated === true));

    const autoCustomersResponse = await fetchWithAuth(`${baseUrl}/api/v1/customers?autoGenerated=true&limit=20`);
    assert.equal(autoCustomersResponse.status, 200);
    const autoCustomers = await autoCustomersResponse.json() as Array<{ isAutoGenerated: boolean; autoImportSource: string | null }>;
    assert.equal(autoCustomers.length, 1);
    assert.equal(autoCustomers[0]?.isAutoGenerated, true);
    assert.equal(autoCustomers[0]?.autoImportSource, "mikrotik_comment_parse_failed");

    const normalCustomersResponse = await fetchWithAuth(`${baseUrl}/api/v1/customers?autoGenerated=false&limit=20`);
    assert.equal(normalCustomersResponse.status, 200);
    const normalCustomers = await normalCustomersResponse.json() as Array<{ isAutoGenerated: boolean; lastName: string }>;
    assert.equal(normalCustomers.length, 1);
    assert.equal(normalCustomers[0]?.isAutoGenerated, false);
    assert.equal(normalCustomers[0]?.lastName, "Kowalski");

    const tariffsResponse = await fetchWithAuth(`${baseUrl}/api/v1/finances/tariffs`);
    assert.equal(tariffsResponse.status, 200);
    const tariffsPayload = await tariffsResponse.json() as Array<{
        id: number;
        name: string;
        speedDownMbps: number | null;
        speedUpMbps: number | null;
        subscriptionCount: number;
    }>;
    assert.equal(tariffsPayload.length, 1);
    assert.equal(tariffsPayload[0]?.speedDownMbps, 100);
    assert.equal(tariffsPayload[0]?.speedUpMbps, 20);
    assert.equal(tariffsPayload[0]?.subscriptionCount, 2);

    const subscriptionsResponse = await fetchWithAuth(`${baseUrl}/api/v1/subscriptions`);
    assert.equal(subscriptionsResponse.status, 200);
    const subscriptionsPayload = await subscriptionsResponse.json() as Array<{
        tariffId: number;
        deviceId: number | null;
        active: boolean;
        speedDownMbps: number | null;
        speedUpMbps: number | null;
    }>;
    assert.equal(subscriptionsPayload.length, 2);
    assert.ok(subscriptionsPayload.every((subscription) => subscription.active));
    assert.ok(subscriptionsPayload.every((subscription) => subscription.tariffId === tariffsPayload[0]?.id));
    assert.ok(subscriptionsPayload.every((subscription) => subscription.deviceId !== null));
    assert.ok(subscriptionsPayload.every((subscription) => subscription.speedDownMbps === 100));
    assert.ok(subscriptionsPayload.every((subscription) => subscription.speedUpMbps === 20));

    const secondAutoImportResponse = await fetchWithAuth(`${baseUrl}/api/v1/network-discovery/sessions/${scanPayload.session.id}/auto-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            importTariffsAndSubscriptions: true,
        }),
    });
    assert.equal(secondAutoImportResponse.status, 200);
    const secondAutoImportPayload = await secondAutoImportResponse.json() as {
        summary: {
            importedCustomerDevices: number;
            createdCustomers: number;
            autoGeneratedCustomers: number;
            createdTariffs: number;
            createdSubscriptions: number;
            skippedRecords: number;
        };
    };
    assert.equal(secondAutoImportPayload.summary.importedCustomerDevices, 0);
    assert.equal(secondAutoImportPayload.summary.createdCustomers, 0);
    assert.equal(secondAutoImportPayload.summary.createdTariffs, 0);
    assert.equal(secondAutoImportPayload.summary.createdSubscriptions, 0);
    assert.ok(secondAutoImportPayload.summary.skippedRecords >= 2);
});
