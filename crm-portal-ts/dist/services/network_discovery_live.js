import { decryptDeviceSecret } from "../device_secrets.js";
import { runDasanDiscovery } from "./dasan_ssh.js";
import { runMikrotikDiscovery } from "./mikrotik_api.js";
import { parseMikrotikComment } from "./mikrotik_parser.js";
export const DISCOVERY_DRIVER_MIKROTIK = "mikrotik_api";
export const DISCOVERY_DRIVER_DASAN = "dasan_ssh";
export const DASAN_DEFAULT_SSH_PORT = 22502;
function normalizeText(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed ? trimmed : null;
}
function normalizeMac(value) {
    const normalized = normalizeText(value);
    return normalized ? normalized.toLowerCase() : null;
}
function parseMetadata(profile) {
    if (!profile.metadataJson) {
        return {};
    }
    try {
        const parsed = JSON.parse(profile.metadataJson);
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
export function getProfileSecrets(profile) {
    return {
        password: decryptDeviceSecret(profile.passwordCiphertext),
        enablePassword: profile.enablePasswordCiphertext
            ? decryptDeviceSecret(profile.enablePasswordCiphertext)
            : "",
    };
}
export async function runDiscoveryScanForDevice(profile, netDevice) {
    const secrets = getProfileSecrets(profile);
    const metadata = parseMetadata(profile);
    if (profile.driver === DISCOVERY_DRIVER_MIKROTIK) {
        const result = await runMikrotikDiscovery({
            host: profile.host,
            port: profile.port ?? 8728,
            username: profile.username,
            password: secrets.password,
            useTls: metadata.useTls === true,
        });
        const records = [
            ...result.leases.map((lease, index) => ({
                recordKind: "mikrotik_lease",
                externalKey: `${netDevice.id}:lease:${lease.address ?? index}`,
                hostname: lease.hostName ?? lease.macAddress ?? lease.address,
                ipAddress: lease.address,
                macAddress: lease.macAddress,
                recordStatus: lease.status,
                payloadJson: JSON.stringify({
                    ...lease,
                    parsedComment: parseMikrotikComment(lease.comment),
                }),
            })),
            ...result.networks
                .filter((network) => network.address)
                .map((network, index) => ({
                recordKind: "mikrotik_network",
                externalKey: `${netDevice.id}:network:${network.address ?? index}`,
                hostname: network.gateway,
                ipAddress: network.address,
                recordStatus: "active",
                payloadJson: JSON.stringify(network),
            })),
        ];
        return {
            driver: profile.driver,
            summary: JSON.stringify({
                leaseCount: result.leases.length,
                arpCount: result.arp.length,
                networkCount: result.networks.length,
                bridgeHostCount: result.bridgeHosts.length,
            }),
            records,
        };
    }
    if (profile.driver === DISCOVERY_DRIVER_DASAN) {
        const result = await runDasanDiscovery({
            host: profile.host,
            port: profile.port ?? DASAN_DEFAULT_SSH_PORT,
            username: profile.username,
            password: secrets.password,
            enablePassword: secrets.enablePassword || secrets.password,
        });
        const records = [
            ...result.onuRows.map((onu) => ({
                recordKind: "dasan_onu",
                externalKey: `${netDevice.id}:onu:${onu.olt}:${onu.onu}`,
                hostname: onu.serialNumber,
                serialNumber: onu.serialNumber,
                recordStatus: onu.status,
                profileName: onu.profileName,
                failReason: onu.failReason,
                remoteOlt: onu.olt,
                remoteOnu: onu.onu,
                distanceMeters: onu.distanceMeters,
                rxPowerDbm: onu.rxPowerDbm,
                payloadJson: JSON.stringify(onu),
            })),
            ...result.macRows.map((row, index) => ({
                recordKind: "dasan_mac",
                externalKey: `${netDevice.id}:mac:${row.portName}:${row.macAddress}:${index}`,
                macAddress: row.macAddress,
                recordStatus: row.status,
                remotePort: row.portName,
                remoteVlanId: row.vlanId,
                payloadJson: JSON.stringify(row),
            })),
        ];
        return {
            driver: profile.driver,
            summary: JSON.stringify({
                onuCount: result.onuRows.length,
                macCount: result.macRows.length,
            }),
            records,
        };
    }
    throw new Error(`Unsupported discovery driver: ${profile.driver}`);
}
export async function testDiscoveryAccessProfile(profile) {
    const secrets = getProfileSecrets(profile);
    const metadata = parseMetadata(profile);
    if (profile.driver === DISCOVERY_DRIVER_MIKROTIK) {
        const result = await runMikrotikDiscovery({
            host: profile.host,
            port: profile.port ?? 8728,
            username: profile.username,
            password: secrets.password,
            useTls: metadata.useTls === true,
        });
        return {
            driver: profile.driver,
            ok: true,
            summary: {
                leaseCount: result.leases.length,
                arpCount: result.arp.length,
                networkCount: result.networks.length,
                bridgeHostCount: result.bridgeHosts.length,
            },
        };
    }
    if (profile.driver === DISCOVERY_DRIVER_DASAN) {
        const result = await runDasanDiscovery({
            host: profile.host,
            port: profile.port ?? DASAN_DEFAULT_SSH_PORT,
            username: profile.username,
            password: secrets.password,
            enablePassword: secrets.enablePassword || secrets.password,
        });
        return {
            driver: profile.driver,
            ok: true,
            summary: {
                onuCount: result.onuRows.length,
                macCount: result.macRows.length,
                activeOnuCount: result.onuRows.filter((row) => row.status === "active").length,
            },
        };
    }
    throw new Error(`Unsupported discovery driver: ${profile.driver}`);
}
export function serializeDiscoveryRecord(record) {
    return {
        id: record.id,
        sessionId: record.sessionId,
        netDeviceId: record.netDeviceId,
        recordKind: record.recordKind,
        externalKey: record.externalKey ?? null,
        hostname: record.hostname ?? null,
        ipAddress: record.ipAddress ?? null,
        macAddress: record.macAddress ?? null,
        serialNumber: record.serialNumber ?? null,
        recordStatus: record.recordStatus ?? null,
        profileName: record.profileName ?? null,
        failReason: record.failReason ?? null,
        remotePort: record.remotePort ?? null,
        remoteVlanId: record.remoteVlanId ?? null,
        remoteOlt: record.remoteOlt ?? null,
        remoteOnu: record.remoteOnu ?? null,
        distanceMeters: record.distanceMeters ?? null,
        rxPowerDbm: record.rxPowerDbm ?? null,
        createdAt: record.createdAt,
    };
}
function buildCheck(key, label, ok, severity, details) {
    return { key, label, ok, severity, details };
}
function findMatchingLease(customerDevice, leases) {
    const deviceIp = normalizeText(customerDevice.ipAddress);
    const deviceMac = normalizeMac(customerDevice.macAddress);
    const deviceHostname = normalizeText(customerDevice.hostname);
    return leases.find((lease) => {
        const leaseIp = normalizeText(lease.address);
        const leaseMac = normalizeMac(lease.macAddress);
        const leaseHostname = normalizeText(lease.hostName);
        return ((!!deviceIp && leaseIp === deviceIp) ||
            (!!deviceMac && leaseMac === deviceMac) ||
            (!!deviceHostname && leaseHostname === deviceHostname));
    }) ?? null;
}
function buildMikrotikRemoteResult(customerDevice, discovery) {
    const matchedLease = findMatchingLease(customerDevice, discovery.leases);
    const matchedArp = discovery.arp.find((row) => {
        const ipMatches = normalizeText(row.address) && normalizeText(row.address) === normalizeText(customerDevice.ipAddress);
        const macMatches = normalizeMac(row.macAddress) && normalizeMac(row.macAddress) === normalizeMac(customerDevice.macAddress);
        return ipMatches || macMatches;
    }) ?? null;
    const matchedBridgeHost = discovery.bridgeHosts.find((row) => {
        return normalizeMac(row.macAddress) && normalizeMac(row.macAddress) === normalizeMac(customerDevice.macAddress);
    }) ?? null;
    const checks = [
        buildCheck("mikrotik_lease_exists", "Lease exists on Mikrotik", !!matchedLease, "blocking", matchedLease?.address ?? null),
        buildCheck("mikrotik_lease_mac_match", "Lease MAC matches customer device", !!matchedLease && (!normalizeMac(customerDevice.macAddress) ||
            normalizeMac(customerDevice.macAddress) === normalizeMac(matchedLease.macAddress)), "warning", matchedLease?.macAddress ?? null),
        buildCheck("mikrotik_l2_presence", "ARP or bridge host entry exists on Mikrotik", !!matchedArp || !!matchedBridgeHost, "warning", matchedArp?.interfaceName ?? matchedBridgeHost?.onInterface ?? null),
    ];
    return {
        driver: DISCOVERY_DRIVER_MIKROTIK,
        ok: checks.filter((check) => check.severity === "blocking").every((check) => check.ok),
        checks,
        snapshot: {
            lease: matchedLease,
            arp: matchedArp,
            bridgeHost: matchedBridgeHost,
        },
    };
}
function buildDasanRemoteResult(customerDevice, discovery) {
    const normalizedSerial = normalizeText(customerDevice.remoteSerialNumber);
    const matchedOnu = discovery.onuRows.find((row) => {
        if (normalizedSerial && normalizeText(row.serialNumber) === normalizedSerial) {
            return true;
        }
        return row.olt === customerDevice.remoteOlt && row.onu === customerDevice.remoteOnu;
    }) ?? null;
    const matchedMac = discovery.macRows.find((row) => normalizeMac(row.macAddress) === normalizeMac(customerDevice.macAddress)) ?? null;
    const checks = [
        buildCheck("dasan_onu_exists", "ONU exists on Dasan", !!matchedOnu, "blocking", matchedOnu ? `OLT ${matchedOnu.olt} ONU ${matchedOnu.onu}` : null),
        buildCheck("dasan_onu_active", "ONU is active", matchedOnu?.status === "active", "blocking", matchedOnu?.status ?? null),
        buildCheck("dasan_serial_match", "Serial matches customer device", !normalizedSerial || normalizeText(matchedOnu?.serialNumber) === normalizedSerial, "blocking", matchedOnu?.serialNumber ?? null),
        buildCheck("dasan_rx_power", "RX power is available", matchedOnu?.rxPowerDbm !== null && matchedOnu?.rxPowerDbm !== undefined, "warning", matchedOnu?.rxPowerDbm !== null && matchedOnu?.rxPowerDbm !== undefined
            ? `${matchedOnu.rxPowerDbm} dBm`
            : null),
        buildCheck("dasan_mac_presence", "Customer MAC is visible on Dasan", !normalizeMac(customerDevice.macAddress) || !!matchedMac, "warning", matchedMac?.portName ?? null),
    ];
    return {
        driver: DISCOVERY_DRIVER_DASAN,
        ok: checks.filter((check) => check.severity === "blocking").every((check) => check.ok),
        checks,
        snapshot: {
            onu: matchedOnu,
            mac: matchedMac,
        },
    };
}
export async function runRemoteDiagnosticsForDevice(customerDevice, profile) {
    const secrets = getProfileSecrets(profile);
    const metadata = parseMetadata(profile);
    if (profile.driver === DISCOVERY_DRIVER_MIKROTIK) {
        const discovery = await runMikrotikDiscovery({
            host: profile.host,
            port: profile.port ?? 8728,
            username: profile.username,
            password: secrets.password,
            useTls: metadata.useTls === true,
        });
        return buildMikrotikRemoteResult(customerDevice, discovery);
    }
    if (profile.driver === DISCOVERY_DRIVER_DASAN) {
        const discovery = await runDasanDiscovery({
            host: profile.host,
            port: profile.port ?? DASAN_DEFAULT_SSH_PORT,
            username: profile.username,
            password: secrets.password,
            enablePassword: secrets.enablePassword || secrets.password,
        });
        return buildDasanRemoteResult(customerDevice, discovery);
    }
    throw new Error(`Unsupported discovery driver: ${profile.driver}`);
}
export async function syncMikrotikLease(customerDevice, profile) {
    if (profile.driver !== DISCOVERY_DRIVER_MIKROTIK) {
        return {
            synced: false,
            reason: "unsupported_driver",
            updates: {},
        };
    }
    const secrets = getProfileSecrets(profile);
    const metadata = parseMetadata(profile);
    const discovery = await runMikrotikDiscovery({
        host: profile.host,
        port: profile.port ?? 8728,
        username: profile.username,
        password: secrets.password,
        useTls: metadata.useTls === true,
    });
    const matchedLease = findMatchingLease(customerDevice, discovery.leases);
    if (!matchedLease) {
        return {
            synced: false,
            reason: "lease_not_found",
            updates: {},
        };
    }
    const updates = {};
    if (matchedLease.address && matchedLease.address !== customerDevice.ipAddress) {
        customerDevice.ipAddress = matchedLease.address;
        updates.ipAddress = matchedLease.address;
    }
    if (matchedLease.macAddress && matchedLease.macAddress !== normalizeMac(customerDevice.macAddress)) {
        customerDevice.macAddress = matchedLease.macAddress;
        updates.macAddress = matchedLease.macAddress;
    }
    if (matchedLease.hostName && matchedLease.hostName !== customerDevice.hostname) {
        customerDevice.hostname = matchedLease.hostName;
        updates.hostname = matchedLease.hostName;
    }
    return {
        synced: Object.keys(updates).length > 0,
        reason: Object.keys(updates).length > 0 ? null : "no_changes",
        updates,
    };
}
//# sourceMappingURL=network_discovery_live.js.map