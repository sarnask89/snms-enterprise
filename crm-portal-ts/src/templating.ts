import { Request } from 'express';
import { Jinja2Templates } from 'jinja2';

import { db_manager } from './database';
import { UserRole } from './models/user-role';
import { grouped_visible_nav, visible_nav_items } from './nav-access';
import { ui_service } from './services/ui-service';

// Preconfigure Jinja2 environment to avoid DeprecationWarning
const env = new jinja2.Environment(
    loader=jinja2.FileSystemLoader(__dirname + '/templates'),
    extensions=["jinja2.ext.do"]
);

const templates = new Jinja2Templates(env);

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

    let cached = request.state.navItemsForTemplate;
    if (u) {
        if (cached !== undefined) {
            ctx['nav_items'] = cached;
            ctx['nav_groups'] = grouped_visible_nav(cached);
        } else {
            const db = await db_manager.getSessionLocal();
            try {
                const items = await visible_nav_items(db, u.role);
                ctx['nav_items'] = items;
                ctx['nav_groups'] = grouped_visible_nav(items);
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
    ctx['ui'] = ui_service.getThemeAssets(request);
    ctx['breadcrumbs'] = ui_service.getBreadcrumb(request, ctx['title']);

    return templates.renderTemplate(request, name, ctx);
}
