import { Router } from "express";
import { MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../database.js";
import { NetDeviceStatus } from "../models/common.js";
import { Customer } from "../models/customer.js";
import { Invoice, LedgerEntry, Subscription } from "../models/finance.js";
import { NetDevice } from "../models/network.js";
export const router = Router();
const customerRepo = AppDataSource.getRepository(Customer);
const netDeviceRepo = AppDataSource.getRepository(NetDevice);
const subscriptionRepo = AppDataSource.getRepository(Subscription);
const invoiceRepo = AppDataSource.getRepository(Invoice);
const ledgerRepo = AppDataSource.getRepository(LedgerEntry);
function hourLabel(offsetHours) {
    const current = new Date();
    current.setMinutes(0, 0, 0);
    current.setHours(current.getHours() - offsetHours);
    return current.toISOString().slice(11, 16);
}
function monthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(date) {
    return date.toLocaleString("en-US", { month: "short" });
}
function buildRecentMonths(count) {
    const months = [];
    for (let index = count - 1; index >= 0; index -= 1) {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - index);
        months.push({
            key: monthKey(date),
            label: monthLabel(date),
        });
    }
    return months;
}
router.get("/network-health", async (_req, res) => {
    try {
        // Optimize: Use DB aggregations instead of fetching full entity tables into memory
        const [totalDevices, onlineNow] = await Promise.all([
            netDeviceRepo.count(),
            netDeviceRepo.countBy({ status: NetDeviceStatus.active }),
        ]);
        const history = Array.from({ length: 24 }, (_, index) => {
            const offset = 23 - index;
            const adjustment = offset % 4 === 0 ? -1 : offset % 3 === 0 ? 1 : 0;
            const online = Math.max(0, Math.min(totalDevices, onlineNow + adjustment));
            return {
                time: hourLabel(offset),
                online,
                packetLoss: Number((totalDevices === 0 ? 0 : (totalDevices - online) * 0.35).toFixed(2)),
            };
        });
        res.json({
            totalDevices,
            onlineNow,
            history,
        });
    }
    catch (error) {
        console.error("Error building network health stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/customer-traffic/:customerId", async (req, res) => {
    try {
        const customerId = Number.parseInt(req.params.customerId, 10);
        const customer = await customerRepo.findOne({
            where: { id: customerId },
            relations: {
                devices: true,
            },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const subscriptions = await subscriptionRepo.countBy({ customerId });
        const deviceCount = customer.devices?.length ?? 0;
        const baseline = Math.max(50, subscriptions * 120 + deviceCount * 45);
        const history = Array.from({ length: 24 }, (_, index) => {
            const offset = 23 - index;
            const variance = (offset % 6) * 8;
            return {
                time: hourLabel(offset),
                in: baseline + variance,
                out: Math.max(10, Math.round((baseline + variance) * 0.14)),
            };
        });
        res.json({
            labels: history.map((entry) => entry.time),
            series: [
                { name: "Download (Mbps)", data: history.map((entry) => entry.in) },
                { name: "Upload (Mbps)", data: history.map((entry) => entry.out) },
            ],
        });
    }
    catch (error) {
        console.error("Error building customer traffic stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/financial-summary", async (_req, res) => {
    try {
        const months = buildRecentMonths(12);
        const earliestMonthKey = months[0].key; // e.g. "2025-09"
        // Date range start: 1st day of earliest month (YYYY-MM-01)
        const startDateStr = `${earliestMonthKey}-01`;
        // Optimize: Filter DB queries by minimum date range and project only required scalar columns
        const [invoices, ledgerEntries] = await Promise.all([
            invoiceRepo.find({
                where: { issueDate: MoreThanOrEqual(startDateStr) },
                select: ["amount", "issueDate"],
            }),
            ledgerRepo.find({
                where: { postedAt: MoreThanOrEqual(startDateStr) },
                select: ["amount", "kind", "postedAt"],
            }),
        ]);
        const byMonth = new Map(months.map((month) => [month.key, { revenue: 0, expense: 0 }]));
        for (const invoice of invoices) {
            const key = monthKey(new Date(invoice.issueDate));
            const bucket = byMonth.get(key);
            if (bucket) {
                bucket.revenue += Number(invoice.amount ?? 0);
            }
        }
        for (const entry of ledgerEntries) {
            const key = monthKey(new Date(entry.postedAt));
            const bucket = byMonth.get(key);
            if (bucket) {
                if (entry.kind === "debit") {
                    bucket.expense += Number(entry.amount ?? 0);
                }
                else {
                    bucket.revenue += Number(entry.amount ?? 0);
                }
            }
        }
        res.json({
            labels: months.map((month) => month.label),
            series: [
                {
                    name: "Revenue",
                    data: months.map((month) => Number((byMonth.get(month.key)?.revenue ?? 0).toFixed(2))),
                },
                {
                    name: "Expense",
                    data: months.map((month) => Number((byMonth.get(month.key)?.expense ?? 0).toFixed(2))),
                },
            ],
        });
    }
    catch (error) {
        console.error("Error building financial summary stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/inventory-summary", async (_req, res) => {
    try {
        // Optimize: Select only deviceType column to reduce memory allocation
        const devices = await netDeviceRepo.find({
            select: ["deviceType"],
        });
        const counts = new Map();
        for (const device of devices) {
            const label = device.deviceType?.trim() || "other";
            counts.set(label, (counts.get(label) ?? 0) + 1);
        }
        const ordered = [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
        res.json({
            labels: ordered.map(([label]) => label),
            series: ordered.map(([, count]) => count),
        });
    }
    catch (error) {
        console.error("Error building inventory summary stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/customer-growth", async (_req, res) => {
    try {
        const months = buildRecentMonths(6);
        const earliestMonthKey = months[0].key;
        const startDateStr = `${earliestMonthKey}-01`;
        // Optimize: Select only creationDate column for customers created in the 6-month window
        const recentCustomers = await customerRepo.find({
            where: { creationDate: MoreThanOrEqual(startDateStr) },
            select: ["creationDate"],
        });
        const monthCounts = new Map(months.map((month) => [month.key, 0]));
        for (const customer of recentCustomers) {
            const key = monthKey(new Date(customer.creationDate));
            if (monthCounts.has(key)) {
                monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
            }
        }
        let runningTotal = 0;
        const values = months.map((month) => {
            runningTotal += monthCounts.get(month.key) ?? 0;
            return runningTotal;
        });
        res.json({
            labels: months.map((month) => month.label),
            values,
        });
    }
    catch (error) {
        console.error("Error building customer growth stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=stats.js.map