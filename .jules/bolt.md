## 2026-07-02 - SQL Optimization: Eager Loading vs Manual Dictionaries
**Learning:** Found a recurring anti-pattern where entire related tables (e.g., Customers, Divisions) were fetched into Python dictionaries to perform lookups in Jinja2 templates. This causes massive memory overhead and database strain as the dataset grows.
**Action:** Use SQLAlchemy `joinedload` for many-to-one relationships and access attributes directly via the relationship object in templates. This reduces multiple full-table scans to a single efficient JOIN.
