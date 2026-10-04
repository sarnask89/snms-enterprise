# Bolt's Journal

## 2026-10-04 - Selective Column Projections for Relation Queries in TypeORM
**Learning:** TypeORM's `relations: { ... }` and `leftJoinAndSelect` load all columns of related entities. For list endpoints that serialize only a subset of related entity fields (e.g., `id`, `customerCode`, `firstName`, `lastName`), using `createQueryBuilder` with explicit `leftJoin` and `.addSelect(["alias.col1", "alias.col2"])` significantly reduces database I/O, SQL payload size, and memory allocations. When referencing entity properties in `qb.where()`, always use the entity property name (e.g. `stat.deviceId`) rather than the raw database column name (`stat.device_id`).
**Action:** Use `leftJoin` + targeted `.addSelect()` for TypeORM list queries with relations and verify property name accuracy against entity models.
