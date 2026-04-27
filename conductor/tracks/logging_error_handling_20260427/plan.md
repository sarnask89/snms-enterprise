# Implementation Plan - Centralized Logging & Error Handling

## Phase 1: Logging Foundation
- [ ] Task: Implement centralized logging configuration
    - [ ] Create `app/logging.py` with standard handlers and formatters
    - [ ] Integrate logger into `app/main.py`
- [ ] Task: Create Request/Response logging middleware
    - [ ] Implement middleware to log URL, method, user, and execution time
    - [ ] Add unit tests for middleware context logging
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Logging Foundation' (Protocol in workflow.md)

## Phase 2: Error Resilience
- [ ] Task: Implement global FastAPI exception handlers
    - [ ] Write handlers for `SQLAlchemyError` and `HTTPException`
    - [ ] Implement HTMX-aware response logic (return fragments vs pages)
- [ ] Task: Refactor silent failures in critical services
    - [ ] Audit and fix bare `except:` blocks in `app/teryt_ws.py`
    - [ ] Ensure all handled errors are recorded in logs
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Error Resilience' (Protocol in workflow.md)
