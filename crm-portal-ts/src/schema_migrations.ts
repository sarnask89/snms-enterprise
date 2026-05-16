import type { DataSource } from "typeorm";
import { AppDataSource } from "./database.js";

const MIGRATION_TABLE = "runtime_schema_migrations";
const BASELINE_MIGRATION = {
    id: "20260516_0001_runtime_baseline",
    name: "runtime_baseline",
};
const NETWORK_DISCOVERY_LIVE_MIGRATION = {
    id: "20260516_0002_network_discovery_live",
    name: "network_discovery_live",
};
const CUSTOMER_DOMAIN_EXPANSION_MIGRATION = {
    id: "20260516_0003_customer_domain_expansion",
    name: "customer_domain_expansion",
};
const TERYT_RELATIONAL_ADDRESSING_MIGRATION = {
    id: "20260516_0004_teryt_relational_addressing",
    name: "teryt_relational_addressing",
};

type MigrationRow = {
    id: string;
    name: string;
    applied_at: string;
};

type ManagedMigration = {
    id: string;
    name: string;
    apply?: (dataSource: DataSource) => Promise<void>;
};

async function ensureMigrationTable(dataSource: DataSource) {
    await dataSource.query(`
        CREATE TABLE IF NOT EXISTS ${MIGRATION_TABLE} (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at TEXT NOT NULL
        )
    `);
}

async function listManagedTables(dataSource: DataSource) {
    const rows = await dataSource.query(
        `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name NOT LIKE 'sqlite_%'
              AND name != ?
            ORDER BY name
        `,
        [MIGRATION_TABLE],
    ) as Array<{ name: string }>;

    return rows.map((row) => row.name);
}

async function getAppliedMigrations(dataSource: DataSource) {
    await ensureMigrationTable(dataSource);
    const rows = await dataSource.query(
        `
            SELECT id, name, applied_at
            FROM ${MIGRATION_TABLE}
            ORDER BY applied_at ASC, id ASC
        `,
    ) as MigrationRow[];

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        appliedAt: row.applied_at,
    }));
}

async function tableExists(dataSource: DataSource, tableName: string) {
    const rows = await dataSource.query(
        `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = ?
            LIMIT 1
        `,
        [tableName],
    ) as Array<{ name: string }>;

    return rows.length > 0;
}

async function getTableColumns(dataSource: DataSource, tableName: string) {
    if (!await tableExists(dataSource, tableName)) {
        return new Set<string>();
    }

    const rows = await dataSource.query(`PRAGMA table_info(${tableName})`) as Array<{ name: string }>;
    return new Set(rows.map((row) => row.name));
}

async function addColumnIfMissing(
    dataSource: DataSource,
    tableName: string,
    columnName: string,
    columnDefinition: string,
) {
    const columns = await getTableColumns(dataSource, tableName);
    if (columns.has(columnName)) {
        return;
    }

    await dataSource.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
}

