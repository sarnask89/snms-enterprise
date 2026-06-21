## 2026-06-21 - Modernizing Nuxt UI v4 Components
**Learning:** Nuxt UI v4 transition requires moving from legacy color tokens (emerald, gray, red) to semantic ones (success, neutral, error, warning). Icon-only buttons in tables are a common accessibility blind spot in this codebase, requiring explicit Polish `aria-label` attributes for screen reader support.
**Action:** Always check for `i-heroicons` and legacy color tokens in `.vue` files; replace with `i-lucide` and semantic tokens. Ensure all icon-only buttons have descriptive `aria-label` in Polish.
