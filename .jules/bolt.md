# Bolt's Performance Journal

## 2026-07-17 - Batching Counts on Dashboard Homepages
**Learning:** Sequential scalar count queries on the home dashboard (for both the legacy Jinja2 layout and the modernized Nuxt v2 API) create an N+1-like performance bottleneck because each query requires a full database round-trip. This can cause high latency during initial dashboard page load.
**Action:** Always batch counts of multiple different resources/models into a single database query using SQLAlchemy's `scalar_subquery()` or SQL-side aggregation. This reduces database round-trip overhead down to 1 query.
