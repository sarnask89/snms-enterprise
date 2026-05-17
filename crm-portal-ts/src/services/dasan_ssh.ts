import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type DasanAccessProfile = {
    host: string;
    port: number;
    username: string;
    password: string;
    enablePassword?: string | null;
    timeoutMs?: number;
};

export type DasanOnuStatusRow = {
    olt: number;
    onu: number;
    status: "active" | "inactive";
    failReason: string | null;
    profileName: string | null;
};

export type DasanOnuInfoRow = {
    olt: number;
    onu: number;
    status: "active" | "inactive";
    serialNumber: string | null;
    distanceMeters: number | null;
    rxPowerDbm: number | null;
    profileName: string | null;
};

export type DasanMacRow = {
    vlanId: number;
    portName: string;
    macAddress: string;
    status: string | null;
    inUse: string | null;
};

export type DasanMergedOnuRow = DasanOnuStatusRow & {
    serialNumber: string | null;
    distanceMeters: number | null;
    rxPowerDbm: number | null;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DASAN_COMMANDS = ["show onu status", "show onu info", "show mac"] as const;

function normalizeSpace(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function parseInteger(value: string) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
}

function parseDistanceMeters(value: string) {
    const match = value.match(/(-?\d+)\s*m/i);
    return match ? Number.parseInt(match[1] ?? "", 10) : null;
}

function parseRxPower(value: string) {
    const normalized = normalizeSpace(value).replace(/^-\s+/, "-");
    const match = normalized.match(/(-?\d+(?:\.\d+)?)\s*dBm/i);
    return match ? Number.parseFloat(match[1] ?? "") : null;
}

function parseStatus(value: string): "active" | "inactive" {
    return value.trim().toLowerCase() === "active" ? "active" : "inactive";
}

function parsePipeRow(rawLine: string) {
    const line = rawLine.trim();
    if (!line || !line.includes("|")) {
        return [];
    }

    const columns = line.split("|").map((part) => normalizeSpace(part));
    const firstColumn = columns[0]?.toLowerCase() ?? "";
    if (firstColumn === "olt" || firstColumn === "onu") {
        return [];
    }

    if (!columns.every((column) => column.length > 0 || columns.length >= 2)) {
        return [];
    }

    return columns;
}

export function parseDasanOnuStatus(output: string): DasanOnuStatusRow[] {
    return output
        .split(/\r?\n/)
        .map((line) => parsePipeRow(line))
        .filter((columns) => columns.length >= 5)
        .map((columns) => {
            const olt = parseInteger(columns[0] ?? "");
            const onu = parseInteger(columns[1] ?? "");
            if (olt === null || onu === null) {
                return null;
            }

            const failReason = normalizeSpace(columns[3] ?? "");

            return {
                olt,
                onu,
                status: parseStatus(columns[2] ?? ""),
                failReason: failReason === "-" ? null : failReason,
                profileName: normalizeSpace(columns[4] ?? "") || null,
            } satisfies DasanOnuStatusRow;
        })
        .filter((row): row is DasanOnuStatusRow => !!row);
}

export function parseDasanOnuInfo(output: string): DasanOnuInfoRow[] {
    return output
        .split(/\r?\n/)
        .map((line) => parsePipeRow(line))
        .filter((columns) => columns.length >= 7)
        .map((columns) => {
            const olt = parseInteger(columns[0] ?? "");
            const onu = parseInteger(columns[1] ?? "");
            if (olt === null || onu === null) {
                return null;
            }

            const serialNumber = normalizeSpace(columns[3] ?? "");

            return {
                olt,
                onu,
                status: parseStatus(columns[2] ?? ""),
                serialNumber: serialNumber === "-" ? null : serialNumber,
                distanceMeters: parseDistanceMeters(columns[4] ?? ""),
                rxPowerDbm: parseRxPower(columns[5] ?? ""),
                profileName: normalizeSpace(columns[6] ?? "") || null,
            } satisfies DasanOnuInfoRow;
        })
        .filter((row): row is DasanOnuInfoRow => !!row);
}

export function parseDasanMacTable(output: string): DasanMacRow[] {
    const rows: DasanMacRow[] = [];

    for (const rawLine of output.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("=") || line.toLowerCase().startsWith("vid")) {
            continue;
        }

        const match = line.match(/^(\d+)\s+(\S+)\s+([0-9a-f:]{17})\s+\S+\s+(\S+)\s+(\S+)/i);
        if (!match) {
            continue;
        }

        rows.push({
            vlanId: Number.parseInt(match[1] ?? "", 10),
            portName: match[2] ?? "",
            macAddress: (match[3] ?? "").toLowerCase(),
            status: match[4] ?? null,
            inUse: match[5] ?? null,
        });
    }

    return rows;
}

export function mergeDasanDiscoveryRows(
    statusRows: DasanOnuStatusRow[],
    infoRows: DasanOnuInfoRow[],
    macRows: DasanMacRow[],
) {
    const infoByKey = new Map<string, DasanOnuInfoRow>();
    for (const row of infoRows) {
        infoByKey.set(`${row.olt}:${row.onu}`, row);
    }

    const onuRows = statusRows.map((row) => {
        const info = infoByKey.get(`${row.olt}:${row.onu}`);
        return {
            olt: row.olt,
            onu: row.onu,
            status: info?.status ?? row.status,
            failReason: row.failReason,
            profileName: info?.profileName ?? row.profileName,
            serialNumber: info?.serialNumber ?? null,
            distanceMeters: info?.distanceMeters ?? null,
            rxPowerDbm: info?.rxPowerDbm ?? null,
        } satisfies DasanMergedOnuRow;
    });

    return {
        onuRows,
        macRows,
    };
}

