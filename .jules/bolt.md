# Bolt's Journal - Performance Optimization

## 2026-08-02 - Pre-compiling Regex in app/routers/netdevices.py and app/routers/search.py
**Learning:** For loops processing device outputs with dynamic prefix paths (e.g., `fr"{port_id}/..."`), instead of in-loop dynamic compilation or generic module-level post-filtering, compile the dynamic pattern exactly once *outside* the line-by-line processing loop to maintain both maximum performance and precise matching correctness. We can also pre-compile all static regexes at the module level in `app/routers/search.py`, `app/routers/netdevices.py`, and `app/services/dasan.py` to eliminate compilation overhead during operations or global searches.
**Action:** Compile regular expressions once outside loops and at module levels.
