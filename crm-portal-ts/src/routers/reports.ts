import { Router } from "express";
import { AppDataSource } from "../database.js";
import { CustomerDevice, NetNode } from "../models/network.js";
import { LocationStreet } from "../models/location.js";

export const router = Router();

const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);
const netNodeRepo = AppDataSource.getRepository(NetNode);
const locationStreetRepo = AppDataSource.getRepository(LocationStreet);

function escapeCsv(value: unknown) {
    const text = String(value ?? "");
    return `"${text.replaceAll("\"", "\"\"")}"`;
}

router.get("/pit-uke/summary", async (_req, res) => {
    try {
        const customerDeviceCount = await customerDeviceRepo.count();
        res.json({ customerDeviceCount });
    } catch (error) {
        console.error("Error building PIT UKE summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/pit-uke/export", async (_req, res) => {
    try {
        const devices = await customerDeviceRepo.find({
            relations: {
                customer: true,
            },
            order: { id: "ASC" },
        });

        const streetIds = devices
            .map((device) => device.customer?.locationStreetId)
            .filter((id): id is number => Number.isInteger(id));
        const streets = streetIds.length > 0
            ? await locationStreetRepo.findByIds(streetIds)
            : [];
        const streetMap = new Map(streets.map((street) => [street.id, street.name]));

        const rows = [
            ["ID", "IP", "MAC", "Customer", "Street", "Number"],
            ...devices.map((device) => {
                const customer = device.customer;
                const customerName = customer
                    ? `${customer.firstName} ${customer.lastName}`.trim()
                    : "";
                const streetName = customer?.locationStreetId
                    ? streetMap.get(customer.locationStreetId) ?? ""
                    : "";

                return [
                    device.id,
                    device.ipAddress ?? "",
                    device.macAddress ?? "",
                    customerName,
                    streetName,
                    customer?.streetNumber ?? "",
                ];
            }),
        ];

        const csv = `${rows
            .map((row) => row.map((value) => escapeCsv(value)).join(";"))
            .join("\r\n")}\r\n`;

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=\"pit_uke_export.csv\"");
        res.send(`\uFEFF${csv}`);
    } catch (error) {
        console.error("Error exporting PIT UKE CSV:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/passport/map", async (_req, res) => {
    try {
        const nodes = await netNodeRepo.find({ order: { name: "ASC" } });
        const nodesData = nodes
            .filter((node) => Number.isFinite(node.latitude) && Number.isFinite(node.longitude))
            .map((node) => ({
                id: node.id,
                name: node.name,
                lat: node.latitude,
                lon: node.longitude,
                type: "net_node",
                address: node.locationDetail ?? "",
            }));

        res.json(nodesData);
    } catch (error) {
        console.error("Error building passport map payload:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
