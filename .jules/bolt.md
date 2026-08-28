## 2026-08-28 - Column projection for TypeORM relation joins in Global Search

**Learning:** Using `leftJoinAndSelect` on a relation loads all database columns of the joined entity into memory, even if the response mapping only accesses 2-3 fields (e.g., `firstName`, `lastName`, `id`). Using `leftJoin` combined with `.addSelect(["alias.field1", "alias.field2"])` drastically reduces SQL payload size and entity instantiation overhead.

**Action:** Whenever joining related entities for display or serializing lightweight DTOs in TypeORM routers, prefer `.leftJoin()` with targeted `.addSelect()` field projections over `.leftJoinAndSelect()`.
