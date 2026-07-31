# Bolt's Journal - Performance Optimization

This journal tracks critical performance optimizations and codebase-specific patterns in this repository.

## 2025-02-17 - DASAN OLT Regex Pre-compilation and Dynamic Prefix Optimization
**Learning:** Compiled regex patterns should be defined outside loops (and at module level where possible) to completely bypass dynamic string-to-pattern compilation, pattern parsing, and internal caching lookup overhead. For loops processing device outputs with dynamic prefix paths (e.g., `fr"{port_id}/..."`), compiling the dynamic pattern exactly once outside the processing loop maintains both maximum performance and precise matching correctness.
**Action:** Move all regex compilation out of processing loops and compile dynamic patterns exactly once before starting line-by-line processing loops.
