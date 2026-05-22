## 2026-05-22 - Nuxt 4 UI Component Resolution and Tooltips
**Learning:** In this Nuxt 4 (experimental) project, UI components like `UTooltip` must be manually resolved in `script setup` using `resolveComponent`. The `UTooltip` component specifically uses the `text` prop for its content.
**Action:** Always check `script setup` for existing `resolveComponent` calls when adding new Nuxt UI components and use the `text` prop for tooltips.
