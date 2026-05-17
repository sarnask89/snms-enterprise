import { Router } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../database.js";
import { Customer, CustomerGroup } from "../models/customer.js";
export const router = Router();
const groupRepo = AppDataSource.getRepository(CustomerGroup);
const customerRepo = AppDataSource.getRepository(Customer);
function normalizeMemberIds(input) {
    if (!Array.isArray(input)) {
        return [];
    }
    return [...new Set(input
            .map((value) => Number.parseInt(String(value), 10))
            .filter((value) => Number.isInteger(value) && value > 0))];
}
function serializeGroup(group, includeMembers = false) {
    const customers = group.customers ?? [];
    return {
        id: group.id,
        name: group.name,
        description: group.description ?? null,
        customerCount: customers.length,
        memberIds: customers.map((customer) => customer.id),
        customers: includeMembers
            ? customers.map((customer) => ({
                id: customer.id,
                customerCode: customer.customerCode,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email ?? null,
                status: customer.status,
            }))
            : undefined,
    };
}
async function assignMembers(group, memberIds) {
    if (memberIds.length === 0) {
        group.customers = [];
        return;
    }
    group.customers = await customerRepo.find({
        where: { id: In(memberIds) },
        order: { lastName: "ASC", firstName: "ASC" },
    });
}
router.get("/", async (_req, res) => {
    try {
        const groups = await groupRepo.find({
            relations: { customers: true },
            order: { name: "ASC" },
        });
        res.json(groups.map((group) => serializeGroup(group, true)));
    }
    catch (error) {
        console.error("Error fetching customer groups:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const group = await groupRepo.findOne({
            where: { id },
            relations: { customers: true },
        });
        if (!group) {
            return res.status(404).json({ message: "Customer group not found" });
        }
        res.json(serializeGroup(group, true));
    }
    catch (error) {
        console.error("Error fetching customer group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        const description = String(req.body?.description ?? "").trim() || undefined;
        const memberIds = normalizeMemberIds(req.body?.memberIds);
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const group = groupRepo.create({
            name,
            description,
        });
        await assignMembers(group, memberIds);
        await groupRepo.save(group);
        const savedGroup = await groupRepo.findOne({
            where: { id: group.id },
            relations: { customers: true },
        });
        res.status(201).json(serializeGroup(savedGroup ?? group, true));
    }
    catch (error) {
        console.error("Error creating customer group:", error);
        res.status(400).json({ message: "Failed to create customer group" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const group = await groupRepo.findOne({
            where: { id },
            relations: { customers: true },
        });
        if (!group) {
            return res.status(404).json({ message: "Customer group not found" });
        }
        const name = String(req.body?.name ?? group.name).trim();
        const descriptionValue = req.body?.description;
        const memberIds = req.body?.memberIds === undefined
            ? group.customers.map((customer) => customer.id)
            : normalizeMemberIds(req.body?.memberIds);
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        group.name = name;
        group.description = descriptionValue === undefined
            ? group.description
            : (String(descriptionValue).trim() || undefined);
        await assignMembers(group, memberIds);
        await groupRepo.save(group);
        const savedGroup = await groupRepo.findOne({
            where: { id: group.id },
            relations: { customers: true },
        });
        res.json(serializeGroup(savedGroup ?? group, true));
    }
    catch (error) {
        console.error("Error updating customer group:", error);
        res.status(400).json({ message: "Failed to update customer group" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const group = await groupRepo.findOne({
            where: { id },
            relations: { customers: true },
        });
        if (!group) {
            return res.status(404).json({ message: "Customer group not found" });
        }
        group.customers = [];
        await groupRepo.save(group);
        await groupRepo.remove(group);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting customer group:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=customer_groups.js.map