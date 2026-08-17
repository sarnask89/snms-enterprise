# Bolt's Journal

## 2026-08-17 - Optimize IP Network Listing Query in TypeORM
**Learning:** In TypeORM, performing `leftJoinAndSelect` on multiple 1-to-N relations (`netDevices` and `customerDevices`) during a list fetch (`GET /ip-networks`) causes a Cartesian product of joined rows and forces TypeORM to instantiate full child entity objects in memory, even when the endpoint only needs relation counts. Using `loadRelationCountAndMap` generates count subqueries in SQL, avoiding Cartesian joins and entity instantiation overhead.
**Action:** When serializing list responses that only need count statistics for related entities, use `loadRelationCountAndMap("entity.propertyName", "entity.relation")` instead of `leftJoinAndSelect`.
