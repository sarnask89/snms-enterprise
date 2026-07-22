## 2026-07-22 - [O(N) Sequential Querying in Loop Anti-Pattern]
**Learning:** In group updates (e.g., adding/editing members in customer groups or device groups), performing `db.get` or subqueries sequentially within a loop results in an O(N) query bottleneck, creating unnecessary database roundtrips and degrading database performance on large datasets.
**Action:** Use a single batched query with the SQL `IN` operator (via `select(...).where(model.id.in_(ids))`) to fetch all selected records in exactly one query, reducing database roundtrips from N+1 to 1.
