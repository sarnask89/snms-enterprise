## 2026-06-30 - Dictionary-based ID lookups vs Eager Loading
**Learning:** Identified a recurring performance anti-pattern where full related tables (like IpNetwork or NetNode) were fetched into memory as dictionaries for ID-to-object mapping in templates. This leads to redundant database scans and unnecessary memory overhead.
**Action:** Replace manual dictionary lookups with SQLAlchemy `joinedload` or `selectinload` and refactor templates to access relationship attributes directly (e.g., `device.ip_network.name`).
