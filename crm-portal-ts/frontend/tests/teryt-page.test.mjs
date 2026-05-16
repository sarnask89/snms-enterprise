import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/teryt.vue', import.meta.url)

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
})

test('teryt page exposes readable managed/default actions', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /(?:Oznacz managed|Zdejmij managed)/, 'managed action should expose a readable label')
  assert.match(source, /Ustaw domyśln/, 'default action should expose a readable label')
})
