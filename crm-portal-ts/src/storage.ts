import { UploadFile } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const MAX_UPLOAD_BYTES = 1024 * 1024; // 1 MB
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || '/uploads'; // Assuming UPLOAD_ROOT is set in environment variables

const ALLOWED_DOC_SUFFIXES = new Set([
    '.pdf', '.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.txt', '.doc', '.docx'
]);

function _safeSuffix(filename: string | null): string {
    if (!filename) return '';
    const suf = path.extname(filename).toLowerCase();
    if (suf.length > 12) suf = suf.slice(0, 12);
    return ALLOWED_DOC_SUFFIXES.has(suf) ? suf : '';
}

async function saveDocumentUpload(upload: UploadFile): Promise<[string, string, number, string | null]> {
    const suffix = _safeSuffix(upload.filename);
    if (!suffix) throw new Error('Niedozwolony lub brak rozszerzenia pliku.');
    const rel = `documents/${uuidv4().slice(0, 12)}${suffix}`;
    const dest = path.join(UPLOAD_ROOT, rel);
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    const raw = await upload.file.arrayBuffer();
    if (raw.byteLength > MAX_UPLOAD_BYTES) throw new Error('Plik za duzy.');
    await fs.promises.writeFile(dest, Buffer.from(raw));
    const orig = upload.filename || dest.name;
    orig = orig.replace(/[^\w.\- +]/g, '_').slice(0, 200);
    return [rel, orig, raw.byteLength, upload.mimetype];
}

async function deleteStoredFile(relativePath: string | null): Promise<void> {
    if (!relativePath) return;
    const p = path.join(UPLOAD_ROOT, relativePath);
    try {
        await fs.promises.unlink(p);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}
