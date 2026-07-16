## 2026-07-02 - [Helpdesk Modernization]
**Learning:** Modernizing the helpdesk module required consistent ARIA labels for icon-only buttons (Edit/Delete/Status) and search inputs to ensure screen reader accessibility. Standard Polish labels like 'Edytuj zgłoszenie' and 'Zmień status' were established. Also, `UTextarea` in this Nuxt UI version expects `:rows` for height, while `:data` was a legacy artifact that caused broken rendering.
**Action:** Always use `:rows` for `UTextarea` and apply established Polish ARIA labels for common CRUD actions in this project.
