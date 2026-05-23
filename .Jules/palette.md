## 2026-05-23 - Accessibility Enhancements for Icon-only Buttons
**Learning:** Icon-only buttons (like ellipsis for actions) lack accessible names for screen readers and visual guidance for mouse users. The project uses Nuxt UI v4 where tooltips are implemented via a `UTooltip` component wrapping the target.
**Action:** Always wrap icon-only `UButton` components with `UTooltip` and provide an `aria-label` in Polish (e.g., 'Więcej opcji').

## 2026-05-23 - Form Guidance with Polish Placeholders
**Learning:** Technical input fields (IP, MAC, Hostname) benefit from realistic examples to guide user input. The project follows a convention of using the "np." prefix for these examples.
**Action:** Add `placeholder` attributes to technical `UInput` fields with realistic Polish examples (e.g., 'np. 10.0.50.100').
