## 2026-05-17 - Cohesive Iconography and Accessible Interactive Metrics
**Learning:** For dashboard statistics grids, summary metrics should not be passive text elements. Turning them into interactive `<NuxtLink>` components enables seamless keyboard navigation and keyboard-visible focus ring styles. Furthermore, to prevent dynamic string interpolation failures during Tailwind static analysis, fully-qualified Tailwind class strings (e.g., `bg-blue-500/10 text-blue-500`) should be explicitly defined within local data mapping structures.
**Action:** When adding/modifying stat grids or metrics:
1. Wrap summary metric cards in `<NuxtLink>` targeting the respective detail sections.
2. Provide precise Polish ARIA labels that dynamically read the metric count (e.g., `'Przejdź do sekcji: ' + label + '. Obecna wartość: ' + count`).
3. Replace all legacy Heroicon library icons (`i-heroicons-...`) with standard, modern Lucide icons (`i-lucide-...`).
4. Avoid dynamic template literal Tailwind strings; declare fully-qualified classes inside the script mapping configuration.
