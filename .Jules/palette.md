## 2025-05-20 - Static Class Mapping for Tailwind JIT in Vue Templates
**Learning:** Constructing dynamic Tailwind CSS class names via template string interpolation (e.g., `bg-${stat.color}-500/10`) inside Vue components prevents the Tailwind JIT scanner from detecting the utility classes, leading to missing background/text styles at runtime.
**Action:** Always maintain an explicit static dictionary mapping key identifiers to full class strings (e.g., `const statColorClasses = { blue: 'bg-blue-500/10 text-blue-500' }`) when applying dynamic visual themes.
