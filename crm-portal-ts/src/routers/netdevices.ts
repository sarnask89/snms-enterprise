import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { NetDevice } from "../models/network.js";
import { NetDeviceStatus } from "../models/common.js";

export const router = Router();
const deviceRepo = AppDataSource.getRepository(NetDevice);

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

function parseStatus(value: unknown, fallback = NetDeviceStatus.active) {
    const candidate = String(value ?? "").trim() as NetDeviceStatus;
    return Object.values(NetDeviceStatus).includes(candidate) ? candidate : fallback;
}

function serializeDevice(device: NetDevice) {
    return {
        id: device.id,
        name: device.name,
        hostname: device.hostname ?? null,
        serialNumber: device.serialNumber ?? null,
        macAddress: device.macAddress ?? null,
        managementIp: device.managementIp ?? null,
        deviceType: device.deviceType,
        status: device.status,
        notes: device.notes ?? null,
        ipNetworkId: device.ipNetworkId ?? null,
        netNodeId: device.netNodeId ?? null,
        customerId: device.customerId ?? null,
        ipNetwork: device.ipNetwork
            ? {
                id: device.ipNetwork.id,
                name: device.ipNetwork.name,
                cidr: device.ipNetwork.cidr,
            }
            : null,
        netNode: device.netNode
            ? {
                id: device.netNode.id,
                name: device.netNode.name,
                locationDetail: device.netNode.locationDetail ?? null,
            }
            : null,
        customer: device.customer
            ? {
                id: device.customer.id,
                customerCode: device.customer.customerCode,
                firstName: device.customer.firstName,
                lastName: device.customer.lastName,
            }
            : null,
    };
}

router.get("/", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const devices = await deviceRepo
            .createQueryBuilder("device")
            .leftJoinAndSelect("device.ipNetwork", "ipNetwork")
            .leftJoinAndSelect("device.netNode", "netNode")
            .leftJoinAndSelect("device.customer", "customer")
            .where(search
                ? new Brackets((qb) => {
                    qb.where("device.name LIKE :search", { search: `%${search}%` })
                        .orWhere("device.hostname LIKE :search", { search: `%${search}%` })
                        .orWhere("device.management_ip LIKE :search", { search: `%${search}%` })
                        .orWhere("device.device_type LIKE :search", { search: `%${search}%` })
                        .orWhere("device.serial_number LIKE :search", { search: `%${search}%` });
                })
                : "1=1")
            .orderBy("device.name", "ASC")
            .getMany();

        res.json(devices.map((device) => serializeDevice(device)));
    } catch (error) {
        console.error("Error fetching net devices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await deviceRepo.findOne({
            where: { id },
            relations: { ipNetwork: true, netNode: true, customer: true },
        });

        if (!device) {
            return res.status(404).json({ message: "Net device not found" });
        }

        res.json(serializeDevice(device));
    } catch (error) {
        console.error("Error fetching net device:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const name = String(req.body?.name ?? "").trim();
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const device = deviceRepo.create({
            name,
            hostname: parseOptionalString(req.body?.hostname),
            serialNumber: parseOptionalString(req.body?.serialNumber),
            macAddress: parseOptionalString(req.body?.macAddress),
            managementIp: parseOptionalString(req.body?.managementIp),
            deviceType: parseOptionalString(req.body?.deviceType) ?? "other",
            status: parseStatus(req.body?.status),
            ipNetworkId: parseOptionalInteger(req.body?.ipNetworkId),
            netNodeId: parseOptionalInteger(req.body?.netNodeId),
            customerId: parseOptionalInteger(req.body?.customerId),
            notes: parseOptionalString(req.body?.notes),
        });

        await deviceRepo.save(device);

        const savedDevice = await deviceRepo.findOne({
            where: { id: device.id },
            relations: { ipNetwork: true, netNode: true, customer: true },
        });

        res.status(201).json(serializeDevice(savedDevice ?? device));
    } catch (error) {
        console.error("Error creating net device:", error);
        res.status(400).json({ message: "Failed to create net device" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await deviceRepo.findOne({
            where: { id },
            relations: { ipNetwork: true, netNode: true, customer: true },
        });

        if (!device) {
            return res.status(404).json({ message: "Net device not found" });
        }

        if (req.body?.name !== undefined) {
            const name = String(req.body.name).trim();
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            device.name = name;
        }

        if (req.body?.hostname !== undefined) {
            device.hostname = parseOptionalString(req.body.hostname);
        }

        if (req.body?.serialNumber !== undefined) {
            device.serialNumber = parseOptionalString(req.body.serialNumber);
        }

        if (req.body?.macAddress !== undefined) {
            device.macAddress = parseOptionalString(req.body.macAddress);
        }

        if (req.body?.managementIp !== undefined) {
            device.managementIp = parseOptionalString(req.body.managementIp);
        }

        if (req.body?.deviceType !== undefined) {
            device.deviceType = parseOptionalString(req.body.deviceType) ?? "other";
        }

        if (req.body?.status !== undefined) {
            device.status = parseStatus(req.body.status, device.status);
        }

        if (req.body?.ipNetworkId !== undefined) {
            device.ipNetworkId = parseOptionalInteger(req.body.ipNetworkId);
        }

        if (req.body?.netNodeId !== undefined) {
            device.netNodeId = parseOptionalInteger(req.body.netNodeId);
        }

        if (req.body?.customerId !== undefined) {
            device.customerId = parseOptionalInteger(req.body.customerId);
        }

        if (req.body?.notes !== undefined) {
            device.notes = parseOptionalString(req.body.notes);
        }

        await deviceRepo.save(device);

        const savedDevice = await deviceRepo.findOne({
            where: { id: device.id },
            relations: { ipNetwork: true, netNode: true, customer: true },
        });

        res.json(serializeDevice(savedDevice ?? device));
    } catch (error) {
        console.error("Error updating net device:", error);
        res.status(400).json({ message: "Failed to update net device" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await deviceRepo.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ message: "Net device not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting net device:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
