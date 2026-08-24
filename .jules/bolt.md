# Bolt's Journal

## 2026-08-24 - TypeORM Entity Instantiation vs Relation Count Mapping
**Learning:** In TypeORM (`crm-portal-ts`), using `leftJoinAndSelect` on child collections (such as `tariff.subscriptions`) when only counting or serializing summary counts causes TypeORM to instantiate full child entity JavaScript objects for every row in memory. Replacing `leftJoinAndSelect` with `loadRelationCountAndMap` delegates the count computation directly to SQL subqueries/aggregates and avoids allocating hundreds/thousands of JavaScript entity instances.
**Action:** When serializing parent entities that only expose child counts, use `loadRelationCountAndMap("parent.countProp", "parent.relation")` instead of eager `leftJoinAndSelect`.

## 2026-08-24 - Deduplicating Primary Keys in TypeORM Batch Lookups
**Learning:** Extracting secondary foreign key IDs from large lists (e.g. `devices.map(d => d.customer?.locationStreetId)`) produces arrays with high duplicate density. Passing non-deduplicated arrays to TypeORM repository `In(...)` queries bloats SQL query parameters with redundant values.
**Action:** Always wrap extracted FK ID arrays in `Array.from(new Set(...))` before querying database repositories with `In()`.
