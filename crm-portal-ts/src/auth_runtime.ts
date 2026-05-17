import { createHmac } from "node:crypto";
import type { Request, Response } from "express";
import { AppDataSource } from "./database.js";
import { PortalUser } from "./models/system.js";
import { isProductionRuntime } from "./runtime_config.js";

const portalUserRepo = AppDataSource.getRepository(PortalUser);
const COOKIE_NAME = "crm_portal_ts_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const SESSION_SECRET = process.env.CRM_PORTAL_TS_SESSION_SECRET || "crm-portal-ts-dev-secret";

function signToken(userId: number, expiresAt: number) {
    const payload = `${userId}.${expiresAt}`;
    const signature = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
    return `${payload}.${signature}`;
}

function verifyToken(token: string | undefined) {
    if (!token) {
        return null;
    }

    const [userIdString, expiresAtString, signature] = token.split(".", 3);
    if (!userIdString || !expiresAtString || !signature) {
        return null;
    }

    const payload = `${userIdString}.${expiresAtString}`;
    const expectedSignature = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
    if (signature !== expectedSignature) {
        return null;
    }

    const userId = Number.parseInt(userIdString, 10);
    const expiresAt = Number.parseInt(expiresAtString, 10);
    if (!Number.isInteger(userId) || !Number.isInteger(expiresAt) || expiresAt < Date.now()) {
        return null;
    }

    return { userId, expiresAt };
}

function getCookieValue(request: Request, name: string) {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
        return undefined;
    }

    const cookies = cookieHeader.split(";").map((part) => part.trim());
    for (const cookie of cookies) {
        const [cookieName, ...cookieValueParts] = cookie.split("=");
        if (cookieName === name) {
            return cookieValueParts.join("=");
        }
    }

    return undefined;
}

export function establishPortalSession(response: Response, userId: number) {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const token = signToken(userId, expiresAt);
    const secureFlag = isProductionRuntime() ? "; Secure" : "";
    response.setHeader(
        "Set-Cookie",
        `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secureFlag}`,
    );
}

export function clearPortalSession(response: Response) {
    const secureFlag = isProductionRuntime() ? "; Secure" : "";
    response.setHeader(
        "Set-Cookie",
        `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`,
    );
}

export async function getSessionUser(request: Request) {
    const token = getCookieValue(request, COOKIE_NAME);
    const session = verifyToken(token);
    if (!session) {
        return null;
    }

    const user = await portalUserRepo.findOneBy({ id: session.userId });
    if (!user || !user.active) {
        return null;
    }

    return user;
}

export function serializePortalUser(user: PortalUser) {
    return {
        id: user.id,
        username: user.username,
        role: user.role,
        active: user.active,
    };
}
