## 2025-05-18 - Nuxt UI v4 Select Menu Item Mapping & Action Guarding
**Learning:** In Nuxt UI v4 `USelectMenu`, option items expect `label` (or `label-key`) instead of legacy `header` properties for display text. Additionally, action buttons that rely on single select values or manual text inputs should explicitly bind `:disabled` states to prevent redundant error-prone API requests.
**Action:** When modernizing selection controls, ensure item objects map display strings to `label` and guard trigger buttons with input presence checks.
