# Specification - Finalize Hardware Integration

## Overview
This track completes the integration of Mikrotik and DASAN devices into the CRM Portal. It focuses on the user interface for real-time diagnostics and the rigorous verification of the automated provisioning and discovery systems.

## Scope
- **Network & Diagnostics UI:**
  - Add a "Network & Diagnostics" card to the Client Device (Node) edit page.
  - Implement HTMX triggers for [Ping], [OLT Lookup], and [Sync Lease] buttons.
  - Display real-time results in a terminal-style output box.
- **Discovery Inbox Improvements:**
  - Ensure the batch-import logic handles `apartment_number` and `customer_code` generation correctly.
  - Verify that imported nodes are correctly linked to their parent NetDevice.
- **Service Verification:**
  - Implement unit tests for `MikrotikParser` to handle all planned street shortcuts.
  - Implement integration tests with mocked API responses for `MikrotikService` and `DasanService`.

## Technical Details
- **Backend:** FastAPI, HTMX, Netmiko, RouterOS v7 REST API.
- **Security:** Fernet encryption for device credentials.

## Constraints
- Real-time diagnostics must not block the main application loop.
- Sensitive credentials must never be displayed in plain text in the UI.
