import { writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const composeFile = join(projectRoot, "docker-compose.production.yml");
const envFile = join(projectRoot, ".env.container-smoke");
const projectName = process.env.CRM_PORTAL_TS_COMPOSE_PROJECT ?? "crm-portal-ts-smoke";
const proxyPort = process.env.CRM_PORTAL_TS_PROXY_PORT ?? "18080";
const backendPort = process.env.CRM_PORTAL_TS_BACKEND_HOST_PORT ?? "18081";

function run(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: projectRoot,
            stdio: "inherit",
            shell: false,
            ...options,
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
        });
    });
}

async function waitForJson(url, predicate, timeoutMs = 120_000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const payload = await response.json();
                if (predicate(payload)) {
                    return payload;
                }
            }
        } catch {
            // Retry until timeout.
        }

        await new Promise((resolve) => setTimeout(resolve, 2_000));
    }

    throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
    await run("docker", ["--version"]);

    const composeEnv = {
        ...process.env,
        CRM_PORTAL_TS_ENV_FILE: envFile,
        CRM_PORTAL_TS_PROXY_PORT: proxyPort,
        CRM_PORTAL_TS_BACKEND_HOST_PORT: backendPort,
    };

    const envContent = [
        "CRM_ENV=production",
        "NODE_ENV=production",
        "AUTH_ENABLED=true",
        "PORT=8080",
        "CRM_PORTAL_TS_SESSION_SECRET=container-smoke-session-secret",
        "CRM_ENCRYPTION_KEY=container-smoke-encryption-key",
        "CRM_ADMIN_USER=admin",
        "CRM_ADMIN_PASSWORD=ContainerSmoke123!",
        "CRM_PORTAL_TS_DB_PATH=/app/runtime/crm-portal-ts.sqlite",
        "CRM_PORTAL_TS_UPLOAD_ROOT=/app/runtime/uploads",
        "CRM_PORTAL_TS_BACKUP_ROOT=/app/runtime/backups",
        "CRM_PORTAL_TS_MAX_UPLOAD_BYTES=20971520",
    ].join("\n");

    await writeFile(envFile, `${envContent}\n`, "utf8");

    const composeArgs = [
        "compose",
        "--project-name",
        projectName,
        "-f",
        composeFile,
    ];

    try {
        await run("docker", [...composeArgs, "config"], { env: composeEnv });
        await run("docker", [...composeArgs, "up", "-d", "--build"], { env: composeEnv });

        await waitForJson(`http://127.0.0.1:${proxyPort}/health/live`, (payload) => payload?.status === "ok");
        await waitForJson(`http://127.0.0.1:${proxyPort}/health/ready`, (payload) => payload?.ready === true);
        await waitForJson(`http://127.0.0.1:${proxyPort}/api/v1/module-status`, (payload) => Array.isArray(payload?.activeModules));
        await waitForJson(`http://127.0.0.1:${backendPort}/health/ready`, (payload) => payload?.ready === true);
    } finally {
        try {
            await run("docker", [...composeArgs, "down", "-v"], { env: composeEnv });
        } finally {
            await rm(envFile, { force: true });
        }
    }
}

main().catch((error) => {
    console.error("Container smoke failed:", error);
    process.exit(1);
});
