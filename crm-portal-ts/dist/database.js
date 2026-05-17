import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import { CalendarEvent, MessageTemplate, OutboundMessage, TrafficStat } from "./models/communication.js";
import { Division, NumberPlan, VatRate } from "./models/config.js";
import { Customer, CustomerGroup, CustomerNotice, Document } from "./models/customer.js";
import { CashReceipt, Invoice, LedgerEntry, RecurringPayment, Subscription, Tariff } from "./models/finance.js";
import { HelpdeskCategory, HelpdeskQueue, SupportTicket } from "./models/helpdesk.js";
import { LocationCity, LocationCommune, LocationDistrict, LocationState, LocationStreet } from "./models/location.js";
import { CustomerDevice, IpNetwork, NetDevice, NetNode, NetworkDeviceAccessProfile, NetworkDiscoveryRecord, NetworkDiscoverySession, } from "./models/network.js";
import { AppSetting, AuditLog, BackupExport, ConfigReloadLog, PortalUser } from "./models/system.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databasePath = process.env.CRM_PORTAL_TS_DB_PATH
    ? path.resolve(process.env.CRM_PORTAL_TS_DB_PATH)
    : path.resolve(__dirname, "../../sqlite_mcp_server.db");
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: databasePath,
    synchronize: false, // Set to true if you want to auto-create tables, but we have existing data
    logging: false,
    // Keep the runtime on an explicit, compilable entity set until the
    // remaining translated modules are repaired and reintroduced.
    entities: [
        Customer,
        CustomerGroup,
        CustomerNotice,
        Document,
        MessageTemplate,
        OutboundMessage,
        CalendarEvent,
        TrafficStat,
        Division,
        VatRate,
        NumberPlan,
        LocationState,
        LocationDistrict,
        LocationCommune,
        LocationCity,
        LocationStreet,
        AppSetting,
        PortalUser,
        AuditLog,
        BackupExport,
        ConfigReloadLog,
        CustomerDevice,
        IpNetwork,
        NetDevice,
        NetNode,
        NetworkDeviceAccessProfile,
        NetworkDiscoverySession,
        NetworkDiscoveryRecord,
        Tariff,
        Subscription,
        Invoice,
        RecurringPayment,
        LedgerEntry,
        CashReceipt,
        HelpdeskQueue,
        HelpdeskCategory,
        SupportTicket,
    ],
    migrations: [],
    subscribers: [],
});
export const initDatabase = async () => {
    if (AppDataSource.isInitialized)
        return AppDataSource;
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        return AppDataSource;
    }
    catch (err) {
        console.error("Error during Data Source initialization", err);
        throw err;
    }
};
//# sourceMappingURL=database.js.map