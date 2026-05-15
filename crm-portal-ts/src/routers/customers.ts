import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { Customer, type CustomerGroup, type CustomerNotice, type Document } from "../models/customer.js";
import { type CustomerDevice } from "../models/network.js";

export const router = Router();
const customerRepo = AppDataSource.getRepository(Customer);

type CustomerWithRelations = Customer & {
    groups?: CustomerGroup[];
    devices?: CustomerDevice[];
    notices?: CustomerNotice[];
    documents?: Document[];
};

function serializeCustomer(customer: CustomerWithRelations, includeDetails = false) {
    const groups = customer.groups ?? [];

    return {
        id: customer.id,
        customerCode: customer.customerCode,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email ?? null,
        phone: customer.phone ?? null,
        status: customer.status,
        creationDate: customer.creationDate,
        notes: customer.notes ?? null,
        portalLogin: customer.portalLogin ?? null,
        groupCount: groups.length,
        groups: groups.map((group) => ({
            id: group.id,
            name: group.name,
        })),
        devices: includeDetails
            ? (customer.devices ?? []).map((device) => ({
                id: device.id,
                hostname: device.hostname,
                ipAddress: device.ipAddress ?? null,
                macAddress: device.macAddress ?? null,
                status: device.status,
            }))
            : undefined,
    };
}

router.get("/", async (req, res) => {
    try {
        const { q, status, skip, limit } = req.query;
        const search = String(q ?? "").trim();
        const statusValue = String(status ?? "").trim();
        const skipNum = Number.parseInt(String(skip ?? "0"), 10) || 0;
        const limitNum = Number.parseInt(String(limit ?? "20"), 10) || 20;

        const qb = customerRepo
            .createQueryBuilder("customer")
            .leftJoinAndSelect("customer.groups", "group")
            .orderBy("customer.lastName", "ASC")
            .addOrderBy("customer.firstName", "ASC")
            .skip(skipNum)
            .take(limitNum);

        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("customer.firstName LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.lastName LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.customerCode LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.email LIKE :search", { search: `%${search}%` });
            }));
        }

        if (statusValue) {
            qb.andWhere("customer.status = :status", { status: statusValue });
        }

        const [items, total] = await qb.getManyAndCount();

        res.set("X-Total-Count", total.toString());
        res.json(items.map((customer) => serializeCustomer(customer)));
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const customer = await customerRepo.findOne({
            where: { id },
            relations: {
                devices: true,
                notices: true,
                groups: true,
            },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(serializeCustomer(customer, true));
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const customer = customerRepo.create({
            customerCode: req.body?.customerCode,
            firstName: req.body?.firstName,
            lastName: req.body?.lastName,
            email: req.body?.email ?? undefined,
            phone: req.body?.phone ?? undefined,
            status: req.body?.status,
            notes: req.body?.notes ?? undefined,
        });
        await customerRepo.save(customer);

        const savedCustomer = await customerRepo.findOne({
            where: { id: customer.id },
            relations: { groups: true },
        });

        res.status(201).json(serializeCustomer(savedCustomer ?? customer));
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(400).json({ message: "Failed to create customer" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const customer = await customerRepo.findOne({
            where: { id },
            relations: { groups: true, devices: true },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        customerRepo.merge(customer, req.body);
        await customerRepo.save(customer);

        const savedCustomer = await customerRepo.findOne({
            where: { id: customer.id },
            relations: { groups: true, devices: true },
        });

        res.json(serializeCustomer(savedCustomer ?? customer, true));
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(400).json({ message: "Failed to update customer" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await customerRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
