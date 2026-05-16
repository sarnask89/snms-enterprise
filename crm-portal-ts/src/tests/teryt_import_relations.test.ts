import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

test("TERYT XML import builds commune relations, default area and syncs customer/device address text", async (t) => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-teryt-"));
    const dbPath = join(tempDir, "teryt.sqlite");
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
    process.env.CRM_PORTAL_TS_SESSION_SECRET = "test-session-secret-for-teryt";
    process.env.CRM_ENCRYPTION_KEY = "test-encryption-key";
    process.env.CRM_ADMIN_USER = "admin";
    process.env.CRM_ADMIN_PASSWORD = "Admin123!";
    process.env.CRM_ENV = "production";
    process.env.NODE_ENV = "production";

    const [{ startServer }, { AppDataSource }] = await Promise.all([
        import("../app.js"),
        import("../database.js"),
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
            } else {
                process.env[key] = value;
            }
        }

        await rm(tempDir, { recursive: true, force: true });
    });

    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const baseUrl = `http://127.0.0.1:${address.port}`;

    let authCookie = "";

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
        body: JSON.stringify({ username: "admin", password: "Admin123!" }),
    });
    assert.equal(loginResponse.status, 200);
    authCookie = loginResponse.headers.get("set-cookie")?.split(";")[0] ?? "";

    const tercXml = `
        <root>
            <row><WOJ>14</WOJ><POW></POW><GMI></GMI><RODZ></RODZ><NAZWA>mazowieckie</NAZWA></row>
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
            <row><SYM>0918123</SYM><CECHA>ul.</CECHA><NAZWA_1>Powstańców</NAZWA_1><NAZWA_2>Śląskich</NAZWA_2><SYM_UL>17777</SYM_UL></row>
        </root>
    `;

    const importTerc = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/terc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: tercXml }),
    });
    assert.equal(importTerc.status, 200);
    assert.deepEqual(await importTerc.json(), {
        importedStates: 1,
        importedDistricts: 1,
        importedCommunes: 1,
    });

    const importSimc = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/simc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: simcXml }),
    });
    assert.equal(importSimc.status, 200);

    const importUlic = await fetchWithAuth(`${baseUrl}/api/v1/teryt/import/ulic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: ulicXml }),
    });
    assert.equal(importUlic.status, 200);

    const communeSuggest = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=commune&q=Bem`);
    assert.equal(communeSuggest.status, 200);
    const communeRows = await communeSuggest.json() as Array<{ id: number; text: string }>;
    assert.equal(communeRows.length, 1);
    assert.equal(communeRows[0]?.text, "Bemowo");
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

    const defaultAreaResponse = await fetchWithAuth(`${baseUrl}/api/v1/addresses/default-area`);
    assert.equal(defaultAreaResponse.status, 200);
    const defaultArea = await defaultAreaResponse.json() as {
        commune: { id: number; name: string } | null;
        city: { id: number; name: string } | null;
        district: { name: string } | null;
        state: { name: string } | null;
    };
    assert.equal(defaultArea.commune?.id, communeId);
    assert.equal(defaultArea.city?.name, "Warszawa");
    assert.equal(defaultArea.district?.name, "Warszawa");
    assert.equal(defaultArea.state?.name, "Mazowieckie");

    const citySuggest = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=city&q=War&communeId=${communeId}`);
    assert.equal(citySuggest.status, 200);
    const cityRows = await citySuggest.json() as Array<{ id: number; text: string }>;
    assert.equal(cityRows[0]?.text, "Warszawa");
    const cityId = cityRows[0]?.id ?? 0;
    assert.ok(cityId > 0);

    const streetSuggest = await fetchWithAuth(`${baseUrl}/api/v1/teryt/suggest?kind=street&q=Pow&cityId=${cityId}&communeId=${communeId}`);
    assert.equal(streetSuggest.status, 200);
    const streetRows = await streetSuggest.json() as Array<{ id: number; text: string }>;
    assert.equal(streetRows[0]?.text, "ul. Śląskich Powstańców");
    const streetId = streetRows[0]?.id ?? 0;
    assert.ok(streetId > 0);

    const createdCustomer = await fetchWithAuth(`${baseUrl}/api/v1/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerCode: "TERYT-001",
            customerType: "individual",
            firstName: "Jan",
            lastName: "Adresowy",
            correspondenceCommuneId: communeId,
            correspondenceCityId: cityId,
            correspondenceStreetId: streetId,
            correspondenceStreetNumber: "10",
            correspondenceApartmentNumber: "15",
        }),
    });
    assert.equal(createdCustomer.status, 201);
    const customerPayload = await createdCustomer.json() as {
        id: number;
        correspondenceState: string | null;
        correspondenceDistrictEntry: { name: string } | null;
        correspondenceCommuneEntry: { id: number; name: string } | null;
        correspondenceCityEntry: { id: number; name: string } | null;
        correspondenceStreet: string | null;
    };
    assert.equal(customerPayload.correspondenceCommuneEntry?.id, communeId);
    assert.equal(customerPayload.correspondenceCityEntry?.id, cityId);
    assert.equal(customerPayload.correspondenceStreet, "ul. Śląskich Powstańców");
    assert.equal(customerPayload.correspondenceState, "Mazowieckie");
    assert.equal(customerPayload.correspondenceDistrictEntry?.name, "Warszawa");

    const createdDevice = await fetchWithAuth(`${baseUrl}/api/v1/customer-devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            hostname: "ont-1",
            installationCommuneId: communeId,
            installationCityId: cityId,
            installationStreetId: streetId,
            installationStreetNumber: "10",
        }),
    });
    assert.equal(createdDevice.status, 201);
    const devicePayload = await createdDevice.json() as {
        installationState: string | null;
        installationDistrictEntry: { name: string } | null;
        installationCommuneEntry: { id: number; name: string } | null;
        installationCity: string | null;
        installationStreet: string | null;
    };
    assert.equal(devicePayload.installationCommuneEntry?.id, communeId);
    assert.equal(devicePayload.installationStreet, "ul. Śląskich Powstańców");
    assert.equal(devicePayload.installationCity, "Warszawa");
    assert.equal(devicePayload.installationState, "Mazowieckie");
    assert.equal(devicePayload.installationDistrictEntry?.name, "Warszawa");
});
