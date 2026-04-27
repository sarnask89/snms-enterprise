# Implementation Plan - Finalize Hardware Integration

## Phase 1: Client Diagnostics UI
- [ ] Task: Create "Network & Diagnostics" UI component
    - [ ] Update `templates/nodes/form.html` to include the diagnostics card
    - [ ] Implement HTMX buttons for Ping and OLT Lookup
- [ ] Task: Implement Lease Sync UI
    - [ ] Add [Sync Lease] button to the Node form
    - [ ] Connect button to `/diagnostics/sync-lease/{node_id}`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Client Diagnostics UI' (Protocol in workflow.md)

## Phase 2: Logic Refinement & Imports
- [ ] Task: Refine Discovery Import Logic
    - [ ] Verify `apartment_number` handling in `app/routers/network_discovery.py`
    - [ ] Update `parse_mikrotik_comment` to be case-insensitive and robust
- [ ] Task: Implement Suffix Mapping
    - [ ] Expand `SUFFIX_MAP` in `app/services/mikrotik_parser.py` with all required shortcuts
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Logic Refinement & Imports' (Protocol in workflow.md)

## Phase 3: Comprehensive Verification
- [ ] Task: Write Service Unit Tests
    - [ ] Create `tests/test_hardware_services.py`
    - [ ] Test `MikrotikParser` with various comment samples
- [ ] Task: Full-Loop Integration Test (Mocked)
    - [ ] Mock Mikrotik REST API and DASAN SSH to verify the discovery process
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Comprehensive Verification' (Protocol in workflow.md)
