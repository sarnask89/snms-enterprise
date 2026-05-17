import { Router } from "express";
import path from "node:path";
import { AppDataSource } from "../database.js";
import { recordAudit } from "../audit.js";
import { createBackup, deleteBackup, listBackups, resolveBackupPath } from "../backups.js";
import { AuditLog, ConfigReloadLog } from "../models/system.js";
export const router = Router();
const reloadLogRepo = AppDataSource.getRepository(ConfigReloadLog);
const auditLogRepo = AppDataSource.getRepository(AuditLog);
function serializeReloadLog(entry) {
    return {
        id: entry.id,
        actorId: entry.actorId ?? null,
        note: entry.note ?? null,
        createdAt: entry.createdAt,
    };
}
router.get("/info", async (_req, res) => {
    try {
        const database = typeof AppDataSource.options.database === "string"
            ? AppDataSource.options.database
            : null;
        res.json({
            engine: "TypeScript",
            platform: process.platform,
            nodeVersion: process.version,
            dbKind: AppDataSource.options.type === "sqlite" ? "SQLite" : String(AppDataSource.options.type),
            databasePath: database ? path.basename(database) : null,
        });
    }
    catch (error) {
        console.error("Error fetching admin info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/audit-logs", async (_req, res) => {
    try {
        const rows = await auditLogRepo
            .createQueryBuilder("audit")
            .orderBy("audit.timestamp", "DESC")
            .limit(200)
            .getRawMany();
        res.json(rows.map((row) => ({
            id: row.audit_id,
            timestamp: row.audit_timestamp,
            actorId: row.audit_actor_id ?? null,
            action: row.audit_action,
            resourceType: row.audit_resource_type ?? null,
            resourceId: row.audit_resource_id ?? null,
            details: row.audit_details ?? null,
            ipAddress: row.audit_ip_address ?? null,
        })));
    }
    catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/backups", async (_req, res) => {
    try {
        const backups = await listBackups();
        res.json(backups.map((backup) => ({
            filename: backup.filename,
            createdAt: backup.createdAt,
            sizeBytes: backup.sizeBytes,
            downloadUrl: `/api/v1/admin/backups/${encodeURIComponent(backup.filename)}/download`,
        })));
    }
    catch (error) {
        console.error("Error fetching backups:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/backups/create", async (req, res) => {
    try {
        const backup = await createBackup();
        await recordAudit({
            action: "backup_create",
            resourceType: "backup",
            details: `Created backup: ${backup.filename}`,
            request: req,
        });
        res.status(201).json({
            filename: backup.filename,
            createdAt: backup.createdAt,
            sizeBytes: backup.sizeBytes,
            downloadUrl: `/api/v1/admin/backups/${encodeURIComponent(backup.filename)}/download`,
        });
    }
    catch (error) {
        console.error("Error creating backup:", error);
        res.status(500).json({ message: "Failed to create backup" });
    }
});
router.get("/backups/:filename/download", async (req, res) => {
    try {
        const filename = req.params.filename;
        const backupPath = resolveBackupPath(filename);
        res.download(backupPath, filename, (error) => {
            if (error && !res.headersSent) {
                res.status(404).json({ message: "Backup not found" });
            }
        });
    }
    catch (error) {
        console.error("Error downloading backup:", error);
        res.status(404).json({ message: "Backup not found" });
    }
});
router.delete("/backups/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        await deleteBackup(filename);
        await recordAudit({
            action: "backup_delete",
            resourceType: "backup",
            details: `Deleted backup: ${filename}`,
            request: req,
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting backup:", error);
        res.status(404).json({ message: "Backup not found" });
    }
});
router.get("/reload", async (_req, res) => {
    try {
        const entries = await reloadLogRepo.find({
            order: { createdAt: "DESC" },
            take: 100,
        });
        res.json(entries.map((entry) => serializeReloadLog(entry)));
    }
    catch (error) {
        console.error("Error fetching reload logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/reload", async (req, res) => {
    try {
        const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
        const entry = reloadLogRepo.create({
            note: note || undefined,
        });
        await reloadLogRepo.save(entry);
        await recordAudit({
            action: "config_reload",
            resourceType: "config_reload",
            resourceId: entry.id,
            details: note || "Config reload triggered",
            request: req,
        });
        res.status(201).json(serializeReloadLog(entry));
    }
    catch (error) {
        console.error("Error creating reload log entry:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=admin.js.map