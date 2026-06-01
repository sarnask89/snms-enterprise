import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('customer-devices.vue has ARIA labels and loading state', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/pages/customer-devices.vue'),
    'utf8'
  )
  assert.match(source, /:loading="pending"/)
  assert.match(source, /aria-label="Odśwież listę"/)
  assert.match(source, /aria-label="Szukaj urządzeń"/)
  assert.match(source, /aria-label="Opcje urządzenia"/)
})

test('customers/index.vue has ARIA labels', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/pages/customers/index.vue'),
    'utf8'
  )
  assert.match(source, /aria-label="Szukaj klientów"/)
  assert.match(source, /aria-label="Opcje klienta"/)
})

test('subscriptions.vue has ARIA labels', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/pages/subscriptions.vue'),
    'utf8'
  )
  assert.match(source, /aria-label="Edytuj subskrypcję"/)
  assert.match(source, /aria-label="Przełącz subskrypcję"/)
  assert.match(source, /aria-label="Usuń subskrypcję"/)
})
