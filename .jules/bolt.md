# Bolt's Journal

## 2026-08-05 - Global search regular expressions caching
**Learning:** Compiling regex patterns globally rather than on each request handler call inside high-frequency endpoints like `global_search` reduces overhead.
**Action:** Move `re.search` patterns to module-level pre-compiled `re.compile` structures to prevent runtime re-compilation on every character entered by the user.
