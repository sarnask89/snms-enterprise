# GitHub Agent Code Review Guide - CRM Portal

This guide provides a structured framework for performing codebase reviews for the `crm-portal` project, based on historical security and technical audits.

## 📋 Summary of Review Categories

Reviews should categorize findings into these four buckets:
1.  **Security**: Vulnerabilities, credential leaks, and data protection.
2.  **Technical/Architectural**: Design patterns, service abstraction, and dependency management.
3.  **Performance**: Query efficiency (N+1), caching, and responsiveness.
4.  **Quick Fixes**: Immediately actionable code-level improvements.

---

## ✅ Review Checklist

### 1. Security & Data Protection
- [ ] **Secrets Management**: Are there any hardcoded keys, passwords, or tokens in `config.py` or elsewhere? Ensure `SECRET_KEY` and `CRM_ENCRYPTION_KEY` have no insecure defaults.
- [ ] **PII Protection**: Is Personal Identifiable Information (PII) like phone numbers or emails being logged in plaintext? Verify redaction/masking logic.
- [ ] **Startup Validation**: Does the application validate critical external dependencies (e.g., TERYT WS, Database) at startup?
- [ ] **Injection Prevention**: Are all shell commands (e.g., DASAN SSH) properly escaped using `shlex.quote`? Verify SQLAlchemy ORM parameterization.
- [ ] **Rate Limiting**: Do public-facing or expensive API endpoints (e.g., TERYT search) have rate limits?
- [ ] **CSRF & Security Headers**: Do state-changing operations (POST/DELETE) include CSRF protection?

### 2. Architectural Integrity
- [ ] **Service Layer**: Is business logic isolated in services, or is it leaking into route handlers?
- [ ] **Repository Pattern**: Are database queries centralized in repositories or scattered across the codebase?
- [ ] **Error Handling**: Are `except Exception` blocks used too broadly? Ensure specific exceptions (e.g., `SQLAlchemyError`, `IntegrityError`) are caught with proper logging and HTTP 4xx/5xx responses.
- [ ] **Dependency Injection**: Are dependencies (DB sessions, services) injected via FastAPI's `Depends`?

### 3. Performance & Efficiency
- [ ] **N+1 Queries**: Are collections and relationships using eager loading (`joinedload`, `selectinload`) where appropriate?
- [ ] **Blocking Operations**: Are long-running tasks (e.g., TERYT sync) blocking the main thread? Use async events or background tasks.
- [ ] **Timeouts**: Do all external network calls (Mikrotik, DASAN, Geocoding) have explicit timeouts?
- [ ] **Pagination**: Do endpoints returning lists support `page` and `per_page` parameters?

### 4. Code Quality
- [ ] **Integer Safety**: Are URL/Form parameters safely converted to integers using utility functions like `parse_int_optional`?
- [ ] **Type Safety**: Are functions properly annotated with Python type hints?
- [ ] **Sanitization**: Is user input sanitized before being used in logic or rendered in templates?

---

## 🚫 Common Patterns & Pitfalls

| Pitfall | Impact | Recommended Pattern |
| :--- | :--- | :--- |
| **Silent Returns** | Returns `[]` or `None` on error without logging. | Raise `HTTPException` or return `(success, data)` tuple. |
| **PII in Audit Logs** | Compliance risk (GDPR). | Use `mask_pii()` utility for details field. |
| **Unbounded Loops** | Memory exhaustion on large datasets. | Mandatory pagination and `limit()` on queries. |
| **Raw Exception Leak** | Reveals schema/paths to users. | Use global exception handlers to return generic messages. |
| **Blocking `to_thread`** | Hangs the worker if thread never returns. | Wrap `asyncio.to_thread` in `asyncio.wait_for` with a timeout. |

---

## 🏆 Standard of Quality

For a PR to be approved in `crm-portal`, it must meet these standards:

1.  **Zero Critical Vulnerabilities**: No hardcoded secrets or plaintext credentials.
2.  **Explicit Error Handling**: Every database and network operation must have a `try/except` block with specific exceptions and logging.
3.  **Comprehensive Logging**: Use structured logging (or consistent `logger` calls) that include context (e.g., `resource_id`, `operation`).
4.  **Type Completeness**: All new functions must have complete type hints.
5.  **Verified Integrity**: Changes must not introduce N+1 query patterns.
6.  **Fail-Fast Configuration**: Critical configuration missing from `.env` must prevent the application from starting in production.

---
*Last Updated: 2026-04-28*
*Based on GitHub Copilot Security & Technical Audit v1.0*
