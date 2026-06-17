## 2026-06-17 - Optimized Admin Logs and Reloads
**Learning:** Found a recurring anti-pattern where the entire `portal_users` table was loaded into memory for lookup instead of using SQLAlchemy relationships (`joinedload`).
**Action:** Always check for `joinedload` opportunities when related entities are displayed in lists, especially for "actor" or "creator" fields. Ensure that the relationship is defined in the SQLAlchemy model before using it in queries.
