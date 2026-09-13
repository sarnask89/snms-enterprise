## 2025-05-18 - Accessibility and Auto-Scroll Enhancements for Floating Chat Widgets

**Learning:** Floating overlay dialogs (like AI chat assistants) require explicit `aria-label` and `aria-expanded` attributes on trigger buttons and dialog containers to communicate state to screen readers. For chat interfaces, automated scroll-to-bottom on reactive message additions via `nextTick` eliminates manual scrolling friction when receiving AI responses.
**Action:** When updating floating chat widgets or drawers in Nuxt UI v4, ensure icon-only buttons use standard Lucide icons with explicit `aria-label` tags, bind `aria-expanded` to visibility state, and wrap input modal configurations in `<UModal>` instead of browser popups or unrendered slots.
