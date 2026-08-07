# Palette's Journal

## 2026-05-18 - Row action buttons with dynamic ARIA labels
**Learning:** Icon-only ellipsis/actions buttons inside Nuxt UI `UTable` cells are completely silent to screen readers unless configured with descriptive `aria-label` attributes. Using dynamic data from the row (like `row.name`, `row.hostname`, or `row.displayName`) provides crucial page-contextual accessibility, making actions readable and informative instead of repetitive.
**Action:** Always include a detailed, localized dynamic `:aria-label` attribute whenever implementing row actions or action buttons inside dynamic grids and lists using `UDropdownMenu` or icon-only `UButton` elements.
