# TERYT Relational Addressing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add relational TERYT import, default-area management, and autosuggest-backed customer and device address mapping to the TS runtime.

**Architecture:** Extend the current flat TERYT model with a real commune entity and relational address ids on customers and customer devices. Reuse the proven XML import flow from the FastAPI backup, then wire the resulting dictionary into API suggestions and Nuxt forms.

**Tech Stack:** TypeScript, Express, TypeORM, SQLite runtime migrations, Nuxt 4, Node test runner.

---

### Task 1: Extend The Schema And Location Model

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\models\location.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\models\customer.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\models\network.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\database.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\schema_migrations.ts`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\migrations.test.ts`

### Task 2: Add Failing Migration And Import Tests

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\migrations.test.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\teryt_import_relations.test.ts`

### Task 3: Rebuild TERYT XML Import Around Relations

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\teryt_import.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\teryt.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\addresses.ts`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\teryt_import_relations.test.ts`

### Task 4: Add Default Commune Area Resolution

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\addresses.ts`
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\src\teryt_defaults.ts`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\teryt_import_relations.test.ts`

### Task 5: Add Relational Address Payloads To Customers And Devices

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\customers.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\customer_devices.ts`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`

### Task 6: Add XML Upload UI And TERYT Suggestion APIs To Nuxt

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\teryt.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\[id].vue`
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\composables\useTerytAddressing.js`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\auth-access.test.mjs`

### Task 7: Verification And Commit

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\README.md`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\MIGRATION_STATUS.md`

- [ ] Run: `npm --prefix C:\Users\xxx\crm-portal\crm-portal-ts test`
- [ ] Run: `npm --prefix C:\Users\xxx\crm-portal\crm-portal-ts\frontend test`
- [ ] Run: `npm --prefix C:\Users\xxx\crm-portal\crm-portal-ts\frontend run build`
- [ ] Run: `npm --prefix C:\Users\xxx\crm-portal\crm-portal-ts run verify:release`
- [ ] Commit only the TERYT/addressing slice.
