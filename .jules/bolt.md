## 2026-09-08 - Batching TERYT Address Resolution for Entity Lists
**Learning:** In `crm-portal-ts`, entity serialization for customers and customer-devices calls `resolveTerytAddress()` per row, causing up to 5 sequential database queries per item (N+1 query pattern).
**Action:** Use `batchResolveTerytAddresses` with TypeORM's `In()` operator across all items in `GET /` endpoints before serialization to fetch state, district, commune, city, and street relations in O(1) database round-trips.
