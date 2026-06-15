## 2025-05-15 - Modernized Dashboard Experience
**Learning:** Standardizing the dashboard using `UDashboardPanel` and `UDashboardNavbar` provides a consistent entry point for users. Aggregating multiple `useFetch` pending states into a single `pendingAny` computed property allows for a clean, single-button refresh experience with proper loading feedback.
**Action:** Use `UDashboardPanel` for all top-level pages and implement the `pendingAny` / `refreshAll` pattern whenever multiple data sources are present on a single view.
