import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const customersIndexPath = new URL('../app/pages/customers/index.vue', import.meta.url)
const customerDetailPath = new URL('../app/pages/customers/[id].vue', import.meta.url)

test('customers index follows dashboard table layout with inline create flow and row dropdown actions', async () => {
  const source = await readFile(customersIndexPath, 'utf8')

  assert.match(source, /<UDashboardPanel/, 'index should use dashboard panel shell')
  assert.match(source, /<UDashboardNavbar title="Abonenci"/, 'index should expose the abonenci navbar title')
  assert.match(source, /<UDashboardSidebarCollapse/, 'index should keep sidebar collapse in the navbar')
  assert.match(source, /Nowy abonent/, 'index should keep create flow visible in-page')
  assert.match(source, /<UTable/, 'index should render the customer list through UTable')
  assert.match(source, /<UDropdownMenu/, 'index should keep row actions behind an optional dropdown')
  assert.match(source, /auto-import|manualny/, 'index should label source badges clearly')
  assert.match(source, /Aktywny|Zawieszony|Zakończony/, 'index should keep readable status labels')
  assert.match(source, /Otwórz dossier/, 'index should keep the explicit dossier action visible')
  assert.equal(source.includes('<UModal'), false, 'index should avoid modal-only create flow')
})

test('customer detail keeps the expanded profile sections and inline device editing surface', async () => {
  const source = await readFile(customerDetailPath, 'utf8')

  assert.match(source, /Pełny profil klienta, dane rozliczeniowe, adresy TERYT i urządzenia/, 'detail should explain the expanded profile context')
  assert.match(source, /Kanały kontaktu/, 'detail should group contact channels explicitly')
  assert.match(source, /Adres korespondencyjny/, 'detail should keep address section visible')
  assert.match(source, /useManagedTerytAddress/, 'detail should reuse the managed-city address helper')
  assert.match(source, /Użyj domyślnego miasta/, 'detail should keep the default-city shortcut for TERYT-backed forms')
  assert.match(source, /Umowa i rozliczenia/, 'detail should keep billing section visible')
  assert.match(source, /Urządzenia i instalacje/, 'detail should expose device section as a named dossier block')
  assert.match(source, /Edytuj adres/, 'detail should keep inline device address editing visible')
  assert.doesNotMatch(source, /label="Gmina"/, 'detail should not expose commune field in operator forms')
  assert.doesNotMatch(source, /label="Powiat"/, 'detail should not expose district field in operator forms')
  assert.doesNotMatch(source, /label="Województwo"/, 'detail should not expose voivodeship field in operator forms')
  assert.equal(source.includes('<UModal'), false, 'detail should avoid modal device editing flow')
})
