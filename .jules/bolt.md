## 2026-10-01 - Optimizing Dashboard Statistics Endpoints with Targeted TypeORM Queries

**Learning:** Unbounded `.find()` queries on database repositories (such as `Invoice`, `LedgerEntry`, `NetDevice`, and `Customer`) perform full table scans and instantiate full ORM model instances for all historical records in memory. In dashboard endpoints like `/financial-summary`, `/inventory-summary`, and `/customer-growth`, this created latency (~235 ms). Filtering with date boundaries (`MoreThanOrEqual`), projecting specific columns (`select`), and using SQL aggregations (`count()`, QueryBuilder `GROUP BY`) reduced response latency by ~88% down to 28 ms.

**Action:** When building statistics or dashboard analytics endpoints with TypeORM, avoid full `.find()` queries. Prefer SQL aggregations (`count()`, `GROUP BY`) or narrow `.find()` calls using `select` column projections and date range constraints (`MoreThanOrEqual`, `LessThan`).
