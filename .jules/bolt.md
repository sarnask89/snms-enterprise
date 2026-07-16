# Bolt's Performance Journal

## 2026-07-02 - [N+1 query patterns in Jinja2 templates]
**Learning:** Jinja2 templates in this codebase often use dictionary-based lookups (e.g., `networks.get(d.ip_network_id)`) which requires fetching full tables into memory.
**Action:** Replace dictionary lookups with SQLAlchemy `joinedload` and direct relationship access in templates. This significantly reduces database round-trips and memory overhead from unused data.
