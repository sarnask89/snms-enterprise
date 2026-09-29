## 2025-09-29 - Nuxt UI v4 Modal Binding and AI Assistant Accessibility
**Learning:** Nuxt UI v4 `<UModal>` components require `v-model:open` instead of standard `v-model` for proper state binding. Floating interactive widgets (e.g. AI Assistant) require explicit `aria-label` and `:aria-expanded` attributes on trigger buttons, input fields, and action buttons to ensure screen reader accessibility.
**Action:** When working with Nuxt UI v4 dialogs and floating widgets, bind modal open state using `v-model:open` and add explicit ARIA labels to icon-only buttons and form controls.
