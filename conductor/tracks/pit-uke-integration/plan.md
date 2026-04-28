# Implementation Plan: UKE PIT System Integration

## Step 1: Database Schema Expansion
- [ ] Add `x_1992` (Float) and `y_1992` (Float) to `Address` model in `app/models.py`.
- [ ] Add `x_1992` (Float) and `y_1992` (Float) to `NetNode` model in `app/models.py`.
- [ ] Create and run Alembic migration or use manual SQL to update `crm.sqlite`.

## Step 2: Service Layer Enhancement
- [ ] Finalize `GugikGeocodingService.get_coordinates_for_pit_uke` in `app/services/gugik.py`.
- [ ] Create `app/services/pit_exporter.py` for GML generation.
    - [ ] Implement `generate_pit_gml(nodes: List[NetNode])` using Jinja2 templates or `lxml`.
    - [ ] Ensure coordinate order (X/Y) matches UKE PIT spec (usually Y, X for GML, but needs verification).

## Step 3: API & Router Implementation
- [ ] Create `app/routers/pit.py` to handle export and sync requests.
- [ ] Add `sync_pit_coordinates` background task to update all addresses without PUWG 1992 data.
- [ ] Register the new router in `app/main.py`.

## Step 4: UI Updates
- [ ] Update `templates/addresses/form_fragment.html` to display and allow editing of PUWG 1992 fields.
- [ ] Update `templates/nodes/form_fragment.html` for node-specific coordinates.
- [ ] Add "Export UKE PIT GML" button to the nodes list or admin dashboard.

## Step 5: Verification & Testing
- [ ] Create tests in `tests/test_pit_integration.py`.
- [ ] Verify GML structure against UKE PIT documentation.
- [ ] Test coordinate retrieval for known TERYT IDs.
