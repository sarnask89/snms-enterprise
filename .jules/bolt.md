# Bolt's Performance Journal

## 2026-05-22 - Dashboard Query Consolidation
**Learning:** Multiple independent count queries on the dashboard (e.g., for customers, invoices, tickets) cause unnecessary database round-trips. Consolidating these into a single SELECT statement using SQLAlchemy `scalar_subquery()` calls reduces overhead significantly.
**Action:** When implementing dashboards or statistics views that aggregate counts from multiple tables, always batch them into a single query to minimize round-trips.
