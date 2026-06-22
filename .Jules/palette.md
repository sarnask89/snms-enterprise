## 2026-06-18 - Modernization of Subscriptions Page
**Learning:** Transitioning from legacy Heroicons to Lucide icons and replacing raw HTML inputs (like checkboxes) with Nuxt UI components (`UCheckbox`) ensures visual consistency and improves out-of-the-box accessibility. Descriptive Polish ARIA labels for icon-only table actions are critical for screen reader support in this localized application.
**Action:** Always prefer Nuxt UI components over raw HTML elements for forms and ensure all icon-only buttons have descriptive `aria-label` attributes in Polish.
