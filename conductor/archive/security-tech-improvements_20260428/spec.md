# Specification: SNMS Security and Technical Improvements

## 1. Introduction
This document specifies the requirements for improving the security posture and technical architecture of the SNMS Enterprise application. It is based on the comprehensive audit performed on April 28, 2026.

## 2. Security Requirements

### 2.1 Configuration Security
- **Secret Management**: All encryption keys (`CRM_ENCRYPTION_KEY`) and secret keys (`CRM_SECRET_KEY`) must be moved from defaults to environment variables.
- **Startup Validation**: The application must fail to start if critical security environment variables are missing or use insecure defaults in production.
- **Credential Protection**: Admin credentials must be configurable and enforced to be strong (min 8 chars, mixed case, digits).

### 2.2 External Service Security
- **TEYRT Validation**: Validate connectivity and credentials for the TERYT WS at application startup to prevent silent failures in address synchronization.

### 2.3 Hardware Service Resilience
- **Timeouts**: All external calls to hardware devices (Mikrotik, DASAN) must have explicit timeouts to prevent thread/process exhaustion.
- **Resource Management**: Ensure connections are properly closed even in case of exceptions.

## 3. Architectural Requirements

### 3.1 Separation of Concerns
- **Service Layer**: Extract business logic from FastAPI routers into dedicated Service classes to improve testability and reuse.
- **Repository Pattern**: Centralize database queries into Repository classes to simplify optimization and data access logic.
- **Dependency Injection**: Leverage FastAPI's dependency injection to manage service and repository lifecycles.

### 3.2 Asynchronous Operations
- **Event Bus**: Implement an internal event system for long-running or background tasks (e.g., TERYT synchronization) to keep HTTP responses fast.

## 4. Stability and Code Quality

### 4.1 Error Handling
- **Standardization**: Use consistent error handling patterns across all routers.
- **Information Leakage**: Prevent detailed database or system information from leaking in HTTP responses.
- **Input Validation**: Use safe parsing utilities for all external inputs (e.g., URL parameters, form data).

### 4.2 Type Safety
- **Full Type Hinting**: Move towards 100% type annotation coverage and enforce it with `mypy`.

### 4.3 Performance
- **Eager Loading**: Fix N+1 query problems in large list views (Customers, Nodes, Tickets).
- **Caching**: Implement Redis caching for static or semi-static lookup data (TERYT cities/streets).
- **Pagination**: Implement standardized pagination for all resource list endpoints.

## 5. References
- `docs/GH-CODE_REVIEW_SECURITY_IMPROVEMENTS.md`
- `docs/GH-QUICK_FIXES.md`
- `docs/GH-TECHNICAL_IMPROVEMENTS.md`
