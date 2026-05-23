## 2026-05-23 - Micro-UX and Accessibility Patterns in Nuxt UI v4
**Learning:**
1. **Icon-only Buttons:** Buttons using only icons (e.g., ellipsis for actions) lack accessible names for screen readers and visual guidance for mouse users. Wrapping them in `UTooltip` and providing an `aria-label` in Polish (e.g., 'Więcej opcji') significantly improves usability.
2. **Technical Input Guidance:** Fields like IP, MAC, and Hostname are prone to entry errors. Providing realistic Polish examples prefixed with "np." as placeholders (e.g., 'np. 10.0.50.100') reduces cognitive load and guides users toward the correct format.
**Action:** Always provide `aria-label` and `UTooltip` for icon-only components, and use descriptive, localized placeholders for technical form fields.
