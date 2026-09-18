# Bolt's Performance Journal

## 2026-09-18 - Helpdesk Queues and Categories Count Aggregation Optimization
**Learning:** Eager loading child entity collections (`categories` and `tickets`) on helpdesk queues and categories caused Cartesian product SQL joins and memory overhead for full entity allocations when only count numbers were required by the serialization schema.
**Action:** Use TypeORM's `loadRelationCountAndMap` on `QueryBuilder` (e.g., `loadRelationCountAndMap("queue.categoryCount", "queue.categories")`) to calculate child counts via SQL subqueries without instantiating entity instances.
