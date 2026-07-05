## 2026-07-02 - [Backend N+1 and Redundant Fetches]
**Learning:** List views often fetch all customers or all related entities into a dictionary for template-side lookup, causing significant memory overhead and redundant database scans. Replacing this with SQLAlchemy `joinedload` and direct relationship access in templates is a major win.
**Action:** Always check if a router fetches a full table (like Customers) just for lookup in a list view. Use `joinedload` to fetch exactly what's needed in one query.
