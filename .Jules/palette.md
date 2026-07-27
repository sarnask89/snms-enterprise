# Palette's Journal

## 2025-02-13 - [Ellipsis action buttons accessibility]
**Learning:** Icon-only ellipsis buttons (e.g., table dropdown triggers) inside tables can silence screen readers if they lack clear Polish contextual labels describing exactly what item they act upon.
**Action:** Always provide descriptive, item-specific dynamic `:aria-label` tags (like `:aria-label="'Więcej opcji dla urządzenia ' + row.hostname"`) for ellipsis/more-options buttons rather than a generic or empty label.
