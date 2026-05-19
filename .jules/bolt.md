## 2026-05-19 - Batching Dashboard Count Queries
**Learning:** Multiple independent count queries (e.g., for dashboard stats) can be batched into a single SELECT statement using SQLAlchemy's `scalar_subquery()` and `label()`. This reduces database round-trips from N to 1.
**Action:** Use `db.execute(select(subquery1.label('l1'), subquery2.label('l2'))).mappings().one()` when fetching multiple counts for dashboard-like views.
