export const ACTIVE_RUNTIME_MODULES = [
    "dashboard",
    "admin",
    "addresses",
    "customers",
    "customer-groups",
    "customer-devices",
    "diagnostics",
    "documents",
    "finances",
    "helpdesk",
    "net-nodes",
    "ip-networks",
    "net-devices",
    "network-discovery",
    "pit",
    "subscriptions",
    "teryt",
    "architect",
] as const;

export const MODULE_MIGRATION_STATUS = [
    {
        module: "core-runtime",
        status: "works_in_ts",
        notes: "Baseline runtime compiles and starts on the curated Express/TypeORM core.",
    },
    {
        module: "admin",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/admin with runtime info, audit logs, backups and reload endpoints.",
    },
    {
        module: "addresses",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/addresses with local TERYT city search and managed/default city controls.",
    },
    {
        module: "audit",
        status: "works_in_ts",
        notes: "Audit log persistence and listing are active for admin backup and reload operations.",
    },
    {
        module: "backups",
        status: "works_in_ts",
        notes: "SQLite backup create/list/download/delete flow is active under /api/v1/admin/backups.",
    },
    {
        module: "customers",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/customers with CRUD baseline and Nuxt page support.",
    },
    {
        module: "customer-groups",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/customer-groups with CRUD and member assignment parity baseline.",
    },
    {
        module: "customer-devices",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/customer-devices with CRUD baseline.",
    },
    {
        module: "diagnostics",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/diagnostics with local readiness checks for imported customer devices.",
    },
    {
        module: "documents",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/documents with JSON upload, list, download and delete baseline.",
    },
    {
        module: "finances",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/finances with tariffs, invoices, payments, ledger and cash CRUD baseline.",
    },
    {
        module: "helpdesk",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/helpdesk with queues, categories, tickets, status changes, assignment and reports baseline.",
    },
    {
        module: "net-nodes",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/net-nodes with searchable CRUD baseline and device relations.",
    },
    {
        module: "ip-networks",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/ip-networks with searchable CRUD baseline and usage counts.",
    },
    {
        module: "net-devices",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/net-devices with searchable CRUD baseline and linked customer/node/network payloads.",
    },
    {
        module: "network-discovery",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/network-discovery with local lease and network import baseline.",
    },
    {
        module: "pit",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/pit with local NetNode GML export and sync readiness summary.",
    },
    {
        module: "reload",
        status: "works_in_ts",
        notes: "Config reload log create/list flow is active under /api/v1/admin/reload.",
    },
    {
        module: "subscriptions",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/subscriptions with CRUD baseline, toggle action and customer-device lookup.",
    },
    {
        module: "teryt",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/teryt with local XML import, city/street listing, suggestions and sync baseline.",
    },
    {
        module: "architect",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/architect for AI-driven file generation.",
    },
    {
        module: "dashboard",
        status: "works_in_ts",
        notes: "Mounted under /api/v1/dashboard with live customer, node and device counts for the active runtime.",
    },
    {
        module: "auth-config",
        status: "present_but_not_wired",
        notes: "Files exist in src/, but are excluded from the production baseline until repaired.",
    },
    {
        module: "translated-legacy-artifacts",
        status: "missing_or_broken",
        notes: "Multiple TS files are malformed FastAPI->TS translations and remain outside the active build.",
    },
] as const;
