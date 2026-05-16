import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/operations.vue', import.meta.url)

test('operations page exposes a split operator console workflow', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Konsola operatorska/, 'page should frame operations as an operator console')
  assert.match(source, /xl:grid-cols-\[[^\]]+\]/, 'page should use an explicit split-pane console layout')
  assert.match(source, /Profil dostępu/, 'page should expose access profile control')
  assert.match(source, /Discovery devices/, 'page should keep device scan control visible')
  assert.match(source, /Sesje discovery/, 'page should expose session workflow control')
  assert.match(source, /Rekordy sesji/, 'page should dedicate a records pane on the right side')
  assert.match(source, /Import i staging/, 'page should dedicate an import context pane on the right side')
  assert.match(source, /Diagnostyka operatora/, 'page should dedicate diagnostics context on the right side')
})

test('operations page keeps readable actions and persistent auto-import reporting', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Odśwież/, 'page should keep top action bar refresh control visible')
  assert.match(source, /Pobierz PIT GML/, 'page should keep top action bar export control visible')
  assert.match(source, /Zapisz profil/, 'page should keep access profile save action readable')
  assert.match(source, /Skanuj/, 'page should keep scan action readable')
  assert.match(source, /Rekordy/, 'page should keep records action readable')
  assert.match(source, /Auto-import/, 'page should keep auto-import action readable')
  assert.match(source, /Wybierz/, 'page should keep record selection action readable')
  assert.match(source, /Importuj rekord/, 'page should keep import action readable')
  assert.match(source, /Wynik auto-importu/, 'page should expose persistent import reporting')
})
