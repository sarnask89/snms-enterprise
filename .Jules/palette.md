## 2025-09-16 - Collapsed Sidebar and Floating Assistant ARIA Enhancements
**Learning:** Collapsed navigation sidebars and floating overlay triggers in Nuxt UI v4 lack descriptive text labels for screen readers when icons alone are rendered.
**Action:** Always provide explicit `:aria-label` dynamic strings for user menu triggers and `:aria-expanded` state tracking on floating overlay toggle buttons.
