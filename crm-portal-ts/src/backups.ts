import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { AppDataSource, databasePath } from "./database.js";

const DEFAULT_BACKUP_ROOT = path.resolve(path.dirname(databasePath), "../backups");

export function getBackupRoot() {
    return path.resolve(process.env.CRM_PORTAL_TS_BACKUP_ROOT ?? DEFAULT_BACKUP_ROOT);
}

export async function ensureBackupRoot() {
    const backupRoot = getBackupRoot();
    await mkdir(backupRoot, { recursive: true });
    return backupRoot;
}

export function resolveBackupPath(filename: string) {
    const backupRoot = getBackupRoot();
    const absolutePath = path.resolve(backupRoot, filename);
    if (!absolutePath.startsWith(backupRoot)) {
        throw new Error("Resolved backup path is outside backup root");
    }
    return absolutePath;
}

export async function listBackups() {
    const backupRoot = await ensureBackupRoot();
    const files = await readdir(backupRoot);
    const entries = await Promise.all(
        files
            .filter((filename) => filename.toLowerCase().endsWith(".sqlite"))
            .map(async (filename) => {
                const filePath = path.join(backupRoot, filename);
                const fileStat = await stat(filePath);
                return {
                    filename,
                    createdAt: new Date(fileStat.mtime),
                    sizeBytes: fileStat.size,
                };
            }),
    );

    return entries.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function createBackup() {
    const backupRoot = await ensureBackupRoot();
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "_");
    const filename = `backup_${timestamp}.sqlite`;
    const destination = path.join(backupRoot, filename);

    const dbPath = typeof AppDataSource.options.database === "string"
        ? AppDataSource.options.database
        : databasePath;

    if (AppDataSource.options.type === "sqlite") {
        const escapedDestination = destination.replace(/'/g, "''");
        await AppDataSource.query(`VACUUM INTO '${escapedDestination}'`);
    } else {
        await copyFile(dbPath, destination);
    }

    const fileStat = await stat(destination);
    return {
        filename,
        createdAt: new Date(fileStat.mtime),
        sizeBytes: fileStat.size,
        absolutePath: destination,
    };
}

export async function deleteBackup(filename: string) {
    const backupPath = resolveBackupPath(filename);
    await rm(backupPath, { force: true });
}
