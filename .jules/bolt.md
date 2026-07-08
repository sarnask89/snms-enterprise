## 2026-07-08 - [Module Shadowing and Refactoring Debt]
**Learning:** The file `app/logging.py` shadows the standard Python `logging` module when running scripts with `PYTHONPATH=.`, leading to `AttributeError: module 'logging' has no attribute 'getLogger'`. Additionally, several legacy tests (e.g., `tests/test_subscriptions_logic.py`) still refer to `models.Node` instead of the refactored `models.CustomerDevice`.
**Action:** Always use full paths or explicit imports when debugging, and prefer the `new_suite` tests which use the updated model names.

## 2026-07-08 - [Fetch-all-to-dict Anti-pattern]
**Learning:** A common performance bottleneck in this codebase is fetching entire tables (e.g., `Customer`, `Tariff`) into Python dictionaries for lookups in Jinja2 templates, instead of using SQLAlchemy eager loading.
**Action:** Use `joinedload` or `selectinload` in routers and access relationship attributes directly in templates to reduce memory usage and avoid N+1 queries.
