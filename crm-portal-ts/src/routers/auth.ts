import { Router } from "express";
import { recordAudit } from "../audit.js";
import { establishPortalSession, clearPortalSession, getSessionUser, serializePortalUser } from "../auth_runtime.js";
import { AppDataSource } from "../database.js";
import { PortalUser } from "../models/system.js";
import { hashPassword, verifyPassword } from "../security.js";

export const router = Router();

const portalUserRepo = AppDataSource.getRepository(PortalUser);

router.post("/login", async (req, res) => {
    try {
        const username = String(req.body?.username ?? "").trim();
        const password = String(req.body?.password ?? "");
        if (!username || !password) {
            return res.status(400).json({ message: "username and password are required" });
        }

        const user = await portalUserRepo.findOneBy({ username });
        if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
            await recordAudit({
                action: "login_failure",
                details: `user: ${username}`,
                request: req,
            });
            return res.status(401).json({ message: "Invalid username or password" });
        }

        establishPortalSession(res, user.id);
        await recordAudit({
            action: "login",
            resourceType: "portal_user",
            resourceId: user.id,
            actorId: user.id,
            details: user.username,
            request: req,
        });

        res.json({ user: serializePortalUser(user) });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const user = await getSessionUser(req);
        clearPortalSession(res);

        await recordAudit({
            action: "logout",
            resourceType: user ? "portal_user" : undefined,
            resourceId: user?.id,
            actorId: user?.id,
            details: user?.username,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me", async (req, res) => {
    try {
        const user = await getSessionUser(req);
        if (!user) {
            return res.status(401).json({ user: null });
        }

        res.json({ user: serializePortalUser(user) });
    } catch (error) {
        console.error("Error during auth me:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/change-password", async (req, res) => {
    try {
        const user = await getSessionUser(req);
        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const currentPassword = String(req.body?.currentPassword ?? "");
        const newPassword = String(req.body?.newPassword ?? "").trim();
        const newPassword2 = String(req.body?.newPassword2 ?? "").trim();

        if (newPassword !== newPassword2) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must have at least 6 characters" });
        }

        if (!verifyPassword(currentPassword, user.passwordHash)) {
            return res.status(400).json({ message: "Current password is invalid" });
        }

        user.passwordHash = hashPassword(newPassword);
        await portalUserRepo.save(user);
        await recordAudit({
            action: "change_password",
            resourceType: "portal_user",
            resourceId: user.id,
            actorId: user.id,
            details: user.username,
            request: req,
        });

        res.json({ ok: true });
    } catch (error) {
        console.error("Error during password change:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
