# Bolt's Journal

## 2026-05-18 - Optimized PIT Coordinate Sync Task
**Learning:** In background/async tasks like `sync_pit_coordinates_task` in `app/routers/pit.py`, querying `NetNodes` and sequentially accessing related models like `location_city` and `location_street` in a loop triggers classic N+1 database queries, creating a severe performance bottleneck.
**Action:** Always use SQLAlchemy `joinedload` to eager-load associated relations when iterating through queried models to inspect attributes of related models.
