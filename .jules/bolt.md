## 2026-03-31 - Customer Devices TERYT Address Batching
**Learning:** In `customer_devices.ts`, calling `serializeDevice` on a list of `CustomerDevice` entities caused individual `resolveTerytAddress` lookups per device, creating an N+1 query problem across `LocationStreet`, `LocationCity`, `LocationCommune`, `LocationDistrict`, and `LocationState`.
**Action:** Use `batchResolveTerytAddresses` to collect all TERYT IDs across the result set and perform batch lookups using TypeORM's `In()` operator before mapping results.
