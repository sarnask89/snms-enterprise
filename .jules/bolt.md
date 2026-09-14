## 2026-09-14 - Batch TERYT Address Resolution
**Learning:** Sequential resolution of TERYT address relations (street -> city/commune -> district -> state) during customer and device list serialization leads to an N+1 query bottleneck (doing up to 5 SQL queries per item).
**Action:** Use `batchResolveTerytAddresses` with TypeORM's `In` operator to batch-fetch missing TERYT address relations across all items in a list prior to serialization, reducing database round-trips from O(N) to O(1).
