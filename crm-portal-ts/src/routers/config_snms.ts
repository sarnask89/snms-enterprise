import { Router } from "express";
import { recordAudit } from "../audit.js";
import { AppDataSource } from "../database.js";
import { NumberPlanDocType } from "../models/common.js";
import { Division, NumberPlan, VatRate } from "../models/config.js";

export const router = Router();

const divisionRepo = AppDataSource.getRepository(Division);
const vatRateRepo = AppDataSource.getRepository(VatRate);
const numberPlanRepo = AppDataSource.getRepository(NumberPlan);

function parseOptionalString(value: unknown) {
    const parsed = String(value ?? "").trim();
    return parsed ? parsed : undefined;
}

function parseOptionalInteger(value: unknown) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }

    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : undefined;
}

function parseNumber(value: unknown, fallback = 0) {
    const parsed = Number.parseFloat(String(value ?? fallback).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: unknown, fallback = false) {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value;
    }

    return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function parseNumberPlanDocType(value: unknown, fallback = NumberPlanDocType.invoice) {
    const candidate = String(value ?? "").trim() as NumberPlanDocType;
    return Object.values(NumberPlanDocType).includes(candidate) ? candidate : fallback;
}

function serializeDivision(row: Division) {
    return {
        id: row.id,
        name: row.name,
        shortName: row.shortName ?? null,
        address: row.address ?? null,
        city: row.city ?? null,
        postalCode: row.postalCode ?? null,
        nip: row.nip ?? null,
        regon: row.regon ?? null,
        active: row.active,
        isDefault: row.isDefault,
    };
}

function serializeVatRate(row: VatRate) {
    return {
        id: row.id,
        label: row.label,
        ratePercent: row.ratePercent,
        sortOrder: row.sortOrder,
        isDefault: row.isDefault,
    };
}

function serializeNumberPlan(row: NumberPlan) {
    return {
        id: row.id,
        name: row.name,
        docType: row.docType,
        patternTemplate: row.patternTemplate,
        nextNumber: row.nextNumber,
        divisionId: row.divisionId ?? null,
        active: row.active,
        isDefault: row.isDefault,
        division: row.division
            ? {
                id: row.division.id,
                name: row.division.name,
                shortName: row.division.shortName ?? null,
            }
            : null,
    };
}

async function clearDefaultDivision(excludedId?: number) {
    const rows = excludedId
        ? await divisionRepo.findBy({})
        : await divisionRepo.findBy({});

    for (const row of rows) {
        if (excludedId && row.id === excludedId) {
            continue;
        }

        if (row.isDefault) {
            row.isDefault = false;
            await divisionRepo.save(row);
        }
    }
}

async function clearDefaultVatRate(excludedId?: number) {
    const rows = await vatRateRepo.findBy({});
    for (const row of rows) {
        if (excludedId && row.id === excludedId) {
            continue;
        }

        if (row.isDefault) {
            row.isDefault = false;
            await vatRateRepo.save(row);
        }
    }
}

async function clearDefaultNumberPlan(docType: NumberPlanDocType, excludedId?: number) {
    const rows = await numberPlanRepo.findBy({ docType });
    for (const row of rows) {
        if (excludedId && row.id === excludedId) {
            continue;
        }

        if (row.isDefault) {
            row.isDefault = false;
            await numberPlanRepo.save(row);
        }
    }
}

router.get("/divisions", async (_req, res) => {
    try {
        const rows = await divisionRepo.find({ order: { name: "ASC" } });
        res.json(rows.map((row) => serializeDivision(row)));
    } catch (error) {
        console.error("Error listing divisions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/divisions", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const isDefault = parseBoolean(req.body?.isDefault);
        if (isDefault) {
            await clearDefaultDivision();
        }

        const row = divisionRepo.create({
            name: name.slice(0, 128),
            shortName: parseOptionalString(req.body?.shortName)?.slice(0, 32),
            address: parseOptionalString(req.body?.address)?.slice(0, 255),
            city: parseOptionalString(req.body?.city)?.slice(0, 128),
            postalCode: parseOptionalString(req.body?.postalCode)?.slice(0, 16),
            nip: parseOptionalString(req.body?.nip)?.slice(0, 20),
            regon: parseOptionalString(req.body?.regon)?.slice(0, 20),
            active: parseBoolean(req.body?.active, true),
            isDefault,
        });

        await divisionRepo.save(row);
        await recordAudit({
            action: "division_create",
            resourceType: "division",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.status(201).json(serializeDivision(row));
    } catch (error) {
        console.error("Error creating division:", error);
        res.status(400).json({ message: "Failed to create division" });
    }
});

router.put("/divisions/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await divisionRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Division not found" });
        }

        const nextDefault = req.body?.isDefault !== undefined ? parseBoolean(req.body.isDefault) : row.isDefault;
        if (nextDefault) {
            await clearDefaultDivision(id);
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name ?? "").trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            row.name = name.slice(0, 128);
        }

        if (req.body?.shortName !== undefined) {
            row.shortName = parseOptionalString(req.body.shortName)?.slice(0, 32);
        }
        if (req.body?.address !== undefined) {
            row.address = parseOptionalString(req.body.address)?.slice(0, 255);
        }
        if (req.body?.city !== undefined) {
            row.city = parseOptionalString(req.body.city)?.slice(0, 128);
        }
        if (req.body?.postalCode !== undefined) {
            row.postalCode = parseOptionalString(req.body.postalCode)?.slice(0, 16);
        }
        if (req.body?.nip !== undefined) {
            row.nip = parseOptionalString(req.body.nip)?.slice(0, 20);
        }
        if (req.body?.regon !== undefined) {
            row.regon = parseOptionalString(req.body.regon)?.slice(0, 20);
        }
        if (req.body?.active !== undefined) {
            row.active = parseBoolean(req.body.active);
        }
        if (req.body?.isDefault !== undefined) {
            row.isDefault = nextDefault;
        }

        await divisionRepo.save(row);
        await recordAudit({
            action: "division_update",
            resourceType: "division",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.json(serializeDivision(row));
    } catch (error) {
        console.error("Error updating division:", error);
        res.status(400).json({ message: "Failed to update division" });
    }
});

