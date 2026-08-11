## 2026-05-17 - Context-Aware Polish ARIA Labels for List Table Row Actions
**Learning:** Standard list tables with vertical ellipsis icon buttons (`i-lucide-ellipsis-vertical`) lack descriptive labels, making them completely uninformative for screen readers. Using standard, context-aware Polish ARIA labels (e.g. "Więcej akcji dla abonenta [name]") significantly improves accessibility and meets Polish operator usability requirements.
**Action:** Always add descriptive, context-specific `:aria-label` to dynamic row action triggers inside `<UTable>` components.
