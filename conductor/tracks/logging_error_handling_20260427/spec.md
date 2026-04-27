# Specification - Centralized Logging & Error Handling

## Overview
This track aims to modernize the application's observability and resilience by centralizing logging and implementing a robust, HTMX-aware exception handling mechanism.

## Scope
- **Centralized Logging:**
  - Create a standard logging configuration in `app/logging.py`.
  - Implement a middleware to log incoming requests, user context, and response times.
- **Exception Handling:**
  - Define global exception handlers in `app/main.py` for common errors (Validation, Database, TERYT).
  - Ensure all `except Exception:` blocks log the error before returning fallbacks.
- **UI Resilience:**
  - Create reusable HTMX-compatible error fragments.
  - Implement logic to return user-friendly error messages into UI components without breaking the layout.

## Technical Details
- **Backend:** Python `logging` module, FastAPI `exception_handler`.
- **Frontend:** HTMX headers (e.g., `HX-Retarget`) for error steering.

## Constraints
- Logging must not expose sensitive data (passwords, secrets).
- Performance overhead of request logging must be minimal.
