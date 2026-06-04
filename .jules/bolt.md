
## 2026-06-04 - Eager Loading vs. Manual Dictionary Lookups
**Learning:** Fetching full related tables (e.g., Customers, Tariffs) into Python dictionaries for manual lookups in templates is a major performance anti-pattern. While O(1) lookup in memory, the initial fetch is O(Total_Table_Size), which scales poorly. SQLAlchemy's `joinedload` allows fetching only the necessary data in a single SQL query, significantly reducing database round-trips and memory overhead.
**Action:** Always prefer SQLAlchemy eager loading (`joinedload`, `selectinload`) over manual in-memory joins or lookups for related entities in list views.
