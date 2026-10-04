## 2026-10-04 - Floating Action Controls and Continuous CSS Animations

**Learning:** Floating action buttons with infinite CSS bounce animations (`animate-bounce-slow`) can create interaction instability for screen readers and automated UI testing unless click targets remain stable or force-activated, while requiring explicit `aria-expanded` and `aria-label` attributes to ensure screen reader users understand toggle state without relying on visual motion.
**Action:** When adding or modernizing floating action buttons, ensure proper `aria-label` and `:aria-expanded` attributes are present, and consider user accessibility preferences for reduced motion (`motion-reduce:animate-none`).
