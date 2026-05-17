import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/network/devices.vue', import.meta.url)

test('network devices page uses dashboard shell and exposes backbone management fields', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /<UDashboardPanel id="network-devices">/, 'page should use dashboard panel shell')
  assert.match(source, /<UDashboardNavbar title="Urządzenia sieciowe"/, 'page should keep dashboard navbar title')
  assert.match(source, /<UDashboardToolbar>/, 'page should expose dashboard toolbar filters')
  assert.match(source, /<UTable/, 'page should render through UTable')
  assert.match(source, /<UDropdownMenu/, 'row actions should live behind a dropdown')
  assert.match(source, /SNMP community/, 'page should expose SNMP community field')
  assert.match(source, /Login URL/, 'page should expose login URL field')
  assert.match(source, /Driver discovery/, 'page should expose discovery driver field')
  assert.match(source, /Login management/, 'page should expose management username field')
  assert.match(source, /Operacje discovery/, 'page should link backbone devices with discovery workflow')
  assert.match(source, /Usuń urządzenie/, 'page should use explicit delete confirmation content')
})
