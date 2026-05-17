import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
test("auto-import Mikrotik comment maps managed default city and street to TERYT ids", async (t) => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-auto-import-teryt-"));
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
    };
    process.env.CRM_PORTAL_TS_DB_PATH = dbPath;
    process.env.CRM_PORTAL_TS_UPLOAD_ROOT = join(tempDir, "uploads");
    process.env.CRM_PORTAL_TS_BACKUP_ROOT = join(tempDir, "backups");
    process.env.CRM_PORTAL_TS_SESSION_SECRET = "test-session-secret-for-auto-import";
    process.env.CRM_ENCRYPTION_KEY = "test-encryption-key";
    process.env.CRM_ADMIN_USER = "admin";
    process.env.CRM_ADMIN_PASSWORD = "Admin123!";
    process.env.CRM_ENV = "production";
    process.env.NODE_ENV = "production";
    const [{ startServer }, { AppDataSource }, { NetDevice, NetworkDiscoveryRecord, NetworkDiscoverySession }, { NetDeviceStatus }, { autoImportDiscoverySession }] = await Promise.all([
        import("../app.js"),
        import("../database.js"),
        import("../models/network.js"),
        import("../models/common.js"),
        import("../services/network_auto_import.js"),
    ]);
    const server = await startServer(0);
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
            }
            else {
                process.env[key] = value;
            }
        }
        await rm(tempDir, { recursive: true, force: true });
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;
    let authCookie = "";
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
    const loginResponse = await fetchWithAuth(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "Admin123!" }),
    });
    assert.equal(loginResponse.status, 200);
    authCookie = loginResponse.headers.get("set-cookie")?.split(";")[0] ?? "";
    const tercXml = `
        <root>
            <row><WOJ>14</WOJ><POW>32</POW><GMI></GMI><RODZ></RODZ><NAZWA>warszawa</NAZWA></row>
            <row><WOJ>14</WOJ><POW>32</POW><GMI>08</GMI><RODZ>2</RODZ><NAZWA>Bemowo</NAZWA></row>
        </root>
    `;
    const simcXml = `
        <root>
            <row><WOJ>14</WOJ><POW>32</POW><GMI>08</GMI><RODZ_GMI>2</RODZ_GMI><NAZWA>Warszawa</NAZWA><SYM>0918123</SYM></row>
        </root>
    `;
    const ulicXml = `
        <root>
            <row><SYM>0918123</SYM><CECHA>ul.</CECHA><NAZWA_1>Romana</NAZWA_1><NAZWA_2>Koseły</NAZWA_2><SYM_UL>17777</SYM_UL></row>
        </root>
    `;
    await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/terc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: tercXml }),
    });
    await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/simc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: simcXml }),
    });
    await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/ulic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: ulicXml }),
    });
    const communeSuggest = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=commune&q=Bem`);
    const communeRows = await communeSuggest.json();
    const communeId = communeRows[0]?.id ?? 0;
    assert.ok(communeId > 0);
    const setManaged = await fetchWithAuth(`${baseUrl}/api/v1/addresses/communes/${communeId}/toggle-managed`, {
        method: "POST",
    });
    assert.equal(setManaged.status, 200);
    const setDefault = await fetchWithAuth(`${baseUrl}/api/v1/addresses/communes/${communeId}/set-default`, {
        method: "POST",
    });
    assert.equal(setDefault.status, 200);
    const netDeviceRepo = AppDataSource.getRepository(NetDevice);
    const sessionRepo = AppDataSource.getRepository(NetworkDiscoverySession);
    const recordRepo = AppDataSource.getRepository(NetworkDiscoveryRecord);
    const customerRepo = AppDataSource.getRepository((await import("../models/customer.js")).Customer);
    const customerDeviceRepo = AppDataSource.getRepository((await import("../models/network.js")).CustomerDevice);
    const tariffRepo = AppDataSource.getRepository((await import("../models/finance.js")).Tariff);
    const subscriptionRepo = AppDataSource.getRepository((await import("../models/finance.js")).Subscription);
    const netDevice = await netDeviceRepo.save(netDeviceRepo.create({
        name: "Mikrotik import test",
        deviceType: "router",
        status: NetDeviceStatus.active,
    }));
    const session = await sessionRepo.save(sessionRepo.create({
        netDeviceId: netDevice.id,
        driver: "mikrotik_api",
        status: "succeeded",
    }));
    const record = await recordRepo.save(recordRepo.create({
        sessionId: session.id,
        netDeviceId: netDevice.id,
        recordKind: "mikrotik_lease",
        externalKey: "lease:10.10.10.2",
        hostname: "cpe-1",
        ipAddress: "10.10.10.2",
        macAddress: "AA:BB:CC:DD:EE:FF",
        recordStatus: "active",
        payloadJson: JSON.stringify({
            address: "10.10.10.2",
            macAddress: "AA:BB:CC:DD:EE:FF",
            hostName: "cpe-1",
            comment: "1195 Test M12 kos 7A",
            rateLimit: "100M/20M",
            parsedComment: {
                externalId: "1195",
                lastName: "Test",
                apartmentNumber: "12",
                streetName: "Romana Koseły",
                streetNumber: "7A",
            },
        }),
    }));
    const result = await autoImportDiscoverySession([record], {
        importTariffsAndSubscriptions: true,
    }, {
        customerRepo,
        customerDeviceRepo,
        tariffRepo,
        subscriptionRepo,
    });
    assert.equal(result.summary.createdCustomers, 1);
    assert.equal(result.summary.importedCustomerDevices, 1);
    assert.equal(result.summary.createdTariffs, 1);
    assert.equal(result.summary.createdSubscriptions, 1);
    const importedCustomer = await customerRepo.findOneByOrFail({ id: result.createdCustomerIds[0] });
    assert.ok(importedCustomer.correspondenceCityId);
    assert.ok(importedCustomer.correspondenceStreetId);
    assert.equal(importedCustomer.correspondenceCity, "Warszawa");
    assert.equal(importedCustomer.correspondenceStreet, "ul. Koseły Romana");
    const importedDevice = await customerDeviceRepo.findOneByOrFail({ id: result.importedCustomerDeviceIds[0] });
    assert.ok(importedDevice.installationCityId);
    assert.ok(importedDevice.installationStreetId);
    assert.equal(importedDevice.installationCity, "Warszawa");
    assert.equal(importedDevice.installationStreet, "ul. Koseły Romana");
});
//# sourceMappingURL=network_auto_import_teryt.test.js.map