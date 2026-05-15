import { Router } from "express";
import { Brackets } from "typeorm";
import { recordAudit } from "../audit.js";
import { AppDataSource } from "../database.js";
import { CustomerDeviceStatus } from "../models/common.js";
import { Customer } from "../models/customer.js";
import { CustomerDevice, IpNetwork, NetDevice } from "../models/network.js";
import { buildDiagnosticsSummary } from "./diagnostics.js";

export const router = Router();

const customerRepo = AppDataSource.getRepository(Customer);
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);
const netDeviceRepo = AppDataSource.getRepository(NetDevice);
const ipNetworkRepo = AppDataSource.getRepository(IpNetwork);

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

function serializeCustomerDevice(device: CustomerDevice) {
    return {
        id: device.id,
        customerId: device.customerId,
        name: device.name ?? null,
        hostname: device.hostname,
        ipAddress: device.ipAddress ?? null,
        macAddress: device.macAddress ?? null,
        status: device.status,
        notes: device.notes ?? null,
        netDeviceId: device.netDeviceId ?? null,
        ipNetworkId: device.ipNetworkId ?? null,
    };
}

function serializeIpNetwork(network: IpNetwork, sourceDeviceId?: number) {
    return {
        id: network.id,
        name: network.name,
        cidr: network.cidr,
        gateway: network.gateway ?? null,
        vlanId: network.vlanId ?? null,
        description: network.description ?? null,
        active: network.active,
        sourceDeviceId: sourceDeviceId ?? null,
    };
}

router.get("/routers", async (_req, res) => {
    try {
        const devices = await netDeviceRepo.find({
            where: [
                { deviceType: "router" },
                { deviceType: "mikrotik" },
                { deviceType: "mikrotik_v7" },
            ],
            order: { name: "ASC" },
        });

        res.json(devices.map((device) => ({
            id: device.id,
            name: device.name,
            hostname: device.hostname ?? null,
            managementIp: device.managementIp ?? null,
            deviceType: device.deviceType,
            status: device.status,
            readyForDiscovery: !!device.managementIp,
        })));
    } catch (error) {
        console.error("Error listing discovery routers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/imported-leases", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const devices = await customerDeviceRepo
            .createQueryBuilder("device")
            .leftJoinAndSelect("device.customer", "customer")
            .leftJoinAndSelect("device.netDevice", "netDevice")
            .leftJoinAndSelect("device.ipNetwork", "ipNetwork")
            .where(search
                ? new Brackets((qb) => {
                    qb.where("device.hostname LIKE :search", { search: `%${search}%` })
                        .orWhere("device.ip_address LIKE :search", { search: `%${search}%` })
                        .orWhere("device.mac_address LIKE :search", { search: `%${search}%` })
                        .orWhere("device.notes LIKE :search", { search: `%${search}%` });
                })
                : "1=1")
            .orderBy("device.hostname", "ASC")
            .getMany();

        res.json(devices.map((device) => serializeCustomerDevice(device)));
    } catch (error) {
        console.error("Error listing imported leases:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/import-lease", async (req, res) => {
    try {
        const customerId = parseOptionalInteger(req.body?.customerId);
        const hostname = parseOptionalString(req.body?.hostname);

        if (!customerId) {
            return res.status(400).json({ message: "customerId is required" });
        }

        if (!hostname) {
            return res.status(400).json({ message: "hostname is required" });
        }

        const customer = await customerRepo.findOneBy({ id: customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const netDeviceId = parseOptionalInteger(req.body?.netDeviceId);
        if (netDeviceId) {
            const netDevice = await netDeviceRepo.findOneBy({ id: netDeviceId });
            if (!netDevice) {
                return res.status(404).json({ message: "Net device not found" });
            }
        }

        const ipNetworkId = parseOptionalInteger(req.body?.ipNetworkId);
        if (ipNetworkId) {
            const ipNetwork = await ipNetworkRepo.findOneBy({ id: ipNetworkId });
            if (!ipNetwork) {
                return res.status(404).json({ message: "IP network not found" });
            }
        }

        const device = customerDeviceRepo.create({
            customerId,
            name: parseOptionalString(req.body?.name) ?? hostname,
            hostname,
            ipAddress: parseOptionalString(req.body?.ipAddress),
            macAddress: parseOptionalString(req.body?.macAddress),
            status: CustomerDeviceStatus.active,
            notes: parseOptionalString(req.body?.comment),
            netDeviceId,
            ipNetworkId,
        });

        await customerDeviceRepo.save(device);

        const savedDevice = await customerDeviceRepo.findOne({
            where: { id: device.id },
            relations: {
                customer: true,
                netDevice: true,
                ipNetwork: true,
            },
        });

        const finalDevice = savedDevice ?? device;
        const diagnostics = buildDiagnosticsSummary(finalDevice);

        await recordAudit({
            action: "network_discovery_import_lease",
            resourceType: "customer_device",
            resourceId: finalDevice.id,
            details: `${hostname} ${finalDevice.ipAddress ?? ""}`.trim(),
            request: req,
        });

        res.status(201).json({
            customerDevice: serializeCustomerDevice(finalDevice),
            diagnostics,
        });
    } catch (error) {
        console.error("Error importing discovered lease:", error);
        res.status(400).json({ message: "Failed to import discovered lease" });
    }
});

router.post("/import-network", async (req, res) => {
    try {
        const cidr = parseOptionalString(req.body?.cidr);
        if (!cidr) {
            return res.status(400).json({ message: "cidr is required" });
        }

        const sourceDeviceId = parseOptionalInteger(req.body?.deviceId);
        if (sourceDeviceId) {
            const sourceDevice = await netDeviceRepo.findOneBy({ id: sourceDeviceId });
            if (!sourceDevice) {
                return res.status(404).json({ message: "Net device not found" });
            }
        }

        const network = ipNetworkRepo.create({
            name: parseOptionalString(req.body?.name) ?? cidr,
            cidr,
            gateway: parseOptionalString(req.body?.gateway),
            vlanId: parseOptionalInteger(req.body?.vlanId),
            description: parseOptionalString(req.body?.comment) ?? parseOptionalString(req.body?.description),
            active: true,
        });

        await ipNetworkRepo.save(network);

        await recordAudit({
            action: "network_discovery_import_network",
            resourceType: "ip_network",
            resourceId: network.id,
            details: `${cidr}${sourceDeviceId ? ` from net_device_id=${sourceDeviceId}` : ""}`,
            request: req,
        });

        res.status(201).json(serializeIpNetwork(network, sourceDeviceId));
    } catch (error) {
        console.error("Error importing discovered network:", error);
        res.status(400).json({ message: "Failed to import discovered network" });
    }
});
