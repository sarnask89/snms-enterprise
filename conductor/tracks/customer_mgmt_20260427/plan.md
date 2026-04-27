# Implementation Plan - Customer & Address Management

## Phase 1: Foundation & Address Discovery
- [x] Task: Implement TERYT address search backend (a3ef152)
    - [x] Write unit tests for TERYT search service
    - [x] Implement search logic for cities/streets/buildings
- [x] Task: Create HTMX address lookup component (f1231bc)
    - [x] Create Jinja2 templates for address search result fragments
    - [x] Implement live-search UI with HTMX
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Address Discovery' (Protocol in workflow.md)

## Phase 2: Customer CRM Integration
- [ ] Task: Extend Customer model for TERYT links
    - [ ] Add migration for TERYT relationship columns
    - [ ] Update SQLModel definitions
- [ ] Task: Implement Customer CRUD with address linking
    - [ ] Write integration tests for Customer creation with TERYT address
    - [ ] Build Customer form with integrated address lookup
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Customer CRM Integration' (Protocol in workflow.md)
