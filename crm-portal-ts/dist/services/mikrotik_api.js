import net from "node:net";
import tls from "node:tls";
function normalizeText(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed ? trimmed : null;
}
function normalizeMacAddress(value) {
    const trimmed = normalizeText(value);
    return trimmed ? trimmed.toLowerCase() : null;
}
function parseBool(value) {
    return String(value ?? "").trim().toLowerCase() === "true";
}
function createFixtureResponse() {
    return {
        leases: [
            {
                address: "10.0.222.150",
                macAddress: "aa:bb:cc:dd:ee:42",
                hostName: "client-lease-1",
                status: "bound",
                server: "dhcp-core",
                comment: "123 Kowalski m12 mic 10",
                rateLimit: "100M/20M",
                dynamic: true,
            },
            {
                address: "10.0.222.151",
                macAddress: "aa:bb:cc:dd:ee:43",
                hostName: "client-lease-2",
                status: "bound",
                server: "dhcp-core",
                comment: null,
                rateLimit: "100M/20M",
                dynamic: true,
            },
        ],
        arp: [
            {
                address: "10.0.222.150",
                macAddress: "aa:bb:cc:dd:ee:42",
                interfaceName: "bridge-clients",
                status: "reachable",
            },
            {
                address: "10.0.222.151",
                macAddress: "aa:bb:cc:dd:ee:43",
                interfaceName: "bridge-clients",
                status: "reachable",
            },
        ],
        networks: [
            {
                address: "10.0.222.0/24",
                gateway: "10.0.222.1",
                comment: "Clients",
            },
            {
                address: "10.0.100.0/24",
                gateway: "10.0.100.1",
                comment: "Backbone",
            },
        ],
        bridgeHosts: [
            {
                macAddress: "aa:bb:cc:dd:ee:42",
                onInterface: "bridge-clients",
                bridge: "bridge",
            },
        ],
    };
}
function encodeLength(length) {
    if (length < 0x80) {
        return Buffer.from([length]);
    }
    if (length < 0x4000) {
        return Buffer.from([
            ((length >> 8) & 0x3f) | 0x80,
            length & 0xff,
        ]);
    }
    if (length < 0x20_0000) {
        return Buffer.from([
            ((length >> 16) & 0x1f) | 0xc0,
            (length >> 8) & 0xff,
            length & 0xff,
        ]);
    }
    if (length < 0x1000_0000) {
        return Buffer.from([
            ((length >> 24) & 0x0f) | 0xe0,
            (length >> 16) & 0xff,
            (length >> 8) & 0xff,
            length & 0xff,
        ]);
    }
    return Buffer.from([
        0xf0,
        (length >> 24) & 0xff,
        (length >> 16) & 0xff,
        (length >> 8) & 0xff,
        length & 0xff,
    ]);
}
function decodeLength(buffer, offset) {
    const first = buffer[offset];
    if (first === undefined) {
        return null;
    }
    if ((first & 0x80) === 0x00) {
        return { length: first, bytes: 1 };
    }
    if ((first & 0xc0) === 0x80) {
        const second = buffer[offset + 1];
        if (second === undefined) {
            return null;
        }
        return {
            length: ((first & ~0xc0) << 8) | second,
            bytes: 2,
        };
    }
    if ((first & 0xe0) === 0xc0) {
        const second = buffer[offset + 1];
        const third = buffer[offset + 2];
        if (second === undefined || third === undefined) {
            return null;
        }
        return {
            length: ((first & ~0xe0) << 16) | (second << 8) | third,
            bytes: 3,
        };
    }
    if ((first & 0xf0) === 0xe0) {
        const second = buffer[offset + 1];
        const third = buffer[offset + 2];
        const fourth = buffer[offset + 3];
        if (second === undefined || third === undefined || fourth === undefined) {
            return null;
        }
        return {
            length: ((first & ~0xf0) << 24) | (second << 16) | (third << 8) | fourth,
            bytes: 4,
        };
    }
    const second = buffer[offset + 1];
    const third = buffer[offset + 2];
    const fourth = buffer[offset + 3];
    const fifth = buffer[offset + 4];
    if (second === undefined || third === undefined || fourth === undefined || fifth === undefined) {
        return null;
    }
    return {
        length: (second << 24) | (third << 16) | (fourth << 8) | fifth,
        bytes: 5,
    };
}
class RouterOsClient {
    profile;
    socket = null;
    readBuffer = Buffer.alloc(0);
    pendingResolvers = [];
    pendingRejectors = [];
    constructor(profile) {
        this.profile = profile;
    }
    async connect() {
        const socket = this.profile.useTls
            ? tls.connect({
                host: this.profile.host,
                port: this.profile.port,
                rejectUnauthorized: false,
            })
            : net.createConnection({
                host: this.profile.host,
                port: this.profile.port,
            });
        this.socket = socket;
        socket.setTimeout(this.profile.timeoutMs ?? 10_000);
        socket.on("data", (chunk) => {
            this.readBuffer = Buffer.concat([this.readBuffer, chunk]);
            this.flushPendingSentences();
        });
        socket.on("timeout", () => {
            socket.destroy(new Error("Mikrotik API connection timeout"));
        });
        socket.on("error", (error) => {
            while (this.pendingRejectors.length > 0) {
                const reject = this.pendingRejectors.shift();
                reject?.(error instanceof Error ? error : new Error(String(error)));
            }
        });
        await new Promise((resolve, reject) => {
            socket.once("connect", () => resolve());
            socket.once("error", reject);
        });
    }
    async close() {
        await new Promise((resolve) => {
            if (!this.socket) {
                resolve();
                return;
            }
            this.socket.end(() => resolve());
        });
    }
    tryParseSentence() {
        let offset = 0;
        const words = [];
        while (offset < this.readBuffer.length) {
            const decoded = decodeLength(this.readBuffer, offset);
            if (!decoded) {
                return null;
            }
            const start = offset + decoded.bytes;
            const end = start + decoded.length;
            if (end > this.readBuffer.length) {
                return null;
            }
            offset = end;
            if (decoded.length === 0) {
                return {
                    words,
                    consumedBytes: offset,
                };
            }
            words.push(this.readBuffer.subarray(start, end).toString("utf8"));
        }
        return null;
    }
    flushPendingSentences() {
        while (this.pendingResolvers.length > 0) {
            const parsed = this.tryParseSentence();
            if (!parsed) {
                return;
            }
            this.readBuffer = this.readBuffer.subarray(parsed.consumedBytes);
            const resolve = this.pendingResolvers.shift();
            this.pendingRejectors.shift();
            resolve?.(parsed.words);
        }
    }
    async readSentence() {
        const parsed = this.tryParseSentence();
        if (parsed) {
            this.readBuffer = this.readBuffer.subarray(parsed.consumedBytes);
            return parsed.words;
        }
        return await new Promise((resolve, reject) => {
            this.pendingResolvers.push(resolve);
            this.pendingRejectors.push(reject);
        });
    }
    async writeSentence(words) {
        if (!this.socket) {
            throw new Error("Mikrotik API socket is not connected");
        }
        const buffers = words.flatMap((word) => {
            const payload = Buffer.from(word, "utf8");
            return [encodeLength(payload.length), payload];
        });
        buffers.push(Buffer.from([0]));
        await new Promise((resolve, reject) => {
            this.socket?.write(Buffer.concat(buffers), (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    async login() {
        await this.writeSentence([
            "/login",
            `=name=${this.profile.username}`,
            `=password=${this.profile.password}`,
        ]);
        while (true) {
            const sentence = await this.readSentence();
            const kind = sentence[0] ?? "";
            if (kind === "!done") {
                return;
            }
            if (kind === "!trap") {
                throw new Error(`Mikrotik login failed: ${sentence.join(" ")}`);
            }
        }
    }
    async command(pathName) {
        await this.writeSentence([pathName]);
        const records = [];
        while (true) {
            const sentence = await this.readSentence();
            const kind = sentence[0] ?? "";
            if (kind === "!trap") {
                throw new Error(`Mikrotik command failed for ${pathName}: ${sentence.join(" ")}`);
            }
            if (kind === "!done") {
                return records;
            }
            if (kind !== "!re") {
                continue;
            }
            const record = {};
            for (const word of sentence.slice(1)) {
                if (!word.startsWith("=")) {
                    continue;
                }
                const separator = word.indexOf("=", 1);
                if (separator < 0) {
                    continue;
                }
                const key = word.slice(1, separator);
                const value = word.slice(separator + 1);
                record[key] = value;
            }
            records.push(record);
        }
    }
}
export async function runMikrotikDiscovery(profile) {
    if (process.env.CRM_NETWORK_DISCOVERY_FIXTURES === "1") {
        return createFixtureResponse();
    }
    const client = new RouterOsClient(profile);
    try {
        await client.connect();
        await client.login();
        const leaseRecords = await client.command("/ip/dhcp-server/lease/print");
        const arpRecords = await client.command("/ip/arp/print");
        const networkRecords = await client.command("/ip/dhcp-server/network/print");
        const bridgeHostRecords = await client.command("/interface/bridge/host/print");
        return {
            leases: leaseRecords.map((row) => ({
                address: normalizeText(row.address),
                macAddress: normalizeMacAddress(row["mac-address"]),
                hostName: normalizeText(row["host-name"]),
                status: normalizeText(row.status),
                server: normalizeText(row.server),
                comment: normalizeText(row.comment),
                rateLimit: normalizeText(row["rate-limit"]),
                dynamic: parseBool(row.dynamic),
            })),
            arp: arpRecords.map((row) => ({
                address: normalizeText(row.address),
                macAddress: normalizeMacAddress(row["mac-address"]),
                interfaceName: normalizeText(row.interface),
                status: normalizeText(row.status),
            })),
            networks: networkRecords.map((row) => ({
                address: normalizeText(row.address),
                gateway: normalizeText(row.gateway),
                comment: normalizeText(row.comment),
            })),
            bridgeHosts: bridgeHostRecords.map((row) => ({
                macAddress: normalizeMacAddress(row["mac-address"]),
                onInterface: normalizeText(row["on-interface"] ?? row.interface),
                bridge: normalizeText(row.bridge),
            })),
        };
    }
    finally {
        await client.close().catch(() => undefined);
    }
}
//# sourceMappingURL=mikrotik_api.js.map