import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource, initDatabase } from "./database.js";
import { ensurePortalAdminUser } from "./bootstrap_admin.js";
import { getCoreRouter } from "./router_aggregator.js";
import { checkRuntimeReadiness, validateRuntimeConfig } from "./runtime_config.js";
import { getSchemaMigrationStatus, runSchemaMigrations } from "./schema_migrations.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");
export async function createApp() {
    validateRuntimeConfig();
    await initDatabase();
    const startupMigrationStatus = await runSchemaMigrations(AppDataSource);
    await ensurePortalAdminUser(process.env);
    const startupReadiness = await checkRuntimeReadiness(process.env, AppDataSource.isInitialized, startupMigrationStatus.pending.length === 0);
    if (!startupReadiness.ready) {
        throw new Error("Runtime readiness checks failed during startup");
    }
    const app = express();
    app.disable("x-powered-by");
    app.set("trust proxy", true);
    app.use(cors());
    app.use(helmet({
        contentSecurityPolicy: false,
    }));
    app.use(morgan("dev"));
    app.use(express.json({ limit: "25mb" }));
    app.use("/static", express.static(path.join(rootDir, "static")));
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", engine: "TypeScript" });
    });
    app.get("/health/live", (_req, res) => {
        res.json({ status: "ok", engine: "TypeScript", live: true });
    });
    app.get("/health/ready", async (_req, res) => {
        const migrationStatus = await getSchemaMigrationStatus(AppDataSource);
        const readiness = await checkRuntimeReadiness(process.env, AppDataSource.isInitialized, migrationStatus.pending.length === 0);
        res.status(readiness.ready ? 200 : 503).json(readiness);
    });
    app.use("/api", getCoreRouter());
    app.get("/dashboard", (_req, res) => {
        res.send("<h1>CRM TS-Backend Dashboard Placeholder</h1>");
    });
    return app;
}
export async function startServer(port = Number(process.env.PORT ?? "8080")) {
    const app = await createApp();
    return await new Promise((resolve) => {
        const server = app.listen(port, () => {
            const address = server.address();
            const actualPort = address && typeof address !== "string" ? address.port : port;
            console.log(`TS Backend running on http://localhost:${actualPort}`);
            resolve(server);
        });
    });
}
//# sourceMappingURL=app.js.map