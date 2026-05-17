import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('customer devices list uses Nuxt UI table and vendor/type filters', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/pages/customer-devices.vue'),
    'utf8'
  )

  assert.match(source, /<UTable/)
  assert.match(source, />Urządzenia klientów</)
  assert.match(source, /deviceTypeFilter/)
  assert.match(source, /vendorFilter/)
  assert.match(source, /deviceType === 'onu'/)
})
