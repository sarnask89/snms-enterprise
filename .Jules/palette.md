# Palette's Journal - Critical UX & Accessibility Insights

This journal documents critical learnings regarding user experience, design consistency, and web accessibility within the CRM portal.

## 2025-02-18 - [Fixing Component Select Option Mapping to Prevent Invisible Labels]
**Learning:** In Nuxt UI components (such as `USelect` and `USelectMenu`), specifying standard props like `:label-key="label"` expects the items array to consistently define its display text under the `label` property. Using arbitrary or legacy keys like `header` breaks component label rendering, silencing screen readers and presenting empty options to visual users.
**Action:** Always map select option objects to have a `label` property for user-visible display text, and ensure the component is configured with a corresponding `:label-key="label"` attribute.
