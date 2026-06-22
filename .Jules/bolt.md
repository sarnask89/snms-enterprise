## 2026-06-22 - [Optimized SNMS entities list views]
**Learning:** Found the "full-table lookup map" anti-pattern in `snms_entities.py` where entire tables (Customers, Templates, Devices) were loaded into memory as dictionaries to perform lookups for list views. This leads to O(N) database queries (N+1 problem) and excessive memory usage.
**Action:** Replace manual dictionary lookups with SQLAlchemy `joinedload` for Eager Loading in list endpoints, and update Jinja2 templates to use direct relationship access.
