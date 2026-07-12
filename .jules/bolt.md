## 2026-07-02 - [Fetch Everything Anti-pattern]
**Learning:** Several routers implemented a pattern of fetching ALL rows from related tables (e.g., `Customers`, `Divisions`) into dictionaries for template lookups. This causes massive redundant memory usage and database load as the table grows, even for small paginated lists or single views.
**Action:** Replace full-table dictionary fetches with SQLAlchemy `joinedload()` to fetch only necessary related records in a single query, and update templates to use direct relationship access.
