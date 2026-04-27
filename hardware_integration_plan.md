# Hardware Integration Plan (Mikrotik & DASAN)

This plan outlines the implementation of network automation and autoconfiguration for Mikrotik (RouterOS) and DASAN (GPON) devices within the CRM Portal.

## 1. Research & Code Recovery
- **Task**: Scan `@copilotpy` and `@strapi-local` for existing Mikrotik microservices.
- **Goal**: Identify reusable API wrapper logic or parsing patterns to maintain consistency with legacy scripts.
- **Tools**: `grep_search` for keywords: `routeros`, `dhcp`, `lease`, `rate-limit`.

## 2. Data Model Extensions
Update `app/models.py` to support provisioning and external device management:
- **NetDevice**: Add `mgmt_username`, `mgmt_password_encrypted`, and `driver_type` (mikrotik_v7, dasan_nos).
- **Node**: Add `external_id` (router lease ID), `last_sync_at`, and `provisioning_status`.
- **Relationship**: Ensure `Node` clearly links to its serving `NetDevice` (Gateway).

## 3. Core Service Layer
### Mikrotik Driver (`app/services/mikrotik.py`)
- **API Client**: Implement RouterOS v7 REST API client using `httpx`.
- **Lease Sync**: Method `upsert_static_lease(device, node, subscription)` to create/update leases with `rate-limit`.
- **Diagnostics**: Methods for `ping`, `arp-ping`, `get_bridge_hosts`, and `get_fdb`.

### DASAN Driver (`app/services/dasan.py`)
- **SSH Client**: Implement `Netmiko` based connection handler.
- **Discovery**: Method `get_onu_path(mac)` to run `show gpon onu mac-address` and return Port/ONU ID.

## 4. Lease Import & Discovery System
Implement the "Discovery Inbox" logic:
- **Regex Parser**: Implement `parse_mikrotik_comment` using the pattern `(\d+)\s+([^\s]+)\s+M/(\d+)\s+([A-Za-z]+)(\d+)`.
- **Mapping**: Integrate the provided `SUFFIX_MAP` for street shortcuts.
- **Matching Engine**: Logic to correlate parsed surnames/addresses with existing `LocationStreet` and `Customer` records.
- **Unknown Handling**: Create "Shadow Customers" for leases without valid comments.

## 5. UI Integration (HTMX)
- **Discovery Dashboard**: A new view at `/admin/discovery` to review and batch-import router leases.
- **Client Diagnostics Tab**: A real-time diagnostic panel on the Customer detail page.
    - **Buttons**: [Ping], [Arp-Ping], [Locate on OLT].
    - **Live Logs**: Stream output using `StreamingResponse`.
- **Lease Sync Button**: Manual "Push to Router" button in Node management.

## 6. Security & Auditing
- **Audit Logs**: Every configuration change (e.g., setting rate-limit) must call `app.audit.record_audit`.
- **Encryption**: Implement a utility to encrypt/decrypt management passwords stored in the database.

## 7. Verification Steps
- **Unit Tests**: Test the regex parser against provided samples (e.g., `1825 Krupka M/33 Mic25`).
- **Integration Tests**: Mock Mikrotik API responses to verify lease creation logic.
- **UI Smoke Test**: Verify HTMX polling for diagnostic results.