router.delete("/divisions/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await divisionRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Division not found" });
        }

        await divisionRepo.delete(id);
        await recordAudit({
            action: "division_delete",
            resourceType: "division",
            resourceId: id,
            details: row.name,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting division:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/vat-rates", async (_req, res) => {
    try {
        const rows = await vatRateRepo.find({ order: { sortOrder: "ASC", id: "ASC" } });
        res.json(rows.map((row) => serializeVatRate(row)));
    } catch (error) {
        console.error("Error listing VAT rates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/vat-rates", async (req, res) => {
    try {
        const label = String(req.body?.label ?? "").trim();
        if (!label) {
            return res.status(400).json({ message: "Label is required" });
        }

        const isDefault = parseBoolean(req.body?.isDefault);
        if (isDefault) {
            await clearDefaultVatRate();
        }

        const row = vatRateRepo.create({
            label: label.slice(0, 128),
            ratePercent: parseNumber(req.body?.ratePercent),
            sortOrder: parseOptionalInteger(req.body?.sortOrder) ?? 0,
            isDefault,
        });

        await vatRateRepo.save(row);
        await recordAudit({
            action: "vat_rate_create",
            resourceType: "vat_rate",
            resourceId: row.id,
            details: row.label,
            request: req,
        });

        res.status(201).json(serializeVatRate(row));
    } catch (error) {
        console.error("Error creating VAT rate:", error);
        res.status(400).json({ message: "Failed to create VAT rate" });
    }
});

router.put("/vat-rates/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await vatRateRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "VAT rate not found" });
        }

        const nextDefault = req.body?.isDefault !== undefined ? parseBoolean(req.body.isDefault) : row.isDefault;
        if (nextDefault) {
            await clearDefaultVatRate(id);
        }

        if (req.body?.label !== undefined) {
            const label = String(req.body.label ?? "").trim();
            if (!label) {
                return res.status(400).json({ message: "Label is required" });
            }
            row.label = label.slice(0, 128);
        }

        if (req.body?.ratePercent !== undefined) {
            row.ratePercent = parseNumber(req.body.ratePercent, row.ratePercent);
        }
        if (req.body?.sortOrder !== undefined) {
            row.sortOrder = parseOptionalInteger(req.body.sortOrder) ?? row.sortOrder;
        }
        if (req.body?.isDefault !== undefined) {
            row.isDefault = nextDefault;
        }

        await vatRateRepo.save(row);
        await recordAudit({
            action: "vat_rate_update",
            resourceType: "vat_rate",
            resourceId: row.id,
            details: row.label,
            request: req,
        });

        res.json(serializeVatRate(row));
    } catch (error) {
        console.error("Error updating VAT rate:", error);
        res.status(400).json({ message: "Failed to update VAT rate" });
    }
});

