# Implementation Plan: Dasan OLT Integration

## Phase 1: Core Service & Data Modeling
- [ ] Task: Update `NetDevice` and `CustomerDevice` SQLAlchemy models to support OLT/ONU hierarchy and foreign keys.
- [ ] Task: Implement `DasanService` class with SSH connection handling and raw command execution.
- [ ] Task: Implement CLI parsing functions in `DasanService` (e.g., `get_onu_details`, `get_onu_macs`).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Core Service & Data Modeling' (Protocol in workflow.md)

## Phase 2: Background Discovery & Sync Scripts
- [ ] Task: Develop `sync_onus.py` to auto-discover ONUs from the OLT and persist them as `NetDevice` records.
- [ ] Task: Develop `sync_macs_to_onus.py` to map existing `CustomerDevice` MACs to the discovered ONUs.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Background Discovery & Sync Scripts' (Protocol in workflow.md)

## Phase 3: Diagnostic Endpoints & UI Integration
- [ ] Task: Create FastAPI endpoints in `app/routers/diagnostics.py` and `app/routers/netdevices.py` for live data retrieval.
- [ ] Task: Build Jinja2/HTMX templates for the OLT configuration view, including the interactive PON port selection dropdown.
- [ ] Task: Add an administrative dashboard panel (e.g., `/admin/olt-discovery`) to trigger synchronization manually.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Diagnostic Endpoints & UI Integration' (Protocol in workflow.md)