import { Fernet } from 'cryptography';
import { CRM_ENCRYPTION_KEY } from './config'; // Przyjmij, że config jest zdefiniowany w tym samym pliku
const logger = console.log;
// Fallback mechanism if key is invalid/missing
try {
    const _cipher = new Fernet(CRM_ENCRYPTION_KEY);
}
catch (e) {
    logger.error(`Failed to initialize Fernet encryption: ${e}. Check CRM_ENCRYPTION_KEY.`);
    _cipher = null;
}
function encryptPassword(password) {
    if (!password || !_cipher) {
        return password;
    }
    return _cipher.encrypt(password).toString('utf-8');
}
function decryptPassword(encryptedPassword) {
    if (!encryptedPassword || !_cipher) {
        return encryptedPassword;
    }
    try {
        return _cipher.decrypt(encryptedPassword).toString('utf-8');
    }
    catch (e) {
        logger.error(`Failed to decrypt password: ${e}`);
        return encryptedPassword; // Zwróć oryginał jeśli odszyfrowanie zawiedzie
    }
}
//# sourceMappingURL=security_utils.js.map