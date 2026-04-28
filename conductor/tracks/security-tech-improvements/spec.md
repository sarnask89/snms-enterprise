# Specification: SNMS Security and Technical Improvements

## 1. Problem Statement
The SNMS Enterprise application, while functional, has several critical security vulnerabilities (hardcoded keys, weak defaults), inconsistent error handling, and architectural debt (logic mixed in routers) that need to be addressed for production readiness.

## 2. Goals
- Eliminate critical security vulnerabilities.
- Standardize error handling and logging.
- Improve input validation and sanitization.
- Introduce architectural patterns (Service/Repository) to improve maintainability.
- Enhance operational monitoring and performance.

## 3. Key Requirements

### 3.1 Security
- **Config Protection**: Remove all hardcoded default secrets/keys from `app/config.py`. Use environment variables with mandatory validation at startup.
- **Credential Management**: Enforce strong admin passwords and validate external service credentials (TEYRT) at startup.
- **Sensitive Data**: Implement encryption at rest for sensitive fields in models (PII, passwords).
- **Network Security**: Fix command injection risks in hardware services (DASAN/Mikrotik) and add timeouts.
- **Protection**: Add CSRF protection and Rate Limiting on public/state-changing endpoints.

### 3.2 Code Quality & Error Handling
- **Safe Parsing**: Implement utility functions for safe integer/string parsing to prevent 500 errors on bad user input.
- **Standardized Errors**: Refactor routers to use proper HTTP exceptions (400, 404, 409, 500) with descriptive but non-leaking messages.
- **Audit Logging**: Ensure audit logs are reliable and mask PII.

### 3.3 Architecture
- **Service Layer**: Extract business logic from routers into dedicated service classes.
- **Repository Layer**: Consolidate data access queries into repositories.
- **Dependency Injection**: Use FastAPI dependency injection for services and repositories.
- **Async Events**: Implement an event system for long-running tasks (e.g., TERYT sync).

### 3.4 Performance & Operations
- **Query Optimization**: Implement eager loading to fix N+1 problems.
- **Caching**: Add Redis caching for frequently accessed TERYT/City data.
- **Pagination**: Implement pagination for all large list views.
- **Observability**: Add Prometheus metrics and structured JSON logging.

## 4. References
- `docs/GH-CODE_REVIEW_SECURITY_IMPROVEMENTS.md`
- `docs/GH-QUICK_FIXES.md`
- `docs/GH-TECHNICAL_IMPROVEMENTS.md`
