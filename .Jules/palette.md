## 2025-05-18 - Standardizing Subscription Management Forms & Table Actions

**Learning:** Replacing native HTML checkboxes with `<UCheckbox>` in Nuxt UI v4 modal forms ensures uniform accessibility and focus states across keyboard navigation, while replacing legacy `i-heroicons-*` with `i-lucide-*` and adding contextual Polish `aria-label` attributes to action buttons (such as activation toggles and delete buttons with customer code identifiers) provides critical context for screen reader users.

**Action:** When modernizing subscription and finance management pages, always wrap toggle/delete row actions with dynamic customer/entity identifiers in `aria-label` attributes and provide instant non-blocking feedback using `useToast`.
