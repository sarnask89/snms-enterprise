# Implementation Plan - Customer & Address Management

## Phase 1: Foundation & Address Discovery
- [ ] Task: Implement TERYT address search backend
    - [ ] Write unit tests for TERYT search service
    - [ ] Implement search logic for cities/streets/buildings
- [ ] Task: Create HTMX address lookup component
    - [ ] Create Jinja2 templates for address search result fragments
    - [ ] Implement live-search UI with HTMX
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Address Discovery' (Protocol in workflow.md)

## Phase 2: Customer CRM Integration
- [ ] Task: Extend Customer model for TERYT links
    - [ ] Add migration for TERYT relationship columns
    - [ ] Update SQLModel definitions
- [ ] Task: Implement Customer CRUD with address linking
    - [ ] Write integration tests for Customer creation with TERYT address
    - [ ] Build Customer form with integrated address lookup
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Customer CRM Integration' (Protocol in workflow.md)
