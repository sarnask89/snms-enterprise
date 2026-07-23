# Palette UX and Accessibility Journal

## 2025-02-18 - Standardizing Iconography and Interactive Feedback in Nuxt UI v4
**Learning:** Legacy Heroicons (`i-heroicons-`) disrupt consistency in apps upgraded to Nuxt UI v4, which standardizes on Lucide icons (`i-lucide-`). Additionally, silently executing background mutations (such as saving forms or deleting items) creates a high screen reader and user cognitive load unless paired with native confirmation dialogs and immediate Toast feedback (`useToast`). Adding localized Polish `aria-label` tags to icon buttons ensures screen readers do not fallback to reading raw action names.
**Action:** When working on Nuxt UI v4 pages, replace all legacy Heroicons with Lucide equivalents, wrap mutations with `useToast()` feedback, ensure destructive actions are guarded by explicit `confirm()` checks, and provide descriptive `aria-label` attributes for accessibility.
