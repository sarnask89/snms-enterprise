import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_UPLOAD_ROOT = path.resolve(__dirname, "../../uploads");
const MAX_UPLOAD_BYTES = Number.parseInt(process.env.CRM_PORTAL_TS_MAX_UPLOAD_BYTES ?? `${20 * 1024 * 1024}`, 10);
const ALLOWED_DOC_SUFFIXES = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".txt", ".doc", ".docx"]);

export function getUploadRoot() {
    return path.resolve(process.env.CRM_PORTAL_TS_UPLOAD_ROOT ?? DEFAULT_UPLOAD_ROOT);
}

function safeSuffix(filename: string | null | undefined) {
    const suffix = path.extname(filename ?? "").toLowerCase();
    if (suffix.length > 12) {
        return "";
    }

    return ALLOWED_DOC_SUFFIXES.has(suffix) ? suffix : "";
}

function sanitizeFilename(filename: string) {
    return filename.replace(/[^\w.\- +]/g, "_").slice(0, 200);
}

export async function saveDocumentBase64(contentBase64: string, originalFilename: string, mimeType?: string | null) {
    const suffix = safeSuffix(originalFilename);
    if (!suffix) {
        throw new Error("Unsupported or missing file extension");
    }

    const buffer = Buffer.from(contentBase64, "base64");
    if (buffer.length === 0) {
        throw new Error("File content is empty");
    }

    if (buffer.length > MAX_UPLOAD_BYTES) {
        throw new Error("File too large");
    }

    const relativePath = path.posix.join("documents", `${randomUUID()}${suffix}`);
    const destination = path.join(getUploadRoot(), ...relativePath.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, buffer);

    return {
        storedPath: relativePath,
        originalFilename: sanitizeFilename(originalFilename || path.basename(destination)),
        fileSize: buffer.length,
        mimeType: mimeType ?? null,
    };
}

export async function readStoredDocument(relativePath: string) {
    const absolutePath = resolveStoredDocumentPath(relativePath);
    const content = await readFile(absolutePath);
    return { absolutePath, content };
}

export function resolveStoredDocumentPath(relativePath: string) {
    const absolutePath = path.resolve(getUploadRoot(), relativePath);
    const root = getUploadRoot();

    if (!absolutePath.startsWith(root)) {
        throw new Error("Resolved path is outside upload root");
    }

    return absolutePath;
}

export async function deleteStoredDocument(relativePath: string | null | undefined) {
    if (!relativePath) {
        return;
    }

    try {
        await unlink(resolveStoredDocumentPath(relativePath));
    } catch {
        // Missing files are non-fatal for delete flow.
    }
}
