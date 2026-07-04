## 2026-07-04 - [Dialect-Aware Monitoring Aggregation]
**Learning:** In high-traffic monitoring routes (NetFlow), shifting aggregation from Python memory to the database using `GROUP BY` and `SUM` provides a significant performance boost. However, since the app supports both SQLite (dev) and PostgreSQL (prod), SQL time-grouping functions must be dialect-aware.
**Action:** Use `db.bind.dialect.name` to switch between `func.strftime` (SQLite) and `func.to_char` (PostgreSQL) for time-series grouping.

## 2026-07-04 - [N+1 History Fetching]
**Learning:** The `get_device_stats_json` endpoint previously fetched history records in a loop for each monitor item, leading to N+1 queries.
**Action:** Use batch fetching with `models.MonitorHistory.item_id.in_(ids)` and a Python dictionary map to reduce database round-trips to a single query.
