## 2026-05-17 - [Batching Dashboard Count Queries]
**Learning:** Consolidating multiple independent count queries into a single SELECT statement using SQLAlchemy scalar subqueries significantly reduces database round-trips and improves execution time by ~45% in environments with network latency or high per-query overhead (even in SQLite).
**Action:** Always check for multiple sequential counts in dashboard-like views and batch them into a single query.

## 2026-05-17 - [Shadowing the 'logging' module]
**Learning:** A file named 'app/logging.py' shadows the standard Python 'logging' library when running with PYTHONPATH=. This can cause confusing 'AttributeError' in third-party libraries (like SQLAlchemy or Alembic) that expect the standard library.
**Action:** Avoid naming modules 'logging.py' or 'json.py' in the main application package to prevent shadowing. If it exists, be extremely careful when performing operations that might trigger a re-import of the standard library in a context where the local 'app' package is prioritized.
