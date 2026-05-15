import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { Customer, Document } from "../models/customer.js";
import { deleteStoredDocument, readStoredDocument, saveDocumentBase64 } from "../storage.js";

export const router = Router();

const documentRepo = AppDataSource.getRepository(Document);
const customerRepo = AppDataSource.getRepository(Customer);

type DocumentWithCustomer = Document & {
    customer?: Customer | null;
};

function serializeDocument(document: DocumentWithCustomer) {
    return {
        id: document.id,
        customerId: document.customerId ?? null,
        title: document.title,
        docType: document.docType,
        notes: document.notes ?? null,
        originalFilename: document.originalFilename ?? null,
        fileSize: document.fileSize ?? null,
        mimeType: document.mimeType ?? null,
        createdAt: document.createdAt,
        downloadUrl: `/api/v1/documents/${document.id}/download`,
        customer: document.customer
            ? {
                id: document.customer.id,
                customerCode: document.customer.customerCode,
                firstName: document.customer.firstName,
                lastName: document.customer.lastName,
            }
            : null,
    };
}

async function getDocumentById(id: number) {
    return await documentRepo.findOne({
        where: { id },
        relations: {
            customer: true,
        },
    });
}

router.get("/", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const customerId = Number.parseInt(String(req.query.customerId ?? ""), 10);

        const qb = documentRepo
            .createQueryBuilder("document")
            .leftJoinAndSelect("document.customer", "customer")
            .orderBy("document.createdAt", "DESC")
            .addOrderBy("document.id", "DESC");

        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("document.title LIKE :search", { search: `%${search}%` })
                    .orWhere("document.notes LIKE :search", { search: `%${search}%` })
                    .orWhere("document.originalFilename LIKE :search", { search: `%${search}%` })
                    .orWhere("document.docType LIKE :search", { search: `%${search}%` });
            }));
        }

        if (Number.isFinite(customerId)) {
            qb.andWhere("document.customerId = :customerId", { customerId });
        }

        const documents = await qb.getMany();
        res.json(documents.map((document) => serializeDocument(document)));
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const document = await getDocumentById(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.json(serializeDocument(document));
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const title = String(req.body?.title ?? "").trim();
        const originalFilename = String(req.body?.originalFilename ?? "").trim();
        const contentBase64 = String(req.body?.contentBase64 ?? "").trim();
        const docType = String(req.body?.docType ?? "other").trim() || "other";
        const notes = typeof req.body?.notes === "string" ? req.body.notes.trim() : "";
        const mimeType = typeof req.body?.mimeType === "string" ? req.body.mimeType.trim() : "";
        const rawCustomerId = req.body?.customerId;
        const customerId = rawCustomerId === null || rawCustomerId === undefined || rawCustomerId === ""
            ? null
            : Number.parseInt(String(rawCustomerId), 10);

        if (!title || !originalFilename || !contentBase64) {
            return res.status(400).json({ message: "title, originalFilename and contentBase64 are required" });
        }

        let customer: Customer | null = null;
        if (customerId !== null) {
            customer = await customerRepo.findOneBy({ id: customerId });
            if (!customer) {
                return res.status(400).json({ message: "Customer not found" });
            }
        }

        const storedFile = await saveDocumentBase64(contentBase64, originalFilename, mimeType || null);
        const document = documentRepo.create({
            customerId: customer?.id,
            title,
            docType,
            notes: notes || undefined,
            storedPath: storedFile.storedPath,
            originalFilename: storedFile.originalFilename,
            fileSize: storedFile.fileSize,
            mimeType: storedFile.mimeType ?? undefined,
        });

        await documentRepo.save(document);
        const savedDocument = await getDocumentById(document.id);

        res.status(201).json(serializeDocument(savedDocument ?? document));
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create document" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const document = await getDocumentById(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (req.body?.customerId !== undefined) {
            const rawCustomerId = req.body.customerId;
            if (rawCustomerId === null || rawCustomerId === "") {
                document.customerId = undefined;
                document.customer = null;
            } else {
                const customerId = Number.parseInt(String(rawCustomerId), 10);
                const customer = await customerRepo.findOneBy({ id: customerId });
                if (!customer) {
                    return res.status(400).json({ message: "Customer not found" });
                }
                document.customerId = customer.id;
                document.customer = customer;
            }
        }

        if (req.body?.title !== undefined) {
            document.title = String(req.body.title).trim() || document.title;
        }

        if (req.body?.docType !== undefined) {
            document.docType = String(req.body.docType).trim() || "other";
        }

        if (req.body?.notes !== undefined) {
            const notes = req.body.notes === null ? "" : String(req.body.notes).trim();
            document.notes = notes || undefined;
        }

        await documentRepo.save(document);
        const savedDocument = await getDocumentById(document.id);

        res.json(serializeDocument(savedDocument ?? document));
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(400).json({ message: "Failed to update document" });
    }
});

router.get("/:id/download", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const document = await getDocumentById(id);

        if (!document || !document.storedPath) {
            return res.status(404).json({ message: "Document not found" });
        }

        const { content } = await readStoredDocument(document.storedPath);
        res.setHeader("Content-Type", document.mimeType || "application/octet-stream");

        if (document.originalFilename) {
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(document.originalFilename)}"`);
        }

        res.status(200);
        res.end(content);
    } catch (error) {
        console.error("Error downloading document:", error);
        res.status(404).json({ message: "Document file not found" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const document = await getDocumentById(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        await deleteStoredDocument(document.storedPath);
        await documentRepo.delete(id);

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
