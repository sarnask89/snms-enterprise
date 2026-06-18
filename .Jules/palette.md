## 2026-06-18 - Modernizing Interactions in Subscriptions
**Learning:** Replacing native `window.confirm()` with `UModal` significantly improves UI cohesion and allows for better user feedback (e.g., loading states on action buttons).
**Action:** Always prefer `UModal` over browser-native dialogs for destructive actions.

## 2026-06-18 - Accessibility for Icon-only Buttons
**Learning:** Icon-only buttons in Nuxt UI tables are invisible to screen readers without explicit `aria-label` attributes.
**Action:** Ensure all icon-only buttons have descriptive `aria-label` attributes in the local language (Polish in this case).
