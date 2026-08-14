# Palette's Journal

## 2025-02-18 - Interactive Card Accessibility in Nuxt UI v4
**Learning:** Nuxt UI v4 `UCard` components do not support dynamic root tag rendering via the `as` prop (e.g., `<UCard as="NuxtLink">` fails to output a clickable anchor element, remaining a static `div`).
**Action:** When making cards interactive, always wrap the `<UCard>` component inside a standard `<NuxtLink>` element rather than attempting to alter its root element. Combine this wrapping with proper visible focus ring styles (e.g., `focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl outline-none`) on the anchor element to preserve tab index and keyboard accessibility.

## 2025-02-18 - Safe Color Compilation in Tailwind/Nuxt UI Dashboard Grids
**Learning:** Constructing dynamic Tailwind CSS class names inside loops via template string interpolation (e.g., `bg-${stat.color}-500/10`) is unsafe because the JIT compiler cannot resolve dynamic strings at build time, leading to uncompiled/missing styles.
**Action:** Always pre-declare exact background and text CSS class strings (e.g., `bg-blue-500/10`, `text-blue-500`) statically in data-maps rather than using runtime color string interpolation.

## 2025-02-18 - Prevent Screen Reader Silencing on Dynamic Metric Blocks
**Learning:** Interactive widgets displaying only an icon, a short label, and a dynamic number are screen reader hostile if they lack an explicit action description, causing confusion or silencing during screen navigation.
**Action:** Apply comprehensive, context-aware `aria-label` strings to interactive link wrappers, combining the target navigation destination with the dynamic runtime value (e.g., `aria-label="Przejdź do sekcji: Abonenci. Obecna wartość: 42"`), keeping speech synthesis clear and descriptive.
