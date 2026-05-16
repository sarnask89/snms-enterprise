# Frontend Operator Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the Nuxt frontend so it feels like a denser, operator-first CRM console, starting with the global shell and the `customers`, `operations`, and `teryt` pages.

**Architecture:** Keep the existing Nuxt routes, auth flow, and `/api/v1` proxy intact. Rework the layout shell and page composition in place, favoring denser toolbars, split working areas, clearer action labels, and stronger operator context. Add small structural frontend tests where they protect against recent regressions, but avoid redesigning backend contracts unless a page reveals a real data gap.

**Tech Stack:** Nuxt 4, Vue 3, @nuxt/ui, Node test runner, existing frontend route middleware and composables.

---

## File Map

### Primary files

- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\layouts\default.vue`
  - Global operator shell, grouped navigation, denser topbar, shared work surface.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\index.vue`
  - Customer list workbench, compact filters, denser table, stronger status and source visibility.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\[id].vue`
  - Customer dossier layout aligned with the new operator shell.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\operations.vue`
  - Split-pane operations console for device/profile/scan/session/import flow.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\teryt.vue`
  - Registry-style dictionary manager, denser import/action areas.

### Supporting files

- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\utils\auth-access.js`
  - Only if navigation grouping requires explicit access adjustments.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\composables\usePortalAuth.js`
  - Only if shell-level user/session summary needs additional derived state.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\auth-access.test.mjs`
  - Keep navigation access expectations aligned with grouped sidebar.
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\teryt-page.test.mjs`
  - Extend if needed to protect readable actions and dense registry behavior.
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\customers-page.test.mjs`
  - Structural tests for visible action labels and dense filter layout.
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\operations-page.test.mjs`
  - Structural tests for visible workflow stages and auto-import reporting.

### Verification targets

- Test command: `npm test`
- Build command: `npm run build`
- Browser review targets:
  - `http://127.0.0.1:3000/customers`
  - `http://127.0.0.1:3000/customers/<id>`
  - `http://127.0.0.1:3000/operations`
  - `http://127.0.0.1:3000/teryt`

## Task 1: Harden the global operator shell

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\layouts\default.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\auth-access.test.mjs`

- [ ] **Step 1: Write the failing shell expectations down in a test-safe form**

Use the existing route policy test style as reference and add assertions for grouped navigation labels that should remain visible after the layout rewrite.

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const layoutPath = new URL('../app/layouts/default.vue', import.meta.url)

test('default layout exposes grouped operator navigation', async () => {
  const source = await readFile(layoutPath, 'utf8')

  assert.match(source, /CRM/, 'sidebar should expose CRM group')
  assert.match(source, /Operacje/, 'sidebar should expose operations group')
  assert.match(source, /Administracja/, 'sidebar should expose admin group')
  assert.match(source, /Sesja|Zaloguj/, 'topbar should expose current session entry point')
})
```

- [ ] **Step 2: Run the frontend test suite to verify the new shell expectation fails or is not yet covered**

Run: `npm test`

Expected:
- existing tests pass
- new shell-focused expectation fails until `default.vue` is updated

- [ ] **Step 3: Rework `default.vue` into an operator shell**

Implement:
- grouped navigation sections instead of one flat list
- denser left rail with stronger visual hierarchy
- thinner topbar with current page context and session summary
- tighter main canvas spacing

Code direction:

```vue
const navigationGroups = computed(() => [
  {
    label: 'CRM',
    links: visibleLinks([
      { label: 'Pulpit', icon: 'i-heroicons-home', to: '/' },
      { label: 'Abonenci', icon: 'i-heroicons-users', to: '/customers' },
      { label: 'Dokumenty', icon: 'i-heroicons-folder', to: '/documents' }
    ])
  },
  {
    label: 'Sieć',
    links: visibleLinks([
      { label: 'Operacje', icon: 'i-heroicons-wrench-screwdriver', to: '/operations' },
      { label: 'Monitoring', icon: 'i-heroicons-signal', to: '/monitoring' },
      { label: 'TERYT', icon: 'i-heroicons-map', to: '/teryt' }
    ])
  }
])
```

Template direction:

```vue
<aside class="w-72 bg-slate-950 text-slate-100 border-r border-slate-800">
  <div class="px-5 py-4 border-b border-slate-800">
    <div class="text-xs uppercase tracking-[0.2em] text-slate-400">SNMS Enterprise</div>
    <div class="mt-1 text-lg font-semibold">Konsola operatorska</div>
  </div>
  <div class="px-3 py-4 space-y-5 overflow-auto">
    <section v-for="group in navigationGroups" :key="group.label" class="space-y-2">
      <div class="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{{ group.label }}</div>
      <UVerticalNavigation :links="group.links" />
    </section>
  </div>
</aside>
```

