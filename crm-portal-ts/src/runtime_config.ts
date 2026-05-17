import { constants } from "node:fs";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DB_PATH = path.resolve(__dirname, "../../sqlite_mcp_server.db");
const DEFAULT_UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
const DEFAULT_BACKUP_ROOT = path.resolve(path.dirname(DEFAULT_DB_PATH), "../backups");
const PLACEHOLDER_VALUES = new Set([
    "",
    "replace-me",
    "replace-with-base64-key",
    "replace-with-long-random-secret",
    "crm-portal-ts-dev-secret",
]);

export function isProductionRuntime(env: NodeJS.ProcessEnv = process.env) {
    const crmEnv = String(env.CRM_ENV ?? "").trim().toLowerCase();
    const nodeEnv = String(env.NODE_ENV ?? "").trim().toLowerCase();
    return crmEnv === "production" || nodeEnv === "production";
}

function isMissingOrPlaceholder(value: string | undefined) {
    const normalizedValue = String(value ?? "").trim();
    if (PLACEHOLDER_VALUES.has(normalizedValue)) {
        return true;
    }

    return normalizedValue.startsWith("replace-with-");
}

export function getRuntimePaths(env: NodeJS.ProcessEnv = process.env) {
    const databasePath = path.resolve(env.CRM_PORTAL_TS_DB_PATH ?? DEFAULT_DB_PATH);

    return {
        databasePath,
        databaseDirectory: path.dirname(databasePath),
        uploadRoot: path.resolve(env.CRM_PORTAL_TS_UPLOAD_ROOT ?? DEFAULT_UPLOAD_ROOT),
        backupRoot: path.resolve(env.CRM_PORTAL_TS_BACKUP_ROOT ?? DEFAULT_BACKUP_ROOT),
    };
}

export function validateRuntimeConfig(env: NodeJS.ProcessEnv = process.env) {
    if (!isProductionRuntime(env)) {
        return;
    }

    const invalidKeys = [
        "CRM_PORTAL_TS_SESSION_SECRET",
        "CRM_ENCRYPTION_KEY",
        "CRM_ADMIN_PASSWORD",
    ].filter((key) => isMissingOrPlaceholder(env[key]));

    if (invalidKeys.length > 0) {
        throw new Error(`Invalid production runtime configuration: ${invalidKeys.join(", ")}`);
    }
}

async function ensureWritableDirectory(directoryPath: string) {
    await mkdir(directoryPath, { recursive: true });
    await access(directoryPath, constants.R_OK | constants.W_OK);
    return true;
}

export async function checkRuntimeReadiness(
    env: NodeJS.ProcessEnv = process.env,
    databaseReady = true,
    schemaReady = true,
) {
    const runtimePaths = getRuntimePaths(env);
    const checks = {
        database: databaseReady,
        schema: schemaReady,
        databaseDirectory: false,
        uploadRoot: false,
        backupRoot: false,
    };

    try {
        checks.databaseDirectory = await ensureWritableDirectory(runtimePaths.databaseDirectory);
        checks.uploadRoot = await ensureWritableDirectory(runtimePaths.uploadRoot);
        checks.backupRoot = await ensureWritableDirectory(runtimePaths.backupRoot);
    } catch {
        // The boolean checks below capture the failure state for readiness callers.
    }

    const ready = Object.values(checks).every(Boolean);

    return {
        status: ready ? "ok" : "degraded",
        ready,
        engine: "TypeScript",
        checks,
        runtimePaths,
    };
}
