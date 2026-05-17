import { Router } from "express";
import { Brackets } from "typeorm";
import { recordAudit } from "../audit.js";
import { AppDataSource } from "../database.js";
import { AppSetting } from "../models/system.js";
import { CalendarEvent, MessageTemplate, OutboundMessage, TrafficStat } from "../models/communication.js";
import { MessageStatus } from "../models/common.js";
import { Customer } from "../models/customer.js";
import { CustomerDevice } from "../models/network.js";

export const router = Router();

const templateRepo = AppDataSource.getRepository(MessageTemplate);
const messageRepo = AppDataSource.getRepository(OutboundMessage);
const eventRepo = AppDataSource.getRepository(CalendarEvent);
const trafficStatRepo = AppDataSource.getRepository(TrafficStat);
const appSettingRepo = AppDataSource.getRepository(AppSetting);
const customerRepo = AppDataSource.getRepository(Customer);
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);

function parseOptionalInteger(value: unknown) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }

    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : undefined;
}

function parseOptionalString(value: unknown) {
    const parsed = String(value ?? "").trim();
    return parsed ? parsed : undefined;
}

function parseIsoDateTime(value: unknown) {
    const parsed = parseOptionalString(value);
    if (!parsed) {
        return undefined;
    }

    const date = new Date(parsed);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseIsoDate(value: unknown) {
    const parsed = parseOptionalString(value);
    if (!parsed) {
        return undefined;
    }

    const date = new Date(parsed);
    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return date.toISOString().slice(0, 10);
}

function serializeTemplate(template: MessageTemplate) {
    return {
        id: template.id,
        name: template.name,
        subject: template.subject,
        body: template.body,
    };
}

function serializeMessage(message: OutboundMessage) {
    return {
        id: message.id,
        customerId: message.customerId ?? null,
        templateId: message.templateId ?? null,
        subject: message.subject,
        body: message.body,
        status: message.status,
        sentAt: message.sentAt ?? null,
        createdAt: message.createdAt,
        customer: message.customer
            ? {
                id: message.customer.id,
                customerCode: message.customer.customerCode,
                firstName: message.customer.firstName,
                lastName: message.customer.lastName,
            }
            : null,
        template: message.template
            ? {
                id: message.template.id,
                name: message.template.name,
            }
            : null,
    };
}

function serializeCalendarEvent(event: CalendarEvent) {
    return {
        id: event.id,
        title: event.title,
        description: event.description ?? null,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        customerId: event.customerId ?? null,
        done: event.done,
        customer: event.customer
            ? {
                id: event.customer.id,
                customerCode: event.customer.customerCode,
                firstName: event.customer.firstName,
                lastName: event.customer.lastName,
            }
            : null,
    };
}

function serializeTrafficStat(stat: TrafficStat) {
    return {
        id: stat.id,
        deviceId: stat.deviceId ?? null,
        periodStart: stat.periodStart,
        periodEnd: stat.periodEnd,
        bytesIn: stat.bytesIn,
        bytesOut: stat.bytesOut,
        note: stat.note ?? null,
        device: stat.device
            ? {
                id: stat.device.id,
                hostname: stat.device.hostname,
                ipAddress: stat.device.ipAddress ?? null,
            }
            : null,
    };
}

function serializeAppSetting(setting: AppSetting) {
    return {
        id: setting.id,
        key: setting.key,
        value: setting.value,
    };
}

async function mergeMessageContent(templateId: number | undefined, subject: string | undefined, body: string | undefined) {
    let finalSubject = subject?.trim() ?? "";
    let finalBody = body?.trim() ?? "";

    if (templateId) {
        const template = await templateRepo.findOneBy({ id: templateId });
        if (!template) {
            return { error: "Message template not found" } as const;
        }

        if (!finalSubject) {
            finalSubject = template.subject.trim();
        }

        if (!finalBody) {
            finalBody = template.body.trim();
        }
    }

    if (!finalSubject || !finalBody) {
        return { error: "subject and body are required" } as const;
    }

    return {
        subject: finalSubject.slice(0, 255),
        body: finalBody,
    } as const;
}

router.get("/messages/templates", async (_req, res) => {
    try {
        const rows = await templateRepo.find({ order: { name: "ASC" } });
        res.json(rows.map((row) => serializeTemplate(row)));
    } catch (error) {
        console.error("Error listing message templates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/messages/template-preview/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await templateRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Message template not found" });
        }

        res.json(serializeTemplate(row));
    } catch (error) {
        console.error("Error fetching message template preview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/messages/templates", async (req, res) => {
    try {
        const row = templateRepo.create({
            name: parseOptionalString(req.body?.name),
            subject: parseOptionalString(req.body?.subject),
            body: parseOptionalString(req.body?.body),
        });

        await templateRepo.save(row);
        await recordAudit({
            action: "message_template_create",
            resourceType: "message_template",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.status(201).json(serializeTemplate(row));
    } catch (error) {
        console.error("Error creating message template:", error);
        res.status(400).json({ message: "Failed to create message template" });
    }
});

router.put("/messages/templates/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await templateRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Message template not found" });
        }

        row.name = parseOptionalString(req.body?.name) ?? row.name;
        row.subject = parseOptionalString(req.body?.subject) ?? row.subject;
        row.body = parseOptionalString(req.body?.body) ?? row.body;
        await templateRepo.save(row);
        await recordAudit({
            action: "message_template_update",
            resourceType: "message_template",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.json(serializeTemplate(row));
    } catch (error) {
        console.error("Error updating message template:", error);
        res.status(400).json({ message: "Failed to update message template" });
    }
});

router.delete("/messages/templates/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await templateRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Message template not found" });
        }

        await templateRepo.delete(id);
        await recordAudit({
            action: "message_template_delete",
            resourceType: "message_template",
            resourceId: id,
            details: row.name,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting message template:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/messages", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const status = parseOptionalString(req.query.status);
        const customerId = parseOptionalInteger(req.query.customerId);

        const qb = messageRepo
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.customer", "customer")
            .leftJoinAndSelect("message.template", "template")
            .orderBy("message.id", "DESC");

        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("message.subject LIKE :search", { search: `%${search}%` })
                    .orWhere("message.body LIKE :search", { search: `%${search}%` });
            }));
        }

        if (status) {
            qb.andWhere("message.status = :status", { status });
        }

        if (customerId) {
            qb.andWhere("message.customer_id = :customerId", { customerId });
        }

        const rows = await qb.getMany();
        res.json(rows.map((row) => serializeMessage(row)));
    } catch (error) {
        console.error("Error listing messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/messages/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await messageRepo.findOne({
            where: { id },
            relations: {
                customer: true,
                template: true,
            },
        });

        if (!row) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json(serializeMessage(row));
    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/messages", async (req, res) => {
    try {
        const customerId = parseOptionalInteger(req.body?.customerId);
        if (customerId) {
            const customer = await customerRepo.findOneBy({ id: customerId });
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
        }

        const templateId = parseOptionalInteger(req.body?.templateId);
        const merged = await mergeMessageContent(templateId, parseOptionalString(req.body?.subject), parseOptionalString(req.body?.body));
        if ("error" in merged) {
            return res.status(400).json({ message: merged.error });
        }

        const status = req.body?.status === MessageStatus.sent || req.body?.sent === true
            ? MessageStatus.sent
            : MessageStatus.draft;

        const row = messageRepo.create({
            customerId,
            templateId,
            subject: merged.subject,
            body: merged.body,
            status,
            sentAt: status === MessageStatus.sent ? new Date() : undefined,
        });

        await messageRepo.save(row);
        const saved = await messageRepo.findOne({
            where: { id: row.id },
            relations: { customer: true, template: true },
        });
        await recordAudit({
            action: "outbound_message_create",
            resourceType: "outbound_message",
            resourceId: row.id,
            details: row.subject,
            request: req,
        });

        res.status(201).json(serializeMessage(saved ?? row));
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(400).json({ message: "Failed to create message" });
    }
});

