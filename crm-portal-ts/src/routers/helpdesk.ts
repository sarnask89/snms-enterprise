import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { TicketStatus } from "../models/common.js";
import { HelpdeskCategory, HelpdeskQueue, SupportTicket } from "../models/helpdesk.js";

export const router = Router();

const queueRepo = AppDataSource.getRepository(HelpdeskQueue);
const categoryRepo = AppDataSource.getRepository(HelpdeskCategory);
const ticketRepo = AppDataSource.getRepository(SupportTicket);

function parseOptionalInteger(value: unknown) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }

    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : undefined;
}

function parseTicketStatus(value: unknown, fallback = TicketStatus.open) {
    const candidate = String(value ?? "").trim() as TicketStatus;
    return Object.values(TicketStatus).includes(candidate) ? candidate : fallback;
}

function serializeQueue(queue: HelpdeskQueue) {
    return {
        id: queue.id,
        name: queue.name,
        description: queue.description ?? null,
        sortOrder: queue.sortOrder,
        categoryCount: queue.categories?.length ?? 0,
        ticketCount: queue.tickets?.length ?? 0,
    };
}

function serializeCategory(category: HelpdeskCategory) {
    return {
        id: category.id,
        queueId: category.queueId,
        name: category.name,
        description: category.description ?? null,
        queue: category.queue
            ? {
                id: category.queue.id,
                name: category.queue.name,
            }
            : null,
        ticketCount: category.tickets?.length ?? 0,
    };
}

function serializeTicket(ticket: SupportTicket) {
    return {
        id: ticket.id,
        customerId: ticket.customerId ?? null,
        queueId: ticket.queueId ?? null,
        categoryId: ticket.categoryId ?? null,
        assigneeId: ticket.assigneeId ?? null,
        title: ticket.title,
        body: ticket.body,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        customer: ticket.customer
            ? {
                id: ticket.customer.id,
                customerCode: ticket.customer.customerCode,
                firstName: ticket.customer.firstName,
                lastName: ticket.customer.lastName,
            }
            : null,
        queue: ticket.queue
            ? {
                id: ticket.queue.id,
                name: ticket.queue.name,
            }
            : null,
        category: ticket.category
            ? {
                id: ticket.category.id,
                name: ticket.category.name,
            }
            : null,
    };
}

router.get("/queues", async (_req, res) => {
    try {
        const queues = await queueRepo.find({
            relations: { categories: true, tickets: true },
            order: { sortOrder: "ASC", id: "ASC" },
        });

        res.json(queues.map((queue) => serializeQueue(queue)));
    } catch (error) {
        console.error("Error fetching helpdesk queues:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/queues", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const queue = queueRepo.create({
            name,
            description: String(req.body?.description ?? "").trim() || undefined,
            sortOrder: parseOptionalInteger(req.body?.sortOrder) ?? 0,
        });

        await queueRepo.save(queue);
        const saved = await queueRepo.findOne({ where: { id: queue.id }, relations: { categories: true, tickets: true } });
        res.status(201).json(serializeQueue(saved ?? queue));
    } catch (error) {
        console.error("Error creating helpdesk queue:", error);
        res.status(400).json({ message: "Failed to create queue" });
    }
});

router.put("/queues/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const queue = await queueRepo.findOne({
            where: { id },
            relations: { categories: true, tickets: true },
        });

        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            queue.name = name;
        }

        if (req.body?.description !== undefined) {
            queue.description = String(req.body.description ?? "").trim() || undefined;
        }

        if (req.body?.sortOrder !== undefined) {
            queue.sortOrder = parseOptionalInteger(req.body.sortOrder) ?? queue.sortOrder;
        }

        await queueRepo.save(queue);
        res.json(serializeQueue(queue));
    } catch (error) {
        console.error("Error updating helpdesk queue:", error);
        res.status(400).json({ message: "Failed to update queue" });
    }
});

