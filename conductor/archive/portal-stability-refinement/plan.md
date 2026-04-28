# Implementation Plan: Portal Stability & Refinement

## Phase 1: Startup & Database
- [x] **Job 1.1**: Refactor `app/init_db.py` and `app/main.py` to handle migrations safely on Windows.
- [x] **Job 1.2**: Implement a database health check endpoint.

## Phase 2: Systematic UI Fixes
- [ ] **Job 2.1**: Update `templates/components/input.html` macros to default `None` to empty string.
- [x] **Job 2.2**: Audit and fix `None` rendering in `customers/list_rows.html`.
- [x] **Job 2.3**: Audit and fix `None` rendering in `net_nodes/list.html`.
- [x] **Job 2.4**: Audit and fix `None` rendering in `netdevices/list.html`.
- [x] **Job 2.5**: Audit and fix `None` rendering in `subscriptions/list.html`.
- [x] **Job 2.6**: Align `templates/documents/form.html` GUI with the rest of the system (consistent card and spacing).

## Phase 3: Router & Logic Refinement
- [x] **Job 3.1**: Enhance `customer_list` search to include `first_name` and `email` consistently.
- [x] **Job 3.2**: Enhance `net_node_list` search to include location details.
- [x] **Job 3.3**: Ensure `customer_edit` persists data without re-assigning numbers (System-wide check).

## Phase 4: Feature Completion
- [x] **Job 4.1**: Link "Integracja PIT UKE" buttons in Audit Log to functional routes and fix 403 Access Denied error.
- [x] **Job 4.2**: Implement "Zarządzaj" button logic for city dictionary.
- [x] **Job 4.3**: Add "Export GML" to net node list context.
- [x] **Job 4.4**: Implement `/customers/reports` endpoint corresponding to `templates/customers/reports.html`.

## Phase 5: Verification
- [x] **Job 5.1**: Comprehensive manual walkthrough of all "Delete" confirmation modals. Complete.
- [x] **Job 5.2**: Verify form validation for all mandatory fields. Complete.
