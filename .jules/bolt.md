## 2026-03-31 - Batch TERYT Address Resolution
**Learning:** Resolving TERYT address components (`street`, `city`, `commune`, `district`, `state`) during list serialization causes an N+1 query pattern where each item triggers up to 5 separate database queries.
**Action:** Use `batchResolveTerytAddresses` to collect unique component IDs across the result set and perform batch lookup queries using TypeORM's `In` operator, reducing query count from O(N) to O(1) (5 queries max).
