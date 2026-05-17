import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/operations.vue', import.meta.url)

test('operations page uses the standard workbench wrapper while preserving key workflow sections', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Operacje sieciowe/, 'page should frame operations with the simpler network operations heading')
  assert.match(source, /Standardowy widok roboczy/, 'page should explain the standard Nuxt-style workbench context')
  assert.match(source, /space-y-6 overflow-x-hidden/, 'page should avoid horizontal overflow in the main workbench wrapper')
  assert.match(source, /grid gap-4 md:grid-cols-2 xl:grid-cols-4/, 'page should expose summary tiles in a standard responsive grid')
  assert.match(source, /Profil dostępu/, 'page should expose access profile control')
  assert.match(source, /Discovery devices/, 'page should keep device scan control visible')
  assert.match(source, /Sesje discovery/, 'page should expose session workflow control')
  assert.match(source, /Rekordy sesji/, 'page should keep session records visible')
  assert.match(source, /Import wybranego rekordu/, 'page should keep record import workflow visible')
  assert.match(source, /Diagnostyka lokalna i zdalna/, 'page should keep diagnostics context visible')
})

test('operations page keeps readable actions and persistent auto-import reporting', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Odśwież/, 'page should keep top action bar refresh control visible')
  assert.match(source, /Pobierz PIT GML/, 'page should keep top action bar export control visible')
  assert.match(source, /Zapisz profil/, 'page should keep access profile save action readable')
  assert.match(source, /Test połączenia/, 'page should allow testing a discovery profile before scanning')
  assert.match(source, /Skanuj/, 'page should keep scan action readable')
  assert.match(source, /Rekordy/, 'page should keep records action readable')
  assert.match(source, /Auto-import/, 'page should keep auto-import action readable')
  assert.match(source, /Wybierz/, 'page should keep record selection action readable')
  assert.match(source, /Importuj rekord/, 'page should keep import action readable')
  assert.match(source, /Wynik auto-importu/, 'page should expose persistent import reporting')
  assert.match(source, /Auto-import ma tworzyć też taryfy i subskrypcje z rate-limit DHCP/, 'page should keep the tariff and subscription auto-import toggle visible')
  assert.match(source, /Połączenie OK/, 'page should show profile connection test feedback inline')
})

test('operations page keeps select values string-safe for Nuxt UI controls', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /const booleanOptions = \[\s*\{\s*label:\s*'Nie',\s*value:\s*'false'/, 'boolean select options should use string values expected by USelect')
  assert.match(source, /label:\s*'Tak',\s*value:\s*'true'/, 'boolean select should expose a string true option')
  assert.match(source, /useTls:\s*'false'/, 'form state should initialize the select with a string value')
  assert.match(source, /useTls:\s*accessProfileForm\.useTls\s*===\s*'true'/, 'submit payload should coerce the select value back to boolean')
})
