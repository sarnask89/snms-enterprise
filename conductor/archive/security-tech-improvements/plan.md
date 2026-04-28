# Implementation Plan: SNMS Security and Technical Improvements

## Phase 1: Security Hotfixes
Critical security vulnerabilities that must be fixed immediately.

- [ ] **Task 1.1: Config Security Hardening**
  - Remove hardcoded `CRM_ENCRYPTION_KEY` from `app/config.py`.
  - Remove hardcoded `SECRET_KEY` default.
  - Remove default `CRM_ADMIN_PASSWORD` ("test").
  - Add startup validation for these environment variables.
- [ ] **Task 1.2: External Service Validation**
  - Add TERYT WS credential validation to `app/init_db.py` startup sequence.
- [ ] **Task 1.3: Update Configuration Templates**
  - Update `.env.example` with all new required variables and descriptions.

## Phase 2: Error Handling & Utility Layer
Improving application stability and user experience through standardized error management.

- [ ] **Task 2.1: Safe Parsing Utilities**
  - Create `app/utils/parsing.py` with `safe_int` and other parsing helpers.
  - Refactor routers to use these helpers instead of manual `int()` conversion.
- [ ] **Task 2.2: Standardize Exception Handling**
  - Update `app/errors.py` to prevent detail leakage in production.
  - Refactor `app/routers/helpdesk.py` and `app/routers/snms_entities.py` to use proper SQLAlchemy exception handling.
- [ ] **Task 2.3: Audit Log PII Masking**
  - Implement `mask_pii` utility.
  - Update `record_audit` calls to use masking for sensitive fields.

## Phase 3: Hardware Service & Validation Enhancements
Fixing reliability issues in device communication and input validation.

- [ ] **Task 3.1: Hardware Service Resilience**
  - Add timeouts and proper error handling to `app/services/mikrotik.py` (all async methods).
  - Fix command injection risk in `app/services/dasan.py` by using `shlex.quote` for MAC addresses.
- [ ] **Task 3.2: Domain & Network Validation**
  - Implement regex-based domain validation in `app/routers/snms_entities.py`.
  - Improve rate-limit parsing in `app/routers/network_discovery.py` with bounds checking.
- [ ] **Task 3.3: Rate Limiting & Protection**
  - Integrate `slowapi` for rate limiting on TERYT endpoints.
  - (Optional/Later) Implement CSRF protection mechanism.

## Phase 4: Architectural Refactoring
Introducing patterns for long-term maintainability.

- [ ] **Task 4.1: Base Service/Repository Patterns**
  - Define base classes or patterns for Services and Repositories.
- [ ] **Task 4.2: Refactor Customer Module**
  - Extract logic into `CustomerService` and `CustomerRepository`.
  - Update `app/routers/customers.py` to use these services via Dependency Injection.
- [ ] **Task 4.3: Async Event System**
  - Implement internal event bus for TERYT synchronization.

## Phase 5: Performance & Observability
Optimizing for speed and production monitoring.

- [ ] **Task 5.1: Database Optimization**
  - Implement `joinedload`/`selectinload` in common list queries to fix N+1 issues.
- [ ] **Task 5.2: Caching & Pagination**
  - Add Redis-based caching for TERYT city/street lookups.
  - Implement standardized pagination for large lists (Customers, Nodes, Tickets).
- [ ] **Task 5.3: Production Logging & Metrics**
  - Switch to structured JSON logging (e.g., `structlog`).
  - Add Prometheus metrics for HTTP requests and business KPIs.
