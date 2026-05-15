# TS/Nuxt Migration Status

This file tracks the current production baseline for `crm-portal-ts` while FastAPI remains the reference implementation for parity work.

## Active runtime modules

- `dashboard`: mounted at `/api/v1/dashboard`, returns resilient placeholder stats for the Nuxt home page.
- `admin`: mounted at `/api/v1/admin`, provides runtime info, audit logs, backups and config reload log endpoints.
- `addresses`: mounted at `/api/v1/addresses`, manages local TERYT city search and `managed/default` flags.
- `customers`: mounted at `/api/v1/customers`, current CRUD baseline.
- `customer-groups`: mounted at `/api/v1/customer-groups`, includes member assignment and parity-oriented payloads.
- `customer-devices`: mounted at `/api/v1/customer-devices`, current CRUD baseline.
- `diagnostics`: mounted at `/api/v1/diagnostics`, provides local customer-device readiness checks without live external router calls.
- `documents`: mounted at `/api/v1/documents`, current upload/list/download/delete baseline using JSON base64 payloads.
- `finances`: mounted at `/api/v1/finances`, current CRUD baseline for tariffs, invoices, recurring payments, ledger and cash.
- `helpdesk`: mounted at `/api/v1/helpdesk`, current CRUD baseline for queues, categories, tickets, assignment and reports.
- `net-nodes`: mounted at `/api/v1/net-nodes`, current searchable CRUD baseline with linked device counts.
- `ip-networks`: mounted at `/api/v1/ip-networks`, current searchable CRUD baseline with usage counts.
- `net-devices`: mounted at `/api/v1/net-devices`, current searchable CRUD baseline with linked node, network and customer data.
- `network-discovery`: mounted at `/api/v1/network-discovery`, imports discovered leases into customer devices and discovered CIDR networks into IP networks.
- `pit`: mounted at `/api/v1/pit`, exports NetNode records with PUWG 1992 coordinates as GML and reports PIT sync readiness.
- `subscriptions`: mounted at `/api/v1/subscriptions`, current CRUD baseline with toggle action and customer-device lookup.
- `teryt`: mounted at `/api/v1/teryt`, supports local TERC/SIMC/ULIC import plus city/street suggestions.
- `architect`: mounted at `/api/v1/architect`, supports AI-driven file generation.
- `module-status`: mounted at `/api/v1/module-status`, reports the current migration state.

## Present but not wired into the baseline

- `auth`, `config_snms`
- `snms_entities`, `stats`, `monitoring`, `reports`, `search`

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
