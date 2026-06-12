# Palette's Journal

🎨 UX and Accessibility learnings.

## 2026-06-12 - Standardizing Finances UI
**Learning:** The `finances.vue` page was using legacy Heroicons and lacked a centralized refresh mechanism, which is a common pattern in newer parts of the application like `customer-devices.vue`. Standardizing these ensures a cohesive user experience.
**Action:** Always check for `i-heroicons` and replace with `i-lucide` when modernizing pages, and implement a global refresh button if multiple data sources are present.
