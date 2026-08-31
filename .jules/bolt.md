
## 2026-08-31 - Batch TERYT Address Resolution for Customer and Device Lists
**Learning:** Resolving TERYT address relations (`state`, `district`, `commune`, `city`, `street`) individually per item in customer or customer device list endpoints generates N+1 database queries during serialization.
**Action:** Use `batchResolveTerytAddresses` in `crm-portal-ts/src/teryt_address_links.ts` to collect unique state, district, commune, city, and street IDs across list items and bulk-fetch them in single TypeORM `In()` queries prior to serialization.
