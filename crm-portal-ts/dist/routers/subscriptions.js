import { Router } from "express";
import { AppDataSource } from "../database.js";
import { AccessTechnology } from "../models/common.js";
import { Subscription } from "../models/finance.js";
import { CustomerDevice } from "../models/network.js";
export const router = Router();
const subscriptionRepo = AppDataSource.getRepository(Subscription);
const deviceRepo = AppDataSource.getRepository(CustomerDevice);
function parseOptionalInteger(value) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }
    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : undefined;
}
function parseBoolean(value, fallback = false) {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    if (typeof value === "boolean") {
        return value;
    }
    return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
}
function parseTechnology(value, fallback = AccessTechnology.ftth) {
    const candidate = String(value ?? "").trim();
    return Object.values(AccessTechnology).includes(candidate) ? candidate : fallback;
}
function serializeSubscription(subscription) {
    return {
        id: subscription.id,
        customerId: subscription.customerId,
        tariffId: subscription.tariffId,
        deviceId: subscription.deviceId ?? null,
        startDate: subscription.startDate,
        endDate: subscription.endDate ?? null,
        active: subscription.active,
        technology: subscription.technology,
        speedDownMbps: subscription.speedDownMbps ?? null,
        speedUpMbps: subscription.speedUpMbps ?? null,
        customer: subscription.customer
            ? {
                id: subscription.customer.id,
                customerCode: subscription.customer.customerCode,
                firstName: subscription.customer.firstName,
                lastName: subscription.customer.lastName,
            }
            : null,
        tariff: subscription.tariff
            ? {
                id: subscription.tariff.id,
                name: subscription.tariff.name,
                monthlyPrice: subscription.tariff.monthlyPrice,
            }
            : null,
        device: subscription.device
            ? {
                id: subscription.device.id,
                hostname: subscription.device.hostname,
                ipAddress: subscription.device.ipAddress ?? null,
            }
            : null,
    };
}
router.get("/", async (_req, res) => {
    try {
        const rows = await subscriptionRepo.find({
            relations: { customer: true, tariff: true, device: true },
            order: { id: "DESC" },
        });
        res.json(rows.map((subscription) => serializeSubscription(subscription)));
    }
    catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/customer-nodes/:customerId", async (req, res) => {
    try {
        const customerId = Number.parseInt(req.params.customerId, 10);
        const devices = await deviceRepo.find({
            where: { customerId },
            order: { hostname: "ASC" },
        });
        res.json(devices.map((device) => ({
            id: device.id,
            hostname: device.hostname,
            ipAddress: device.ipAddress ?? null,
            status: device.status,
        })));
    }
    catch (error) {
        console.error("Error fetching customer devices for subscription form:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await subscriptionRepo.findOne({
            where: { id },
            relations: { customer: true, tariff: true, device: true },
        });
        if (!row) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.json(serializeSubscription(row));
    }
    catch (error) {
        console.error("Error fetching subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const customerId = Number.parseInt(String(req.body?.customerId ?? ""), 10);
        const tariffId = Number.parseInt(String(req.body?.tariffId ?? ""), 10);
        if (!Number.isInteger(customerId) || !Number.isInteger(tariffId)) {
            return res.status(400).json({ message: "Customer and tariff are required" });
        }
        const subscription = subscriptionRepo.create({
            customerId,
            tariffId,
            deviceId: parseOptionalInteger(req.body?.deviceId),
            startDate: String(req.body?.startDate ?? new Date().toISOString().slice(0, 10)).trim(),
            endDate: String(req.body?.endDate ?? "").trim() || undefined,
            active: parseBoolean(req.body?.active, true),
            technology: parseTechnology(req.body?.technology),
            speedDownMbps: parseOptionalInteger(req.body?.speedDownMbps),
            speedUpMbps: parseOptionalInteger(req.body?.speedUpMbps),
        });
        await subscriptionRepo.save(subscription);
        const saved = await subscriptionRepo.findOne({
            where: { id: subscription.id },
            relations: { customer: true, tariff: true, device: true },
        });
        res.status(201).json(serializeSubscription(saved ?? subscription));
    }
    catch (error) {
        console.error("Error creating subscription:", error);
        res.status(400).json({ message: "Failed to create subscription" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const subscription = await subscriptionRepo.findOne({
            where: { id },
            relations: { customer: true, tariff: true, device: true },
        });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        if (req.body?.customerId !== undefined) {
            subscription.customerId = Number.parseInt(String(req.body.customerId), 10);
        }
        if (req.body?.tariffId !== undefined) {
            subscription.tariffId = Number.parseInt(String(req.body.tariffId), 10);
        }
        if (req.body?.deviceId !== undefined) {
            subscription.deviceId = parseOptionalInteger(req.body.deviceId);
        }
        if (req.body?.startDate !== undefined) {
            subscription.startDate = String(req.body.startDate).trim();
        }
        if (req.body?.endDate !== undefined) {
            subscription.endDate = String(req.body.endDate ?? "").trim() || undefined;
        }
        if (req.body?.active !== undefined) {
            subscription.active = parseBoolean(req.body.active, subscription.active);
        }
        if (req.body?.technology !== undefined) {
            subscription.technology = parseTechnology(req.body.technology, subscription.technology);
        }
        if (req.body?.speedDownMbps !== undefined) {
            subscription.speedDownMbps = parseOptionalInteger(req.body.speedDownMbps);
        }
        if (req.body?.speedUpMbps !== undefined) {
            subscription.speedUpMbps = parseOptionalInteger(req.body.speedUpMbps);
        }
        await subscriptionRepo.save(subscription);
        res.json(serializeSubscription(subscription));
    }
    catch (error) {
        console.error("Error updating subscription:", error);
        res.status(400).json({ message: "Failed to update subscription" });
    }
});
router.post("/:id/toggle", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const subscription = await subscriptionRepo.findOne({
            where: { id },
            relations: { customer: true, tariff: true, device: true },
        });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        subscription.active = !subscription.active;
        await subscriptionRepo.save(subscription);
        res.json(serializeSubscription(subscription));
    }
    catch (error) {
        console.error("Error toggling subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await subscriptionRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=subscriptions.js.map