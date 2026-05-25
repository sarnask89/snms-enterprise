## 2026-05-25 - Accessibility of icon-only buttons in Nuxt UI v4
**Learning:** Nuxt UI v4 components often lack descriptive aria-labels by default when only an icon is used. This creates accessibility barriers for screen readers. The `UTooltip` component requires a `text` prop for its content.
**Action:** Always audit `UTable` action slots and icon-only `UButton` instances. Wrap them in `UTooltip` with a `text` prop and add a matching `aria-label` to the button. Use consistent Polish translations like "Edytuj", "Usuń", "Więcej opcji".
