import type { Request } from "express";
import { AppDataSource } from "./database.js";
import { AuditLog } from "./models/system.js";

const auditRepo = AppDataSource.getRepository(AuditLog);

type AuditInput = {
    action: string;
    resourceType?: string | null;
    resourceId?: number | null;
    details?: string | null;
    actorId?: number | null;
    request?: Request | null;
};

function extractIpAddress(request?: Request | null) {
    if (!request) {
        return null;
    }

    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
        return forwarded.split(",")[0]?.trim() ?? null;
    }

    return request.ip || request.socket.remoteAddress || null;
}

export async function recordAudit(input: AuditInput) {
    const entry = auditRepo.create({
        actorId: input.actorId ?? input.request?.portalUser?.id ?? undefined,
        action: input.action,
        resourceType: input.resourceType ?? undefined,
        resourceId: input.resourceId ?? undefined,
        details: input.details ?? undefined,
        ipAddress: extractIpAddress(input.request) ?? undefined,
    });

    await auditRepo.save(entry);
    return entry;
}
