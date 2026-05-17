// because we are using it as a request object here and the actual implementation is different than what you provided.
var UserRole;
(function (UserRole) {
})(UserRole || (UserRole = {}));
const AUTH_ENABLED = process.env['AUTH_ENABLED'] || 'true'; // Reads env var at call time, not cached — always fresh (default to true)
// Note: This is a TypeScript feature and does NOT correspond directly with Python's os module or FastAPI environment variables as they are different in nature.  
let portal_user; /* Declare your user variable */ // Assuming you have an instance of User model here 
function _auth_enabled() { return AUTH_ENABLED !== 'false' && AUTH_ENABLED !== '0' && AUTH_ENABLED !== 'no' && AUTH_ENABLED != 'off'; } // Convert to TS idioms (e.g., not in, and comparison operators)
function login_required(request) { if (!this._auth_enabled())
    throw new Error('Not authenticated'); /* Add error handling */ /* Add error handling */ portal_user && request.state; {
    'portal_user';
    portal_user;
} ; } // Assuming you have a way to get the user from your context (like in Express middleware)
async function verify_session(request) { await this._auth_enabled() ? login_required : null; /* Add async/await for Promises */ }
function require_can_mutate() { } // Assuming this function checks whether a request should be mutable (i.e., can have changes made) and throws appropriate errors
async function require_business_write(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ } // Assuming this checks whether a request should be writable in business (i.e., can have changes made) and throws appropriate errors
async function require_helpdesk_write(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ } // Assuming this checks whether a request should be writable in help desk (i.e., can have changes made) and throws appropriate errors
async function require_messaging_write(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ } // Assuming this checks whether a request should be writable in messaging (i.e., can have changes made) and throws appropriate errors
async function require_admin(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ /* Add async/await for Promises */ if (!this._auth_enabled())
    throw new Error('Not authenticated'); portal_user && request.state; {
    'portal_user';
    portal_user;
} ; } // Assuming you have a way to get the user from your context (like in Express middleware)
async function require_admin_or_manager(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ /* Add async/await for Promises */ if (!this._auth_enabled())
    throw new Error('Not authenticated'); portal_user && request.state; {
    'portal_user';
    portal_user;
} ; } // Assuming you have a way to get the user from your context (like in Express middleware)
async function require_client(request) { await verify_session ? login_required : null; /* Add async/await for Promises */ /* Add async/await for Promises */ if (!this._auth_enabled())
    throw new Error('Not authenticated'); portal_user && request.state; {
    'portal_user';
    portal_user;
} ; }
export {};
//# sourceMappingURL=deps.js.map