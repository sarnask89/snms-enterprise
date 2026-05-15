import { Router } from "express";
import { AppDataSource } from "../database.js";
import { CustomerDevice } from "../models/network.js";

export const router = Router();

const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);

export type DiagnosticCheck = {
    key: string;
    label: string;
    ok: boolean;
    severity: "blocking" | "warning";
    details: string | null;
};

export type DiagnosticsSummary = {
    customerDeviceId: number;
    ready: boolean;
    blockingChecks: number;
    checks: DiagnosticCheck[];
};

function hasText(value: unknown) {
    return typeof value === "string" && value.trim().length > 0;
}

export function buildDiagnosticsSummary(device: CustomerDevice): DiagnosticsSummary {
    const checks: DiagnosticCheck[] = [
        {
            key: "customer_link",
            label: "Customer is linked",
            ok: Number.isInteger(device.customerId) && device.customerId > 0,
            severity: "blocking",
            details: device.customerId ? `customer_id=${device.customerId}` : null,
        },
        {
            key: "device_ip",
            label: "Customer device has IP address",
            ok: hasText(device.ipAddress),
            severity: "blocking",
            details: device.ipAddress ?? null,
        },
        {
            key: "device_mac",
            label: "Customer device has MAC address",
            ok: hasText(device.macAddress),
            severity: "warning",
            details: device.macAddress ?? null,
        },
        {
            key: "net_device_link",
            label: "Access/network device is linked",
            ok: !!device.netDeviceId,
            severity: "blocking",
            details: device.netDeviceId ? `net_device_id=${device.netDeviceId}` : null,
        },
        {
            key: "net_device_management_ip",
            label: "Access/network device has management IP",
            ok: hasText(device.netDevice?.managementIp),
            severity: "blocking",
            details: device.netDevice?.managementIp ?? null,
        },
        {
            key: "ip_network_link",
            label: "IP network is linked",
            ok: !!device.ipNetworkId,
            severity: "blocking",
            details: device.ipNetworkId ? `ip_network_id=${device.ipNetworkId}` : null,
        },
    ];

    const blockingChecks = checks.filter((check) => check.severity === "blocking" && !check.ok).length;

    return {
        customerDeviceId: device.id,
        ready: blockingChecks === 0,
        blockingChecks,
        checks,
    };
}

async function loadCustomerDevice(id: number) {
    return customerDeviceRepo.findOne({
        where: { id },
        relations: {
            customer: true,
            netDevice: true,
            ipNetwork: true,
        },
    });
}

router.get("/devices/:id/readiness", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await loadCustomerDevice(id);

        if (!device) {
            return res.status(404).json({ message: "Customer device not found" });
        }

        res.json(buildDiagnosticsSummary(device));
    } catch (error) {
        console.error("Error checking diagnostic readiness:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/check/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await loadCustomerDevice(id);

        if (!device) {
            return res.status(404).json({ message: "Customer device not found" });
        }

        res.json(buildDiagnosticsSummary(device));
    } catch (error) {
        console.error("Error running diagnostic check:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/sync-lease/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await loadCustomerDevice(id);

        if (!device) {
            return res.status(404).json({ message: "Customer device not found" });
        }

        const diagnostics = buildDiagnosticsSummary(device);
        res.json({
            customerDeviceId: device.id,
            synced: false,
            reason: "external_router_not_configured",
            diagnostics,
        });
    } catch (error) {
        console.error("Error preparing lease sync:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
