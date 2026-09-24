## 2026-09-24 - Targeted Column Projection for ManyToMany Relations
**Learning:** TypeORM's `relations: { customers: true }` performs a full `SELECT *` on joined entities, fetching 50+ unused columns (e.g. PESEL numbers, hashes, billing notes) per related record.
**Action:** Use `createQueryBuilder().leftJoin().addSelect([...fields])` when fetching ManyToMany relations to only retrieve summary fields needed for serialization.