router.delete("/vat-rates/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await vatRateRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "VAT rate not found" });
        }

        await vatRateRepo.delete(id);
        await recordAudit({
            action: "vat_rate_delete",
            resourceType: "vat_rate",
            resourceId: id,
            details: row.label,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting VAT rate:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/number-plans", async (_req, res) => {
    try {
        const rows = await numberPlanRepo.find({
            relations: { division: true },
            order: { name: "ASC" },
        });
        res.json(rows.map((row) => serializeNumberPlan(row)));
    } catch (error) {
        console.error("Error listing number plans:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/number-plans", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        const patternTemplate = String(req.body?.patternTemplate ?? "").trim();
        if (!name || !patternTemplate) {
            return res.status(400).json({ message: "name and patternTemplate are required" });
        }

        const docType = parseNumberPlanDocType(req.body?.docType);
        const isDefault = parseBoolean(req.body?.isDefault);
        if (isDefault) {
            await clearDefaultNumberPlan(docType);
        }

        const row = numberPlanRepo.create({
            name: name.slice(0, 128),
            docType,
            patternTemplate: patternTemplate.slice(0, 128),
            nextNumber: Math.max(1, parseOptionalInteger(req.body?.nextNumber) ?? 1),
            divisionId: parseOptionalInteger(req.body?.divisionId),
            active: parseBoolean(req.body?.active, true),
            isDefault,
        });

        await numberPlanRepo.save(row);
        const saved = await numberPlanRepo.findOne({
            where: { id: row.id },
            relations: { division: true },
        });

        await recordAudit({
            action: "number_plan_create",
            resourceType: "number_plan",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.status(201).json(serializeNumberPlan(saved ?? row));
    } catch (error) {
        console.error("Error creating number plan:", error);
        res.status(400).json({ message: "Failed to create number plan" });
    }
});

router.put("/number-plans/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await numberPlanRepo.findOne({ where: { id } });
        if (!row) {
            return res.status(404).json({ message: "Number plan not found" });
        }

        const nextDocType = req.body?.docType !== undefined ? parseNumberPlanDocType(req.body.docType, row.docType) : row.docType;
        const nextDefault = req.body?.isDefault !== undefined ? parseBoolean(req.body.isDefault) : row.isDefault;
        if (nextDefault) {
            await clearDefaultNumberPlan(nextDocType, id);
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name ?? "").trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            row.name = name.slice(0, 128);
        }

        if (req.body?.patternTemplate !== undefined) {
            const patternTemplate = String(req.body.patternTemplate ?? "").trim();
            if (!patternTemplate) {
                return res.status(400).json({ message: "patternTemplate is required" });
            }
            row.patternTemplate = patternTemplate.slice(0, 128);
        }

        if (req.body?.docType !== undefined) {
            row.docType = nextDocType;
        }
        if (req.body?.nextNumber !== undefined) {
            row.nextNumber = Math.max(1, parseOptionalInteger(req.body.nextNumber) ?? row.nextNumber);
        }
        if (req.body?.divisionId !== undefined) {
            row.divisionId = parseOptionalInteger(req.body.divisionId);
        }
        if (req.body?.active !== undefined) {
            row.active = parseBoolean(req.body.active);
        }
        if (req.body?.isDefault !== undefined) {
            row.isDefault = nextDefault;
        }

        await numberPlanRepo.save(row);
        const saved = await numberPlanRepo.findOne({
            where: { id: row.id },
            relations: { division: true },
        });

        await recordAudit({
            action: "number_plan_update",
            resourceType: "number_plan",
            resourceId: row.id,
            details: row.name,
            request: req,
        });

        res.json(serializeNumberPlan(saved ?? row));
    } catch (error) {
        console.error("Error updating number plan:", error);
        res.status(400).json({ message: "Failed to update number plan" });
    }
});

router.delete("/number-plans/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const row = await numberPlanRepo.findOneBy({ id });
        if (!row) {
            return res.status(404).json({ message: "Number plan not found" });
        }

        await numberPlanRepo.delete(id);
        await recordAudit({
            action: "number_plan_delete",
            resourceType: "number_plan",
            resourceId: id,
            details: row.name,
            request: req,
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting number plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
