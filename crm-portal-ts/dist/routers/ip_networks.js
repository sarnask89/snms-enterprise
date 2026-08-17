import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { IpNetwork } from "../models/network.js";
export const router = Router();
const networkRepo = AppDataSource.getRepository(IpNetwork);
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
function parseBoolean(value, fallback = false) {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    if (typeof value === "boolean") {
        return value;
    }
    return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
}
function serializeNetwork(network, includeDetails = false) {
    const netDevices = network.netDevices ?? [];
    const customerDevices = network.customerDevices ?? [];
    return {
        id: network.id,
        name: network.name,
        cidr: network.cidr,
        gateway: network.gateway ?? null,
        vlanId: network.vlanId ?? null,
        description: network.description ?? null,
        active: network.active,
        deviceCount: netDevices.length,
        customerDeviceCount: customerDevices.length,
        devices: includeDetails
            ? netDevices.map((device) => ({
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
        const query = networkRepo
            .createQueryBuilder("network")
            .leftJoinAndSelect("network.netDevices", "netDevice")
            .leftJoinAndSelect("network.customerDevices", "customerDevice")
            .orderBy("network.id", "ASC");
        if (search) {
            query.andWhere(new Brackets((qb) => {
                qb.where("network.name LIKE :search", { search: `%${search}%` })
                    .orWhere("network.cidr LIKE :search", { search: `%${search}%` })
                    .orWhere("network.gateway LIKE :search", { search: `%${search}%` })
                    .orWhere("network.description LIKE :search", { search: `%${search}%` });
                const parsedVlan = Number.parseInt(search, 10);
                if (Number.isInteger(parsedVlan)) {
                    qb.orWhere("network.vlan_id = :vlanId", { vlanId: parsedVlan });
                }
            }));
        }
        const networks = await query.getMany();
        res.json(networks.map((network) => serializeNetwork(network)));
    }
    catch (error) {
        console.error("Error fetching IP networks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const network = await networkRepo.findOne({
            where: { id },
            relations: { netDevices: true, customerDevices: true },
        });
        if (!network) {
            return res.status(404).json({ message: "IP network not found" });
        }
        res.json(serializeNetwork(network, true));
    }
    catch (error) {
        console.error("Error fetching IP network:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        const cidr = String(req.body?.cidr ?? "").trim();
        if (!name || !cidr) {
            return res.status(400).json({ message: "Name and CIDR are required" });
        }
        const network = networkRepo.create({
            name,
            cidr,
            gateway: parseOptionalString(req.body?.gateway),
            vlanId: parseOptionalInteger(req.body?.vlanId),
            description: parseOptionalString(req.body?.description),
            active: parseBoolean(req.body?.active, true),
        });
        await networkRepo.save(network);
        const savedNetwork = await networkRepo.findOne({
            where: { id: network.id },
            relations: { netDevices: true, customerDevices: true },
        });
        res.status(201).json(serializeNetwork(savedNetwork ?? network, true));
    }
    catch (error) {
        console.error("Error creating IP network:", error);
        res.status(400).json({ message: "Failed to create IP network" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const network = await networkRepo.findOne({
            where: { id },
            relations: { netDevices: true, customerDevices: true },
        });
        if (!network) {
            return res.status(404).json({ message: "IP network not found" });
        }
        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            network.name = name;
        }
        if (req.body?.cidr !== undefined) {
            const cidr = String(req.body.cidr).trim();
            if (!cidr) {
                return res.status(400).json({ message: "CIDR is required" });
            }
            network.cidr = cidr;
        }
        if (req.body?.gateway !== undefined) {
            network.gateway = parseOptionalString(req.body.gateway);
        }
        if (req.body?.vlanId !== undefined) {
            network.vlanId = parseOptionalInteger(req.body.vlanId);
        }
        if (req.body?.description !== undefined) {
            network.description = parseOptionalString(req.body.description);
        }
        if (req.body?.active !== undefined) {
            network.active = parseBoolean(req.body.active, network.active);
        }
        await networkRepo.save(network);
        const savedNetwork = await networkRepo.findOne({
            where: { id: network.id },
            relations: { netDevices: true, customerDevices: true },
        });
        res.json(serializeNetwork(savedNetwork ?? network, true));
    }
    catch (error) {
        console.error("Error updating IP network:", error);
        res.status(400).json({ message: "Failed to update IP network" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await networkRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "IP network not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting IP network:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=ip_networks.js.map