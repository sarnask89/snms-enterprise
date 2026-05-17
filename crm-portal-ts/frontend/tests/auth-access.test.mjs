import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { readdir } from 'node:fs/promises'

import { importTypeScriptModule } from './support/load-ts-module.mjs'

const {
  canAccessRoute,
  filterNavigationLinks,
  isPublicRoute
} = await importTypeScriptModule('app/utils/auth-access.ts')

test('public routes are limited to auth entry points', () => {
  assert.equal(isPublicRoute('/settings'), true)
  assert.equal(isPublicRoute('/architect'), true)
  assert.equal(isPublicRoute('/customers'), false)
})

test('anonymous user cannot access protected routes', () => {
  assert.equal(canAccessRoute(null, '/customers'), false)
  assert.equal(canAccessRoute(null, '/admin'), false)
  assert.equal(canAccessRoute(null, '/settings'), true)
})

test('view role can access read-oriented modules but not admin routes', () => {
  assert.equal(canAccessRoute('view', '/customers'), true)
  assert.equal(canAccessRoute('view', '/customer-devices'), true)
  assert.equal(canAccessRoute('view', '/network/devices'), true)
  assert.equal(canAccessRoute('view', '/admin'), false)
  assert.equal(canAccessRoute('view', '/settings'), true)
})

test('admin role can access admin routes', () => {
  assert.equal(canAccessRoute('admin', '/admin'), true)
  assert.equal(canAccessRoute('admin', '/settings'), true)
})

test('navigation is filtered by role', () => {
  const links = [
    { label: 'Customers', to: '/customers' },
    { label: 'Admin', to: '/admin' },
    {
      label: 'Network',
      children: [
        { label: 'Nodes', to: '/network/nodes' },
        { label: 'Admin tools', to: '/admin/tools' }
      ]
    }
  ]

  assert.deepEqual(
    filterNavigationLinks(links, 'view'),
    [
      { label: 'Customers', to: '/customers' },
      {
        label: 'Network',
        children: [
          { label: 'Nodes', to: '/network/nodes' }
        ]
      }
    ]
  )
})

test('operator shell source uses dashboard template primitives and exposes key navigation entries', () => {
  const layoutSource = readFileSync(
    resolve(process.cwd(), 'app/layouts/default.vue'),
    'utf8'
  )

  assert.match(layoutSource, /<UDashboardGroup/)
  assert.match(layoutSource, /<UDashboardSidebar/)
  assert.match(layoutSource, /<UDashboardSearchButton/)
  assert.match(layoutSource, /<UNavigationMenu/)
  assert.match(layoutSource, /label:\s*'Abonenci'/)
  assert.match(layoutSource, /label:\s*'Urządzenia klientów'/)
  assert.match(layoutSource, /label:\s*'Administracja'/)
  assert.match(layoutSource, /label:\s*'Monitoring'/)
  assert.match(layoutSource, /Wyloguj' : 'Zaloguj'|'Wyloguj' : 'Zaloguj'|Zaloguj/)
})

test('operator shell resolves truthful page labels from dashboard navigation for the architect route', () => {
  const layoutScript = readLayoutScript()
  const navigationSections = new Function('open', `
    return ${extractBetween(layoutScript, 'const navigationSections = ', '\n\nconst visibleSections = computed(() =>')}
  `)({ value: false })
  const links = navigationSections.flat()
  const architectNavigation = findExpectedNavigationEntry(links, '/architect')

  assert.ok(architectNavigation, 'expected /architect to be represented in topbar navigation lookup')
  assert.deepEqual(
    findActiveNavigation(links, '/architect'),
    architectNavigation
  )
})

test('operator shell bootstraps auth session during setup instead of waiting for mount', () => {
  const layoutScript = readLayoutScript()
  const authComposableSource = readFileSync(
    resolve(process.cwd(), 'app/composables/usePortalAuth.ts'),
    'utf8'
  )
  const authMiddlewareSource = readFileSync(
    resolve(process.cwd(), 'app/middleware/auth.global.ts'),
    'utf8'
  )

  assert.match(
    layoutScript,
    /await\s+loadSession\(\{\s*silent:\s*true\s*\}\)/,
    'default layout should hydrate the session during setup so SSR sees the active user'
  )
  assert.doesNotMatch(
    layoutScript,
    /onMounted\(\(\)\s*=>\s*\{\s*loadSession\(\{\s*silent:\s*true\s*\}\)/,
    'default layout should not defer the primary session bootstrap until mount'
  )
  assert.match(
    authComposableSource,
    /useRequestHeaders\(\s*\[\s*['"]cookie['"]\s*\]\s*\)/,
    'auth composable should forward request cookies when resolving SSR session state'
  )
  assert.doesNotMatch(
    authMiddlewareSource,
    /if\s*\(\s*import\.meta\.server\s*\)\s*\{\s*return\s*\}/,
    'route middleware should not skip auth checks on the server'
  )
})

test('frontend app source no longer keeps JavaScript modules after TS migration', async () => {
  const appRoot = resolve(process.cwd(), 'app')
  const jsFiles = await collectJavaScriptFiles(appRoot)

  assert.deepEqual(jsFiles, [])
  assert.match(
    readFileSync(resolve(process.cwd(), 'app/utils/auth-access.ts'), 'utf8'),
    /const INTERNAL_ROLES/
  )
})

function readLayoutScript() {
  const layoutSource = readFileSync(
    resolve(process.cwd(), 'app/layouts/default.vue'),
    'utf8'
  )
  const match = layoutSource.match(/<script setup>([\s\S]*?)<\/script>/)

  assert.ok(match, 'expected default layout to contain a <script setup> block')
  return match[1]
}

function extractBetween(source, startMarker, endMarker) {
  const startIndex = source.indexOf(startMarker)
  assert.notEqual(startIndex, -1, `expected to find marker: ${startMarker}`)

  const contentStart = startIndex + startMarker.length
  const endIndex = source.indexOf(endMarker, contentStart)
  assert.notEqual(endIndex, -1, `expected to find marker: ${endMarker}`)

  return source.slice(contentStart, endIndex).trim()
}

function normalizePath(path) {
  if (!path) {
    return '/'
  }

  return String(path).split('?')[0] || '/'
}

function matchesPath(candidate, currentPath) {
  const normalizedCandidate = normalizePath(candidate)
  return currentPath === normalizedCandidate || currentPath.startsWith(`${normalizedCandidate}/`)
}

function findActiveLink(items, currentPath) {
  for (const item of items) {
    if (item.to && matchesPath(item.to, currentPath)) {
      return item.label
    }

    if (Array.isArray(item.children)) {
      const childLabel = findActiveLink(item.children, currentPath)

      if (childLabel) {
        return childLabel
      }
    }
  }

  return null
}

function findActiveNavigation(items, currentPath) {
  for (const item of items) {
    const pageLabel = findActiveLink([item], currentPath)
    if (pageLabel) {
      return {
        pageLabel
      }
    }
  }

  return null
}

function findExpectedNavigationEntry(items, targetPath) {
  for (const item of items) {
    const pageLabel = findActiveLink([item], targetPath)
    if (pageLabel) {
      return {
        pageLabel
      }
    }
  }

  return null
}

async function collectJavaScriptFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = resolve(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectJavaScriptFiles(absolutePath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(absolutePath)
    }
  }

  return files
}
