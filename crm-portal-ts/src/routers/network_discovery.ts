import { Router } from "express";
import { Brackets } from "typeorm";
import { recordAudit } from "../audit.js";
import { AppDataSource } from "../database.js";
import { encryptDeviceSecret, hasEncryptedSecret } from "../device_secrets.js";
import { Subscription, Tariff } from "../models/finance.js";
import { CustomerDeviceStatus } from "../models/common.js";
import { Customer } from "../models/customer.js";
import {
    CustomerDevice,
    IpNetwork,
    NetDevice,
    NetworkDeviceAccessProfile,
    NetworkDiscoveryRecord,
    NetworkDiscoverySession,
} from "../models/network.js";
import {
    DASAN_DEFAULT_SSH_PORT,
    DISCOVERY_DRIVER_DASAN,
    DISCOVERY_DRIVER_MIKROTIK,
    runDiscoveryScanForDevice,
    serializeDiscoveryRecord,
} from "../services/network_discovery_live.js";
import { autoImportDiscoverySession } from "../services/network_auto_import.js";
import { buildDiagnosticsSummary } from "./diagnostics.js";

export const router = Router();

const customerRepo = AppDataSource.getRepository(Customer);
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);
const netDeviceRepo = AppDataSource.getRepository(NetDevice);
const ipNetworkRepo = AppDataSource.getRepository(IpNetwork);
const accessProfileRepo = AppDataSource.getRepository(NetworkDeviceAccessProfile);
const discoverySessionRepo = AppDataSource.getRepository(NetworkDiscoverySession);
const discoveryRecordRepo = AppDataSource.getRepository(NetworkDiscoveryRecord);
const tariffRepo = AppDataSource.getRepository(Tariff);
const subscriptionRepo = AppDataSource.getRepository(Subscription);

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

function parseOptionalBoolean(value: unknown) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }

    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true") {
        return true;
    }
    if (normalized === "false") {
        return false;
    }

    return undefined;
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
        remoteVendor: device.remoteVendor ?? null,
        remoteSerialNumber: device.remoteSerialNumber ?? null,
        remoteOlt: device.remoteOlt ?? null,
        remoteOnu: device.remoteOnu ?? null,
        remotePort: device.remotePort ?? null,
        remoteProfileName: device.remoteProfileName ?? null,
        remoteRxPowerDbm: device.remoteRxPowerDbm ?? null,
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

