# Specification: Full-Stack Bug Fix and Browser Extension Audit

## Overview
This track aims to resolve multiple stability issues within the CRM Portal's backend and address UI display glitches on the frontend. Additionally, it includes a comprehensive verification phase using the MCP Chrome browser extension to ensure a high-quality user experience and robust DOM interaction.

## Functional Requirements
### Backend Stability
- **Comprehensive Audit:** Identify and fix recurring errors in FastAPI endpoints and SQLAlchemy service logic.
- **Data Integrity:** Ensure database constraints and validation logic are robust across all core modules (Customers, TERYT, Subscriptions).

### Frontend UI/UX
- **Display Fixes:** Resolve Jinja2 template rendering errors and ensure consistent element positioning.
- **Responsiveness:** Ensure the UI scales correctly and remains usable across different viewport sizes.

### Browser Extension Verification
- **UI/UX Audit:** Use the MCP Chrome extension to verify layout stability, accessibility, and visual consistency.
- **DOM Interaction:** Validate that the extension can correctly read, inspect, and interact with the page's HTML structure.
- **Full User Flow:** Execute end-to-end tests for critical paths (e.g., login, searching for a customer, viewing diagnostics).

## Acceptance Criteria
- Backend test suite passes with zero errors and meets the >80% coverage target.
- Frontend UI display glitches are resolved and verified across primary templates.
- Successful execution of all manual verification steps using the MCP browser extension, with documented results.

## Out of Scope
- Implementing new features or external integrations (e.g., MikroTik REST-API).
- Major architectural refactoring unrelated to current stability issues.
