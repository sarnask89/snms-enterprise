// Also import RedirectResponse and AuthenticationBackend interface if you want to define them later on or in a different file 
from;
app.database;
// Also assuming SECRET_KEY type and interface are defined elsewhere in code 
from;
app.config;
var AUTH_ENABLED = ;
// Also assuming db manager is the correct type of session local and get method 
class AdminAuth {
    async login(request) {
        return true;
    } // same for logout and authenticate  
    async logout(request) {
        return true;
    } // same for login and authenticate  
    async authenticate(request) {
        if (!AUTH_ENABLED)
            return true;
    } // same for login and logout  
}
export {};
//# sourceMappingURL=admin_auth.js.map