# Implementation Plan - Research Legacy Mikrotik Microservices

## Phase 1: Source Code Discovery
- [ ] Task: Scan old directories for Mikrotik microservices
    - [ ] Search `copilotpy/` for Python files referencing 'mikrotik' or 'routeros'
    - [ ] Search `strapi-local/` for Python files referencing 'mikrotik' or 'routeros'
    - [ ] Document findings and file locations
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Source Code Discovery' (Protocol in workflow.md)

## Phase 2: Logic Extraction & Analysis
- [ ] Task: Analyze found microservices
    - [ ] Extract relevant DHCP lease logic
    - [ ] Extract relevant QoS / Rate-Limiting logic
    - [ ] Extract diagnostic logic
- [ ] Task: Propose refactoring strategy
    - [ ] Map legacy features to the new CRM Portal `app.services.mikrotik`
    - [ ] Draft an integration document for the new features
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Logic Extraction & Analysis' (Protocol in workflow.md)
