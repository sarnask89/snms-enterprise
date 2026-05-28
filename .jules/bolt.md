## 2026-05-28 - Eager Loading and Redundant Query Elimination
**Learning:** Significant performance gains (~80% in benchmarks) were achieved by replacing full-table manual lookups with SQLAlchemy `joinedload` and in-memory map construction. Fetching thousands of rows into a dictionary for a simple ID lookup is a major anti-pattern in this codebase's legacy routers.
**Action:** Always check if a full table `db.scalars(select(Model)).all()` is being used to build a lookup map for a list view, and replace it with `joinedload` on the main query.
