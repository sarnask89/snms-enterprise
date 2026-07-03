## 2026-07-03 - [Optimization Anti-pattern: Redundant Manual Lookups]
**Learning:** Even when using SQLAlchemy eager loading (joinedload), performing a separate full-table scan to create a lookup dictionary in memory for the same related data is redundant and wasteful.
**Action:** Always verify if relationship data is already fetched via joinedload and refactor templates to use direct relationship access (e.g., item.related.name) instead of manual dictionary lookups.
