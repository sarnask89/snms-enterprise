# Implementation Plan - Finalize Hardware Integration

## Phase 1: Client Diagnostics UI [checkpoint: 51b2d10]
- [x] Task: Create "Network & Diagnostics" UI component (a826f78)
    - [x] Update `templates/nodes/form.html` to include the diagnostics card
    - [x] Implement HTMX buttons for Ping and OLT Lookup
- [x] Task: Implement Lease Sync UI (a826f78)
    - [x] Add [Sync Lease] button to the Node form
    - [x] Connect button to `/diagnostics/sync-lease/{node_id}`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Client Diagnostics UI' (Protocol in workflow.md)

## Phase 2: Logic Refinement & Imports
- [x] Task: Refine Discovery Import Logic (e654233)
    - [x] Verify `apartment_number` handling in `app/routers/network_discovery.py`
    - [x] Update `parse_mikrotik_comment` to be case-insensitive and robust
- [x] Task: Implement Suffix Mapping (e654233)
    - [x] Expand `SUFFIX_MAP` in `app/services/mikrotik_parser.py` with all required shortcuts
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Logic Refinement & Imports' (Protocol in workflow.md)

## Phase 3: Comprehensive Verification
- [x] Task: Write Service Unit Tests (e654233)
    - [x] Create `tests/test_hardware_services.py`
    - [x] Test `MikrotikParser` with various comment samples
- [x] Task: Full-Loop Integration Test (Mocked) (e654233)
    - [x] Mock Mikrotik REST API and DASAN SSH to verify the discovery process
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Comprehensive Verification' (Protocol in workflow.md)
