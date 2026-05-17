import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { Customer } from "../models/customer.js";
import { CustomerDevice } from "../models/network.js";

export const router = Router();

const customerRepo = AppDataSource.getRepository(Customer);
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);

function detectSearchType(query: string) {
    const clean = query.toLowerCase().trim();

    if (/^\d{1,3}\./.test(clean) || (/\d/.test(clean) && clean.includes("."))) {
        return "ip";
    }

    if (/^(?:[0-9a-f]{2}[:-]){2,}[0-9a-f]{2}$/i.test(clean) || /^[0-9a-f]{4,12}$/.test(clean) || clean.includes(":")) {
        return "mac";
    }

    return "name";
}

router.get("/", async (req, res) => {
    try {
        const q = String(req.query.q ?? "").trim();
        if (q.length < 3) {
            return res.json({
                q,
                searchType: "name",
                customers: [],
                devices: [],
            });
        }

        const terms = q.split(/\s+/).filter(Boolean);
        const customerQuery = customerRepo
            .createQueryBuilder("customer")
            .orderBy("customer.lastName", "ASC")
            .addOrderBy("customer.firstName", "ASC")
            .take(10);

        for (const term of terms) {
            customerQuery.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("customer.lastName LIKE :term", { term: `%${term}%` })
                    .orWhere("customer.firstName LIKE :term", { term: `%${term}%` })
                    .orWhere("customer.customerCode LIKE :term", { term: `%${term}%` });
            }));
        }

        const deviceQuery = customerDeviceRepo
            .createQueryBuilder("device")
            .leftJoinAndSelect("device.customer", "customer")
            .orderBy("device.hostname", "ASC")
            .take(10);

        for (const term of terms) {
            deviceQuery.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("device.hostname LIKE :term", { term: `%${term}%` })
                    .orWhere("device.ip_address LIKE :term", { term: `%${term}%` })
                    .orWhere("device.mac_address LIKE :term", { term: `%${term}%` });
            }));
        }

        const [customers, devices] = await Promise.all([
            customerQuery.getMany(),
            deviceQuery.getMany(),
        ]);

        res.json({
            q,
            searchType: detectSearchType(q),
            customers: customers.map((customer) => ({
                id: customer.id,
                customerCode: customer.customerCode,
                firstName: customer.firstName,
                lastName: customer.lastName,
                status: customer.status,
            })),
            devices: devices.map((device) => ({
                id: device.id,
                hostname: device.hostname,
                ipAddress: device.ipAddress ?? null,
                macAddress: device.macAddress ?? null,
                customerId: device.customerId,
                customerName: device.customer
                    ? `${device.customer.firstName} ${device.customer.lastName}`.trim()
                    : null,
            })),
        });
    } catch (error) {
        console.error("Error running global search:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
