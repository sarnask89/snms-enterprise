## 2025-05-13 - [Consolidated Dashboard Queries]
**Learning:** Fetching multiple counts from different tables using separate `db.scalar()` calls causes multiple database round-trips. In SQLAlchemy, these can be consolidated into a single `db.execute()` call using `scalar_subquery()` for each count. This reduced execution time by ~50% in a local SQLite environment and will have a greater impact on remote databases with higher latency.
**Action:** Always check for repeated `count()` or `scalar()` calls on the dashboard or list views and consolidate them into a single query when possible.
