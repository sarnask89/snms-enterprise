# TS/Nuxt Migration Status

This file tracks the current production baseline for `crm-portal-ts` while FastAPI remains the reference implementation for parity work.

## Active runtime modules

- `dashboard`: mounted at `/api/v1/dashboard`, returns resilient placeholder stats for the Nuxt home page.
- `admin`: mounted at `/api/v1/admin`, provides runtime info, audit logs, backups and config reload log endpoints.
- `auth`: mounted at `/api/v1/auth`, provides login, logout, current session and password change endpoints.
- `access-control`: active on mounted runtime routers, enforces `401` for missing session plus role-based `403` on protected writes and admin/config access.
- `config-snms`: mounted at `/api/v1/config`, manages divisions, VAT rates and number plans for the TS runtime.
- `addresses`: mounted at `/api/v1/addresses`, manages local TERYT city search and `managed/default` flags.
- `customers`: mounted at `/api/v1/customers`, supports expanded individual/company profiles, correspondence/billing fields and filtering for auto-generated customers.
- `customer-groups`: mounted at `/api/v1/customer-groups`, includes member assignment and parity-oriented payloads.
- `customer-devices`: mounted at `/api/v1/customer-devices`, supports installation-address fields per service/device.
- `diagnostics`: mounted at `/api/v1/diagnostics`, provides local customer-device readiness checks without live external router calls.
- `documents`: mounted at `/api/v1/documents`, current upload/list/download/delete baseline using JSON base64 payloads.
- `finances`: mounted at `/api/v1/finances`, current CRUD baseline for tariffs, invoices, recurring payments, ledger and cash.
- `helpdesk`: mounted at `/api/v1/helpdesk`, current CRUD baseline for queues, categories, tickets, assignment and reports.
- `net-nodes`: mounted at `/api/v1/net-nodes`, current searchable CRUD baseline with linked device counts.
- `ip-networks`: mounted at `/api/v1/ip-networks`, current searchable CRUD baseline with usage counts.
- `monitoring`: mounted at `/api/v1/monitoring`, provides local device, customer-device and global traffic summaries without legacy NMS dependencies.
- `net-devices`: mounted at `/api/v1/net-devices`, current searchable CRUD baseline with linked node, network and customer data.
- `network-discovery`: mounted at `/api/v1/network-discovery`, supports live scan staging, session auto-import, fallback customers and Mikrotik `rate-limit` tariff/subscription mapping.
- `pit`: mounted at `/api/v1/pit`, exports NetNode records with PUWG 1992 coordinates as GML and reports PIT sync readiness.
- `reports`: mounted at `/api/v1/reports`, provides PIT UKE CSV export and network passport map payloads.
- `search`: mounted at `/api/v1/search`, provides global customer and customer-device lookup.
- `snms-entities`: mounted at `/api/v1/snms`, provides messages, templates, timetable, traffic stats and runtime app settings CRUD.
- `stats`: mounted at `/api/v1/stats`, provides network, finance, inventory and growth summaries.
- `subscriptions`: mounted at `/api/v1/subscriptions`, current CRUD baseline with toggle action and customer-device lookup.
- `teryt`: mounted at `/api/v1/teryt`, supports local TERC/SIMC/ULIC import plus city/street suggestions.
- `architect`: mounted at `/api/v1/architect`, supports AI-driven file generation.
- `module-status`: mounted at `/api/v1/module-status`, reports the current migration state.

## Present but not wired into the baseline

- none

These files remain in `src/`, but they are not yet part of the curated runtime because they still need parity validation, dependency cleanup, or manual repair.

## Broken translation artifacts

The current repository contains multiple malformed files produced by incomplete FastAPI-to-TypeScript translation. Typical symptoms:

- Python syntax embedded in `.ts` files
- duplicated or truncated code blocks
- invalid imports and mixed runtime assumptions
- modules that exist on disk but cannot pass `tsc`

These files are intentionally excluded from the production baseline until they are either:

1. repaired manually, or
2. replaced with hand-written TypeScript implementations that match FastAPI behavior.

## Next migration rule

Only add a module back into the active runtime when all of the following are true:

- `tsc` stays green
- the router is mounted explicitly in `src/router_aggregator.ts`
- the module behavior is checked against the FastAPI version
- baseline tests still pass

## Release gate

Use `npm run verify:release` in `crm-portal-ts` as the canonical pre-release verification command.

The repository root GitHub Actions workflow `.github/workflows/crm-portal-ts-release-gate.yml` runs `npm run verify:ci`, which extends that gate with container smoke over `docker compose`.

## Schema bootstrap

The TS runtime now uses a dedicated runtime schema migration runner:

- `npm run migrate` applies the baseline migration to an empty managed runtime database.
- `npm run migrate:status` reports applied and pending runtime migrations.
- app startup runs the same migration runner before serving traffic.
- readiness requires both database access and zero pending runtime migrations.
