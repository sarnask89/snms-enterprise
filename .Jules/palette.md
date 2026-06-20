## 2025-05-14 - Modernization of Helpdesk UI

**Learning:** Nuxt UI v4 prefers `color="neutral"` for secondary/ghost buttons over the legacy `color="gray"`. Transitioning from Heroicons to Lucide icons provides a more consistent and modern visual language across the dashboard. Accessibility in data tables for icon-only buttons is critical and should always include descriptive `aria-label` attributes in the primary application language (Polish).

**Action:** Always check for `color="gray"` in Nuxt UI components and replace with `color="neutral"` when modernizing. Ensure all icon-only buttons in UTable actions have `aria-label` attributes.
