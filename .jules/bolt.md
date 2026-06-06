## 2026-06-06 - Optimized NetNode list by removing redundant dictionary lookup
**Learning:** The `net_nodes_list` endpoint was fetching all divisions into a Python dictionary for lookups, despite already using `joinedload(models.NetNode.division)` in the main query. This resulted in an unnecessary extra database query and redundant memory usage.
**Action:** Remove manual dictionary lookups when eager loading (`joinedload`) is already implemented in the SQLAlchemy query, and use direct relationship access in templates.
