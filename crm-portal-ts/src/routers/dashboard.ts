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
        const [customers, customerDevices, netDevices, nodes, tickets] = await Promise.all([
            countOrZero(Customer),
            countOrZero(CustomerDevice),
            countOrZero(NetDevice),
            countOrZero(NetNode),
            countOrZero(SupportTicket),
        ]);

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
