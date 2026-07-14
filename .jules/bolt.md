## 2026-07-02 - [N+1 and Full-Table Fetch Anti-pattern]
**Learning:** Multiple routers (e.g., subscriptions, finances, documents) were fetching all customers and tariffs into dictionaries to perform lookups in Jinja2 templates. This causes redundant database traffic and memory overhead, especially as the database grows.
**Action:** Use SQLAlchemy `joinedload` for eager loading of relationships and access them directly in the templates, eliminating the need for separate lookup dictionaries.
