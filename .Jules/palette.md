## 2026-06-17 - [Accessibility: Missing ARIA labels in tables]
**Learning:** Icon-only buttons in the Nuxt UI tables (e.g., Edit/Delete) require explicit `aria-label` attributes to ensure accessibility for screen readers. In this application, these buttons are consistently used across many pages (Helpdesk, Subscriptions, Finances) without labels.
**Action:** Always include Polish `aria-label` attributes for icon-only table actions (e.g., 'Edytuj [obiekt]', 'Usuń [obiekt]').
