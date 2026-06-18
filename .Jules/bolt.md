## 2026-06-18 - SQLAlchemy Eager Loading vs Manual Dictionary Lookups
**Learning:** The codebase frequently uses an anti-pattern where entire related tables (Customers, Tariffs, etc.) are fetched into Python dictionaries to perform lookups in Jinja2 templates. This causes unnecessary memory usage and over-fetching as the database grows.
**Action:** Use SQLAlchemy's `joinedload` or `selectinload` in the router to fetch only the required related objects and refactor templates to use direct relationship access (e.g., `subscription.customer.name`).
