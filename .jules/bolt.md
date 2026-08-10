# Bolt's Journal - CRM Performance Optimizations

## 2026-08-10 - Regular Expression Pre-compilation and Dynamic Patterns
**Learning:** Found that compiling regular expressions inside hot path loops (such as parsing OLT MAC tables, search queries, and Mikrotik comment lines) introduced unnecessary overhead because of repetitive string pattern parsing. Furthermore, when dealing with dynamic patterns that incorporate runtime parameters (like `port_id`), inline re-compilation in a line-by-line processing loop (e.g. `re.search(fr"{port_id}/...", line)`) dramatically degrades parsing speed.
**Action:** Always pre-compile static regex patterns at the module level using `re.compile()`. For dynamic patterns within loops, compile the dynamic regex exactly once *outside* the line-by-line loop to eliminate repeated parsing overhead while maintaining maximum correctness.
