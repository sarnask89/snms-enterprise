## 2025-05-18 - Language Consistency & WCAG 2.5.3 in ARIA Labels
**Learning:** When adding `aria-label` attributes to components with English text (such as `AiAssistant.vue`), use English ARIA descriptions to maintain screen reader language consistency and avoid WCAG 2.5.3 (Label in Name) violations. Also avoid adding `aria-label` to buttons that already have an explicit, identical visible text label.
**Action:** Ensure ARIA labels match the visual UI language and only add `aria-label` to icon-only buttons or inputs lacking explicit visible labels.
