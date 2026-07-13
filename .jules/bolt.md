## 2026-07-13 - SQL Aggregation for NetFlow Stats
**Learning:** Fetching large volumes of raw records (like NetFlow aggregates) and processing them in Python memory is a major bottleneck as the dataset grows. Using database-side aggregation (`SUM`, `CASE`, `GROUP BY`) significantly reduces memory pressure and network I/O.
**Action:** Always prefer SQL aggregation for time-series data or large-scale metric calculations. Ensure dialect-awareness when using date/time formatting functions (e.g., `strftime` for SQLite vs `to_char` for PostgreSQL).
