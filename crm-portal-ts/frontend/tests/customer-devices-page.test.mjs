import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('customer devices list uses Nuxt UI table and vendor/type filters', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/pages/customer-devices.vue'),
    'utf8'
  )

  assert.match(source, /<UDashboardPanel/)
  assert.match(source, /<UDashboardNavbar title="Urządzenia klientów"/)
  assert.match(source, /<UTable/)
  assert.match(source, /<UDropdownMenu/)
  assert.match(source, /deviceTypeFilter/)
  assert.match(source, /vendorFilter/)
  assert.match(source, /statusFilter/)
  assert.match(source, /deviceType === 'onu'/)
  assert.match(source, /remoteVendor === 'dasan'/)
  assert.match(source, /Diagnostyka w operacjach/)
  assert.match(source, /Edytuj urządzenie/)
  assert.match(source, /Usuń urządzenie/)
  assert.match(source, /Użyj domyślnego miasta/)
  assert.match(source, /useManagedTerytAddress/)
  assert.match(source, /installationCityId/)
  assert.match(source, /installationStreetId/)
  assert.match(source, /<UModal/)
})
