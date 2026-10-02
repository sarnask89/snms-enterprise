# Bolt's Journal - Critical Learnings

## 2026-10-02 - TypeORM Column Projections and Count Aggregations on Dashboard Stats Endpoints
**Learning:**
In TypeORM endpoints, retrieving full entity tables with `Repo.find()` and performing in-memory filtering/counting (e.g., `devices.filter(d => d.status === 'active')`) loads all column data for every record into Node.js heap memory, degrading throughput and increasing response latency as tables grow.

Replacing full table reads with:
1. Direct SQL count aggregates (`repo.count()`, `repo.countBy({ status: NetDeviceStatus.active })`)
2. Targeted column projections (`select: ["issueDate", "amount"]`)
3. SQL date-range filters (`where: { issueDate: MoreThanOrEqual(startDate) }`)

drastically reduces SQL query execution time, network payload size, and garbage collection overhead.

**Action:**
When optimizing dashboard or analytics endpoints that compute aggregates or rolling metrics, always check if full entity arrays are being fetched into memory. Convert full `find()` calls to database-level `count()`, `countBy()`, or `select`-projected queries filtered by indexed date ranges.
