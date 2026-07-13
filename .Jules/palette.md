## 2026-07-13 - [Customer Groups Modernization]
**Learning:** Replacing native HTML checkboxes with `UCheckbox` in a loop bound to an array (like `form.memberIds`) significantly improves keyboard accessibility and visual consistency with Nuxt UI.
**Action:** Always prefer `UCheckbox` over native `input type="checkbox"` for multi-select patterns in this app.

**Learning:** Fixed a typo in `UTextarea` where `:data="3"` was used instead of the correct `:rows="3"` for setting the initial height.
**Action:** Audit other `UTextarea` usages for incorrect props.
