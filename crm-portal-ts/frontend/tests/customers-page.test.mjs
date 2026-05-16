import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const customersIndexPath = new URL('../app/pages/customers/index.vue', import.meta.url)
const customerDetailPath = new URL('../app/pages/customers/[id].vue', import.meta.url)

test('customers index exposes dense workbench structure and inline create flow', async () => {
  const source = await readFile(customersIndexPath, 'utf8')

  assert.match(source, /CRM Workbench/, 'index should expose CRM workbench heading')
  assert.match(source, /Szybkie dodanie abonenta/, 'index should keep create flow visible in-page')
  assert.match(source, /Źródło rekordu|Źródło danych/, 'index should label source badges clearly')
  assert.match(source, /Status operacyjny|Status/, 'index should keep readable status labels')
  assert.equal(source.includes('<UModal'), false, 'index should avoid modal-only create flow')
})

test('customer detail exposes dossier sections and inline device editing surface', async () => {
  const source = await readFile(customerDetailPath, 'utf8')

  assert.match(source, /Dossier abonenta/, 'detail should expose dossier framing')
  assert.match(source, /Kanały kontaktu/, 'detail should group contact channels explicitly')
  assert.match(source, /Adres korespondencyjny/, 'detail should keep address section visible')
  assert.match(source, /Umowa i rozliczenia/, 'detail should keep billing section visible')
  assert.match(source, /Urządzenia i instalacje/, 'detail should expose device section as a named dossier block')
  assert.equal(source.includes('<UModal'), false, 'detail should avoid modal device editing flow')
})
