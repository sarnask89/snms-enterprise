import { getSessionUser, serializePortalUser } from "./auth_runtime.js";
import { UserRole } from "./models/common.js";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const AUTH_ENABLED = process.env.AUTH_ENABLED !== "false";
export const INTERNAL_READ_ROLES = [
    UserRole.admin,
    UserRole.manager,
    UserRole.service,
    UserRole.view,
];
export const INTERNAL_WRITE_ROLES = [
    UserRole.admin,
    UserRole.manager,
    UserRole.service,
];
export const FINANCE_WRITE_ROLES = [
    UserRole.admin,
    UserRole.manager,
];
export const ADMIN_ONLY_ROLES = [
    UserRole.admin,
];
async function resolvePortalUser(request) {
    if (request.portalUser !== undefined) {
        return request.portalUser;
    }
    const user = await getSessionUser(request);
    request.portalUser = user;
    request.portalSession = user ? serializePortalUser(user) : undefined;
    return user;
}
export function createAccessMiddleware(policy) {
    return async (request, response, next) => {
        try {
            if (!AUTH_ENABLED) {
                return next();
            }
            const user = await resolvePortalUser(request);
            if (!user) {
                return response.status(401).json({ message: "Authentication required" });
            }
            const allowedRoles = SAFE_METHODS.has(request.method)
                ? policy.readRoles
                : (policy.writeRoles ?? policy.readRoles);
            if (!allowedRoles.includes(user.role)) {
                return response.status(403).json({ message: "Forbidden" });
            }
            next();
        }
        catch (error) {
            console.error("Error checking access control:", error);
            response.status(500).json({ message: "Internal server error" });
        }
    };
}
//# sourceMappingURL=access_control.js.map