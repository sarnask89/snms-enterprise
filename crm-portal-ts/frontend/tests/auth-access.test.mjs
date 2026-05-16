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
  assert.match(layoutSource, /label="Sesja"|label:\s*'Sesja'/)
  assert.match(layoutSource, /label="Zaloguj"|label:\s*'Zaloguj'/)
})
