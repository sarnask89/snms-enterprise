## 2026-03-29 - Nuxt UI v4 Modal and Textarea Property Binding Standards
**Learning:** In Nuxt UI v4, `<UModal>` visibility state must be bound using `v-model:open` rather than standard `v-model`. In addition, `<UTextarea>` expects `:rows="3"` instead of legacy `:data="3"` for specifying initial row height.
**Action:** When updating form controls and dialogs in Nuxt UI v4, ensure `v-model:open` is used for modals and `:rows` is used for textareas.
