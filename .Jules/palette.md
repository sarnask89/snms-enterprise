## 2026-07-02 - [ESLint Catch Block Constraint in Nuxt/TS]
**Learning:** Nuxt 4 & Nuxt UI frontend uses a strict ESLint configuration that enforces `@typescript-eslint/no-unused_vars` on catch blocks. Any catch block defining `catch (error)` without referencing the variable causes a build failure.
**Action:** Use the parameterless `catch { ... }` syntax if the error object is not required, and only define `(error)` when inspecting or printing the error's message.
