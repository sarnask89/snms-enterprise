## 2025-05-18 - Nuxt UI v4 Finanse Page Accessibility & Toast Modernization
**Learning:** Replacing native form elements with `<UCheckbox>` and fixing legacy props (`:data` -> `:rows` on `<UTextarea>`) along with explicit Polish `aria-label` tags ensures proper screen reader accessibility and consistent Nuxt UI design patterns across complex financial forms.
**Action:** Always check form controls in Nuxt UI pages for raw HTML inputs, invalid `:data` props on `UTextarea`, and ensure `useToast` notifications wrap async CRUD requests.
