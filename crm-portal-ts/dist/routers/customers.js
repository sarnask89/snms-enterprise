import { Router } from "express";
import { Brackets } from "typeorm";
import { AppDataSource } from "../database.js";
import { Customer, } from "../models/customer.js";
import { CustomerStatus, CustomerType, PaymentMethod } from "../models/common.js";
import { resolveTerytAddress, serializeTerytEntry, } from "../teryt_address_links.js";
export const router = Router();
const customerRepo = AppDataSource.getRepository(Customer);
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
function parseOptionalBoolean(value) {
    if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
    }
    if (typeof value === "boolean") {
        return value;
    }
    const normalized = String(value).trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) {
        return true;
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
        return false;
    }
    return undefined;
}
function parseCustomerType(value, fallback = CustomerType.individual) {
    const candidate = String(value ?? "").trim();
    return Object.values(CustomerType).includes(candidate) ? candidate : fallback;
}
function parsePaymentMethod(value) {
    const candidate = String(value ?? "").trim();
    return Object.values(PaymentMethod).includes(candidate) ? candidate : undefined;
}
function parseCustomerStatus(value, fallback = CustomerStatus.active) {
    const candidate = String(value ?? "").trim();
    return Object.values(CustomerStatus).includes(candidate) ? candidate : fallback;
}
function parseDateString(value) {
    return parseOptionalString(value);
}
async function buildCorrespondenceAddress(customer) {
    const hasTerytIds = [
        customer.correspondenceStateId,
        customer.correspondenceDistrictId,
        customer.correspondenceCommuneId,
        customer.correspondenceCityId,
        customer.correspondenceStreetId,
        customer.locationCityId,
        customer.locationStreetId,
    ].some((value) => value !== null && value !== undefined);
    if (!hasTerytIds) {
        return null;
    }
    return await resolveTerytAddress({
        stateId: customer.correspondenceStateId,
        districtId: customer.correspondenceDistrictId,
        communeId: customer.correspondenceCommuneId,
        cityId: customer.correspondenceCityId ?? customer.locationCityId,
        streetId: customer.correspondenceStreetId ?? customer.locationStreetId,
    });
}
async function serializeCustomer(customer, includeDetails = false) {
    const groups = customer.groups ?? [];
    const correspondenceAddress = await buildCorrespondenceAddress(customer);
    return {
        id: customer.id,
        customerCode: customer.customerCode,
        customerType: customer.customerType,
        displayName: customer.customerType === CustomerType.company
            ? (customer.companyName ?? customer.lastName)
            : `${customer.firstName} ${customer.lastName}`.trim(),
        firstName: customer.firstName,
        middleName: customer.middleName ?? null,
        lastName: customer.lastName,
        companyName: customer.companyName ?? null,
        email: customer.email ?? null,
        phone: customer.phone ?? null,
        secondaryPhone: customer.secondaryPhone ?? null,
        billingEmail: customer.billingEmail ?? null,
        pesel: customer.pesel ?? null,
        nip: customer.nip ?? null,
        regon: customer.regon ?? null,
        krs: customer.krs ?? null,
        idDocumentType: customer.idDocumentType ?? null,
        idDocumentNumber: customer.idDocumentNumber ?? null,
        birthDate: customer.birthDate ?? null,
        contactFirstName: customer.contactFirstName ?? null,
        contactLastName: customer.contactLastName ?? null,
        contactPhone: customer.contactPhone ?? null,
        contactEmail: customer.contactEmail ?? null,
        status: customer.status,
        creationDate: customer.creationDate,
        notes: customer.notes ?? null,
        portalLogin: customer.portalLogin ?? null,
        locationCityId: correspondenceAddress?.city?.id ?? customer.locationCityId ?? null,
        locationStreetId: correspondenceAddress?.street?.id ?? customer.locationStreetId ?? null,
        correspondenceStateId: correspondenceAddress?.state?.id ?? customer.correspondenceStateId ?? null,
        correspondenceDistrictId: correspondenceAddress?.district?.id ?? customer.correspondenceDistrictId ?? null,
        correspondenceCommuneId: correspondenceAddress?.commune?.id ?? customer.correspondenceCommuneId ?? null,
        correspondenceCityId: correspondenceAddress?.city?.id ?? customer.correspondenceCityId ?? customer.locationCityId ?? null,
        correspondenceStreetId: correspondenceAddress?.street?.id ?? customer.correspondenceStreetId ?? customer.locationStreetId ?? null,
        streetNumber: customer.streetNumber ?? null,
        apartmentNumber: customer.apartmentNumber ?? null,
        correspondenceState: correspondenceAddress?.state?.name ?? customer.correspondenceState ?? null,
        correspondenceCounty: correspondenceAddress?.district?.name ?? customer.correspondenceCounty ?? null,
        correspondenceCity: correspondenceAddress?.city?.name ?? customer.correspondenceCity ?? null,
        correspondenceStreet: correspondenceAddress?.street?.name ?? customer.correspondenceStreet ?? null,
        correspondenceStreetNumber: customer.correspondenceStreetNumber ?? null,
        correspondenceApartmentNumber: customer.correspondenceApartmentNumber ?? null,
        correspondencePostalCode: customer.correspondencePostalCode ?? null,
        correspondenceCountry: customer.correspondenceCountry ?? null,
        correspondenceStateEntry: serializeTerytEntry(correspondenceAddress?.state ?? null),
        correspondenceDistrictEntry: serializeTerytEntry(correspondenceAddress?.district ?? null),
        correspondenceCommuneEntry: serializeTerytEntry(correspondenceAddress?.commune ?? null),
        correspondenceCityEntry: serializeTerytEntry(correspondenceAddress?.city ?? null),
        correspondenceStreetEntry: serializeTerytEntry(correspondenceAddress?.street ?? null),
        contractNumber: customer.contractNumber ?? null,
        contractSignedAt: customer.contractSignedAt ?? null,
        serviceStartDate: customer.serviceStartDate ?? null,
        paymentMethod: customer.paymentMethod ?? null,
        paymentDueDay: customer.paymentDueDay ?? null,
        invoiceRecipientName: customer.invoiceRecipientName ?? null,
        invoiceRecipientTaxId: customer.invoiceRecipientTaxId ?? null,
        billingNotes: customer.billingNotes ?? null,
        marketingConsent: customer.marketingConsent,
        emailConsent: customer.emailConsent,
        smsConsent: customer.smsConsent,
        documentDeliveryConsent: customer.documentDeliveryConsent,
        isAutoGenerated: customer.isAutoGenerated,
        autoImportSource: customer.autoImportSource ?? null,
        groupCount: groups.length,
        groups: groups.map((group) => ({
            id: group.id,
            name: group.name,
        })),
        devices: includeDetails
            ? (customer.devices ?? []).map((device) => ({
                id: device.id,
                hostname: device.hostname,
                ipAddress: device.ipAddress ?? null,
                macAddress: device.macAddress ?? null,
                status: device.status,
                installationCity: device.installationCity ?? null,
                installationStreet: device.installationStreet ?? null,
                installationStreetNumber: device.installationStreetNumber ?? null,
            }))
            : undefined,
    };
}
function hasAnyTerytAddressInput(payload) {
    return [
        "locationCityId",
        "locationStreetId",
        "correspondenceStateId",
        "correspondenceDistrictId",
        "correspondenceCommuneId",
        "correspondenceCityId",
        "correspondenceStreetId",
    ].some((key) => Object.prototype.hasOwnProperty.call(payload, key));
}
async function syncCorrespondenceAddress(customer, payload) {
    if (!hasAnyTerytAddressInput(payload)) {
        return;
    }
    const resolved = await resolveTerytAddress({
        stateId: customer.correspondenceStateId,
        districtId: customer.correspondenceDistrictId,
        communeId: customer.correspondenceCommuneId,
        cityId: customer.correspondenceCityId ?? customer.locationCityId,
        streetId: customer.correspondenceStreetId ?? customer.locationStreetId,
    });
    applyResolvedCorrespondenceAddress(customer, resolved);
}
function applyResolvedCorrespondenceAddress(customer, resolved) {
    customer.correspondenceStateId = resolved.state?.id;
    customer.correspondenceDistrictId = resolved.district?.id;
    customer.correspondenceCommuneId = resolved.commune?.id;
    customer.correspondenceCityId = resolved.city?.id;
    customer.correspondenceStreetId = resolved.street?.id;
    customer.locationCityId = resolved.city?.id;
    customer.locationStreetId = resolved.street?.id;
    if (resolved.state) {
        customer.correspondenceState = resolved.state.name;
    }
    if (resolved.district) {
        customer.correspondenceCounty = resolved.district.name;
    }
    if (resolved.city) {
        customer.correspondenceCity = resolved.city.name;
    }
    if (resolved.street) {
        customer.correspondenceStreet = resolved.street.name;
    }
}
async function applyCustomerPayload(customer, payload, isCreate = false) {
    if (payload.customerCode !== undefined || isCreate) {
        const customerCode = parseOptionalString(payload.customerCode);
        if (!customerCode) {
            throw new Error("customerCode is required");
        }
        customer.customerCode = customerCode;
    }
    const customerType = payload.customerType !== undefined || isCreate
        ? parseCustomerType(payload.customerType, customer.customerType ?? CustomerType.individual)
        : customer.customerType;
    customer.customerType = customerType;
    if (payload.firstName !== undefined || (isCreate && customerType === CustomerType.individual)) {
        customer.firstName = parseOptionalString(payload.firstName) ?? "";
    }
    if (payload.middleName !== undefined) {
        customer.middleName = parseOptionalString(payload.middleName);
    }
    if (payload.lastName !== undefined || (isCreate && customerType === CustomerType.individual)) {
        customer.lastName = parseOptionalString(payload.lastName) ?? "";
    }
    if (payload.companyName !== undefined) {
        customer.companyName = parseOptionalString(payload.companyName);
    }
    if (payload.email !== undefined) {
        customer.email = parseOptionalString(payload.email);
    }
    if (payload.phone !== undefined) {
        customer.phone = parseOptionalString(payload.phone);
    }
    if (payload.secondaryPhone !== undefined) {
        customer.secondaryPhone = parseOptionalString(payload.secondaryPhone);
    }
    if (payload.billingEmail !== undefined) {
        customer.billingEmail = parseOptionalString(payload.billingEmail);
    }
    if (payload.pesel !== undefined) {
        customer.pesel = parseOptionalString(payload.pesel);
    }
    if (payload.nip !== undefined) {
        customer.nip = parseOptionalString(payload.nip);
    }
    if (payload.regon !== undefined) {
        customer.regon = parseOptionalString(payload.regon);
    }
    if (payload.krs !== undefined) {
        customer.krs = parseOptionalString(payload.krs);
    }
    if (payload.idDocumentType !== undefined) {
        customer.idDocumentType = parseOptionalString(payload.idDocumentType);
    }
    if (payload.idDocumentNumber !== undefined) {
        customer.idDocumentNumber = parseOptionalString(payload.idDocumentNumber);
    }
    if (payload.birthDate !== undefined) {
        customer.birthDate = parseDateString(payload.birthDate);
    }
    if (payload.contactFirstName !== undefined) {
        customer.contactFirstName = parseOptionalString(payload.contactFirstName);
    }
    if (payload.contactLastName !== undefined) {
        customer.contactLastName = parseOptionalString(payload.contactLastName);
    }
    if (payload.contactPhone !== undefined) {
        customer.contactPhone = parseOptionalString(payload.contactPhone);
    }
    if (payload.contactEmail !== undefined) {
        customer.contactEmail = parseOptionalString(payload.contactEmail);
    }
    if (payload.status !== undefined || isCreate) {
        customer.status = parseCustomerStatus(payload.status, customer.status ?? CustomerStatus.active);
    }
    if (payload.notes !== undefined) {
        customer.notes = parseOptionalString(payload.notes);
    }
    if (payload.locationCityId !== undefined) {
        customer.locationCityId = parseOptionalInteger(payload.locationCityId);
    }
    if (payload.locationStreetId !== undefined) {
        customer.locationStreetId = parseOptionalInteger(payload.locationStreetId);
    }
    if (payload.streetNumber !== undefined) {
        customer.streetNumber = parseOptionalString(payload.streetNumber);
    }
    if (payload.apartmentNumber !== undefined) {
        customer.apartmentNumber = parseOptionalString(payload.apartmentNumber);
    }
    if (payload.correspondenceState !== undefined) {
        customer.correspondenceState = parseOptionalString(payload.correspondenceState);
    }
    if (payload.correspondenceStateId !== undefined) {
        customer.correspondenceStateId = parseOptionalInteger(payload.correspondenceStateId);
    }
    if (payload.correspondenceCounty !== undefined) {
        customer.correspondenceCounty = parseOptionalString(payload.correspondenceCounty);
    }
    if (payload.correspondenceDistrictId !== undefined) {
        customer.correspondenceDistrictId = parseOptionalInteger(payload.correspondenceDistrictId);
    }
    if (payload.correspondenceCommuneId !== undefined) {
        customer.correspondenceCommuneId = parseOptionalInteger(payload.correspondenceCommuneId);
    }
    if (payload.correspondenceCity !== undefined) {
        customer.correspondenceCity = parseOptionalString(payload.correspondenceCity);
    }
    if (payload.correspondenceCityId !== undefined) {
        customer.correspondenceCityId = parseOptionalInteger(payload.correspondenceCityId);
    }
    if (payload.correspondenceStreet !== undefined) {
        customer.correspondenceStreet = parseOptionalString(payload.correspondenceStreet);
    }
    if (payload.correspondenceStreetId !== undefined) {
        customer.correspondenceStreetId = parseOptionalInteger(payload.correspondenceStreetId);
    }
    if (payload.correspondenceStreetNumber !== undefined) {
        customer.correspondenceStreetNumber = parseOptionalString(payload.correspondenceStreetNumber);
    }
    if (payload.correspondenceApartmentNumber !== undefined) {
        customer.correspondenceApartmentNumber = parseOptionalString(payload.correspondenceApartmentNumber);
    }
    if (payload.correspondencePostalCode !== undefined) {
        customer.correspondencePostalCode = parseOptionalString(payload.correspondencePostalCode);
    }
    if (payload.correspondenceCountry !== undefined) {
        customer.correspondenceCountry = parseOptionalString(payload.correspondenceCountry);
    }
    if (payload.contractNumber !== undefined) {
        customer.contractNumber = parseOptionalString(payload.contractNumber);
    }
    if (payload.contractSignedAt !== undefined) {
        customer.contractSignedAt = parseDateString(payload.contractSignedAt);
    }
    if (payload.serviceStartDate !== undefined) {
        customer.serviceStartDate = parseDateString(payload.serviceStartDate);
    }
    if (payload.paymentMethod !== undefined) {
        customer.paymentMethod = parsePaymentMethod(payload.paymentMethod);
    }
    if (payload.paymentDueDay !== undefined) {
        customer.paymentDueDay = parseOptionalInteger(payload.paymentDueDay);
    }
    if (payload.invoiceRecipientName !== undefined) {
        customer.invoiceRecipientName = parseOptionalString(payload.invoiceRecipientName);
    }
    if (payload.invoiceRecipientTaxId !== undefined) {
        customer.invoiceRecipientTaxId = parseOptionalString(payload.invoiceRecipientTaxId);
    }
    if (payload.billingNotes !== undefined) {
        customer.billingNotes = parseOptionalString(payload.billingNotes);
    }
    if (payload.marketingConsent !== undefined) {
        customer.marketingConsent = parseOptionalBoolean(payload.marketingConsent) ?? false;
    }
    if (payload.emailConsent !== undefined) {
        customer.emailConsent = parseOptionalBoolean(payload.emailConsent) ?? false;
    }
    if (payload.smsConsent !== undefined) {
        customer.smsConsent = parseOptionalBoolean(payload.smsConsent) ?? false;
    }
    if (payload.documentDeliveryConsent !== undefined) {
        customer.documentDeliveryConsent = parseOptionalBoolean(payload.documentDeliveryConsent) ?? false;
    }
    if (payload.isAutoGenerated !== undefined) {
        customer.isAutoGenerated = parseOptionalBoolean(payload.isAutoGenerated) ?? false;
    }
    if (payload.autoImportSource !== undefined) {
        customer.autoImportSource = parseOptionalString(payload.autoImportSource);
    }
    await syncCorrespondenceAddress(customer, payload);
    if (customer.customerType === CustomerType.individual) {
        if (!customer.firstName.trim() || !customer.lastName.trim()) {
            throw new Error("Individual customer requires firstName and lastName");
        }
        customer.companyName = parseOptionalString(customer.companyName);
    }
    else {
        const companyName = parseOptionalString(customer.companyName);
        if (!companyName) {
            throw new Error("Company customer requires companyName");
        }
        customer.companyName = companyName;
        customer.firstName = customer.firstName.trim();
        customer.lastName = customer.lastName.trim() || companyName;
    }
}
router.get("/", async (req, res) => {
    try {
        const { q, status, customerType, autoGenerated, skip, limit } = req.query;
        const search = String(q ?? "").trim();
        const statusValue = String(status ?? "").trim();
        const customerTypeValue = String(customerType ?? "").trim();
        const autoGeneratedValue = parseOptionalBoolean(autoGenerated);
        const skipNum = Number.parseInt(String(skip ?? "0"), 10) || 0;
        const limitNum = Number.parseInt(String(limit ?? "20"), 10) || 20;
        const qb = customerRepo
            .createQueryBuilder("customer")
            .leftJoinAndSelect("customer.groups", "group")
            .orderBy("customer.lastName", "ASC")
            .addOrderBy("customer.firstName", "ASC")
            .skip(skipNum)
            .take(limitNum);
        if (search) {
            qb.andWhere(new Brackets((subQuery) => {
                subQuery
                    .where("customer.first_name LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.last_name LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.company_name LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.customer_code LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.email LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.billing_email LIKE :search", { search: `%${search}%` })
                    .orWhere("customer.phone LIKE :search", { search: `%${search}%` });
            }));
        }
        if (statusValue) {
            qb.andWhere("customer.status = :status", { status: statusValue });
        }
        if (customerTypeValue && Object.values(CustomerType).includes(customerTypeValue)) {
            qb.andWhere("customer.customer_type = :customerType", { customerType: customerTypeValue });
        }
        if (autoGeneratedValue !== undefined) {
            qb.andWhere("customer.is_auto_generated = :autoGenerated", { autoGenerated: autoGeneratedValue ? 1 : 0 });
        }
        const [items, total] = await qb.getManyAndCount();
        res.set("X-Total-Count", total.toString());
        res.json(await Promise.all(items.map((customer) => serializeCustomer(customer))));
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const customer = await customerRepo.findOne({
            where: { id },
            relations: {
                devices: true,
                notices: true,
                groups: true,
            },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(await serializeCustomer(customer, true));
    }
    catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/", async (req, res) => {
    try {
        const customer = customerRepo.create();
        await applyCustomerPayload(customer, req.body ?? {}, true);
        await customerRepo.save(customer);
        const savedCustomer = await customerRepo.findOne({
            where: { id: customer.id },
            relations: { groups: true },
        });
        res.status(201).json(await serializeCustomer(savedCustomer ?? customer));
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create customer" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const customer = await customerRepo.findOne({
            where: { id },
            relations: { groups: true, devices: true },
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        await applyCustomerPayload(customer, req.body ?? {});
        await customerRepo.save(customer);
        const savedCustomer = await customerRepo.findOne({
            where: { id: customer.id },
            relations: { groups: true, devices: true },
        });
        res.json(await serializeCustomer(savedCustomer ?? customer, true));
    }
    catch (error) {
        console.error("Error updating customer:", error);
        res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update customer" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const result = await customerRepo.delete(id);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=customers.js.map