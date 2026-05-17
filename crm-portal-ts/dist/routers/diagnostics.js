import { Router } from "express";
import { recordAudit } from "../audit.js";
import { AppDataSource } from "../database.js";
import { CustomerDevice, NetworkDeviceAccessProfile } from "../models/network.js";
import { runRemoteDiagnosticsForDevice, syncMikrotikLease, } from "../services/network_discovery_live.js";
export const router = Router();
const customerDeviceRepo = AppDataSource.getRepository(CustomerDevice);
const accessProfileRepo = AppDataSource.getRepository(NetworkDeviceAccessProfile);
function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
}
export function buildDiagnosticsSummary(device) {
    const checks = [
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
async function loadCustomerDevice(id) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        if (!device.netDeviceId) {
            return res.json({
                customerDeviceId: device.id,
                synced: false,
                reason: "net_device_not_linked",
                diagnostics: buildDiagnosticsSummary(device),
            });
        }
        const accessProfile = await accessProfileRepo.findOneBy({ netDeviceId: device.netDeviceId });
        if (!accessProfile) {
            return res.json({
                customerDeviceId: device.id,
                synced: false,
                reason: "external_router_not_configured",
                diagnostics: buildDiagnosticsSummary(device),
            });
        }
        const syncResult = await syncMikrotikLease(device, accessProfile);
        if (syncResult.synced) {
            await customerDeviceRepo.save(device);
        }
        const diagnostics = buildDiagnosticsSummary(device);
        await recordAudit({
            action: "diagnostics_sync_lease",
            resourceType: "customer_device",
            resourceId: device.id,
            details: `${accessProfile.driver} synced=${syncResult.synced} reason=${syncResult.reason ?? "updated"}`,
            request: req,
        });
        res.json({
            customerDeviceId: device.id,
            synced: syncResult.synced,
            reason: syncResult.reason,
            updates: syncResult.updates,
            diagnostics,
        });
    }
    catch (error) {
        console.error("Error preparing lease sync:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/remote-test/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const device = await loadCustomerDevice(id);
        if (!device) {
            return res.status(404).json({ message: "Customer device not found" });
        }
        if (!device.netDeviceId) {
            return res.status(400).json({ message: "Customer device is not linked to a network device" });
        }
        const accessProfile = await accessProfileRepo.findOneBy({ netDeviceId: device.netDeviceId });
        if (!accessProfile) {
            return res.status(400).json({ message: "Discovery access profile is not configured for linked network device" });
        }
        const localDiagnostics = buildDiagnosticsSummary(device);
        const remoteDiagnostics = await runRemoteDiagnosticsForDevice(device, accessProfile);
        await recordAudit({
            action: "diagnostics_remote_test",
            resourceType: "customer_device",
            resourceId: device.id,
            details: `${accessProfile.driver} ok=${remoteDiagnostics.ok}`,
            request: req,
        });
        res.json({
            customerDeviceId: device.id,
            localDiagnostics,
            remoteDiagnostics,
        });
    }
    catch (error) {
        console.error("Error running remote diagnostic test:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//# sourceMappingURL=diagnostics.js.map