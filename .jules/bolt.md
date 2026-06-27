## 2026-06-27 - [Finance List Views Optimization]
**Learning:** Performance anti-pattern identified: fetching full related tables into Python dictionaries for lookups (O(N+M) complexity) instead of using SQLAlchemy eager loading (joinedload).
**Action:** Always use `joinedload` or `selectinload` for related entities in list views and refactor templates to access relationship attributes directly.
