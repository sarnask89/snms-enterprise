# Implementation Plan: SNMS Security and Technical Improvements

## Phase 1: Security Hotfixes & Foundation
*Goal: Address critical vulnerabilities and establish basic utilities.*

- [x] **Task 1.1: Secure Configuration Implementation** 
  - Update `app/config.py` to remove hardcoded `CRM_ENCRYPTION_KEY`.
  - Update `app/config.py` to remove hardcoded `CRM_ADMIN_PASSWORD`.
  - Update `app/config.py` to remove hardcoded `SECRET_KEY`.
  - Add startup validation logic to enforce presence of these keys in production. aaa26f3
- [x] **Task 1.2: Local TERYT Data Validation**
  - Verify presence of local TERYT data in `app/init_db.py` startup sequence. 27cecbc
- [x] **Task 1.3: Startup Configuration Report**
  - Implement `app/config_validation.py` to report configuration status and warnings at startup. a514431
- [x] **Task 1.4: Base Parsing Utilities**
  - Create `app/utils/parsing.py` with `parse_int` and `parse_int_optional` functions.
  - Refactor all routers to use these utilities for safe integer conversion. 7b27fb6

## Phase 2: Hardware Service Resilience & Input Sanitization
*Goal: Improve communication reliability and input validation.*

- [ ] **Task 2.1: Mikrotik Service Hardening**
  - Add `asyncio.wait_for` timeouts to all `app/services/mikrotik.py` async methods.
  - Ensure `conn.disconnect()` is called in `finally` blocks.
- [ ] **Task 2.2: DASAN Service Security**
  - Sanitize MAC addresses and other parameters in `app/services/dasan.py` using `shlex.quote` or regex.
- [ ] **Task 2.3: Data Validation Improvements**
  - Implement regex-based domain validation in `app/routers/snms_entities.py`.
  - Refactor rate-limit parsing in `app/routers/network_discovery.py` to include bounds checking.

## Phase 3: Error Handling & Code Quality
*Goal: Standardize exceptions and improve observability.*

- [ ] **Task 3.1: Standardized Database Error Handling**
  - Refactor `app/routers/helpdesk.py` and `app/routers/snms_entities.py` to catch `SQLAlchemyError` and return proper `HTTPException`.
- [ ] **Task 3.2: Structured Logging**
  - Set up `structlog` for JSON-formatted logging suitable for production monitoring.
- [ ] **Task 3.3: Pre-commit Hooks**
  - Configure `.pre-commit-config.yaml` with `black`, `isort`, `flake8`, and `bandit`.
- [x] **Task 3.4: Resolve Jinja2 Deprecation**
  - Refactor `app/templating.py` to use a preconfigured `jinja2.Environment` instead of passing extra options to `Jinja2Templates`. 7b27fb6

## Phase 4: Architectural Refactoring
*Goal: Implement Service and Repository patterns.*

- [ ] **Task 4.1: Implementation of Base Patterns**
  - Define base classes for Repositories and Services.
- [ ] **Task 4.2: Customer Module Refactoring**
  - Extract business logic into `app/services/customer_service.py`.
  - Extract data access into `app/repositories/customer_repository.py`.
  - Update `app/routers/customers.py` to use Service/Repository via Dependency Injection.
- [ ] **Task 4.3: Internal Event System**
  - Implement `EventBus` for asynchronous background tasks.
  - Refactor TERYT sync to use background event processing.

## Phase 5: Performance & Operations
*Goal: Optimize database access and monitoring.*

- [ ] **Task 5.1: Database Query Optimization**
  - Audit and fix N+1 query issues in all list views using `joinedload`.
- [ ] **Task 5.2: Caching Layer**
  - Integrate Redis and implement caching for TERYT location data.
- [ ] **Task 5.3: Standardized Pagination**
  - Implement a generic pagination utility and apply it to all large list views.
- [ ] **Task 5.4: Observability Integration**
  - Add Prometheus metrics for API performance and business metrics.
  - (Optional) Configure OpenTelemetry for distributed tracing.
