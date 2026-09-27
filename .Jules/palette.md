## 2026-09-27 - Floating Assistant Accessibility and Modal Fallbacks

**Learning:** Floating widget components (like AI assistants) often miss `aria-label`, `:aria-expanded` attributes, and explicit modal templates bound to reactive visibility triggers (`v-model:open`), rendering key feature configuration popups inaccessible or non-functional.
**Action:** Always verify floating action triggers have descriptive `aria-label` tags and `:aria-expanded` states, and ensure all reactive modal flags (`isContextModalOpen`) are backed by rendered `<UModal>` dialogs in the template.
