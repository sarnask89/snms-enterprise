## 2026-08-20 - TypeORM Child Entity Eager Joining vs loadRelationCountAndMap

**Learning:** Using `leftJoinAndSelect` on child entity collections (such as `city.streets` or `node.devices`) merely to calculate array length (`.length`) creates Cartesian products in SQL results and forces TypeORM to instantiate thousands of child entity instances in memory. Replacing `leftJoinAndSelect` with `loadRelationCountAndMap` maps child counts directly as scalar properties without entity instantiation overhead.

**Action:** When querying parent entities in TypeORM where child relations are only used for aggregate counts, use `.loadRelationCountAndMap()` instead of `.leftJoinAndSelect()`.
