
## 2026-09-06 - Eager loading Subscription relations in `app/routers/subscriptions.py`
**Learning:** Fetching full tables into in-memory dictionaries (`customers = {c.id: c for c in db.scalars(select(models.Customer)).all()}`) to build template context creates unnecessary database queries and loads irrelevant entities into memory. Using SQLAlchemy `joinedload` (`joinedload(models.Subscription.customer)`, `joinedload(models.Subscription.tariff)`, `joinedload(models.Subscription.device)`) directly fetches only the required joined relations in a single optimized SQL query.
**Action:** When listing entities with foreign key relationships, replace full-table in-memory dictionary lookups with `joinedload` on `select()`.
