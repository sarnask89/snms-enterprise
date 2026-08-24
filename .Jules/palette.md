## 2025-05-20 - Modernizing AI Module Architect Page
**Learning:** Legacy Heroicons (`i-heroicons-*`) and native `alert()` popups hinder accessibility and visual consistency in Nuxt UI v4 apps. Icon-only buttons and input controls require explicit `aria-label` attributes in Polish for screen reader clarity.
**Action:** Replace `i-heroicons-*` icons with `i-lucide-*`, add explicit `aria-label`s on icon-only buttons and inputs, and use `useToast()` for asynchronous user feedback.
