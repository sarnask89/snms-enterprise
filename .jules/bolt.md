## 2026-05-31 - [Batch Dashboard Count Queries]
**Learning:** Multiple independent `COUNT` queries on the dashboard create unnecessary database round-trips. While each query is fast, the cumulative latency (especially over a network) adds up. Using SQLAlchemy `scalar_subquery()` allows batching these into a single `SELECT` statement.
**Action:** Always check for clusters of independent aggregate queries (COUNT, SUM, etc.) in dashboard or report views and batch them into a single query.

## 2026-05-31 - [Node.js 22 Healthchecks and Auth Redirects]
**Learning:** In Node.js 22/Nuxt 4 environments, frontend healthchecks using `fetch` or `wget` can fail if they hit authentication middleware that returns a 302 redirect. The healthcheck must be configured to accept successful redirects (status < 500) rather than just a 200 OK.
**Action:** Configure Docker healthchecks for authenticated frontends to use `status < 500` checks and provide an adequate `start_period` for cold starts.
