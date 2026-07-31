# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-02-17 - Modernizing Operations Page UX & Accessibility
**Learning:** Nuxt UI v4 replaced legacy Heroicons with Lucide icons (using `i-lucide-*` prefixes instead of `i-heroicons-*`). Additionally, form components like `UTextarea` migrated the vertical sizing parameter from `:data="N"` to `:rows="N"`, which otherwise causes broken formatting and rendering issues. To maintain strong accessibility (a11y) standards, all custom non-text or dynamic action buttons require clear context-aware Polish ARIA labels (e.g., `aria-label="Odśwież dane"`) so screen readers don't silence key system interactions.
**Action:** Always verify `UTextarea` attributes use `rows` instead of `data` when modernizing legacy views, update all legacy icon classes to their Lucide equivalents, and verify ARIA labels are added to any interactive components.
