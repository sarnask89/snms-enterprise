# Bolt's Journal - Critical Performance Learnings

## 2026-03-26 - Date Window Filtering and Column Projection on Stats Endpoints
**Learning:** Calling TypeORM `find()` without parameters on tables like `Invoice`, `LedgerEntry`, and `Customer` loads thousands of historical rows and all unneeded columns into memory, which spiked dashboard stats endpoint response times up to 227ms.
**Action:** Always constrain time series stats queries with `MoreThanOrEqual(cutoffDateStr)` to only fetch rows within the active calculation window, and pass explicit `select` arrays (e.g., `["issueDate", "amount"]`) to avoid instantiating full TypeORM entity objects and loading heavy unneeded columns.
