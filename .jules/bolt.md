## 2026-09-03 - Batch TERYT Address Resolution for Entity Lists
**Learning:** In `crm-portal-ts`, entity list endpoints for customers and customer devices were executing O(N) database queries (up to 5 queries per item) to resolve TERYT address hierarchies (street -> city -> commune -> district -> state).
**Action:** Use `batchResolveTerytAddresses` in `teryt_address_links.ts` with TypeORM's `In(...)` operator to batch-fetch all required TERYT address entities in O(1) queries before mapping items during list serialization.
