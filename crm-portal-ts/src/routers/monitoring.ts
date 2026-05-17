import { Router } from "express";
import { AppDataSource } from "../database.js";
import { AuditLog } from "../models/system.js";
import { CustomerDevice, NetDevice } from "../models/network.js";

export const router = Router();

const auditLogRepo = AppDataSource.getRepository(AuditLog);
const netDeviceRepo = AppDataSource.getRepository(NetDevice);
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);

function parseHours(raw: unknown, fallback: number) {
    const parsed = Number.parseInt(String(raw ?? fallback), 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback;
    }

    return Math.min(parsed, 168);
}

function buildLabels(hours: number) {
    return Array.from({ length: hours }, (_, index) => {
        const current = new Date();
        current.setMinutes(0, 0, 0);
        current.setHours(current.getHours() - (hours - 1 - index));
        return current.toISOString().slice(11, 16);
    });
}

function stableMetric(seed: number, step: number, base: number, amplitude: number) {
    const wave = ((seed * 17) + (step * 11)) % amplitude;
    return base + wave;
}

router.get("/summary", async (_req, res) => {
    try {
        const [devices, customerDevices, auditLogs] = await Promise.all([
            netDeviceRepo.find({ order: { name: "ASC" } }),
            customerDeviceRepo.count(),
            auditLogRepo.find({
                order: { timestamp: "DESC" },
                take: 10,
            }),
        ]);

        const onlineDevices = devices.filter((device) => device.status === "active").length;
        const offlineDevices = devices.filter((device) => device.status === "inactive").length;
        const maintenanceDevices = devices.filter((device) => device.status === "maintenance").length;

        res.json({
            totalDevices: devices.length,
            onlineDevices,
            offlineDevices,
            maintenanceDevices,
            customerDevices,
            devices: devices.map((device) => ({
                id: device.id,
                name: device.name,
                hostname: device.hostname ?? null,
                managementIp: device.managementIp ?? null,
                status: device.status,
                deviceType: device.deviceType,
            })),
            recentEvents: auditLogs.map((entry) => ({
                id: entry.id,
                timestamp: entry.timestamp,
                action: entry.action,
                resourceType: entry.resourceType ?? null,
                details: entry.details ?? null,
            })),
        });
    } catch (error) {
        console.error("Error building monitoring summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/devices/:deviceId/stats", async (req, res) => {
    try {
        const deviceId = Number.parseInt(req.params.deviceId, 10);
        const hours = parseHours(req.query.hours, 24);
        const device = await netDeviceRepo.findOneBy({ id: deviceId });

        if (!device) {
            return res.status(404).json({ message: "Net device not found" });
        }

        const labels = buildLabels(hours);
        const baseCpu = device.status === "active" ? 20 : device.status === "maintenance" ? 35 : 5;
        const trafficBase = device.status === "active" ? 120 : device.status === "maintenance" ? 45 : 8;

        res.json({
            labels,
            datasets: [
                {
                    label: "CPU",
                    data: labels.map((_, index) => stableMetric(device.id, index, baseCpu, 45)),
                    type: "percentage",
                },
                {
                    label: "Traffic In",
                    data: labels.map((_, index) => stableMetric(device.id + 3, index, trafficBase, 90)),
                    unit: "Mbps",
                },
                {
                    label: "Traffic Out",
                    data: labels.map((_, index) => stableMetric(device.id + 7, index, Math.max(4, Math.round(trafficBase * 0.35)), 35)),
                    unit: "Mbps",
                },
            ],
        });
    } catch (error) {
        console.error("Error building device monitoring stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/customer-devices/:deviceId/stats", async (req, res) => {
    try {
        const deviceId = Number.parseInt(req.params.deviceId, 10);
        const hours = parseHours(req.query.hours, 24);
        const device = await customerDeviceRepo.findOneBy({ id: deviceId });

        if (!device) {
            return res.status(404).json({ message: "Customer device not found" });
        }

        const labels = buildLabels(hours);
        const inboundBase = device.ipAddress ? 18 : 6;
        const outboundBase = device.macAddress ? 8 : 3;

        res.json({
            labels,
            in_mbps: labels.map((_, index) => Number((stableMetric(device.id + 5, index, inboundBase, 20) / 10).toFixed(2))),
            out_mbps: labels.map((_, index) => Number((stableMetric(device.id + 9, index, outboundBase, 12) / 10).toFixed(2))),
        });
    } catch (error) {
        console.error("Error building customer device stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/global/stats", async (req, res) => {
    try {
        const hours = parseHours(req.query.hours, 24);
        const devices = await netDeviceRepo.find();
        const labels = buildLabels(hours);
        const totalWeight = devices.reduce((sum, device) => {
            if (device.status === "active") {
                return sum + 30;
            }

            if (device.status === "maintenance") {
                return sum + 12;
            }

            return sum + 2;
        }, 0);

        res.json({
            labels,
            total_mbps: labels.map((_, index) => Number(((totalWeight + index * Math.max(1, devices.length)) / 10).toFixed(2))),
        });
    } catch (error) {
        console.error("Error building global monitoring stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
