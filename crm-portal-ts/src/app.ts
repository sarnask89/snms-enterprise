import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./database.js";
import { getCoreRouter } from "./router_aggregator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

export async function createApp(): Promise<Express> {
    await initDatabase();

    const app = express();

    app.use(cors());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        }),
    );
    app.use(morgan("dev"));
    app.use(express.json({ limit: "25mb" }));
    app.use("/static", express.static(path.join(rootDir, "static")));

    app.get("/health", (_req, res) => {
        res.json({ status: "ok", engine: "TypeScript" });
    });

    app.use("/api", getCoreRouter());

    app.get("/dashboard", (_req, res) => {
        res.send("<h1>CRM TS-Backend Dashboard Placeholder</h1>");
    });

    return app;
}

export async function startServer(port = Number(process.env.PORT ?? "8080")) {
    const app = await createApp();

    return await new Promise<import("node:http").Server>((resolve) => {
        const server = app.listen(port, () => {
            const address = server.address();
            const actualPort = address && typeof address !== "string" ? address.port : port;
            console.log(`TS Backend running on http://localhost:${actualPort}`);
            resolve(server);
        });
    });
}
