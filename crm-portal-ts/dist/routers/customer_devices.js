import { Router } from "express";
import { ILike } from "typeorm";
import { AppDataSource } from "../database.js";
import { CustomerDeviceStatus } from "../models/common.js";
import { CustomerDevice } from "../models/network.js";
import { resolveTerytAddress, serializeTerytEntry, } from "../teryt_address_links.js";
export const router = Router();
const deviceRepo = AppDataSource.getRepository(CustomerDevice);
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
function parseStatus(value, fallback = CustomerDeviceStatus.active) {
    const candidate = String(value ?? "").trim();
    return Object.values(CustomerDeviceStatus).includes(candidate) ? candidate : fallback;
}
async function buildInstallationAddress(device) {
    const hasTerytIds = [
        device.installationStateId,
        device.installationDistrictId,
        device.installationCommuneId,
        device.installationCityId,
        device.installationStreetId,
    ].some((value) => value !== null && value !== undefined);
    if (!hasTerytIds) {
        return null;
    }
    return await resolveTerytAddress({
        stateId: device.installationStateId,
        districtId: device.installationDistrictId,
        communeId: device.installationCommuneId,
        cityId: device.installationCityId,
        streetId: device.installationStreetId,
    });
}
async function serializeDevice(device) {
    const installationAddress = await buildInstallationAddress(device);
    return {
        id: device.id,
        customerId: device.customerId,
        name: device.name ?? null,
        hostname: device.hostname,
        deviceType: device.deviceType ?? null,
        login: device.login ?? null,
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
        installationStateId: installationAddress?.state?.id ?? device.installationStateId ?? null,
        installationDistrictId: installationAddress?.district?.id ?? device.installationDistrictId ?? null,
        installationCommuneId: installationAddress?.commune?.id ?? device.installationCommuneId ?? null,
        installationCityId: installationAddress?.city?.id ?? device.installationCityId ?? null,
        installationStreetId: installationAddress?.street?.id ?? device.installationStreetId ?? null,
        installationState: installationAddress?.state?.name ?? device.installationState ?? null,
        installationCounty: installationAddress?.district?.name ?? device.installationCounty ?? null,
        installationCity: installationAddress?.city?.name ?? device.installationCity ?? null,
        installationStreet: installationAddress?.street?.name ?? device.installationStreet ?? null,
        installationStreetNumber: device.installationStreetNumber ?? null,
        installationApartmentNumber: device.installationApartmentNumber ?? null,
        installationPostalCode: device.installationPostalCode ?? null,
        installationCountry: device.installationCountry ?? null,
        locationDescription: device.locationDescription ?? null,
        installationStateEntry: serializeTerytEntry(installationAddress?.state ?? null),
        installationDistrictEntry: serializeTerytEntry(installationAddress?.district ?? null),
        installationCommuneEntry: serializeTerytEntry(installationAddress?.commune ?? null),
        installationCityEntry: serializeTerytEntry(installationAddress?.city ?? null),
        installationStreetEntry: serializeTerytEntry(installationAddress?.street ?? null),
        customer: device.customer
            ? {
                id: device.customer.id,
                customerCode: device.customer.customerCode,
                firstName: device.customer.firstName,
                lastName: device.customer.lastName,
                companyName: device.customer.companyName ?? null,
            }
            : null,
    };
}
function hasAnyTerytAddressInput(payload) {
    return [
        "installationStateId",
        "installationDistrictId",
        "installationCommuneId",
        "installationCityId",
        "installationStreetId",
    ].some((key) => Object.prototype.hasOwnProperty.call(payload, key));
}
function applyResolvedInstallationAddress(device, resolved) {
    device.installationStateId = resolved.state?.id;
    device.installationDistrictId = resolved.district?.id;
    device.installationCommuneId = resolved.commune?.id;
    device.installationCityId = resolved.city?.id;
    device.installationStreetId = resolved.street?.id;
    if (resolved.state) {
        device.installationState = resolved.state.name;
    }
    if (resolved.district) {
        device.installationCounty = resolved.district.name;
    }
    if (resolved.city) {
        device.installationCity = resolved.city.name;
    }
    if (resolved.street) {
        device.installationStreet = resolved.street.name;
    }
}
async function syncInstallationAddress(device, payload) {
    if (!hasAnyTerytAddressInput(payload)) {
        return;
    }
    const resolved = await resolveTerytAddress({
        stateId: device.installationStateId,
        districtId: device.installationDistrictId,
        communeId: device.installationCommuneId,
        cityId: device.installationCityId,
        streetId: device.installationStreetId,
    });
    applyResolvedInstallationAddress(device, resolved);
}
async function applyDevicePayload(device, payload, isCreate = false) {
    if (payload.customerId !== undefined || isCreate) {
        const customerId = parseOptionalInteger(payload.customerId);
        if (!customerId) {
            throw new Error("customerId is required");
        }
        device.customerId = customerId;
    }
    if (payload.hostname !== undefined || isCreate) {
        const hostname = parseOptionalString(payload.hostname);
        if (!hostname) {
            throw new Error("hostname is required");
        }
        device.hostname = hostname;
    }
    if (payload.name !== undefined) {
        device.name = parseOptionalString(payload.name);
    }
    if (payload.deviceType !== undefined) {
        device.deviceType = parseOptionalString(payload.deviceType);
    }
    if (payload.login !== undefined) {
        device.login = parseOptionalString(payload.login);
    }
    if (payload.passwd !== undefined) {
        device.passwd = parseOptionalString(payload.passwd);
    }
    if (payload.ipAddress !== undefined) {
        device.ipAddress = parseOptionalString(payload.ipAddress);
    }
    if (payload.macAddress !== undefined) {
        device.macAddress = parseOptionalString(payload.macAddress)?.toLowerCase();
    }
    if (payload.status !== undefined || isCreate) {
        device.status = parseStatus(payload.status, device.status ?? CustomerDeviceStatus.active);
    }
    if (payload.notes !== undefined) {
        device.notes = parseOptionalString(payload.notes);
    }
    if (payload.netDeviceId !== undefined) {
        device.netDeviceId = parseOptionalInteger(payload.netDeviceId);
    }
    if (payload.ipNetworkId !== undefined) {
        device.ipNetworkId = parseOptionalInteger(payload.ipNetworkId);
    }
    if (payload.remoteVendor !== undefined) {
        device.remoteVendor = parseOptionalString(payload.remoteVendor);
    }
    if (payload.remoteSerialNumber !== undefined) {
        device.remoteSerialNumber = parseOptionalString(payload.remoteSerialNumber);
    }
    if (payload.remoteOlt !== undefined) {
        device.remoteOlt = parseOptionalInteger(payload.remoteOlt);
    }
    if (payload.remoteOnu !== undefined) {
        device.remoteOnu = parseOptionalInteger(payload.remoteOnu);
    }
    if (payload.remotePort !== undefined) {
        device.remotePort = parseOptionalString(payload.remotePort);
    }
    if (payload.remoteProfileName !== undefined) {
        device.remoteProfileName = parseOptionalString(payload.remoteProfileName);
    }
    if (payload.remoteRxPowerDbm !== undefined) {
        const rxPower = Number.parseFloat(String(payload.remoteRxPowerDbm));
        device.remoteRxPowerDbm = Number.isFinite(rxPower) ? rxPower : undefined;
    }
    if (payload.installationStateId !== undefined) {
        device.installationStateId = parseOptionalInteger(payload.installationStateId);
    }
    if (payload.installationDistrictId !== undefined) {
        device.installationDistrictId = parseOptionalInteger(payload.installationDistrictId);
    }
    if (payload.installationCommuneId !== undefined) {
        device.installationCommuneId = parseOptionalInteger(payload.installationCommuneId);
    }
    if (payload.installationCityId !== undefined) {
        device.installationCityId = parseOptionalInteger(payload.installationCityId);
    }
    if (payload.installationStreetId !== undefined) {
        device.installationStreetId = parseOptionalInteger(payload.installationStreetId);
    }
    if (payload.installationState !== undefined) {
        device.installationState = parseOptionalString(payload.installationState);
    }
    if (payload.installationCounty !== undefined) {
        device.installationCounty = parseOptionalString(payload.installationCounty);
    }
    if (payload.installationCity !== undefined) {
        device.installationCity = parseOptionalString(payload.installationCity);
    }
    if (payload.installationStreet !== undefined) {
        device.installationStreet = parseOptionalString(payload.installationStreet);
    }
    if (payload.installationStreetNumber !== undefined) {
        device.installationStreetNumber = parseOptionalString(payload.installationStreetNumber);
    }
    if (payload.installationApartmentNumber !== undefined) {
        device.installationApartmentNumber = parseOptionalString(payload.installationApartmentNumber);
    }
    if (payload.installationPostalCode !== undefined) {
        device.installationPostalCode = parseOptionalString(payload.installationPostalCode);
    }
    if (payload.installationCountry !== undefined) {
        device.installationCountry = parseOptionalString(payload.installationCountry);
    }
    if (payload.locationDescription !== undefined) {
        device.locationDescription = parseOptionalString(payload.locationDescription);
    }
    await syncInstallationAddress(device, payload);
}
router.get("/", async (req, res) => {
    try {
        const { q, skip, limit } = req.query;
        const search = String(q ?? "").trim();
        const skipNum = Number.parseInt(String(skip ?? "0"), 10) || 0;
        const limitNum = Number.parseInt(String(limit ?? "20"), 10) || 20;
        const where = search
            ? [
                { hostname: ILike(`%${search}%`) },
                { ipAddress: ILike(`%${search}%`) },
                { macAddress: ILike(`%${search}%`) },
                { installationCity: ILike(`%${search}%`) },
                { installationStreet: ILike(`%${search}%`) },
            ]
            : {};
        const [items, total] = await deviceRepo.findAndCount({
            where,
            skip: skipNum,
            take: limitNum,
            relations: ["customer"],
            order: { hostname: "ASC" },
        });
        res.set("X-Total-Count", total.toString());
        res.json(await Promise.all(items.map((item) => serializeDevice(item))));
    }
    catch (error) {
        console.error("Error fetching customer devices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await deviceRepo.findOne({
            where: { id },
            relations: ["customer"],
        });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.json(await serializeDevice(device));
    }
    catch (error) {
        console.error("Error fetching customer device:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        if (!req.body || Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an object" });
        }
        const device = deviceRepo.create();
        await applyDevicePayload(device, req.body, true);
        await deviceRepo.save(device);
        const savedDevice = await deviceRepo.findOne({
            where: { id: device.id },
            relations: ["customer"],
        });
        res.status(201).json(await serializeDevice(savedDevice ?? device));
    }
    catch (error) {
        console.error("Error creating customer device:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create device" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await deviceRepo.findOneBy({ id });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        await applyDevicePayload(device, req.body ?? {});
        await deviceRepo.save(device);
        const savedDevice = await deviceRepo.findOne({
            where: { id: device.id },
            relations: ["customer"],
        });
        res.json(await serializeDevice(savedDevice ?? device));
    }
    catch (error) {
        console.error("Error updating customer device:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update device" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await deviceRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting customer device:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=customer_devices.js.map