## 2025-05-15 - Batching Dashboard Counts
**Learning:** Multiple independent `SELECT COUNT(*)` queries on the dashboard create unnecessary database round-trips. In local SQLite tests, batching 7 counts into a single SQL statement using `scalar_subquery()` reduced execution time by ~55%.
**Action:** Always check dashboard or report views for multiple independent count queries and batch them using `scalar_subquery()` or a single `select` with multiple columns.
