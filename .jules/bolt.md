# Bolt's Journal - Performance Optimizations

## 2026-08-03 - [Hoisting Regex Compilation in Router Iterative Loops]
**Learning:** Compiling dynamic and static regular expressions on every line iteration or function invocation in high-frequency endpoints (such as `global_search` or device output processing splits) introduces measurable CPU overhead and garbage collection pressure due to Python re-compiling string patterns. Pre-compiling static patterns at the module level and compiling dynamic patterns exactly once outside nested loops resolves this.
**Action:** Always pre-compile static regular expressions at the module level using `re.compile`. For dynamic or parameterized regexes, compile them exactly once outside line-by-line processing loops to maximize matching performance and correctness.
