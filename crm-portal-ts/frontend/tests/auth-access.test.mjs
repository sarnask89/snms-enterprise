import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  canAccessRoute,
  filterNavigationLinks,
  isPublicRoute
} from '../app/utils/auth-access.js'

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

test('operator shell source keeps grouped navigation labels and session affordances visible', () => {
  const layoutSource = readFileSync(
    resolve(process.cwd(), 'app/layouts/default.vue'),
    'utf8'
  )

  assert.match(layoutSource, /label:\s*'CRM'/)
  assert.match(layoutSource, /label:\s*'Operacje'/)
  assert.match(layoutSource, /label:\s*'Administracja'/)
  assert.match(layoutSource, /label:\s*'Urządzenia klientów'/)
  assert.match(layoutSource, /<UVerticalNavigation/, 'default layout should use standard sidebar navigation')
  assert.match(layoutSource, /label="Administracja"/, 'default layout should expose administration in the top menu')
  assert.match(layoutSource, /label="Sesja"|label:\s*'Sesja'/)
  assert.match(layoutSource, /label="Zaloguj"|label:\s*'Zaloguj'/)
})

test('operator shell session summary reads the auth session as a ref-backed state object', () => {
  const sessionSummaryBody = extractBlock(
    readLayoutScript(),
    'const sessionSummary = computed(() =>'
  )

  const evaluateSessionSummary = new Function('currentUser', sessionSummaryBody)

  assert.equal(
    evaluateSessionSummary({
      value: {
        role: 'admin'
      }
    }),
    'admin · sesja aktywna'
  )

  assert.equal(
    evaluateSessionSummary({
      value: null
    }),
    'Brak sesji'
  )
})

test('operator shell resolves truthful section and page labels for the architect route', () => {
  const layoutScript = readLayoutScript()
  const navigationSections = new Function(
    `return (${extractArrayLiteral(layoutScript, 'const navigationSections = ')})`
  )()
  const staticRouteLabels = new Function(
    `return (${extractArrayLiteral(layoutScript, 'const staticRouteLabels = ')})`
  )()

  const architectNavigation = findExpectedNavigationEntry(
    navigationSections,
    staticRouteLabels,
    '/architect'
  )

  assert.ok(architectNavigation, 'expected /architect to be represented in topbar navigation lookup')
  assert.deepEqual(
    findActiveNavigation(navigationSections, '/architect', staticRouteLabels),
    architectNavigation
  )
})

test('operator shell bootstraps auth session during setup instead of waiting for mount', () => {
  const layoutScript = readLayoutScript()
  const authComposableSource = readFileSync(
    resolve(process.cwd(), 'app/composables/usePortalAuth.js'),
    'utf8'
  )
  const authMiddlewareSource = readFileSync(
    resolve(process.cwd(), 'app/middleware/auth.global.js'),
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

function readLayoutScript() {
  const layoutSource = readFileSync(
    resolve(process.cwd(), 'app/layouts/default.vue'),
    'utf8'
  )
  const match = layoutSource.match(/<script setup>([\s\S]*?)<\/script>/)

  assert.ok(match, 'expected default layout to contain a <script setup> block')
  return match[1]
}

function extractArrayLiteral(source, marker) {
  const markerIndex = source.indexOf(marker)
  assert.notEqual(markerIndex, -1, `expected to find marker: ${marker}`)

  const startIndex = source.indexOf('[', markerIndex)
  assert.notEqual(startIndex, -1, `expected array literal after marker: ${marker}`)

  return extractBalancedSegment(source, startIndex, '[', ']')
}

function extractBlock(source, marker) {
  const markerIndex = source.indexOf(marker)
  assert.notEqual(markerIndex, -1, `expected to find marker: ${marker}`)

  const startIndex = source.indexOf('{', markerIndex)
  assert.notEqual(startIndex, -1, `expected block after marker: ${marker}`)

  const block = extractBalancedSegment(source, startIndex, '{', '}')
  return block.slice(1, -1)
}

function extractBalancedSegment(source, startIndex, openChar, closeChar) {
  let depth = 0

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]

    if (char === openChar) {
      depth += 1
    } else if (char === closeChar) {
      depth -= 1

      if (depth === 0) {
        return source.slice(startIndex, index + 1)
      }
    }
  }

  assert.fail(`unterminated ${openChar}${closeChar} segment starting at ${startIndex}`)
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

function findActiveLink(links, currentPath) {
  for (const link of links) {
    if (link.to && matchesPath(link.to, currentPath)) {
      return link.label
    }

    if (Array.isArray(link.children)) {
      const childLabel = findActiveLink(link.children, currentPath)

      if (childLabel) {
        return childLabel
      }
    }
  }

  return null
}

function findActiveNavigation(sections, currentPath, staticLabels = []) {
  const staticLabel = staticLabels.find(({ path }) => matchesPath(path, currentPath))

  if (staticLabel) {
    return {
      sectionLabel: staticLabel.sectionLabel,
      pageLabel: staticLabel.pageLabel
    }
  }

  for (const section of sections) {
    const pageLabel = findActiveLink(section.links, currentPath)

    if (pageLabel) {
      return {
        sectionLabel: section.label,
        pageLabel
      }
    }
  }

  return null
}

function findExpectedNavigationEntry(sections, staticLabels, targetPath) {
  const staticLabel = staticLabels.find(({ path }) => matchesPath(path, targetPath))

  if (staticLabel) {
    return {
      sectionLabel: staticLabel.sectionLabel,
      pageLabel: staticLabel.pageLabel
    }
  }

  for (const section of sections) {
    const pageLabel = findActiveLink(section.links, targetPath)

    if (pageLabel) {
      return {
        sectionLabel: section.label,
        pageLabel
      }
    }
  }

  return null
}
