## 2026-09-11 - TypeORM Relation Count vs Eager Loading
**Learning:** In TypeORM endpoints that only need relation counts (e.g., subscription count per tariff), using `loadRelationCountAndMap` avoids eager joins (`leftJoinAndSelect`) that instantiate full child entity trees in memory.
**Action:** Use `.loadRelationCountAndMap("tariff.subscriptionCount", "tariff.subscriptions")` for summary listing routes.