function serializeAccessProfile(profile: NetworkDeviceAccessProfile) {
    let metadata: Record<string, unknown> | null = null;
    if (profile.metadataJson) {
        try {
            metadata = JSON.parse(profile.metadataJson) as Record<string, unknown>;
        } catch {
            metadata = null;
        }
    }

    return {
        id: profile.id,
        netDeviceId: profile.netDeviceId,
        driver: profile.driver,
        host: profile.host,
        port: profile.port ?? null,
        username: profile.username,
        hasPassword: hasEncryptedSecret(profile.passwordCiphertext),
        hasEnablePassword: hasEncryptedSecret(profile.enablePasswordCiphertext),
        metadata,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}

function serializeDiscoverySession(session: NetworkDiscoverySession) {
    let summary: Record<string, unknown> | null = null;
    if (session.summary) {
        try {
            summary = JSON.parse(session.summary) as Record<string, unknown>;
        } catch {
            summary = null;
        }
    }

    return {
        id: session.id,
        netDeviceId: session.netDeviceId,
        accessProfileId: session.accessProfileId ?? null,
        driver: session.driver,
        status: session.status,
        summary,
        errorMessage: session.errorMessage ?? null,
        startedAt: session.startedAt,
        finishedAt: session.finishedAt ?? null,
        netDevice: session.netDevice
            ? {
                id: session.netDevice.id,
                name: session.netDevice.name,
                managementIp: session.netDevice.managementIp ?? null,
                deviceType: session.netDevice.deviceType,
            }
            : null,
        recordCount: Array.isArray(session.records) ? session.records.length : undefined,
    };
}

function getDefaultPort(driver: string) {
    if (driver === DISCOVERY_DRIVER_MIKROTIK) {
        return 8728;
    }
    if (driver === DISCOVERY_DRIVER_DASAN) {
        return DASAN_DEFAULT_SSH_PORT;
    }
    return undefined;
}

router.get("/devices", async (req, res) => {
    try {
        const search = String(req.query.q ?? "").trim();
        const devices = await netDeviceRepo
            .createQueryBuilder("device")
            .leftJoinAndSelect("device.accessProfile", "accessProfile")
            .where(search
                ? new Brackets((qb) => {
                    qb.where("device.name LIKE :search", { search: `%${search}%` })
                        .orWhere("device.management_ip LIKE :search", { search: `%${search}%` })
                        .orWhere("device.device_type LIKE :search", { search: `%${search}%` });
                })
                : "1=1")
            .orderBy("device.name", "ASC")
            .getMany();

        res.json(devices.map((device) => ({
            id: device.id,
            name: device.name,
            hostname: device.hostname ?? null,
            managementIp: device.managementIp ?? null,
            deviceType: device.deviceType,
            status: device.status,
            readyForDiscovery: !!device.managementIp && !!device.accessProfile,
            accessProfile: device.accessProfile ? serializeAccessProfile(device.accessProfile) : null,
        })));
    } catch (error) {
        console.error("Error listing discovery devices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/routers", async (_req, res) => {
    try {
        const devices = await netDeviceRepo.find({
            where: [
                { deviceType: "router" },
                { deviceType: "mikrotik" },
                { deviceType: "mikrotik_v7" },
            ],
            relations: { accessProfile: true },
            order: { name: "ASC" },
        });

        res.json(devices.map((device) => ({
            id: device.id,
            name: device.name,
            hostname: device.hostname ?? null,
            managementIp: device.managementIp ?? null,
            deviceType: device.deviceType,
            status: device.status,
            readyForDiscovery: !!device.managementIp && !!device.accessProfile,
            accessProfileDriver: device.accessProfile?.driver ?? null,
        })));
    } catch (error) {
        console.error("Error listing discovery routers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/access-profiles", async (_req, res) => {
    try {
        const profiles = await accessProfileRepo.find({
            order: { id: "ASC" },
        });

        res.json(profiles.map((profile) => serializeAccessProfile(profile)));
    } catch (error) {
        console.error("Error listing discovery access profiles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/access-profiles", async (req, res) => {
    try {
        const netDeviceId = parseOptionalInteger(req.body?.netDeviceId);
        const driver = parseOptionalString(req.body?.driver);
        const host = parseOptionalString(req.body?.host);
        const username = parseOptionalString(req.body?.username);
        const password = parseOptionalString(req.body?.password);

        if (!netDeviceId || !driver || !host || !username || !password) {
            return res.status(400).json({ message: "netDeviceId, driver, host, username and password are required" });
        }

        if (![DISCOVERY_DRIVER_MIKROTIK, DISCOVERY_DRIVER_DASAN].includes(driver)) {
            return res.status(400).json({ message: "Unsupported discovery driver" });
        }

        const netDevice = await netDeviceRepo.findOneBy({ id: netDeviceId });
        if (!netDevice) {
            return res.status(404).json({ message: "Net device not found" });
        }

        let profile = await accessProfileRepo.findOneBy({ netDeviceId });
        const createdNewProfile = !profile;
        if (!profile) {
            profile = accessProfileRepo.create({
                netDeviceId,
            });
        }

        const metadata: Record<string, unknown> = {};
        const useTls = parseOptionalBoolean(req.body?.useTls);
        if (useTls !== undefined) {
            metadata.useTls = useTls;
        }

        profile.driver = driver;
        profile.host = host;
        profile.port = parseOptionalInteger(req.body?.port) ?? getDefaultPort(driver);
        profile.username = username;
        profile.passwordCiphertext = encryptDeviceSecret(password);
        profile.enablePasswordCiphertext = driver === DISCOVERY_DRIVER_DASAN
            ? encryptDeviceSecret(parseOptionalString(req.body?.enablePassword) ?? password)
            : undefined;
        profile.metadataJson = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined;
        profile.updatedAt = new Date();

        await accessProfileRepo.save(profile);

        await recordAudit({
            action: "network_discovery_profile_upsert",
            resourceType: "network_device_access_profile",
            resourceId: profile.id,
            details: `${driver} host=${host} net_device_id=${netDeviceId}`,
            request: req,
        });

        res.status(createdNewProfile ? 201 : 200).json(serializeAccessProfile(profile));
    } catch (error) {
        console.error("Error creating discovery access profile:", error);
        res.status(400).json({ message: "Failed to create discovery access profile" });
    }
});

router.put("/access-profiles/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const profile = await accessProfileRepo.findOneBy({ id });
        if (!profile) {
            return res.status(404).json({ message: "Access profile not found" });
        }

        if (req.body?.driver !== undefined) {
            const driver = parseOptionalString(req.body.driver);
            if (!driver || ![DISCOVERY_DRIVER_MIKROTIK, DISCOVERY_DRIVER_DASAN].includes(driver)) {
                return res.status(400).json({ message: "Unsupported discovery driver" });
            }
            profile.driver = driver;
            if (!profile.port) {
                profile.port = getDefaultPort(driver);
            }
        }

        if (req.body?.host !== undefined) {
            const host = parseOptionalString(req.body.host);
            if (!host) {
                return res.status(400).json({ message: "host cannot be empty" });
            }
            profile.host = host;
        }
        if (req.body?.port !== undefined) {
            profile.port = parseOptionalInteger(req.body.port) ?? getDefaultPort(profile.driver);
        }
        if (req.body?.username !== undefined) {
            const username = parseOptionalString(req.body.username);
            if (!username) {
                return res.status(400).json({ message: "username cannot be empty" });
            }
            profile.username = username;
        }
        if (req.body?.password !== undefined) {
            const password = parseOptionalString(req.body.password);
            if (!password) {
                return res.status(400).json({ message: "password cannot be empty" });
            }
            profile.passwordCiphertext = encryptDeviceSecret(password);
        }
        if (req.body?.enablePassword !== undefined) {
            const enablePassword = parseOptionalString(req.body.enablePassword);
            profile.enablePasswordCiphertext = enablePassword
                ? encryptDeviceSecret(enablePassword)
                : undefined;
        }

        const metadata = profile.metadataJson ? JSON.parse(profile.metadataJson) as Record<string, unknown> : {};
        const useTls = parseOptionalBoolean(req.body?.useTls);
        if (useTls !== undefined) {
            metadata.useTls = useTls;
        }
        profile.metadataJson = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined;
        profile.updatedAt = new Date();

        await accessProfileRepo.save(profile);

        await recordAudit({
            action: "network_discovery_profile_update",
            resourceType: "network_device_access_profile",
            resourceId: profile.id,
            details: `${profile.driver} host=${profile.host}`,
            request: req,
        });

        res.json(serializeAccessProfile(profile));
    } catch (error) {
        console.error("Error updating discovery access profile:", error);
        res.status(400).json({ message: "Failed to update discovery access profile" });
    }
});

router.get("/sessions", async (req, res) => {
    try {
        const netDeviceId = parseOptionalInteger(req.query.netDeviceId);
        const sessions = await discoverySessionRepo.find({
            where: netDeviceId ? { netDeviceId } : {},
            relations: { netDevice: true, records: true },
            order: { id: "DESC" },
            take: 30,
        });

        res.json(sessions.map((session) => serializeDiscoverySession(session)));
    } catch (error) {
        console.error("Error listing discovery sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/sessions/:id/records", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const records = await discoveryRecordRepo.find({
            where: { sessionId: id },
            order: { id: "ASC" },
        });

        res.json(records.map((record) => serializeDiscoveryRecord(record)));
    } catch (error) {
        console.error("Error listing discovery records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/sessions/:id/auto-import", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const session = await discoverySessionRepo.findOne({
            where: { id },
            relations: { netDevice: true },
        });

        if (!session) {
            return res.status(404).json({ message: "Discovery session not found" });
        }

        const records = await discoveryRecordRepo.find({
            where: { sessionId: session.id },
            order: { id: "ASC" },
        });

        const result = await autoImportDiscoverySession(
            records,
            {
                importTariffsAndSubscriptions: parseOptionalBoolean(req.body?.importTariffsAndSubscriptions) ?? false,
            },
            {
                customerRepo,
                customerDeviceRepo,
                tariffRepo,
                subscriptionRepo,
            },
        );

        await recordAudit({
            action: "network_discovery_auto_import",
            resourceType: "network_discovery_session",
            resourceId: session.id,
            details: `net_device_id=${session.netDeviceId} devices=${result.summary.importedCustomerDevices} customers=${result.summary.createdCustomers} tariffs=${result.summary.createdTariffs} subscriptions=${result.summary.createdSubscriptions}`,
            request: req,
        });

        res.json({
            session: serializeDiscoverySession(session),
            summary: result.summary,
            importedCustomerDeviceIds: result.importedCustomerDeviceIds,
            createdCustomerIds: result.createdCustomerIds,
            createdTariffIds: result.createdTariffIds,
            createdSubscriptionIds: result.createdSubscriptionIds,
            skippedRecordIds: result.skippedRecordIds,
        });
    } catch (error) {
        console.error("Error auto-importing discovery session:", error);
        res.status(400).json({ message: "Failed to auto-import discovery session" });
    }
});

router.post("/scan/:netDeviceId", async (req, res) => {
    const netDeviceId = Number.parseInt(req.params.netDeviceId, 10);
    const netDevice = await netDeviceRepo.findOne({
        where: { id: netDeviceId },
        relations: { accessProfile: true },
    });

    if (!netDevice) {
        return res.status(404).json({ message: "Net device not found" });
    }

    if (!netDevice.accessProfile) {
        return res.status(400).json({ message: "Discovery access profile is not configured for this device" });
    }

    const session = discoverySessionRepo.create({
        netDeviceId: netDevice.id,
        accessProfileId: netDevice.accessProfile.id,
        driver: netDevice.accessProfile.driver,
        status: "running",
    });
    await discoverySessionRepo.save(session);

    try {
        const scanResult = await runDiscoveryScanForDevice(netDevice.accessProfile, netDevice);
        const records = scanResult.records.map((record) => discoveryRecordRepo.create({
            sessionId: session.id,
            netDeviceId: netDevice.id,
            recordKind: record.recordKind,
            externalKey: record.externalKey ?? undefined,
            hostname: record.hostname ?? undefined,
            ipAddress: record.ipAddress ?? undefined,
            macAddress: record.macAddress ?? undefined,
            serialNumber: record.serialNumber ?? undefined,
            recordStatus: record.recordStatus ?? undefined,
            profileName: record.profileName ?? undefined,
            failReason: record.failReason ?? undefined,
            remotePort: record.remotePort ?? undefined,
            remoteVlanId: record.remoteVlanId ?? undefined,
            remoteOlt: record.remoteOlt ?? undefined,
            remoteOnu: record.remoteOnu ?? undefined,
            distanceMeters: record.distanceMeters ?? undefined,
            rxPowerDbm: record.rxPowerDbm ?? undefined,
            payloadJson: record.payloadJson ?? undefined,
        }));
        await discoveryRecordRepo.save(records);

        session.status = "succeeded";
        session.summary = scanResult.summary;
        session.finishedAt = new Date();
        await discoverySessionRepo.save(session);

        await recordAudit({
            action: "network_discovery_scan",
            resourceType: "network_discovery_session",
            resourceId: session.id,
            details: `net_device_id=${netDevice.id} records=${records.length}`,
            request: req,
        });

        res.status(201).json({
            session: serializeDiscoverySession({
                ...session,
                netDevice,
                records,
            } as NetworkDiscoverySession),
            records: records.map((record) => serializeDiscoveryRecord(record)),
        });
    } catch (error) {
        session.status = "failed";
        session.errorMessage = error instanceof Error ? error.message : String(error);
        session.finishedAt = new Date();
        await discoverySessionRepo.save(session);

        console.error("Error running discovery scan:", error);
        res.status(502).json({
            message: "Discovery scan failed",
            error: session.errorMessage,
        });
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
                        .orWhere("device.notes LIKE :search", { search: `%${search}%` })
                        .orWhere("device.remote_serial_number LIKE :search", { search: `%${search}%` });
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

router.post("/import-record/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const record = await discoveryRecordRepo.findOneBy({ id });
        if (!record) {
            return res.status(404).json({ message: "Discovery record not found" });
        }

        if (record.recordKind === "mikrotik_network") {
            const cidr = parseOptionalString(record.ipAddress);
            if (!cidr) {
                return res.status(400).json({ message: "Discovery record does not contain network CIDR" });
            }

            const existing = await ipNetworkRepo.findOneBy({ cidr });
            if (existing) {
                return res.status(409).json({ message: "IP network already exists" });
            }

            let gateway: string | undefined;
            let comment: string | undefined;
            try {
                const payload = JSON.parse(record.payloadJson ?? "{}") as Record<string, unknown>;
                gateway = parseOptionalString(payload.gateway);
                comment = parseOptionalString(payload.comment);
            } catch {
                gateway = undefined;
                comment = undefined;
            }

            const network = ipNetworkRepo.create({
                name: parseOptionalString(req.body?.name) ?? cidr,
                cidr,
                gateway,
                description: comment,
                vlanId: parseOptionalInteger(req.body?.vlanId),
                active: true,
            });
            await ipNetworkRepo.save(network);

            await recordAudit({
                action: "network_discovery_import_record",
                resourceType: "ip_network",
                resourceId: network.id,
                details: `record_id=${record.id} kind=${record.recordKind}`,
                request: req,
            });

            return res.status(201).json({
                imported: "ip_network",
                network: serializeIpNetwork(network, record.netDeviceId),
            });
        }

        const customerId = parseOptionalInteger(req.body?.customerId);
        if (!customerId) {
            return res.status(400).json({ message: "customerId is required for customer device import" });
        }

        const customer = await customerRepo.findOneBy({ id: customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
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
            name: parseOptionalString(req.body?.name) ?? record.hostname ?? record.serialNumber ?? record.macAddress ?? "discovered-device",
            hostname: parseOptionalString(req.body?.hostname) ?? record.hostname ?? record.serialNumber ?? `record-${record.id}`,
            ipAddress: record.ipAddress ?? undefined,
            macAddress: record.macAddress ?? undefined,
            status: record.recordStatus === "inactive" ? CustomerDeviceStatus.inactive : CustomerDeviceStatus.active,
            notes: parseOptionalString(req.body?.comment) ?? `Imported from discovery record #${record.id}`,
            netDeviceId: record.netDeviceId,
            ipNetworkId,
            remoteVendor: record.recordKind.startsWith("dasan_") ? "dasan" : "mikrotik",
            remoteSerialNumber: record.serialNumber ?? undefined,
            remoteOlt: record.remoteOlt ?? undefined,
            remoteOnu: record.remoteOnu ?? undefined,
            remotePort: record.remotePort ?? undefined,
            remoteProfileName: record.profileName ?? undefined,
            remoteRxPowerDbm: record.rxPowerDbm ?? undefined,
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
            action: "network_discovery_import_record",
            resourceType: "customer_device",
            resourceId: finalDevice.id,
            details: `record_id=${record.id} kind=${record.recordKind}`,
            request: req,
        });

        res.status(201).json({
            imported: "customer_device",
            customerDevice: serializeCustomerDevice(finalDevice),
            diagnostics,
        });
    } catch (error) {
        console.error("Error importing discovery record:", error);
        res.status(400).json({ message: "Failed to import discovery record" });
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
