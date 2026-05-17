# Backbone Network Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` when executing this plan in slices. Track progress with checkbox updates and keep commits narrow by phase.

**Goal:** Restore operator-grade backbone network management in `crm-portal-ts`, modeled on the old FastAPI backup workflow, with proper inventory, vendor access profiles, Dasan and Mikrotik discovery/import, unified diagnostics, and an operator-friendly frontend flow.

**Architecture:** Build on the existing TS runtime foundations already present in `net_devices`, `network_device_access_profiles`, `network_discovery_sessions`, and `network_discovery_records`. Expand `NetDevice` toward backup parity, keep encrypted connection secrets in access profiles, and preserve the `scan -> staging -> import` workflow rather than importing directly into business tables.

**Tech Stack:** TypeScript, Express, TypeORM, SQLite runtime migrations, Nuxt UI, Node test runner, Paramiko-compatible SSH flow on Dasan via Node SSH adapter, MikroTik RouterOS API adapter

---

### Phase 1: Backbone Device Inventory Parity

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\models\network.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\netdevices.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\schema_migrations.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\migrations.test.ts`

- [ ] Add operator-facing inventory fields restored from backup parity: `snmpCommunity`, `loginUrl`, `driverType`, `mgmtUsername`.
- [ ] Keep credentials in `network_device_access_profiles`; do not duplicate secrets on `net_devices`.
- [ ] Extend `net-devices` list/detail/create/update serialization to include the new fields.
- [ ] Add a runtime migration for the new `net_devices` columns.
- [ ] Verify the new fields survive create/update/detail flows.

### Phase 2: Vendor Access And Connection Tests

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\network_discovery.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\network_discovery_live.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\dasan_ssh.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\mikrotik_api.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`

- [ ] Add explicit connection-test behavior for Mikrotik and Dasan access profiles.
- [ ] Preserve Dasan `ssh -> enable -> cli-in-cli` behavior with port `22502`.
- [ ] Return operator-readable readiness state per device/profile.
- [ ] Cover both vendors with smoke expectations and parser/adapter tests.

### Phase 3: Dasan Discovery Staging Completion

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\dasan_ssh.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\network_discovery_live.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\network_discovery.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\network_vendor_parsers.test.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`

- [ ] Merge `show onu status`, `show onu info`, and `show mac` into one consistent staging model.
- [ ] Persist `OLT`, `ONU`, `status`, `serial`, `distance`, `rxPower`, `profile`, `port`, `vlan`, `mac`.
- [ ] Ensure live Dasan scan produces usable `dasan_onu` and `dasan_mac` records every time.
- [ ] Make session summaries meaningful for operator review.

### Phase 4: Unified Import Workflow

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\network_auto_import.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\network_discovery.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\customer_devices.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`

- [ ] Keep Mikrotik auto-import behavior intact.
- [ ] Add Dasan auto-import into `customer_devices` with `remote*` fields populated.
- [ ] Reuse fallback customer creation for unmatched records.
- [ ] Keep idempotency for repeated session auto-import runs.

### Phase 5: Unified Diagnostics And Backbone Operations

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\diagnostics.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\monitoring.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\routers\network_tools.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\services\monitoring_service.ts`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\src\tests\smoke.test.ts`

- [ ] Present one remote diagnostics result model for Mikrotik and Dasan.
- [ ] Cover `lease`, `arp`, `ping`, `bridge host` for Mikrotik.
- [ ] Cover `ONU exists`, `ONU active`, `serial match`, `MAC presence`, `rx power` for Dasan.
- [ ] Restore the minimum useful skeleton operations set from backup.

### Phase 6: Operator Frontend For Backbone Workflows

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\layouts\default.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\operations.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\monitoring.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\index.vue`
- Add or modify tests under: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\`

- [ ] Remove horizontal overflow from operator screens and navigation.
- [ ] Keep the calmer visual style, but move closer to the old workflow in menu and forms.
- [ ] Make backbone tasks discoverable from one infrastructure section.
- [ ] Keep staging, import, and diagnostics readable without icon-only actions.

### Phase 7: Final Verification And Rollout

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\MIGRATION_STATUS.md`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\README.md`

- [ ] Run `npm test`
- [ ] Run `npm --prefix frontend test`
- [ ] Run `npm run verify:release`
- [ ] Run a live sanity check for Mikrotik and Dasan scans against the local environment.
- [ ] Stage and commit only the files belonging to the current phase.