router.put("/messages/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await messageRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Message not found" });
        }

        const customerId = parseOptionalInteger(req.body?.customerId);
        if (customerId) {
            const customer = await customerRepo.findOneBy({ id: customerId });
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
        }

        const templateId = parseOptionalInteger(req.body?.templateId);
        const merged = await mergeMessageContent(
            templateId ?? row.templateId,
            parseOptionalString(req.body?.subject) ?? row.subject,
            parseOptionalString(req.body?.body) ?? row.body,
        );
        if ("error" in merged) {
            return res.status(400).json({ message: merged.error });
        }

        const status = req.body?.status === MessageStatus.sent || req.body?.sent === true
            ? MessageStatus.sent
            : req.body?.status === MessageStatus.draft
                ? MessageStatus.draft
                : row.status;

        row.customerId = customerId;
        row.templateId = templateId;
        row.subject = merged.subject;
        row.body = merged.body;
        row.status = status;
        row.sentAt = status === MessageStatus.sent ? (row.sentAt ?? new Date()) : undefined;
        await messageRepo.save(row);
        const saved = await messageRepo.findOne({
            where: { id: row.id },
            relations: { customer: true, template: true },
        });
        await recordAudit({
            action: "outbound_message_update",
            resourceType: "outbound_message",
            resourceId: row.id,
            details: row.subject,
            request: req,
        });

        res.json(serializeMessage(saved ?? row));
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(400).json({ message: "Failed to update message" });
    }
});

