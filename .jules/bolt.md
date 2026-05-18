## 2025-05-15 - Dashboard Query Batching
**Learning:** Multiple independent `SELECT COUNT(*)` queries on the dashboard and API endpoints were causing redundant database round-trips. Batching these into a single `SELECT` statement using SQLAlchemy `scalar_subquery()` calls significantly reduces latency.
**Action:** Always check dashboard or status-style endpoints for sequential count queries and batch them into a single request.
