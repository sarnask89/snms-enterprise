# Palette's Journal - SNMS Enterprise CRM Portal

This journal contains critical UX/accessibility learnings discovered while working on this repository.

## 2025-02-17 - AI Assistant Chat Hydration and Usability Polish
**Learning:** Icon-only buttons without explicit accessible ARIA labels or tooltips are a major accessibility issue for screen readers. Using conditional rendering (`v-if`) directly on floating action buttons wrapped in layout contexts can also trigger Vue hydration mismatches if not carefully managed (e.g. by wrapping or hoisting conditional rendering to container/tooltip levels). Automated message scrolling must be bound reactively to both the messages list and window open transitions to ensure immediate feed focusing.
**Action:** Always wrap interactive icon-only buttons in accessible `<UTooltip>` components, supply explicit English `aria-label` attributes, use standard Lucide icons rather than legacy custom icon suites, and manage focus and scroll states reactively in setup hooks.
