# Feature Parity Report: Legacy FastAPI/Jinja2 vs. Nuxt 3 Migration

## Overview
This report assesses the migration progress of the CRM Portal from the legacy FastAPI/Jinja2 templates to the modern Nuxt 3 frontend. It categorizes the features into those currently implemented in the Nuxt application and the features that remain to be migrated to achieve full parity.

---

## 1. Currently Implemented in Nuxt 3
The following core views have been scaffolded in the new Nuxt 3 app (`crm-portal-nuxt/snms-nuxt-app/app/pages/`):

*   **Authentication & Base**
    *   `login.vue` (Migrated from `login.html`)
    *   `index.vue` / Dashboard (Migrated from `dashboard.html`)
*   **CRM & Core Modules**
    *   `customers.vue` (Replaces `customers/list.html` and basic customer management)
    *   `finances.vue` (Replaces basic `finances/list.html` or equivalent overview)
    *   `helpdesk.vue` (Replaces basic `helpdesk/tickets.html`)
*   **Network Infrastructure**
    *   `network/devices.vue` (Migrated from `netdevices/list.html`)
    *   `network/nodes.vue` (Migrated from `net_nodes/list.html`)

---

## 2. Missing Features & Modules
The following modules and views exist in the legacy `templates/` directory but have not yet been implemented in the Nuxt 3 frontend. 

### A. Client Portal (Self-Service)
The entire customer-facing portal is missing.
*   **Views:** `client/base.html`, `client/dashboard.html`, `client/devices.html`, `client/helpdesk.html`, `client/login.html`, `client/payments.html`, `client/profile.html`, `client/shop.html`, `client/subscriptions.html`

### B. Administration & System Config
System-wide configuration, access control, and auditing tools are completely missing.
*   **Users & Access:** `admin/users_list.html`, `admin/user_form.html`, `admin/user_groups_list.html`, `admin/menu_access.html`
*   **Audit & Logs:** `admin/audit_logs.html`, `admin/info.html`, `admin/backups.html`
*   **SNMS Settings:** `snms/config.html`, `snms/config_divisions.html`, `snms/config_network_hosts.html`, `snms/config_number_plans.html`, `snms/config_vat_rates.html`
*   **Messaging:** `snms/messages.html`, `snms/message_templates.html`
*   **Other Admin:** `admin/copyrights.html`, `snms/timetable.html`, `snms/stats.html`

### C. Advanced CRM & Customer Entities
While `customers.vue` exists, advanced customer-related entities and detailed views are missing.
*   **Customer Groups:** `customer_groups/` (list, form)
*   **Customer Devices:** `customer_devices/` (list, form, sessions, reports, notices)
*   **Customer Device Groups:** `customer_device_groups/` (list, form)
*   **Notices:** `customers/notices.html`, `customers/notices_hub.html`
*   **Subscriptions & Documents:** `subscriptions/` (list, form), `documents/` (list, form)

### D. Advanced Billing & Finances
While `finances.vue` provides a top-level view, specific financial operations are absent.
*   **Invoicing:** `finances/invoices.html`, `finances/invoice_form.html`, `bulk/invoicing.html` (Bulk operations)
*   **Operations:** `finances/balance.html`, `finances/cash.html`, `finances/payments.html`
*   **Tariffs:** `finances/tariffs.html`, `finances/tariff_form.html`

### E. Advanced Helpdesk
The core `helpdesk.vue` exists, but configuration and details do not.
*   **Tickets:** `helpdesk/ticket_detail.html`, `helpdesk/ticket_form.html`
*   **Configuration:** `helpdesk/categories.html`, `helpdesk/queues.html`
*   **Reports:** `helpdesk/reports.html`

### F. Addressing & Location (TERYT)
The Polish address registry synchronization and management tools are missing.
*   **Addresses:** `addresses/manage.html`, `addresses/teryt_search_results.html`
*   **TERYT Data:** `teryt/city_list.html`, `teryt/city_form.html`, `admin/teryt_sync.html`, `teryt_browse.html`

### G. Advanced Network Tools & Infrastructure
While basic devices and nodes are listed, deep network management features are absent.
*   **IP Networks:** `ip_networks/` (list, form, search, usage)
*   **Monitoring & Discovery:** `admin/monitoring.html`, `admin/olt_discovery.html`, `admin/discovery_results.html`, `admin/network_tools.html`
*   **Mapping:** `net_nodes/map.html`, `net_map.html`

### H. Account & Auth Utilities
*   **Password Management:** `auth/change_password.html`

---

## 3. Recommendations & Next Steps

1.  **Prioritize the Client Portal (`client/`)**: If the CRM is actively used by customers, scaffold a separate Nuxt layout (e.g., `layouts/client.vue`) and implement the client self-service pages (`client/dashboard.vue`, `client/payments.vue`, etc.) to prevent service disruption for end-users.
2.  **Flesh out Detail Pages (Dynamic Routes)**: Create dynamic routes for the already implemented top-level pages. For example, `customers/[id].vue`, `helpdesk/[id].vue`, and `finances/invoices/[id].vue` to accommodate the detailed forms and records (migrating the `_form.html` and `_detail.html` templates).
3.  **Componentize TERYT & Addressing**: The TERYT address search (`teryt_lookup.html`) is highly reusable. Build a dedicated Vue component for TERYT address resolution before migrating the `addresses/` and `teryt/` management views, as many other forms (customers, nodes) will depend on it.
4.  **Admin Panel & Settings**: Create a dedicated `/admin` nested route structure to port over the system configuration (`snms/`), users, and audit logs. This can be done iteratively as these are typically used less frequently by the general staff.
