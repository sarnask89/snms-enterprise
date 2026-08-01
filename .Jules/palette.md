# Palette's Journal

## 2025-02-14 - Initialize Journal
**Learning:** Initiating the palette's journal for tracking CRITICAL UX/accessibility learnings.
**Action:** Use this file to record key learnings when discovering patterns, guidelines, or design constraints.

## 2025-02-14 - Accessible & Standardized Customer Groups Dashboard Component
**Learning:** Legacy pages built with Vue/Nuxt can often contain old heroicons and non-standard HTML inputs (like raw checkboxes) or broken bindings (like `:data="3"` on `UTextarea`). Migrating these to standard Nuxt UI `<UCheckbox>` and `:rows="3"` improves keyboard navigation, semantic accessibility, layout responsiveness, and style unification. Icon-only buttons MUST feature descriptive Polish ARIA labels (e.g., `Edytuj grupę [nazwa]`) to avoid screen reader silencing.
**Action:** Always scan target page templates for legacy bindings, native input elements, and icon-only actions, replacing them with accessible Nuxt UI design-system alternatives and adding Polish ARIA labels and `useToast` feedback notifications.
