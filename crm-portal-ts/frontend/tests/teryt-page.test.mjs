import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/teryt.vue', import.meta.url)

test('teryt page exposes a dense registry manager layout', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /xl:grid-cols-\[1\.2fr,0\.8fr\]/, 'page should keep a tight import and default-area split at the top')
  assert.match(source, /xl:grid-cols-2/, 'page should keep side-by-side commune and city registries')
  assert.match(source, /xl:grid-cols-\[0\.9fr,1\.1fr\]/, 'page should keep quick search and streets preview as support panes')
  assert.match(source, /Rejestr importu/, 'page should frame imports as a compact registry section')
  assert.match(source, /Obszar domyślny/, 'page should expose a compact default area summary')
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
})