- [ ] **Step 4: Run tests and build to verify the shell rewrite is stable**

Run:
- `npm test`
- `npm run build`

Expected:
- frontend tests PASS
- Nuxt production build PASS

- [ ] **Step 5: Commit the shell slice**

```bash
git add frontend/app/layouts/default.vue frontend/tests/auth-access.test.mjs
git commit -m "feat: refresh operator shell layout"
```

## Task 2: Convert customer list into a denser CRM workbench

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\index.vue`
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\customers-page.test.mjs`

- [ ] **Step 1: Write the failing structural test for the customer workbench**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/customers/index.vue', import.meta.url)

test('customers page exposes readable row actions and compact filters', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Nowy abonent/, 'page should expose create action')
  assert.match(source, /Edytuj/, 'page should expose edit action')
  assert.match(source, /Usuń/, 'page should expose delete action')
  assert.match(source, /Auto-import|Pochodzenie/, 'page should expose customer source state')
})
```

- [ ] **Step 2: Run the new customer page test and confirm the current page still needs redesign**

Run: `npm test -- tests/customers-page.test.mjs`

Expected:
- either explicit failure on missing structure
- or a pass that still confirms the page needs visual/layout refactor, in which case continue with implementation

- [ ] **Step 3: Refactor the customer list into a two-level workbench layout**

Implement:
- compact title bar with primary actions
- persistent filter toolbar
- denser table rows
- stronger primary/secondary identity rendering
- visible source/status badges

Code direction:

```vue
<div class="space-y-4">
  <section class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="text-xl font-semibold">Abonenci</h1>
      <p class="text-sm text-gray-500">CRM operatora: dane klienta, status, źródło i szybkie akcje</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <UButton label="Grupy klientów" />
      <UButton label="Nowy abonent" />
    </div>
  </section>

  <section class="rounded-lg border ... p-3">
    <!-- dense filters -->
  </section>

  <section class="rounded-lg border ...">
    <UTable ... />
  </section>
</div>
```

- [ ] **Step 4: Bring the customer detail page in line with the new shell**

Update `customers/[id].vue` only where needed to:
- reduce empty spacing
- group profile blocks into dossier sections
- keep identity, billing, correspondence, and device context visible without long scrolling

Keep route behavior and existing API calls unchanged.

- [ ] **Step 5: Run verification for the customer slice**

Run:
- `npm test`
- `npm run build`

Expected:
- all frontend tests PASS
- build PASS

- [ ] **Step 6: Commit the customer slice**

```bash
git add frontend/app/pages/customers/index.vue frontend/app/pages/customers/[id].vue frontend/tests/customers-page.test.mjs
git commit -m "feat: redesign customer workbench pages"
```

## Task 3: Rebuild operations into a left-to-right operator console

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\operations.vue`
- Create: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\operations-page.test.mjs`

- [ ] **Step 1: Write the failing structural test for the operations workflow**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/operations.vue', import.meta.url)

test('operations page exposes scan and auto-import workflow sections', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Profil dostępu/, 'page should expose access profile step')
  assert.match(source, /Sesje discovery/, 'page should expose scan session step')
  assert.match(source, /Auto-import/, 'page should expose auto import action')
  assert.match(source, /Wynik auto-importu/, 'page should expose persistent import summary')
})
```

- [ ] **Step 2: Run the operations page test and verify baseline behavior**

Run: `npm test -- tests/operations-page.test.mjs`

Expected:
- new test either fails or passes while still documenting required operator structure

- [ ] **Step 3: Refactor `operations.vue` into a split workflow layout**

Implement:
- smaller summary counters
- top action bar
- left column for device/profile/session control
- right column for session records, import, and diagnostics context
- persistent operator report for auto-import result

Code direction:

```vue
<div class="grid xl:grid-cols-[1.1fr,0.9fr] gap-4">
  <section class="space-y-4">
    <!-- access profile, discovery devices, sessions -->
  </section>
  <section class="space-y-4">
    <!-- selected session records, import form, diagnostics -->
  </section>
</div>
```

- [ ] **Step 4: Keep all operational actions readable and stable**

Ensure labels remain visible for:
- `Zapisz profil`
- `Skanuj`
- `Rekordy`
- `Auto-import`
- `Wybierz`
- `Importuj`

