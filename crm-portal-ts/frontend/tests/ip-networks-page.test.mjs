import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/network/ip-networks.vue', import.meta.url)

test('ip networks page uses dashboard table flow and Nuxt UI controls', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /<UDashboardPanel id="ip-networks">/)
  assert.match(source, /<UDashboardNavbar title="Sieci IP"/)
  assert.match(source, /<UDashboardToolbar>/)
  assert.match(source, /<UTable/)
  assert.match(source, /<UDropdownMenu/)
  assert.match(source, /<UCheckbox v-model="form\.active"/)
  assert.match(source, /Usuń sieć/)
  assert.doesNotMatch(source, /confirm\(/)
  assert.doesNotMatch(source, /<input[^>]+type="checkbox"/)
})
