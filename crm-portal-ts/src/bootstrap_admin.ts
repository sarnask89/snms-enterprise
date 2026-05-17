import { AppDataSource } from "./database.js";
import { UserRole } from "./models/common.js";
import { PortalUser } from "./models/system.js";
import { hashPassword, verifyPassword } from "./security.js";
import { isProductionRuntime } from "./runtime_config.js";

export async function ensurePortalAdminUser(env: NodeJS.ProcessEnv = process.env) {
    const username = String(env.CRM_ADMIN_USER ?? "admin").trim();
    const password = String(env.CRM_ADMIN_PASSWORD ?? "");

    if (!username || !password) {
        return {
            created: false,
            updated: false,
            skipped: true,
            username,
        };
    }

    const portalUserRepo = AppDataSource.getRepository(PortalUser);
    const existingUser = await portalUserRepo.findOneBy({ username });

    if (!existingUser) {
        const adminUser = new PortalUser();
        adminUser.username = username;
        adminUser.passwordHash = hashPassword(password);
        adminUser.role = UserRole.admin;
        adminUser.active = true;
        await portalUserRepo.save(adminUser);

        return {
            created: true,
            updated: false,
            skipped: false,
            username,
        };
    }

    let updated = false;

    if (!existingUser.active) {
        existingUser.active = true;
        updated = true;
    }

    if (existingUser.role !== UserRole.admin) {
        existingUser.role = UserRole.admin;
        updated = true;
    }

    // In development keep the seeded login aligned with .env so local testing is predictable.
    if (!isProductionRuntime(env) && !verifyPassword(password, existingUser.passwordHash)) {
        existingUser.passwordHash = hashPassword(password);
        updated = true;
    }

    if (updated) {
        await portalUserRepo.save(existingUser);
    }

    return {
        created: false,
        updated,
        skipped: false,
        username,
    };
}