Do not rely on icon-only affordances for core actions.

- [ ] **Step 5: Run verification for the operations slice**

Run:
- `npm test`
- `npm run build`

Expected:
- tests PASS
- build PASS

- [ ] **Step 6: Commit the operations slice**

```bash
git add frontend/app/pages/operations.vue frontend/tests/operations-page.test.mjs
git commit -m "feat: redesign network operations console"
```

## Task 4: Turn TERYT into a denser registry manager

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\teryt.vue`
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\teryt-page.test.mjs`

- [ ] **Step 1: Extend the TERYT page test to protect registry-style actions**

Add assertions for:
- visible `managed` action labels
- visible default action labels
- visible import action labels
- null-safe collections in the template

```js
assert.match(source, /Importuj XML/, 'import action should stay readable')
assert.match(source, /Ustaw domyśln/, 'default action should stay readable')
assert.match(source, /Oznacz managed|Zdejmij managed/, 'managed action should stay readable')
```

- [ ] **Step 2: Run the TERYT page test before refactor**

Run: `npm test -- tests/teryt-page.test.mjs`

Expected:
- current test passes
- baseline locked before layout refactor

- [ ] **Step 3: Refactor TERYT into a compact registry manager**

Implement:
- tighter import area at top
- more compact default-area summary
- denser commune/city tables
- support tools below or beside the main registry tables, not competing with them

Layout direction:

```vue
<div class="space-y-4">
  <section class="grid xl:grid-cols-[1.2fr,0.8fr] gap-4">
    <!-- import registry -->
    <!-- default area summary -->
  </section>
  <section class="grid xl:grid-cols-2 gap-4">
    <!-- communes registry -->
    <!-- cities registry -->
  </section>
  <section class="grid xl:grid-cols-[0.9fr,1.1fr] gap-4">
    <!-- quick search -->
    <!-- streets preview -->
  </section>
</div>
```

- [ ] **Step 4: Preserve the recent regression fix while increasing density**

Keep:
- `addressSearchRows` and `streetRows`
- `useFetch(..., { default: () => [] })`
- readable action labels for `managed/default/sync`

Do not reintroduce direct `.length` access on undefined fetch data.

- [ ] **Step 5: Run verification for the TERYT slice**

Run:
- `npm test`
- `npm run build`

Expected:
- tests PASS
- build PASS

- [ ] **Step 6: Commit the TERYT slice**

```bash
git add frontend/app/pages/teryt.vue frontend/tests/teryt-page.test.mjs
git commit -m "feat: redesign teryt registry page"
```

## Task 5: Browser validation and final polish

**Files:**
- Modify if needed: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\layouts\default.vue`
- Modify if needed: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\index.vue`
- Modify if needed: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customers\[id].vue`
- Modify if needed: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\operations.vue`
- Modify if needed: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\teryt.vue`

- [ ] **Step 1: Start the local frontend and backend if not already running**

Run:

```bash
npm run dev
```

and in the backend workspace if needed:

```bash
npm run dev
```

Expected:
- frontend reachable on `http://127.0.0.1:3000`
- backend/API reachable through the existing proxy

- [ ] **Step 2: Verify the operator shell manually**

Check:
- grouped sidebar sections render correctly
- session actions remain visible
- route access still respects roles

- [ ] **Step 3: Verify the customer workbench manually**

Check:
- filters are always visible
- row actions are readable
- `individual/company/auto-generated` distinction is easy to scan
- customer detail reads like a dossier rather than a long generic form

- [ ] **Step 4: Verify the operations console manually**

Check:
- workflow reads naturally left to right
- scan/session/import state remains visible
- auto-import report stays readable after execution

- [ ] **Step 5: Verify the TERYT registry manually**

Check:
- import actions remain visible
- `managed/default` actions are easy to find
- quick search and street preview support the main registry flow rather than distracting from it

- [ ] **Step 6: Run final automated verification**

Run:

```bash
npm test
npm run build
```

Expected:
- all frontend tests PASS
- production build PASS

- [ ] **Step 7: Commit final polish**

```bash
git add frontend/app/layouts/default.vue frontend/app/pages/customers/index.vue frontend/app/pages/customers/[id].vue frontend/app/pages/operations.vue frontend/app/pages/teryt.vue frontend/tests/customers-page.test.mjs frontend/tests/operations-page.test.mjs frontend/tests/teryt-page.test.mjs
git commit -m "feat: complete operator-first frontend refresh"
```
