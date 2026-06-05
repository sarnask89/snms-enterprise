## 2026-06-05 - Batching Dashboard Statistics
**Learning:** Sequential scalar count queries on the dashboard create unnecessary database round-trip overhead (7 queries in the main router, 4 in the API). Batching these using SQLAlchemy `scalar_subquery()` in a single `select()` statement reduced execution time by ~55% in local benchmarks.
**Action:** Always look for opportunities to batch multiple independent aggregate queries (counts, sums) into a single SQL statement on entry pages or high-traffic endpoints.
