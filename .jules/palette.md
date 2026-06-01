## 2026-06-01 - [Accessibility and Interaction Polish]
**Learning:** Found that several key icon-only buttons in the main tables lacked ARIA labels, making them inaccessible to screen readers. Also, the 'Refresh' button lacked a loading state, providing no feedback for the async 'pending' status of the data fetch.
**Action:** Consistently add 'aria-label' to icon-only buttons and bind ':loading' to the 'pending' state from 'useFetch' in list views. Use standardized Polish labels like 'Odśwież listę' and 'Szukaj urządzeń'.