router.delete("/queues/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await queueRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Queue not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting helpdesk queue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/categories", async (_req, res) => {
    try {
        const categories = await categoryRepo.find({
            relations: { queue: true, tickets: true },
            order: { id: "ASC" },
        });

        res.json(categories.map((category) => serializeCategory(category)));
    } catch (error) {
        console.error("Error fetching helpdesk categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/categories", async (req, res) => {
    try {
        const queueId = Number.parseInt(String(req.body?.queueId ?? ""), 10);
        const name = String(req.body?.name ?? "").trim();
        if (!Number.isInteger(queueId) || !name) {
            return res.status(400).json({ message: "Queue and name are required" });
        }

        const category = categoryRepo.create({
            queueId,
            name,
            description: String(req.body?.description ?? "").trim() || undefined,
        });

        await categoryRepo.save(category);
        const saved = await categoryRepo.findOne({ where: { id: category.id }, relations: { queue: true, tickets: true } });
        res.status(201).json(serializeCategory(saved ?? category));
    } catch (error) {
        console.error("Error creating helpdesk category:", error);
        res.status(400).json({ message: "Failed to create category" });
    }
});

router.put("/categories/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const category = await categoryRepo.findOne({
            where: { id },
            relations: { queue: true, tickets: true },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (req.body?.queueId !== undefined) {
            const queueId = Number.parseInt(String(req.body.queueId), 10);
            if (!Number.isInteger(queueId)) {
                return res.status(400).json({ message: "Valid queueId is required" });
            }
            category.queueId = queueId;
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            category.name = name;
        }

        if (req.body?.description !== undefined) {
            category.description = String(req.body.description ?? "").trim() || undefined;
        }

        await categoryRepo.save(category);
        res.json(serializeCategory(category));
    } catch (error) {
        console.error("Error updating helpdesk category:", error);
        res.status(400).json({ message: "Failed to update category" });
    }
});

router.delete("/categories/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await categoryRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting helpdesk category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/tickets", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const status = String(req.query.status ?? "").trim();
        const queueId = parseOptionalInteger(req.query.queueId);

        const query = ticketRepo
            .createQueryBuilder("ticket")
            .leftJoinAndSelect("ticket.customer", "customer")
            .leftJoinAndSelect("ticket.queue", "queue")
            .leftJoinAndSelect("ticket.category", "category")
            .orderBy("ticket.id", "DESC");

        if (search) {
            query.andWhere(new Brackets((qb) => {
                qb.where("ticket.title LIKE :search", { search: `%${search}%` })
                    .orWhere("ticket.body LIKE :search", { search: `%${search}%` });
            }));
        }

        if (status) {
            query.andWhere("ticket.status = :status", { status: parseTicketStatus(status) });
        }

        if (queueId) {
            query.andWhere("ticket.queue_id = :queueId", { queueId });
        }

        const tickets = await query.getMany();
        res.json(tickets.map((ticket) => serializeTicket(ticket)));
    } catch (error) {
        console.error("Error fetching helpdesk tickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/tickets/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const ticket = await ticketRepo.findOne({
            where: { id },
            relations: { customer: true, queue: true, category: true },
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.json(serializeTicket(ticket));
    } catch (error) {
        console.error("Error fetching helpdesk ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/tickets", async (req, res) => {
    try {
        const title = String(req.body?.title ?? "").trim();
        const body = String(req.body?.body ?? "").trim();
        if (!title || !body) {
            return res.status(400).json({ message: "Title and body are required" });
        }

        const ticket = ticketRepo.create({
            customerId: parseOptionalInteger(req.body?.customerId),
            queueId: parseOptionalInteger(req.body?.queueId),
            categoryId: parseOptionalInteger(req.body?.categoryId),
            assigneeId: parseOptionalInteger(req.body?.assigneeId),
            title,
            body,
            status: parseTicketStatus(req.body?.status),
        });

        await ticketRepo.save(ticket);
        const saved = await ticketRepo.findOne({
            where: { id: ticket.id },
            relations: { customer: true, queue: true, category: true },
        });

        res.status(201).json(serializeTicket(saved ?? ticket));
    } catch (error) {
        console.error("Error creating helpdesk ticket:", error);
        res.status(400).json({ message: "Failed to create ticket" });
    }
});

router.put("/tickets/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const ticket = await ticketRepo.findOne({
            where: { id },
            relations: { customer: true, queue: true, category: true },
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (req.body?.title !== undefined) {
            const title = String(req.body.title).trim();
            if (!title) {
                return res.status(400).json({ message: "Title is required" });
            }
            ticket.title = title;
        }

        if (req.body?.body !== undefined) {
            const body = String(req.body.body).trim();
            if (!body) {
                return res.status(400).json({ message: "Body is required" });
            }
            ticket.body = body;
        }

        if (req.body?.customerId !== undefined) {
            ticket.customerId = parseOptionalInteger(req.body.customerId);
        }

        if (req.body?.queueId !== undefined) {
            ticket.queueId = parseOptionalInteger(req.body.queueId);
        }

        if (req.body?.categoryId !== undefined) {
            ticket.categoryId = parseOptionalInteger(req.body.categoryId);
        }

        if (req.body?.assigneeId !== undefined) {
            ticket.assigneeId = parseOptionalInteger(req.body.assigneeId);
        }

        if (req.body?.status !== undefined) {
            ticket.status = parseTicketStatus(req.body.status, ticket.status);
        }

        ticket.updatedAt = new Date().toISOString();
        await ticketRepo.save(ticket);
        res.json(serializeTicket(ticket));
    } catch (error) {
        console.error("Error updating helpdesk ticket:", error);
        res.status(400).json({ message: "Failed to update ticket" });
    }
});

router.post("/tickets/:id/status", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const ticket = await ticketRepo.findOne({
            where: { id },
            relations: { customer: true, queue: true, category: true },
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        ticket.status = parseTicketStatus(req.body?.status, ticket.status);
        ticket.updatedAt = new Date().toISOString();
        await ticketRepo.save(ticket);

        res.json(serializeTicket(ticket));
    } catch (error) {
        console.error("Error updating ticket status:", error);
        res.status(400).json({ message: "Failed to update ticket status" });
    }
});

router.post("/tickets/:id/assign", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const ticket = await ticketRepo.findOne({
            where: { id },
            relations: { customer: true, queue: true, category: true },
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        ticket.assigneeId = parseOptionalInteger(req.body?.assigneeId);
        ticket.updatedAt = new Date().toISOString();
        await ticketRepo.save(ticket);

        res.json(serializeTicket(ticket));
    } catch (error) {
        console.error("Error assigning ticket:", error);
        res.status(400).json({ message: "Failed to assign ticket" });
    }
});

router.delete("/tickets/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await ticketRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting helpdesk ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/reports", async (_req, res) => {
    try {
        const tickets = await ticketRepo.find();
        const byStatus = tickets.reduce<Record<string, number>>((acc, ticket) => {
            acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
            return acc;
        }, {});

        const byQueueMap = tickets.reduce<Map<number | null, number>>((acc, ticket) => {
            const key = ticket.queueId ?? null;
            acc.set(key, (acc.get(key) ?? 0) + 1);
            return acc;
        }, new Map<number | null, number>());

        res.json({
            totalTickets: tickets.length,
            byStatus,
            byQueue: [...byQueueMap.entries()].map(([queueId, count]) => ({ queueId, count })),
        });
    } catch (error) {
        console.error("Error generating helpdesk reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
