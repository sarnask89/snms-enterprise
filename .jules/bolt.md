# Bolt's Performance Journal

## 2026-07-10 - Dialect-aware NetFlow Aggregation and N+1 Query Elimination
**Learning:** Python-side aggregation of large datasets (like NetFlow aggregates) is a major bottleneck. Moving this to the database using `GROUP BY` and `CASE` statements reduces data transfer by orders of magnitude. Furthermore, monitoring endpoints often suffer from N+1 patterns when fetching the "latest" status or history for multiple items; these can be efficiently resolved using batching (`IN` clause) or subqueries with joins.
**Action:** Always prefer database-side aggregation for time-series data. Use `db.bind.dialect.name` to maintain multi-dialect compatibility for date formatting functions like `strftime` vs `to_char`.
