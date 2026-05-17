import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 390_000;
const SALT_BYTES = 16;

export function hashPassword(password: string): string {
    const salt = randomBytes(SALT_BYTES);
    const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
    return `pbkdf2_sha256$${ITERATIONS}$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    try {
        const [algorithm, iterationsString, saltHex, hashHex] = stored.split("$", 4);
        if (algorithm !== "pbkdf2_sha256") {
            return false;
        }

        const iterations = Number.parseInt(iterationsString, 10);
        const salt = Buffer.from(saltHex, "hex");
        const expected = Buffer.from(hashHex, "hex");
        const derivedKey = pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
        return timingSafeEqual(derivedKey, expected);
    } catch (_error) {
        return false;
    }
}
