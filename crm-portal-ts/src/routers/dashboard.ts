import { Router } from "express";
import { AppDataSource } from "../database.js";
import { Customer } from "../models/customer.js";
import { SupportTicket } from "../models/helpdesk.js";
import { CustomerDevice, NetDevice, NetNode } from "../models/network.js";

export const router = Router();

async function countOrZero<T>(entity: { new (): T }) {
    try {
        return await AppDataSource.getRepository(entity).count();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("no such table")) {
            return 0;
        }

        throw error;
    }
}

router.get("/stats", async (_req, res) => {
    try {
        // Performance: Batch multiple count queries into a single database round-trip.
        // We use a raw query here for maximum efficiency across different entity types.
        const results = await AppDataSource.query(`
            SELECT
                (SELECT COUNT(*) FROM customers) as customers,
                (SELECT COUNT(*) FROM customer_devices) as customer_devices,
                (SELECT COUNT(*) FROM net_devices) as net_devices,
                (SELECT COUNT(*) FROM net_nodes) as nodes,
                (SELECT COUNT(*) FROM support_tickets) as tickets
        `);

        const stats = results[0] || {};
        const customers = Number(stats.customers || 0);
        const customerDevices = Number(stats.customer_devices || 0);
        const netDevices = Number(stats.net_devices || 0);
        const nodes = Number(stats.nodes || 0);
        const tickets = Number(stats.tickets || 0);

        res.json({
            customers,
            nodes,
            devices: customerDevices + netDevices,
            tickets,
        });
    } catch (error) {
        console.error("Error generating dashboard stats:", error);
        res.json({
            customers: 0,
            nodes: 0,
            devices: 0,
            tickets: 0,
        });
    }
});
