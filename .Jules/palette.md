## 2025-09-05 - Accessible ARIA labels and Icon alignment on Floating Components
**Learning:** Floating interactive widgets (such as `AiAssistant.vue`) and collapsed sidebar trigger buttons (`default.vue`) require explicit `aria-label` and `aria-expanded` attributes matching their visual intent, as screen readers cannot rely on surrounding contextual DOM elements.
**Action:** Always add descriptive `aria-label` and `aria-expanded` attributes to floating icon-only triggers and collapsed drawer buttons, and ensure standard icon packages (`i-lucide-*`) are consistently used.
