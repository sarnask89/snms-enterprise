## 2026-03-31 - Admin Page Accessibility and Toast Notifications
**Learning:** Icon-only buttons for row-level backup actions require context-aware dynamic `aria-label` attributes (e.g. `Pobierz backup [filename]`), and async administration actions need non-blocking toast notifications (`useToast`) to give operators clear visual feedback upon database backup and reload events.
**Action:** Always complement icon-only buttons with descriptive, dynamic ARIA labels and bind async trigger buttons to reactive loading states and toast notifications.
