## 2026-05-24 - Accessible tooltips for icon-only buttons
**Learning:** In the Nuxt UI v4 environment, icon-only buttons in table actions and headers require both `aria-label` for screen readers and `UTooltip` for sighted users to ensure clear intent. Standardized Polish labels like "Więcej opcji" and "Odśwież listę" maintain consistency.
**Action:** Always wrap icon-only `UButton` with `UTooltip` and provide a descriptive `aria-label`.

## 2026-05-24 - Helpful placeholders for network configuration
**Learning:** Providing realistic Polish examples as placeholders (prefixed with "np.") in technical fields like IP and MAC addresses significantly improves data entry UX for administrators.
**Action:** Add `placeholder="np. ..."` to `UInput` fields for technical data.
