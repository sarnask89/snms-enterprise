# Bolt's Journal ⚡

## 2026-08-07 - [Joined Load Document Customer Optimizer]
**Learning:** Selecting all rows from the `Customer` table (`db.scalars(select(models.Customer)).all()`) to build an in-memory mapping for a specific target view is highly slow and creates a severe memory overhead as the database scales. Eager-loading the association via SQLAlchemy's `joinedload` option enables a highly optimized `JOIN` query, returning exactly the required fields in a single efficient query.
**Action:** Always prefer SQLAlchemy `joinedload` on relationships over full table in-memory map dictionaries when rendering foreign keys/relations in server-side lists and templates.
