import { hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';

const ITERATIONS = 390_000;
const SALT_BYTES = 16;

function hashPassword(password: string): string {
    const salt = randomBytes(SALT_BYTES);
    const dk = bcrypt.hashSync(password, salt, ITERATIONS);
    return `pbkdf2_sha256${ITERATIONS}${salt.toString('hex')}${dk.toString('hex')}`;
}

function verifyPassword(password: string, stored: string): boolean {
    try {
        const [algo, itS, saltHex, hashHex] = stored.split('$', 3);
        const iterations = parseInt(itS, 10);
        const salt = Buffer.from(saltHex, 'hex');
        const expected = Buffer.from(hashHex, 'hex');
    } catch (error) {
        return false;
    }
    const dk = bcrypt.hashSync(password, salt, iterations);
    return bcrypt.compareSync(dk, expected);
}
