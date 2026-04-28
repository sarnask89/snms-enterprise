# Comprehensive UI Audit Checklist

## 1. Authentication
- [x] Login page (UI layout)
- [x] Login (Verified via active session)
- [ ] Logout
- [x] Change Password form (Visited)
- [x] Role-based access control (Admin verified)

## 2. Customers
- [x] List View:
    - [x] Search functionality
    - [x] Edit button (redirects correctly)
    - [x] Delete button (Confirmation modal works)
- [x] New Customer Form:
    - [x] Validation (required fields)
    - [x] Successful creation
- [x] Edit Customer Form:
    - [x] Pre-filled values
    - [x] Updating fields
    - [x] Successful save (NOTE: ID re-assignment bug found)

## 3. Infrastructure
- [x] Network Nodes:
    - [x] List: Edit, Delete, Filter
    - [x] Form: Validation
    - [x] Successful creation
- [x] Topology Map:
    - [x] Map rendering
    - [x] Node markers interaction
- [x] Customer Devices:
    - [x] List: Link to customer
    - [x] Diagnostics button (Triggered)
- [ ] Hardware Catalog:
    - [x] Visited
- [x] Mikrotik Discovery:
    - [x] Scan triggered successfully

## 4. IP Networks
- [x] IPv4 Addresses List:
    - [x] New network (Creation works)
    - [ ] Edit/Delete
- [x] IP Usage Report:
    - [x] Visited

## 5. Finances
- [x] Subscriptions:
    - [x] Status toggle (Works)
- [x] Tariffs:
    - [x] Creation works
    - [ ] Tax rate selection

## 6. System Administration
- [x] Users:
    - [x] New user (Creation works)
- [x] Audit Logs:
    - [x] View list (Functional)
- [x] Number Plans:
    - [x] Creation works
- [x] VAT Rates:
    - [x] Creation works
- [ ] Backups:
    - [ ] Create (Broken/Missing)
- [x] Cache Reload:
    - [x] Trigger reload (Log recorded)
