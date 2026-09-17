## 2026-09-17 - Batch TERYT Address Resolution in Customer and Device List Endpoints
**Learning:** Sequential per-item TERYT address component lookups (`resolveTerytAddress`) during list serialization caused up to 5N database round-trips for N records on `GET /customers` and `GET /customer-devices`.
**Action:** Use `batchResolveTerytAddresses` with TypeORM `In()` operator to batch-fetch all street, city, commune, district, and state relations in at most 5 queries before array serialization.