function getFixtureOutputs() {
    return {
        "show onu status": `
-----------------------------------------------------------------------------
    OLT    | ONU |  ACTIVE  |     Fail Reason      | Profile Name
-----------------------------------------------------------------------------
         1 |   1 |   Active |              Success | H660GM
         1 |   2 | Inactive |                    - | H660GM
         1 |   3 | Inactive |                    - | H660GM
`,
        "show onu info": `
----------------------------------------------------------------------------------
    OLT    | ONU |  STATUS  |  Serial No.  | Distance |  Rx Power  |    Profile
----------------------------------------------------------------------------------
         1 |   1 |   Active | DSNW276d9298 |    204m  | - 20.3 dBm | H660GM
         1 |   2 | Inactive | DSNW2750c2e0 |      0m  | -          | H660GM
         1 |   3 | Inactive | DSNW276dd220 |      0m  | -          | H660GM
`,
        "show mac": `
================================================================================
 vid   port          mac addr          permission     status      in use
================================================================================
   99  eth15    4c:5e:0c:35:c6:7c     OK         dynamic       202.26
   99  eth24    00:d0:cb:89:46:53     OK         dynamic       202.26
  100  eth01    d0:96:fb:63:f7:e1     OK         dynamic         4.40
  100  eth01    54:db:a2:18:ce:99     OK         dynamic         6.28
  100  eth01    54:db:a2:11:80:19     OK         dynamic         8.08
`,
    };
}

async function runFixtureSession(commands: readonly string[]) {
    const fixtures = getFixtureOutputs();
    return commands.map((command) => ({
        command,
        output: fixtures[command as keyof typeof fixtures] ?? "",
    }));
}

type HelperResponse = {
    ok: boolean;
    outputs?: Array<{ command: string; output: string }>;
    error?: string;
};

async function spawnHelper(pythonCommand: string, pythonArgs: string[], payload: Record<string, unknown>) {
    return await new Promise<HelperResponse>((resolve, reject) => {
        const child = spawn(pythonCommand, pythonArgs, {
            stdio: ["pipe", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";
        child.stdout.on("data", (chunk) => {
            stdout += String(chunk);
        });
        child.stderr.on("data", (chunk) => {
            stderr += String(chunk);
        });
        child.on("error", reject);
        child.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(stderr.trim() || `Dasan helper exited with code ${code}`));
                return;
            }

            try {
                resolve(JSON.parse(stdout) as HelperResponse);
            } catch (error) {
                reject(new Error(`Invalid Dasan helper response: ${String(error)}`));
            }
        });

        child.stdin.write(JSON.stringify(payload));
        child.stdin.end();
    });
}

async function runPythonHelper(profile: DasanAccessProfile, commands: readonly string[]) {
    const helperCandidates = [
        path.resolve(__dirname, "../vendor_helpers/dasan_cli_helper.py"),
        path.resolve(__dirname, "../../src/vendor_helpers/dasan_cli_helper.py"),
    ];
    const helperPath = helperCandidates.find((candidate) => existsSync(candidate)) ?? helperCandidates[0] ?? "";
    const payload = {
        host: profile.host,
        port: profile.port,
        username: profile.username,
        password: profile.password,
        enablePassword: profile.enablePassword ?? profile.password,
        commands,
        timeoutMs: profile.timeoutMs ?? 15_000,
    };

    const attempts: Array<{ command: string; args: string[] }> = [];
    if (process.env.CRM_PYTHON_BIN) {
        attempts.push({ command: process.env.CRM_PYTHON_BIN, args: [helperPath] });
    } else {
        attempts.push({ command: "python", args: [helperPath] });
        if (process.platform === "win32") {
            attempts.push({ command: "py", args: ["-3", helperPath] });
        }
    }

    let lastError: unknown = null;
    for (const attempt of attempts) {
        try {
            const response = await spawnHelper(attempt.command, attempt.args, payload);
            if (!response.ok || !response.outputs) {
                throw new Error(response.error || "Dasan helper returned no outputs");
            }
            return response.outputs;
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(`Failed to execute Dasan helper: ${String(lastError ?? "unknown error")}`);
}

export async function runDasanDiscovery(profile: DasanAccessProfile) {
    const commands = [...DEFAULT_DASAN_COMMANDS];
    const outputs = process.env.CRM_NETWORK_DISCOVERY_FIXTURES === "1"
        ? await runFixtureSession(commands)
        : await runPythonHelper(profile, commands);

    const outputByCommand = new Map(outputs.map((entry) => [entry.command.toLowerCase(), entry.output]));
    const statusRows = parseDasanOnuStatus(outputByCommand.get("show onu status") ?? "");
    const infoRows = parseDasanOnuInfo(outputByCommand.get("show onu info") ?? "");
    const macRows = parseDasanMacTable(outputByCommand.get("show mac") ?? "");

    return {
        rawOutputs: outputs,
        ...mergeDasanDiscoveryRows(statusRows, infoRows, macRows),
    };
}
