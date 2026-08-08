# Bolt's Journal - Critical Performance Learnings

## 2026-08-08 - Initial Learnings & Past Work
**Learning:** Sequential DB gets inside loops (N+1 queries) can be resolved by batching with SQLAlchemy `.in_()`, pre-fetching matching records, or using SQLAlchemy `joinedload` for relationships (especially for related Entities like Customer, Division).
Regular expressions should be compiled at the module level to avoid recompilation overhead in heavy polling or processing loops.
Dynamic prefix paths regexes (e.g., `fr"{port_id}/..."`) should be compiled exactly once *outside* processing loops.
**Action:** Always batch queries or pre-compile regexes. Maintain an in-memory normalized street-to-ID pre-fetching cache for bulk/discovery operations to resolve N+1 street name matching bottlenecks.
