# Specification - Research Legacy Mikrotik Microservices

## Overview
This track focuses on locating, analyzing, and potentially extracting legacy Python microservices used for Mikrotik management from the old project folders (`copilotpy/` and `strapi-local/`).

## Scope
- **Source Code Recovery:**
  - Search the `copilotpy/` directory for Python scripts matching Mikrotik logic (e.g., REST API, legacy API, RouterOS commands).
  - Search the `strapi-local/` directory for similar scripts.
- **Analysis:**
  - Understand how the legacy microservices handled tasks like static leases, QoS queues, and automated diagnostic checks.
  - Determine what components can be re-used, refactored, or discarded in the current CRM Portal architecture.

## Technical Details
- Extract logic from legacy Python files.
- Compare legacy libraries (e.g., `routeros_api`, `paramiko`) against current usage.

## Constraints
- Do not blindly copy-paste old code; it must be adapted to the new FastAPI architecture and `app.services` standards.
- Avoid introducing technical debt or deprecated libraries into the new codebase.
