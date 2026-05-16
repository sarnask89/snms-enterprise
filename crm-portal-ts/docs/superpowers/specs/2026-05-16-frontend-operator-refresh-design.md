# Frontend Operator Refresh Design

Date: 2026-05-16
Project: `crm-portal-ts`
Scope: Nuxt frontend refresh toward a denser, operator-first workflow inspired by the legacy FastAPI CRM UI

## Summary

The current Nuxt frontend is functional, but it still feels like a generic dashboard application rather than an operations console. The legacy CRM from backup was less visually polished, but it had stronger operator ergonomics: denser layouts, faster scanning of tables, more visible actions, and less wasted space between working areas.

This redesign will move the current Nuxt frontend toward that operator-first model without reverting to the legacy codebase or recreating the old UI pixel-for-pixel. The goal is not nostalgia. The goal is to preserve the working strengths of the old application while keeping the current TS/Nuxt runtime, routing, API contracts, and module structure.

The first implementation slice will focus on:

1. global shell and navigation
2. `customers`
3. `operations`
4. `teryt`

These areas carry the highest daily operator value and expose the most obvious UX friction today.

## Goals

- Make the frontend feel like a dense internal operations tool rather than a spacious dashboard.
- Reduce click cost for common CRM and network workflows.
- Keep the existing Nuxt route structure and backend API contracts intact.
- Reuse current components where possible, but change layout and page composition aggressively enough to improve usability.
- Bring visible actions, filters, status, and working context closer to the data they affect.

## Non-Goals

- No attempt to recreate the legacy FastAPI/Jinja UI one-to-one.
- No backend functional changes unless the frontend reveals a missing API detail required for usability.
- No broad redesign of every module in one pass.
- No introduction of a separate design system or third-party UI framework outside the current Nuxt UI stack.

## Design Approaches Considered

### 1. Operator-first refresh

Retain the existing routes and application architecture, but redesign the shell, density, tables, forms, and page composition to prioritize fast operator workflows.

Pros:
- strongest UX gain for moderate engineering cost
- low backend risk
- can be rolled out module by module

Cons:
- not a literal replica of legacy screens

### 2. Near-legacy recreation

Rebuild the Nuxt frontend to resemble the old CRM as closely as possible.

Pros:
- familiar look for legacy users

Cons:
- high risk of copying old limitations
- easy to produce a dated UI without improving workflow

### 3. Minimal touch-up

Keep most screens intact and only tweak spacing, button visibility, and labels.

Pros:
- fastest
- lowest implementation risk

Cons:
- not enough change to solve the current ergonomics problem

## Decision

Use approach 1: operator-first refresh.

This preserves the current technical direction while deliberately pulling in the legacy application's strongest usability traits: density, visibility, hierarchy, and workflow speed.

## UX Principles

### Dense by default

Desktop is the primary operating mode. The interface should expose more information per viewport and reduce oversized spacing. Cards should only be used when they create real separation between tasks; otherwise lists, toolbars, and split layouts should dominate.

### Actions next to data

Users should not need to hunt for row-level actions. Buttons like `edytuj`, `usuń`, `managed`, `domyślne`, `skanuj`, and `auto-import` should remain visible, readable, and consistently placed.

### Working context stays visible

Filters, selection state, active session, chosen records, and current defaults should stay on screen while the user works. The interface should avoid forcing memory of prior selections.

### Hierarchy over decoration

The design should look intentional and operational, not decorative. Strong section headers, compact tables, status badges, and clear left-to-right workflows matter more than visual softness.

### Legacy familiarity, modern implementation

The frontend should feel closer to a CRM backoffice than a product marketing panel, but should still use current Nuxt conventions, composables, and route structure.

## Information Architecture

### Global Shell

The shell becomes a compact two-column operator workspace:

- left: stronger navigation rail with module groups
- right: top workbar and content area

### Sidebar

The sidebar should:

- use grouped sections such as `CRM`, `Sieć`, `Finanse`, `Operacje`, `Administracja`
- display a stronger visual hierarchy than the current flat list
- keep always-used destinations near the top
- expose quick system status where useful, such as active user and key counters

The current sidebar title area should be redesigned from a simple logo header into a compact product-and-context block. It should feel like a working console, not a generic app shell.

### Topbar

The topbar should contain:

- breadcrumbs or current section name
- optional quick search entry point
- current session/user summary
- one compact action zone for context-level actions

The topbar should be thinner and more utilitarian than today.

### Content Canvas

Pages should use:

- narrower vertical rhythm
- fewer oversized wrappers
- more split-pane patterns
- fewer isolated cards for single tables

### Page Redesign Scope

### Customers

The customer module should shift toward a classic CRM workbench:

