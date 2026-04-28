# Specification: Portal Stability & Refinement

## 1. Startup Reliability
- **Problem**: Calling `alembic` migrations inside the `lifespan` handler on Windows with Uvicorn causes the process to hang or lock the SQLite database.
- **Requirement**: Implement a separate initialization check or a safer way to run migrations without blocking the main event loop.

## 2. UI Data Consistency ("None" Leaks)
- **Problem**: Fields with `None` or `NULL` values frequently render as the literal string "None" in HTML templates.
- **Requirement**: 
    - Update the `input` and `select` macros in `templates/components/` to handle nulls.
    - Systematically audit all `list_rows.html` files to use `{{ value or '—' }}`.

## 3. Search Parity
- **Problem**: Search logic in `app/routers/` often misses key fields (e.g., searching for a customer by first name fails).
- **Requirement**: Update all router `GET` methods with `q` parameters to search across all user-visible columns in the respective model.

## 4. Integration Completion
- **Problem**: Several UI elements (like PIT export buttons in Audit Logs) point to placeholder or non-existent routes.
- **Requirement**: Map these UI elements to the functional endpoints implemented in the `pit-uke-integration` and `database-backups` tracks.

## 5. Form Robustness
- **Problem**: Some forms lack robust server-side validation, leading to 500 errors if invalid types are submitted.
- **Requirement**: Use Pydantic schemas or explicit `_opt_int` parsing for all optional/integer fields.
