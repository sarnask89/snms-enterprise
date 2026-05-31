## 2026-05-31 - [Batch Dashboard Count Queries]
**Learning:** Multiple independent `COUNT` queries on the dashboard create unnecessary database round-trips. While each query is fast, the cumulative latency (especially over a network) adds up. Using SQLAlchemy `scalar_subquery()` allows batching these into a single `SELECT` statement.
**Action:** Always check for clusters of independent aggregate queries (COUNT, SUM, etc.) in dashboard or report views and batch them into a single query.