- filters always visible at top
- denser table with stronger row scanability
- more visible identity and billing context in the list
- clearer differentiation between `individual`, `company`, and `auto-generated`
- direct access to edit/view/delete without depending on tiny icons

The customer detail screen should become a structured operator profile:

- identity block
- contact block
- correspondence address block
- contract and billing block
- device/installations block

The page should read like a working dossier rather than a long generic form.

### Operations

The network operations screen should become a true operations console:

- left-to-right workflow of `device/profile -> scan -> session -> records -> import/test`
- denser summary counters
- clearer distinction between access profiles, discovery devices, sessions, and session records
- fewer stacked cards where split workflow panes are more efficient

Auto-import results should remain visible after execution and be framed like an operator report, not just a transient result area.

### TERYT

The TERYT page should feel like an administrative dictionary manager:

- import controls grouped tightly at top
- default area and managed/default actions visible without visual hunting
- communes and cities displayed in denser registry-style tables
- street preview and quick search placed as support tools, not dominant panels

Because this page is dictionary-heavy, it should resemble a records management console more than a dashboard.

## Visual Direction

### Color and surface

The refreshed UI should move toward:

- stronger neutral surfaces
- darker, more technical sidebar
- clearer borders between working regions
- reduced “soft card” feeling

It should look closer to an enterprise operations console than a marketing-oriented admin template.

### Typography

Typography should prioritize readability and density:

- slightly smaller supporting text
- stronger section titles
- tighter table rows
- more consistent label hierarchy in forms

### Components

Existing `UButton`, `UTable`, `UCard`, `UFormGroup`, and `UInput` components remain the base layer, but their composition changes:

- more compact buttons by default
- more text labels on operational actions
- less dependence on icon-only controls
- stronger use of inline status badges and secondary metadata

## Interaction Model

### Tables

Tables should become the primary working surface.

Expected changes:

- tighter row height
- clearer action columns
- stronger visual distinction between primary and secondary cell content
- persistent footers or compact headers where totals and filters matter

### Forms

Forms should be split into meaningful operational sections instead of long uninterrupted field lists. For customer details and network operations, this means a multi-panel layout with explicit headings and compact helper copy.

### Selection and state

The UI must keep important current state visible:

- active discovery session
- selected record
- current default area
- currently active filters
- current customer type and import origin

## Technical Design

### Frontend architecture

The redesign should stay inside the current Nuxt application:

- preserve route files
- preserve auth middleware and access filtering
- preserve API proxying under `/api/v1`

Implementation should prefer:

- layout-level improvements in `frontend/app/layouts/default.vue`
- page-level refactors for `customers`, `operations`, and `teryt`
- extraction of local presentational helpers only where repetition becomes real

No broad component library rewrite is required.

### Data dependencies

No API redesign is planned for this refresh. Existing endpoints should remain sufficient for the first slice. If a page reveals a missing summary field needed for usability, that should be treated as a small supporting backend enhancement, not a redesign driver.

## Testing Strategy

### Frontend verification

For each redesigned page:

- Nuxt build must pass
- frontend test suite must pass
- page-specific structural tests should verify critical regressions where practical

### Browser validation

Manual browser review should confirm:

- navigation remains role-aware
- key actions are visible on desktop
- no important workflows require hidden or ambiguous controls
- the denser layout remains readable

### Regression focus

The redesign should explicitly guard against:

- icon-only actions becoming invisible again
- SSR/runtime failures from null-unsafe template access
- overuse of cards and empty spacing reappearing in key modules

## Implementation Order

1. redesign global shell in `default.vue`
2. refactor `customers/index.vue`
3. refactor `customers/[id].vue` where needed for consistency
4. refactor `operations.vue`
5. refactor `teryt.vue`
6. run browser validation and tighten remaining rough edges

## Risks

### Over-modernizing away from operator workflows

If the redesign focuses too much on aesthetics, it will miss the actual goal. Every visual change must be justified by faster scanning, fewer clicks, or clearer state.

### Inconsistent density

If only some pages become dense and others remain airy, the app will feel incoherent. The shell and first three operational pages need to set a consistent tone.

### Hidden action regressions

The current issue with icon-only controls is a direct warning sign. Operational actions must remain readable even when icon rendering changes.

## Acceptance Criteria

The redesign is successful when:

- the app feels closer to a legacy CRM/backoffice than a generic dashboard
- navigation and page structure support faster operator work
- `customers`, `operations`, and `teryt` expose important actions and state without hunting
- the UI is denser but still readable
- all existing auth and API flows continue to work

## Open Questions

There are no blocking product questions for the first slice. The remaining execution questions are implementation details and should be handled in the plan:

- exact module grouping in sidebar
- exact table density defaults
- whether some create/edit flows should stay modal or move inline
