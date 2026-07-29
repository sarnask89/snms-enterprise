# Palette's Journal

## 2025-02-15 - Monitoring Page Micro-UX and Accessibility Enhancements
**Learning:** Legacy icons like `i-heroicons-arrow-path` are inconsistent with modern Nuxt UI v4 `i-lucide-` icons. Adding `useToast` to action-based forms without default success indicators provides users with direct, satisfying micro-feedback, and adding descriptive Polish ARIA labels improves screen reader comprehension in local operations menus.
**Action:** Always replace legacy icons with standard Lucide ones, use Polish ARIA labels for action items, and use `useToast` to provide interactive success and warning feedback on form actions.
