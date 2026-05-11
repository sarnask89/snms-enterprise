import * as crypto from 'crypto';
import { CRM_ENCRYPTION_KEY } from './config'; // Assuming config.ts contains the key

const logger = console.log;

// Fallback mechanism if key is invalid/missing
try {
    const _cipher = crypto.createCipher('aes-256-cbc', CRM_ENCRYPTION_KEY);
} catch (e) {
    logger.error(`Failed to initialize Fernet encryption: ${e}. Check CRM_ENCRYPTION_KEY.`);
    _cipher = null;
}

function encryptPassword(password: string): string {
    if (!password || !_cipher) {
        return password;
    }
    const encrypted = _cipher.update(password, 'utf8', 'hex');
    return encrypted + _cipher.final('hex');
}

function decryptPassword(encryptedPassword: string): string {
    if (!encryptedPassword || !_cipher) {
        return encryptedPassword;
    }
    try {
        const decrypted = _cipher.update(encryptedPassword, 'hex', 'utf8');
        return decrypted + _cipher.final('utf8');
    } catch (e) {
        logger.error(`Failed to decrypt password: ${e}`);
        return encryptedPassword; // Return original if decryption fails
    }
}
