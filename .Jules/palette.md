## 2026-05-26 - Standardizing Accessibility and Form UX

**Learning:** This repository utilizes Nuxt UI v4 where components like `UTooltip` and `UButton` are frequently icon-only. To maintain accessibility, these must always have an `aria-label` matching the Polish localized tooltip text. Standard translations include "Zamknij" (Close), "Więcej opcji" (More options), and "Odśwież" (Refresh). Additionally, form inputs benefit significantly from realistic Polish examples using the "np." (na przykład) prefix in placeholders.

**Action:**
1. Always wrap icon-only buttons in `UTooltip` with a `text` prop and add a matching `aria-label`.
2. Use `resolveComponent` for `UTooltip` if not already available in the script block.
3. Bind the `pending` state from `useFetch` to the `:loading` prop of refresh buttons for immediate visual feedback.
4. Add `placeholder` attributes with realistic examples (e.g., "np. Jan") to all primary form inputs.
