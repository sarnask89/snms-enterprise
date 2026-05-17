import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/network/nodes.vue', import.meta.url)

test('network nodes page uses dashboard table flow and avoids raw confirm or checkbox inputs', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /<UDashboardPanel id="network-nodes">/)
  assert.match(source, /<UDashboardNavbar title="Węzły sieciowe"/)
  assert.match(source, /<UDashboardToolbar>/)
  assert.match(source, /<UTable/)
  assert.match(source, /<UDropdownMenu/)
  assert.match(source, /<UCheckbox v-model="form\.hasPower"/)
  assert.match(source, /<UCheckbox v-model="form\.hasEnvControl"/)
  assert.match(source, /Usuń węzeł/)
  assert.doesNotMatch(source, /confirm\(/)
  assert.doesNotMatch(source, /<input[^>]+type="checkbox"/)
})
