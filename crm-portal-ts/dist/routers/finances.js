import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { CashReceipt, Invoice, LedgerEntry, RecurringPayment, Subscription, Tariff } from "../models/finance.js";
import { InvoiceDocumentKind, InvoiceStatus, LedgerEntryKind } from "../models/common.js";
export const router = Router();
const tariffRepo = AppDataSource.getRepository(Tariff);
const invoiceRepo = AppDataSource.getRepository(Invoice);
const paymentRepo = AppDataSource.getRepository(RecurringPayment);
const ledgerRepo = AppDataSource.getRepository(LedgerEntry);
const cashRepo = AppDataSource.getRepository(CashReceipt);
const subscriptionRepo = AppDataSource.getRepository(Subscription);
function parseOptionalString(value) {
    const parsed = String(value ?? "").trim();
    return parsed ? parsed : undefined;
}
function parseOptionalInteger(value) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }
    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : undefined;
}
function parseNumber(value, fallback = 0) {
    const parsed = Number.parseFloat(String(value ?? fallback));
    return Number.isFinite(parsed) ? parsed : fallback;
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
function parseInvoiceStatus(value, fallback = InvoiceStatus.draft) {
    const candidate = String(value ?? "").trim();
    return Object.values(InvoiceStatus).includes(candidate) ? candidate : fallback;
}
function parseInvoiceKind(value, fallback = InvoiceDocumentKind.invoice) {
    const candidate = String(value ?? "").trim();
    return Object.values(InvoiceDocumentKind).includes(candidate) ? candidate : fallback;
}
function parseLedgerKind(value, fallback = LedgerEntryKind.debit) {
    const candidate = String(value ?? "").trim();
    return Object.values(LedgerEntryKind).includes(candidate) ? candidate : fallback;
}
function parseDateString(value, fallback) {
    const parsed = parseOptionalString(value);
    return parsed ?? fallback;
}
function serializeTariff(tariff) {
    const subscriptions = tariff.subscriptions ?? [];
    return {
        id: tariff.id,
        name: tariff.name,
        monthlyPrice: tariff.monthlyPrice,
        description: tariff.description ?? null,
        active: tariff.active,
        speedDownMbps: tariff.speedDownMbps ?? null,
        speedUpMbps: tariff.speedUpMbps ?? null,
        vatRateId: tariff.vatRateId ?? null,
        subscriptionCount: subscriptions.length,
    };
}
function serializeInvoice(invoice) {
    return {
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        documentKind: invoice.documentKind,
        customerId: invoice.customerId,
        divisionId: invoice.divisionId ?? null,
        vatRateId: invoice.vatRateId ?? null,
        amountNet: invoice.amountNet ?? null,
        amountVat: invoice.amountVat ?? null,
        customer: invoice.customer
            ? {
                id: invoice.customer.id,
                customerCode: invoice.customer.customerCode,
                firstName: invoice.customer.firstName,
                lastName: invoice.customer.lastName,
            }
            : null,
    };
}
function serializeRecurringPayment(payment) {
    return {
        id: payment.id,
        customerId: payment.customerId,
        name: payment.name,
        amount: payment.amount,
        intervalMonths: payment.intervalMonths,
        dayOfMonth: payment.dayOfMonth,
        active: payment.active,
        nextRun: payment.nextRun ?? null,
        customer: payment.customer
            ? {
                id: payment.customer.id,
                customerCode: payment.customer.customerCode,
                firstName: payment.customer.firstName,
                lastName: payment.customer.lastName,
            }
            : null,
    };
}
function serializeLedgerEntry(entry) {
    return {
        id: entry.id,
        customerId: entry.customerId,
        amount: entry.amount,
        kind: entry.kind,
        description: entry.description,
        postedAt: entry.postedAt,
        customer: entry.customer
            ? {
                id: entry.customer.id,
                customerCode: entry.customer.customerCode,
                firstName: entry.customer.firstName,
                lastName: entry.customer.lastName,
            }
            : null,
    };
}
function serializeCashReceipt(receipt) {
    return {
        id: receipt.id,
        customerId: receipt.customerId ?? null,
        amount: receipt.amount,
        description: receipt.description,
        issuedAt: receipt.issuedAt,
        customer: receipt.customer
            ? {
                id: receipt.customer.id,
                customerCode: receipt.customer.customerCode,
                firstName: receipt.customer.firstName,
                lastName: receipt.customer.lastName,
            }
            : null,
    };
}
router.get("/tariffs", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const active = String(req.query.active ?? "").trim();
        const query = tariffRepo
            .createQueryBuilder("tariff")
            .leftJoinAndSelect("tariff.subscriptions", "subscription")
            .orderBy("tariff.id", "ASC");
        if (search) {
            query.andWhere(new Brackets((qb) => {
                qb.where("tariff.name LIKE :search", { search: `%${search}%` })
                    .orWhere("tariff.description LIKE :search", { search: `%${search}%` });
            }));
        }
        if (active) {
            query.andWhere("tariff.active = :active", { active: parseBoolean(active) });
        }
        const tariffs = await query.getMany();
        res.json(tariffs.map((tariff) => serializeTariff(tariff)));
    }
    catch (error) {
        console.error("Error fetching tariffs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/tariffs/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const tariff = await tariffRepo.findOne({
            where: { id },
            relations: { subscriptions: true },
        });
        if (!tariff) {
            return res.status(404).json({ message: "Tariff not found" });
        }
        res.json(serializeTariff(tariff));
    }
    catch (error) {
        console.error("Error fetching tariff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/tariffs", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const tariff = tariffRepo.create({
            name,
            monthlyPrice: parseNumber(req.body?.monthlyPrice),
            description: parseOptionalString(req.body?.description),
            active: parseBoolean(req.body?.active, true),
            speedDownMbps: parseOptionalInteger(req.body?.speedDownMbps),
            speedUpMbps: parseOptionalInteger(req.body?.speedUpMbps),
            vatRateId: parseOptionalInteger(req.body?.vatRateId),
        });
        await tariffRepo.save(tariff);
        const saved = await tariffRepo.findOne({ where: { id: tariff.id }, relations: { subscriptions: true } });
        res.status(201).json(serializeTariff(saved ?? tariff));
    }
    catch (error) {
        console.error("Error creating tariff:", error);
        res.status(400).json({ message: "Failed to create tariff" });
    }
});
router.put("/tariffs/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const tariff = await tariffRepo.findOne({
            where: { id },
            relations: { subscriptions: true },
        });
        if (!tariff) {
            return res.status(404).json({ message: "Tariff not found" });
        }
        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            tariff.name = name;
        }
        if (req.body?.monthlyPrice !== undefined) {
            tariff.monthlyPrice = parseNumber(req.body.monthlyPrice, tariff.monthlyPrice);
        }
        if (req.body?.description !== undefined) {
            tariff.description = parseOptionalString(req.body.description);
        }
        if (req.body?.active !== undefined) {
            tariff.active = parseBoolean(req.body.active, tariff.active);
        }
        if (req.body?.speedDownMbps !== undefined) {
            tariff.speedDownMbps = parseOptionalInteger(req.body.speedDownMbps);
        }
        if (req.body?.speedUpMbps !== undefined) {
            tariff.speedUpMbps = parseOptionalInteger(req.body.speedUpMbps);
        }
        if (req.body?.vatRateId !== undefined) {
            tariff.vatRateId = parseOptionalInteger(req.body.vatRateId);
        }
        await tariffRepo.save(tariff);
        res.json(serializeTariff(tariff));
    }
    catch (error) {
        console.error("Error updating tariff:", error);
        res.status(400).json({ message: "Failed to update tariff" });
    }
});
router.delete("/tariffs/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const usageCount = await subscriptionRepo.count({ where: { tariffId: id } });
        if (usageCount > 0) {
            return res.status(409).json({ message: "Tariff is used by subscriptions", usageCount });
        }
        const result = await tariffRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Tariff not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting tariff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/invoices", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const status = String(req.query.status ?? "").trim();
        const kind = String(req.query.kind ?? "").trim();
        const query = invoiceRepo
            .createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.customer", "customer")
            .orderBy("invoice.id", "DESC");
        if (search) {
            query.andWhere("invoice.number LIKE :search", { search: `%${search}%` });
        }
        if (status) {
            query.andWhere("invoice.status = :status", { status: parseInvoiceStatus(status) });
        }
        if (kind) {
            query.andWhere("invoice.document_kind = :kind", { kind: parseInvoiceKind(kind) });
        }
        const invoices = await query.getMany();
        res.json(invoices.map((invoice) => serializeInvoice(invoice)));
    }
    catch (error) {
        console.error("Error fetching invoices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/invoices/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const invoice = await invoiceRepo.findOne({
            where: { id },
            relations: { customer: true },
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json(serializeInvoice(invoice));
    }
    catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/invoices", async (req, res) => {
    try {
        const number = String(req.body?.number ?? "").trim();
        if (!number) {
            return res.status(400).json({ message: "Number is required" });
        }
        const invoice = invoiceRepo.create({
            number,
            customerId: Number.parseInt(String(req.body?.customerId ?? ""), 10),
            amount: parseNumber(req.body?.amount),
            status: parseInvoiceStatus(req.body?.status),
            issueDate: parseDateString(req.body?.issueDate, new Date().toISOString().slice(0, 10)),
            documentKind: parseInvoiceKind(req.body?.documentKind),
            divisionId: parseOptionalInteger(req.body?.divisionId),
            vatRateId: parseOptionalInteger(req.body?.vatRateId),
            amountNet: req.body?.amountNet !== undefined ? parseNumber(req.body.amountNet) : undefined,
            amountVat: req.body?.amountVat !== undefined ? parseNumber(req.body.amountVat) : undefined,
        });
        await invoiceRepo.save(invoice);
        const saved = await invoiceRepo.findOne({ where: { id: invoice.id }, relations: { customer: true } });
        res.status(201).json(serializeInvoice(saved ?? invoice));
    }
    catch (error) {
        console.error("Error creating invoice:", error);
        res.status(400).json({ message: "Failed to create invoice" });
    }
});
router.put("/invoices/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const invoice = await invoiceRepo.findOne({
            where: { id },
            relations: { customer: true },
        });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        if (invoice.status === InvoiceStatus.issued || invoice.status === InvoiceStatus.paid) {
            return res.status(403).json({ message: "Issued or paid invoice cannot be edited" });
        }
        if (req.body?.number !== undefined) {
            const number = String(req.body.number).trim();
            if (!number) {
                return res.status(400).json({ message: "Number is required" });
            }
            invoice.number = number;
        }
        if (req.body?.customerId !== undefined) {
            invoice.customerId = Number.parseInt(String(req.body.customerId), 10);
        }
        if (req.body?.amount !== undefined) {
            invoice.amount = parseNumber(req.body.amount, invoice.amount);
        }
        if (req.body?.status !== undefined) {
            invoice.status = parseInvoiceStatus(req.body.status, invoice.status);
        }
        if (req.body?.documentKind !== undefined) {
            invoice.documentKind = parseInvoiceKind(req.body.documentKind, invoice.documentKind);
        }
        if (req.body?.issueDate !== undefined) {
            invoice.issueDate = parseDateString(req.body.issueDate, invoice.issueDate);
        }
        if (req.body?.divisionId !== undefined) {
            invoice.divisionId = parseOptionalInteger(req.body.divisionId);
        }
        if (req.body?.vatRateId !== undefined) {
            invoice.vatRateId = parseOptionalInteger(req.body.vatRateId);
        }
        if (req.body?.amountNet !== undefined) {
            invoice.amountNet = parseNumber(req.body.amountNet);
        }
        if (req.body?.amountVat !== undefined) {
            invoice.amountVat = parseNumber(req.body.amountVat);
        }
        await invoiceRepo.save(invoice);
        res.json(serializeInvoice(invoice));
    }
    catch (error) {
        console.error("Error updating invoice:", error);
        res.status(400).json({ message: "Failed to update invoice" });
    }
});
router.delete("/invoices/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const invoice = await invoiceRepo.findOneBy({ id });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        if (invoice.status === InvoiceStatus.issued || invoice.status === InvoiceStatus.paid) {
            return res.status(409).json({ message: "Issued or paid invoice cannot be deleted" });
        }
        await invoiceRepo.remove(invoice);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/payments", async (_req, res) => {
    try {
        const rows = await paymentRepo.find({
            relations: { customer: true },
            order: { id: "DESC" },
        });
        res.json(rows.map((payment) => serializeRecurringPayment(payment)));
    }
    catch (error) {
        console.error("Error fetching recurring payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/payments", async (req, res) => {
    try {
        const payment = paymentRepo.create({
            customerId: Number.parseInt(String(req.body?.customerId ?? ""), 10),
            name: String(req.body?.name ?? "").trim(),
            amount: parseNumber(req.body?.amount),
            intervalMonths: Math.max(1, parseOptionalInteger(req.body?.intervalMonths) ?? 1),
            dayOfMonth: Math.min(28, Math.max(1, parseOptionalInteger(req.body?.dayOfMonth) ?? 1)),
            active: parseBoolean(req.body?.active, true),
            nextRun: parseDateString(req.body?.nextRun),
        });
        if (!payment.name) {
            return res.status(400).json({ message: "Name is required" });
        }
        await paymentRepo.save(payment);
        const saved = await paymentRepo.findOne({ where: { id: payment.id }, relations: { customer: true } });
        res.status(201).json(serializeRecurringPayment(saved ?? payment));
    }
    catch (error) {
        console.error("Error creating recurring payment:", error);
        res.status(400).json({ message: "Failed to create recurring payment" });
    }
});
router.delete("/payments/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await paymentRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Recurring payment not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting recurring payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/balance", async (_req, res) => {
    try {
        const rows = await ledgerRepo.find({
            relations: { customer: true },
            order: { postedAt: "DESC" },
        });
        res.json(rows.map((entry) => serializeLedgerEntry(entry)));
    }
    catch (error) {
        console.error("Error fetching ledger entries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/balance", async (req, res) => {
    try {
        const entry = ledgerRepo.create({
            customerId: Number.parseInt(String(req.body?.customerId ?? ""), 10),
            amount: parseNumber(req.body?.amount),
            kind: parseLedgerKind(req.body?.kind),
            description: String(req.body?.description ?? "").trim(),
            postedAt: parseDateString(req.body?.postedAt, new Date().toISOString()),
        });
        if (!entry.description) {
            return res.status(400).json({ message: "Description is required" });
        }
        await ledgerRepo.save(entry);
        const saved = await ledgerRepo.findOne({ where: { id: entry.id }, relations: { customer: true } });
        res.status(201).json(serializeLedgerEntry(saved ?? entry));
    }
    catch (error) {
        console.error("Error creating ledger entry:", error);
        res.status(400).json({ message: "Failed to create ledger entry" });
    }
});
router.delete("/balance/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await ledgerRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Ledger entry not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting ledger entry:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/cash", async (_req, res) => {
    try {
        const rows = await cashRepo.find({
            relations: { customer: true },
            order: { issuedAt: "DESC" },
        });
        res.json(rows.map((receipt) => serializeCashReceipt(receipt)));
    }
    catch (error) {
        console.error("Error fetching cash receipts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/cash", async (req, res) => {
    try {
        const receipt = cashRepo.create({
            customerId: parseOptionalInteger(req.body?.customerId),
            amount: parseNumber(req.body?.amount),
            description: String(req.body?.description ?? "").trim(),
            issuedAt: parseDateString(req.body?.issuedAt, new Date().toISOString()),
        });
        if (!receipt.description) {
            return res.status(400).json({ message: "Description is required" });
        }
        await cashRepo.save(receipt);
        const saved = await cashRepo.findOne({ where: { id: receipt.id }, relations: { customer: true } });
        res.status(201).json(serializeCashReceipt(saved ?? receipt));
    }
    catch (error) {
        console.error("Error creating cash receipt:", error);
        res.status(400).json({ message: "Failed to create cash receipt" });
    }
});
router.delete("/cash/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await cashRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Cash receipt not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting cash receipt:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=finances.js.map