## 2026-07-07 - [N+1 Query in GPU Monitoring]
**Learning:** The GPU monitoring dashboard performed a separate database query for every active GPU to fetch its latest status, leading to O(N) queries.
**Action:** Use a subquery with  joined back to the main stats table to fetch all latest statuses in a single optimized query.
## 2026-07-07 - [N+1 Query in GPU Monitoring]
**Learning:** The GPU monitoring dashboard performed a separate database query for every active GPU to fetch its latest status, leading to O(N) queries.
**Action:** Use a subquery with func.max(timestamp) joined back to the main stats table to fetch all latest statuses in a single optimized query.
