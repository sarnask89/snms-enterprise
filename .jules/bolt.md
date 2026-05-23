## 2026-05-23 - Batch Dashboard Count Queries
**Learning:** Multiple independent `SELECT COUNT(*)` queries in dashboard routers cause unnecessary database round-trips. Consolidating them into a single `SELECT` statement using SQLAlchemy `scalar_subquery()` calls significantly reduces latency.
**Action:** Always prefer batching independent scalar queries (like counts) into a single statement when they are executed together on the same page load.
