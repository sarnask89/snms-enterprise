import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { NetNode } from "../models/network.js";
import { NetNodeLocationType } from "../models/common.js";

export const router = Router();
const nodeRepo = AppDataSource.getRepository(NetNode);

function parseOptionalNumber(value: unknown) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }

    const parsed = Number.parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalString(value: unknown) {
    const parsed = String(value ?? "").trim();
    return parsed ? parsed : undefined;
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

function parseLocationType(value: unknown, fallback = NetNodeLocationType.other) {
    const candidate = String(value ?? "").trim() as NetNodeLocationType;
    return Object.values(NetNodeLocationType).includes(candidate) ? candidate : fallback;
}

function serializeNode(node: NetNode, includeDetails = false) {
    const devices = node.devices ?? [];

    return {
        id: node.id,
        name: node.name,
        locationDetail: node.locationDetail ?? null,
        locationType: node.locationType,
        nodeType: node.nodeType ?? null,
        ownerType: node.ownerType ?? null,
        latitude: node.latitude ?? null,
        longitude: node.longitude ?? null,
        x1992: node.x1992 ?? null,
        y1992: node.y1992 ?? null,
        hasPower: node.hasPower,
        hasEnvControl: node.hasEnvControl,
        info: node.info ?? null,
        deviceCount: devices.length,
        devices: includeDetails
            ? devices.map((device) => ({
                id: device.id,
                name: device.name,
                hostname: device.hostname ?? null,
                managementIp: device.managementIp ?? null,
                status: device.status,
            }))
            : undefined,
    };
}

router.get("/", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const nodes = await nodeRepo
            .createQueryBuilder("node")
            .leftJoinAndSelect("node.devices", "device")
            .where(search
                ? new Brackets((qb) => {
                    qb.where("node.name LIKE :search", { search: `%${search}%` })
                        .orWhere("node.location_detail LIKE :search", { search: `%${search}%` })
                        .orWhere("node.node_type LIKE :search", { search: `%${search}%` });
                })
                : "1=1")
            .orderBy("node.name", "ASC")
            .getMany();

        res.json(nodes.map((node) => serializeNode(node)));
    } catch (error) {
        console.error("Error fetching net nodes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const node = await nodeRepo.findOne({
            where: { id },
            relations: { devices: true },
        });

        if (!node) {
            return res.status(404).json({ message: "Net node not found" });
        }

        res.json(serializeNode(node, true));
    } catch (error) {
        console.error("Error fetching net node:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const node = nodeRepo.create({
            name,
            locationDetail: parseOptionalString(req.body?.locationDetail),
            locationType: parseLocationType(req.body?.locationType),
            nodeType: parseOptionalString(req.body?.nodeType),
            ownerType: parseOptionalString(req.body?.ownerType),
            latitude: parseOptionalNumber(req.body?.latitude),
            longitude: parseOptionalNumber(req.body?.longitude),
            x1992: parseOptionalNumber(req.body?.x1992),
            y1992: parseOptionalNumber(req.body?.y1992),
            hasPower: parseBoolean(req.body?.hasPower),
            hasEnvControl: parseBoolean(req.body?.hasEnvControl),
            info: parseOptionalString(req.body?.info),
        });

        await nodeRepo.save(node);

        const savedNode = await nodeRepo.findOne({
            where: { id: node.id },
            relations: { devices: true },
        });

        res.status(201).json(serializeNode(savedNode ?? node, true));
    } catch (error) {
        console.error("Error creating net node:", error);
        res.status(400).json({ message: "Failed to create net node" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const node = await nodeRepo.findOne({
            where: { id },
            relations: { devices: true },
        });

        if (!node) {
            return res.status(404).json({ message: "Net node not found" });
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            node.name = name;
        }

        if (req.body?.locationDetail !== undefined) {
            node.locationDetail = parseOptionalString(req.body.locationDetail);
        }

        if (req.body?.locationType !== undefined) {
            node.locationType = parseLocationType(req.body.locationType, node.locationType);
        }

        if (req.body?.nodeType !== undefined) {
            node.nodeType = parseOptionalString(req.body.nodeType);
        }

        if (req.body?.ownerType !== undefined) {
            node.ownerType = parseOptionalString(req.body.ownerType);
        }

        if (req.body?.latitude !== undefined) {
            node.latitude = parseOptionalNumber(req.body.latitude);
        }

        if (req.body?.longitude !== undefined) {
            node.longitude = parseOptionalNumber(req.body.longitude);
        }

        if (req.body?.x1992 !== undefined) {
            node.x1992 = parseOptionalNumber(req.body.x1992);
        }

        if (req.body?.y1992 !== undefined) {
            node.y1992 = parseOptionalNumber(req.body.y1992);
        }

        if (req.body?.hasPower !== undefined) {
            node.hasPower = parseBoolean(req.body.hasPower, node.hasPower);
        }

        if (req.body?.hasEnvControl !== undefined) {
            node.hasEnvControl = parseBoolean(req.body.hasEnvControl, node.hasEnvControl);
        }

        if (req.body?.info !== undefined) {
            node.info = parseOptionalString(req.body.info);
        }

        await nodeRepo.save(node);

        const savedNode = await nodeRepo.findOne({
            where: { id: node.id },
            relations: { devices: true },
        });

        res.json(serializeNode(savedNode ?? node, true));
    } catch (error) {
        console.error("Error updating net node:", error);
        res.status(400).json({ message: "Failed to update net node" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await nodeRepo.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ message: "Net node not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting net node:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
