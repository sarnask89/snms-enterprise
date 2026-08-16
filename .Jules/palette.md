## 2025-05-18 - UTextarea attribute binding in Nuxt UI v4
**Learning:** In Nuxt UI v4, `<UTextarea>` components use `:rows` instead of legacy `:data` for configuring height rows. Passing `:data` generates invalid HTML attributes and fails to render expected textarea row sizes.
**Action:** Always use `:rows="N"` on `<UTextarea>` components.
