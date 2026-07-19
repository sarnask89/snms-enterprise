## 2026-07-19 - [Helpdesk Full-Table Mapping Lookup Anti-Pattern]
**Learning:** Instantiating full-table lists as dictionaries in controllers to map relationship keys in templates causes massive DB query and memory overhead (O(N) load on every page view).
**Action:** Always utilize SQLAlchemy's eager-loading features (such as `selectinload` or `joinedload`) and fetch relations directly via the model instance in Jinja2 templates instead of custom controller-side dictionary mappings.
