import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/teryt.vue', import.meta.url)

test('teryt page exposes a calmer registry workspace with legacy-like sections', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /TERYT i adresy/, 'page should keep the main registry heading')
  assert.match(source, /grid lg:grid-cols-3 gap-6/, 'page should use the calmer three-column legacy-like layout blocks')
  assert.match(source, /Domyślny obszar/, 'page should expose the default area summary')
  assert.match(source, /Rejestr gmin/, 'page should expose a dedicated commune registry')
  assert.match(source, /Rejestr miast/, 'page should expose a dedicated city registry')
  assert.match(source, /Podgląd ulic/, 'page should keep a streets preview helper pane')
})

test('teryt page uses null-safe collections in template conditions', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.equal(
    source.includes('!addressSearchResults.length'),
    false,
    'template should not access addressSearchResults.length directly before data is available'
  )
  assert.equal(
    source.includes('!streets.length'),
    false,
    'template should not access streets.length directly before data is available'
  )
  assert.match(source, /const addressSearchRows = computed\(\(\) => addressSearchData\.value \|\| \[\]\)/, 'address search rows should stay null-safe')
  assert.match(source, /const streetRows = computed\(\(\) => streets\.value \|\| \[\]\)/, 'street rows should stay null-safe')
  assert.match(source, /default:\s*\(\)\s*=>\s*\[\]/, 'list fetches should keep array defaults')
})

test('teryt page exposes readable registry actions', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /(?:Oznacz managed|Zdejmij managed)/, 'managed action should expose a readable label')
  assert.match(source, /Ustaw domyśln/, 'default action should expose a readable label')
  assert.match(source, /Importuj XML/, 'import action should stay readable')
  assert.match(source, /Synchronizuj/, 'sync action should stay readable')
  assert.match(source, /Szybkie wyszukiwanie TERYT/, 'page should keep the fast address lookup helper visible')
})
