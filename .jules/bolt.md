
## 2026-09-15 - Date Filtering & Column Projection on Aggregation Stats Endpoints
**Learning:** Endpoints generating rolling aggregate metrics (e.g. `/financial-summary`) often fetch entire tables with `repo.find()` and perform JS reductions. Over time, as transaction tables grow into thousands of rows, this causes heavy DB read I/O, large payload instantiation, and high memory usage.
**Action:** Always constrain dashboard statistics endpoints using TypeORM `where: { field: MoreThanOrEqual(startDateStr) }` filtering and selective field projections (`select: [...]`).
