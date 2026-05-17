import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const IV_BYTES = 12;

function getKeyMaterial() {
    const encryptionKey = String(process.env.CRM_ENCRYPTION_KEY ?? "").trim();
    if (!encryptionKey) {
        throw new Error("CRM_ENCRYPTION_KEY is required to encrypt device secrets");
    }

    return createHash("sha256").update(encryptionKey, "utf8").digest();
}

export function encryptDeviceSecret(plainText: string) {
    const normalized = String(plainText ?? "");
    if (!normalized) {
        return "";
    }

    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv("aes-256-gcm", getKeyMaterial(), iv);
    const encrypted = Buffer.concat([
        cipher.update(normalized, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return [
        iv.toString("base64"),
        authTag.toString("base64"),
        encrypted.toString("base64"),
    ].join(":");
}

export function decryptDeviceSecret(cipherText: string | null | undefined) {
    const normalized = String(cipherText ?? "").trim();
    if (!normalized) {
        return "";
    }

    const [ivBase64, authTagBase64, payloadBase64] = normalized.split(":", 3);
    if (!ivBase64 || !authTagBase64 || !payloadBase64) {
        throw new Error("Invalid encrypted device secret payload");
    }

    const decipher = createDecipheriv(
        "aes-256-gcm",
        getKeyMaterial(),
        Buffer.from(ivBase64, "base64"),
    );
    decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

    return Buffer.concat([
        decipher.update(Buffer.from(payloadBase64, "base64")),
        decipher.final(),
    ]).toString("utf8");
}

export function hasEncryptedSecret(cipherText: string | null | undefined) {
    return String(cipherText ?? "").trim().length > 0;
}
