import { Request } from 'express';
import { Jinja2Templates } from 'jinja2-express';
import { UserRole } from './models/UserRole'; // Assuming UserRole is defined in a separate file
import { uiService } from './services/ui_service';

// Preconfigure Jinja2 environment to avoid DeprecationWarning
const env = new Jinja2Templates({
    loader: new jinja2.FileSystemLoader(__dirname + '/templates'),
    extensions: ['jinja2.ext.do']
});

const templates = env;

async function render(
    request: Request,
    name: string,
    context?: Record<string, any>,
    status_code?: number
): Promise<Response> {
    const ctx = { ...context };
    const u = request.state.portalUser;
    ctx['portal_user'] = u;
    const c = request.state.clientUser;
    ctx['client_user'] = c;

    let cachedNavItems: UserRole[] | undefined;
    if (u) {
        if (cachedNavItems !== undefined) {
            ctx['nav_items'] = cachedNavItems;
            ctx['nav_groups'] = groupedVisibleNav(cachedNavItems);
        } else {
            const db = await dbManager.getSessionLocal();
            try {
                const items = await visible_nav_items(db, u.role);
                ctx['nav_items'] = items;
                ctx['nav_groups'] = groupedVisibleNav(items);
            } finally {
                db.close();
            }
        }
        const r = u.role;
        ctx['can_write_crm'] = r === UserRole.admin || r === UserRole.manager;
        ctx['can_write_helpdesk'] = r === UserRole.admin || r === UserRole.manager || r === UserRole.service;
        ctx['can_write_messages'] = r === UserRole.admin || r === UserRole.manager || r === UserRole.service;
        ctx['can_mutate'] = ctx['can_write_crm'];
        ctx['visible_menu_keys'] = request.state.visibleMenuKeys ?? new Set();
    } else {
        ctx['nav_items'] = [];
        ctx['nav_groups'] = [];
        ctx['can_write_crm'] = false;
        ctx['can_write_helpdesk'] = false;
        ctx['can_write_messages'] = false;
        ctx['can_mutate'] = false;
        ctx['visible_menu_keys'] = new Set();
    }
    ctx['title'] = '';
    ctx['app_name'] = APP_DISPLAY_NAME;

    // UI Plugin Integration
    ctx['ui'] = uiService.getThemeAssets(request);
    ctx['breadcrumbs'] = uiService.getBreadcrumb(request, ctx['title']);

    const resp = templates.renderTemplate(request, name, ctx);
    if (status_code !== undefined) {
        resp.status(status_code);
    }
    return resp;
}
