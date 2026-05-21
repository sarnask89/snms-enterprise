## 2026-05-21 - Database Initialization for Benchmarks
**Learning:** SQLite database in the sandbox may not be pre-initialized. Running benchmarks or standalone scripts that query models will fail with "no such table" unless metadata is explicitly created.
**Action:** Always include `models.Base.metadata.create_all(bind=engine)` in standalone diagnostic or benchmark scripts.
