import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
test("baseline schema migrations bootstrap empty runtime database and stay idempotent", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-migrations-"));
    const previousDbPath = process.env.CRM_PORTAL_TS_DB_PATH;
    process.env.CRM_PORTAL_TS_DB_PATH = join(tempDir, "runtime.sqlite");
    const [{ AppDataSource }, { getSchemaMigrationStatus, runSchemaMigrations }] = await Promise.all([
        import("../database.js"),
        import("../schema_migrations.js"),
    ]);
    try {
        await AppDataSource.initialize();
        const before = await getSchemaMigrationStatus(AppDataSource);
        assert.equal(before.applied.length, 0);
        assert.equal(before.pending.length, 6);
        const firstRun = await runSchemaMigrations(AppDataSource);
        assert.equal(firstRun.applied.length, 6);
        assert.equal(firstRun.pending.length, 0);
        assert.equal(firstRun.current?.id, "20260517_0006_customer_device_type");
        const secondRun = await runSchemaMigrations(AppDataSource);
        assert.equal(secondRun.applied.length, 6);
        assert.equal(secondRun.pending.length, 0);
        assert.equal(secondRun.current?.id, "20260517_0006_customer_device_type");
        const columns = await AppDataSource.query("PRAGMA table_info(net_devices)");
        const columnNames = new Set(columns.map((column) => column.name));
        assert.equal(columnNames.has("snmp_community"), true);
        assert.equal(columnNames.has("login_url"), true);
        assert.equal(columnNames.has("driver_type"), true);
        assert.equal(columnNames.has("mgmt_username"), true);
        const customerDeviceColumns = await AppDataSource.query("PRAGMA table_info(customer_devices)");
        const customerDeviceColumnNames = new Set(customerDeviceColumns.map((column) => column.name));
        assert.equal(customerDeviceColumnNames.has("device_type"), true);
        const tables = await AppDataSource.query(`
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = 'runtime_schema_migrations'
        `);
        assert.equal(tables.length, 1);
    }
    finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        if (previousDbPath === undefined) {
            delete process.env.CRM_PORTAL_TS_DB_PATH;
        }
        else {
            process.env.CRM_PORTAL_TS_DB_PATH = previousDbPath;
        }
        await rm(tempDir, { recursive: true, force: true });
    }
});
//# sourceMappingURL=migrations.test.js.map