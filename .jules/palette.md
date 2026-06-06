## 2026-06-06 - Standardizing Refresh Patterns
**Learning:** Consistently naming fetch state variables (e.g., `pendingSubscriptions`, `refreshSubscriptions`) and binding them to a 'Refresh' button in the page header is a strong UX pattern in this app that provides clear feedback and control to the user.
**Action:** Always check the `useFetch` destructuring to ensure the correct variable names are bound to the Refresh button's `:loading` and `@click` props.

## 2026-06-06 - UI Consistency with Gray Color
**Learning:** While `color="neutral"` might seem like a logical choice for utility buttons, this project consistently uses `color="gray"` for secondary or outline buttons to maintain visual harmony.
**Action:** Prefer `color="gray"` over `color="neutral"` for secondary UI elements unless specifically requested otherwise.