async function applyNetworkDiscoveryLiveMigration(dataSource: DataSource) {
    await dataSource.query(`
        CREATE TABLE IF NOT EXISTS network_device_access_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            net_device_id INTEGER NOT NULL UNIQUE,
            driver TEXT NOT NULL,
            host TEXT NOT NULL,
            port INTEGER,
            username TEXT NOT NULL,
            password_ciphertext TEXT NOT NULL,
            enable_password_ciphertext TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(net_device_id) REFERENCES net_devices(id) ON DELETE CASCADE
        )
    `);

    await dataSource.query(`
        CREATE TABLE IF NOT EXISTS network_discovery_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            net_device_id INTEGER NOT NULL,
            access_profile_id INTEGER,
            driver TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'running',
            summary TEXT,
            error_message TEXT,
            started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            finished_at TEXT,
            FOREIGN KEY(net_device_id) REFERENCES net_devices(id) ON DELETE CASCADE,
            FOREIGN KEY(access_profile_id) REFERENCES network_device_access_profiles(id) ON DELETE SET NULL
        )
    `);

    await dataSource.query(`
        CREATE TABLE IF NOT EXISTS network_discovery_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            net_device_id INTEGER NOT NULL,
            record_kind TEXT NOT NULL,
            external_key TEXT,
            hostname TEXT,
            ip_address TEXT,
            mac_address TEXT,
            serial_number TEXT,
            record_status TEXT,
            profile_name TEXT,
            fail_reason TEXT,
            remote_port TEXT,
            remote_vlan_id INTEGER,
            remote_olt INTEGER,
            remote_onu INTEGER,
            distance_meters INTEGER,
            rx_power_dbm REAL,
            payload_json TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(session_id) REFERENCES network_discovery_sessions(id) ON DELETE CASCADE,
            FOREIGN KEY(net_device_id) REFERENCES net_devices(id) ON DELETE CASCADE
        )
    `);

    await addColumnIfMissing(dataSource, "customer_devices", "remote_vendor", "remote_vendor TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_serial_number", "remote_serial_number TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_olt", "remote_olt INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_onu", "remote_onu INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_port", "remote_port TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_profile_name", "remote_profile_name TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "remote_rx_power_dbm", "remote_rx_power_dbm REAL");
}

async function applyCustomerDomainExpansionMigration(dataSource: DataSource) {
    await addColumnIfMissing(dataSource, "customers", "customer_type", "customer_type TEXT NOT NULL DEFAULT 'individual'");
    await addColumnIfMissing(dataSource, "customers", "middle_name", "middle_name TEXT");
    await addColumnIfMissing(dataSource, "customers", "company_name", "company_name TEXT");
    await addColumnIfMissing(dataSource, "customers", "secondary_phone", "secondary_phone TEXT");
    await addColumnIfMissing(dataSource, "customers", "billing_email", "billing_email TEXT");
    await addColumnIfMissing(dataSource, "customers", "pesel", "pesel TEXT");
    await addColumnIfMissing(dataSource, "customers", "nip", "nip TEXT");
    await addColumnIfMissing(dataSource, "customers", "regon", "regon TEXT");
    await addColumnIfMissing(dataSource, "customers", "krs", "krs TEXT");
    await addColumnIfMissing(dataSource, "customers", "id_document_type", "id_document_type TEXT");
    await addColumnIfMissing(dataSource, "customers", "id_document_number", "id_document_number TEXT");
    await addColumnIfMissing(dataSource, "customers", "birth_date", "birth_date TEXT");
    await addColumnIfMissing(dataSource, "customers", "contact_first_name", "contact_first_name TEXT");
    await addColumnIfMissing(dataSource, "customers", "contact_last_name", "contact_last_name TEXT");
    await addColumnIfMissing(dataSource, "customers", "contact_phone", "contact_phone TEXT");
    await addColumnIfMissing(dataSource, "customers", "contact_email", "contact_email TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_state", "correspondence_state TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_county", "correspondence_county TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_city", "correspondence_city TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_street", "correspondence_street TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_street_number", "correspondence_street_number TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_apartment_number", "correspondence_apartment_number TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_postal_code", "correspondence_postal_code TEXT");
    await addColumnIfMissing(dataSource, "customers", "correspondence_country", "correspondence_country TEXT");
    await addColumnIfMissing(dataSource, "customers", "contract_number", "contract_number TEXT");
    await addColumnIfMissing(dataSource, "customers", "contract_signed_at", "contract_signed_at TEXT");
    await addColumnIfMissing(dataSource, "customers", "service_start_date", "service_start_date TEXT");
    await addColumnIfMissing(dataSource, "customers", "payment_method", "payment_method TEXT");
    await addColumnIfMissing(dataSource, "customers", "payment_due_day", "payment_due_day INTEGER");
    await addColumnIfMissing(dataSource, "customers", "invoice_recipient_name", "invoice_recipient_name TEXT");
    await addColumnIfMissing(dataSource, "customers", "invoice_recipient_tax_id", "invoice_recipient_tax_id TEXT");
    await addColumnIfMissing(dataSource, "customers", "billing_notes", "billing_notes TEXT");
    await addColumnIfMissing(dataSource, "customers", "marketing_consent", "marketing_consent INTEGER NOT NULL DEFAULT 0");
    await addColumnIfMissing(dataSource, "customers", "email_consent", "email_consent INTEGER NOT NULL DEFAULT 0");
    await addColumnIfMissing(dataSource, "customers", "sms_consent", "sms_consent INTEGER NOT NULL DEFAULT 0");
    await addColumnIfMissing(dataSource, "customers", "document_delivery_consent", "document_delivery_consent INTEGER NOT NULL DEFAULT 0");
    await addColumnIfMissing(dataSource, "customers", "is_auto_generated", "is_auto_generated INTEGER NOT NULL DEFAULT 0");
    await addColumnIfMissing(dataSource, "customers", "auto_import_source", "auto_import_source TEXT");

    await addColumnIfMissing(dataSource, "customer_devices", "installation_state", "installation_state TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_county", "installation_county TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_city", "installation_city TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_street", "installation_street TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_street_number", "installation_street_number TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_apartment_number", "installation_apartment_number TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_postal_code", "installation_postal_code TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_country", "installation_country TEXT");
    await addColumnIfMissing(dataSource, "customer_devices", "location_description", "location_description TEXT");
}

async function applyTerytRelationalAddressingMigration(dataSource: DataSource) {
    await dataSource.query(`
        CREATE TABLE IF NOT EXISTS location_communes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            district_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            teryt_code TEXT,
            commune_code TEXT,
            commune_type TEXT,
            is_managed INTEGER NOT NULL DEFAULT 0,
            is_default INTEGER NOT NULL DEFAULT 0,
            is_active INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(district_id) REFERENCES location_districts(id) ON DELETE CASCADE
        )
    `);

    await addColumnIfMissing(dataSource, "location_cities", "commune_id", "commune_id INTEGER");
    await addColumnIfMissing(dataSource, "location_streets", "commune_id", "commune_id INTEGER");

    await addColumnIfMissing(dataSource, "customers", "correspondence_state_id", "correspondence_state_id INTEGER");
    await addColumnIfMissing(dataSource, "customers", "correspondence_district_id", "correspondence_district_id INTEGER");
    await addColumnIfMissing(dataSource, "customers", "correspondence_commune_id", "correspondence_commune_id INTEGER");
    await addColumnIfMissing(dataSource, "customers", "correspondence_city_id", "correspondence_city_id INTEGER");
    await addColumnIfMissing(dataSource, "customers", "correspondence_street_id", "correspondence_street_id INTEGER");

    await addColumnIfMissing(dataSource, "customer_devices", "installation_state_id", "installation_state_id INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_district_id", "installation_district_id INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_commune_id", "installation_commune_id INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_city_id", "installation_city_id INTEGER");
    await addColumnIfMissing(dataSource, "customer_devices", "installation_street_id", "installation_street_id INTEGER");

    await dataSource.query(`
        UPDATE customers
        SET correspondence_city_id = COALESCE(correspondence_city_id, location_city_id),
            correspondence_street_id = COALESCE(correspondence_street_id, location_street_id)
        WHERE location_city_id IS NOT NULL
           OR location_street_id IS NOT NULL
    `);
}

const MANAGED_MIGRATIONS: ManagedMigration[] = [
    BASELINE_MIGRATION,
    {
        ...NETWORK_DISCOVERY_LIVE_MIGRATION,
        apply: applyNetworkDiscoveryLiveMigration,
    },
    {
        ...CUSTOMER_DOMAIN_EXPANSION_MIGRATION,
        apply: applyCustomerDomainExpansionMigration,
    },
    {
        ...TERYT_RELATIONAL_ADDRESSING_MIGRATION,
        apply: applyTerytRelationalAddressingMigration,
    },
];

export async function runSchemaMigrations(dataSource: DataSource = AppDataSource) {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    const appliedBefore = await getAppliedMigrations(dataSource);
    const alreadyApplied = appliedBefore.some((entry) => entry.id === BASELINE_MIGRATION.id);

    if (!alreadyApplied) {
        const existingTables = await listManagedTables(dataSource);
        if (existingTables.length > 0) {
            throw new Error(
                `Database contains unmanaged tables before baseline migration: ${existingTables.join(", ")}`,
            );
        }

        await dataSource.synchronize();
        await dataSource.query(
            `
                INSERT INTO ${MIGRATION_TABLE} (id, name, applied_at)
                VALUES (?, ?, ?)
            `,
            [BASELINE_MIGRATION.id, BASELINE_MIGRATION.name, new Date().toISOString()],
        );
    }

    for (const migration of MANAGED_MIGRATIONS.slice(1)) {
        const appliedMigrations = await getAppliedMigrations(dataSource);
        if (appliedMigrations.some((entry) => entry.id === migration.id)) {
            continue;
        }

        await migration.apply?.(dataSource);
        await dataSource.query(
            `
                INSERT INTO ${MIGRATION_TABLE} (id, name, applied_at)
                VALUES (?, ?, ?)
            `,
            [migration.id, migration.name, new Date().toISOString()],
        );
    }

    return await getSchemaMigrationStatus(dataSource);
}

export async function getSchemaMigrationStatus(dataSource: DataSource = AppDataSource) {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    const applied = await getAppliedMigrations(dataSource);
    const pending = MANAGED_MIGRATIONS.filter(
        (migration) => !applied.some((entry) => entry.id === migration.id),
    );

    return {
        migrationTable: MIGRATION_TABLE,
        applied,
        pending,
        current: applied.at(-1) ?? null,
    };
}