router.delete("/messages/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await messageRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Message not found" });
        }

        await messageRepo.delete(id);
        await recordAudit({
            action: "outbound_message_delete",
            resourceType: "outbound_message",
            resourceId: id,
            details: row.subject,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/timetable", async (_req, res) => {
    try {
        const rows = await eventRepo.find({
            relations: { customer: true },
            order: { startsAt: "DESC" },
        });
        res.json(rows.map((row) => serializeCalendarEvent(row)));
    } catch (error) {
        console.error("Error listing timetable events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/timetable/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await eventRepo.findOne({
            where: { id },
            relations: { customer: true },
        });
        if (!row) {
            return res.status(404).json({ message: "Calendar event not found" });
        }

        res.json(serializeCalendarEvent(row));
    } catch (error) {
        console.error("Error fetching timetable event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/timetable", async (req, res) => {
    try {
        const customerId = parseOptionalInteger(req.body?.customerId);
        if (customerId) {
            const customer = await customerRepo.findOneBy({ id: customerId });
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
        }

        const startsAt = parseIsoDateTime(req.body?.startsAt);
        const endsAt = parseIsoDateTime(req.body?.endsAt);
        if (!startsAt || !endsAt) {
            return res.status(400).json({ message: "startsAt and endsAt are required" });
        }

        const row = eventRepo.create({
            title: parseOptionalString(req.body?.title),
            description: parseOptionalString(req.body?.description),
            startsAt,
            endsAt,
            customerId,
            done: Boolean(req.body?.done),
        });

        await eventRepo.save(row);
        const saved = await eventRepo.findOne({
            where: { id: row.id },
            relations: { customer: true },
        });
        await recordAudit({
            action: "calendar_event_create",
            resourceType: "calendar_event",
            resourceId: row.id,
            details: row.title,
            request: req,
        });

        res.status(201).json(serializeCalendarEvent(saved ?? row));
    } catch (error) {
        console.error("Error creating timetable event:", error);
        res.status(400).json({ message: "Failed to create timetable event" });
    }
});

router.put("/timetable/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await eventRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Calendar event not found" });
        }

        const customerId = parseOptionalInteger(req.body?.customerId);
        if (customerId) {
            const customer = await customerRepo.findOneBy({ id: customerId });
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
        }

        const startsAt = parseIsoDateTime(req.body?.startsAt);
        const endsAt = parseIsoDateTime(req.body?.endsAt);
        row.title = parseOptionalString(req.body?.title) ?? row.title;
        row.description = parseOptionalString(req.body?.description);
        row.startsAt = startsAt ?? row.startsAt;
        row.endsAt = endsAt ?? row.endsAt;
        row.customerId = customerId;
        row.done = typeof req.body?.done === "boolean" ? req.body.done : row.done;
        await eventRepo.save(row);
        const saved = await eventRepo.findOne({
            where: { id: row.id },
            relations: { customer: true },
        });
        await recordAudit({
            action: "calendar_event_update",
            resourceType: "calendar_event",
            resourceId: row.id,
            details: row.title,
            request: req,
        });

        res.json(serializeCalendarEvent(saved ?? row));
    } catch (error) {
        console.error("Error updating timetable event:", error);
        res.status(400).json({ message: "Failed to update timetable event" });
    }
});

router.delete("/timetable/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await eventRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Calendar event not found" });
        }

        await eventRepo.delete(id);
        await recordAudit({
            action: "calendar_event_delete",
            resourceType: "calendar_event",
            resourceId: id,
            details: row.title,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting timetable event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/traffic-stats", async (req, res) => {
    try {
        const deviceId = parseOptionalInteger(req.query.deviceId);
        const rows = await trafficStatRepo.find({
            where: deviceId ? { deviceId } : {},
            relations: { device: true },
            order: { periodStart: "DESC" },
        });
        res.json(rows.map((row) => serializeTrafficStat(row)));
    } catch (error) {
        console.error("Error listing traffic stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/traffic-stats/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await trafficStatRepo.findOne({
            where: { id },
            relations: { device: true },
        });
        if (!row) {
            return res.status(404).json({ message: "Traffic stat not found" });
        }

        res.json(serializeTrafficStat(row));
    } catch (error) {
        console.error("Error fetching traffic stat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/traffic-stats", async (req, res) => {
    try {
        const deviceId = parseOptionalInteger(req.body?.deviceId);
        if (deviceId) {
            const device = await customerDeviceRepo.findOneBy({ id: deviceId });
            if (!device) {
                return res.status(404).json({ message: "Customer device not found" });
            }
        }

        const periodStart = parseIsoDate(req.body?.periodStart);
        const periodEnd = parseIsoDate(req.body?.periodEnd);
        if (!periodStart || !periodEnd) {
            return res.status(400).json({ message: "periodStart and periodEnd are required" });
        }

        const row = trafficStatRepo.create({
            deviceId,
            periodStart,
            periodEnd,
            bytesIn: parseOptionalInteger(req.body?.bytesIn) ?? 0,
            bytesOut: parseOptionalInteger(req.body?.bytesOut) ?? 0,
            note: parseOptionalString(req.body?.note),
        });

        await trafficStatRepo.save(row);
        const saved = await trafficStatRepo.findOne({
            where: { id: row.id },
            relations: { device: true },
        });
        await recordAudit({
            action: "traffic_stat_create",
            resourceType: "traffic_stat",
            resourceId: row.id,
            details: `${periodStart} - ${periodEnd}`,
            request: req,
        });

        res.status(201).json(serializeTrafficStat(saved ?? row));
    } catch (error) {
        console.error("Error creating traffic stat:", error);
        res.status(400).json({ message: "Failed to create traffic stat" });
    }
});

router.put("/traffic-stats/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await trafficStatRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Traffic stat not found" });
        }

        const deviceId = parseOptionalInteger(req.body?.deviceId);
        if (deviceId) {
            const device = await customerDeviceRepo.findOneBy({ id: deviceId });
            if (!device) {
                return res.status(404).json({ message: "Customer device not found" });
            }
        }

        row.deviceId = deviceId;
        row.periodStart = parseIsoDate(req.body?.periodStart) ?? row.periodStart;
        row.periodEnd = parseIsoDate(req.body?.periodEnd) ?? row.periodEnd;
        row.bytesIn = parseOptionalInteger(req.body?.bytesIn) ?? row.bytesIn;
        row.bytesOut = parseOptionalInteger(req.body?.bytesOut) ?? row.bytesOut;
        row.note = parseOptionalString(req.body?.note);
        await trafficStatRepo.save(row);
        const saved = await trafficStatRepo.findOne({
            where: { id: row.id },
            relations: { device: true },
        });
        await recordAudit({
            action: "traffic_stat_update",
            resourceType: "traffic_stat",
            resourceId: row.id,
            details: `${row.periodStart} - ${row.periodEnd}`,
            request: req,
        });

        res.json(serializeTrafficStat(saved ?? row));
    } catch (error) {
        console.error("Error updating traffic stat:", error);
        res.status(400).json({ message: "Failed to update traffic stat" });
    }
});

router.delete("/traffic-stats/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await trafficStatRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Traffic stat not found" });
        }

        await trafficStatRepo.delete(id);
        await recordAudit({
            action: "traffic_stat_delete",
            resourceType: "traffic_stat",
            resourceId: id,
            details: `${row.periodStart} - ${row.periodEnd}`,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting traffic stat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/config", async (_req, res) => {
    try {
        const rows = await appSettingRepo.find({ order: { key: "ASC" } });
        res.json(rows.map((row) => serializeAppSetting(row)));
    } catch (error) {
        console.error("Error listing app settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/config", async (req, res) => {
    try {
        const key = parseOptionalString(req.body?.key);
        const value = parseOptionalString(req.body?.value);
        if (!key || value === undefined) {
            return res.status(400).json({ message: "key and value are required" });
        }

        const existing = await appSettingRepo.findOneBy({ key });
        if (existing) {
            return res.status(409).json({ message: "App setting key already exists" });
        }

        const row = appSettingRepo.create({ key, value });
        await appSettingRepo.save(row);
        await recordAudit({
            action: "app_setting_create",
            resourceType: "app_setting",
            resourceId: row.id,
            details: row.key,
            request: req,
        });

        res.status(201).json(serializeAppSetting(row));
    } catch (error) {
        console.error("Error creating app setting:", error);
        res.status(400).json({ message: "Failed to create app setting" });
    }
});

router.put("/config/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await appSettingRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "App setting not found" });
        }

        const key = parseOptionalString(req.body?.key);
        const value = parseOptionalString(req.body?.value);
        if (key) {
            const other = await appSettingRepo.findOneBy({ key });
            if (other && other.id !== id) {
                return res.status(409).json({ message: "App setting key already exists" });
            }

            row.key = key;
        }

        if (value !== undefined) {
            row.value = value;
        }

        await appSettingRepo.save(row);
        await recordAudit({
            action: "app_setting_update",
            resourceType: "app_setting",
            resourceId: row.id,
            details: row.key,
            request: req,
        });

        res.json(serializeAppSetting(row));
    } catch (error) {
        console.error("Error updating app setting:", error);
        res.status(400).json({ message: "Failed to update app setting" });
    }
});

router.delete("/config/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await appSettingRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "App setting not found" });
        }

        await appSettingRepo.delete(id);
        await recordAudit({
            action: "app_setting_delete",
            resourceType: "app_setting",
            resourceId: id,
            details: row.key,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting app setting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
