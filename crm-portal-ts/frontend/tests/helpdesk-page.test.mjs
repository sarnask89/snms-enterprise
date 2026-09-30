import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/helpdesk.vue', import.meta.url)

test('helpdesk page uses Lucide icons instead of legacy Heroicons', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.equal(source.includes('i-heroicons'), false, 'page should not contain legacy heroicons')
  assert.match(source, /i-lucide-plus/, 'page should use i-lucide-plus')
  assert.match(source, /i-lucide-pencil/, 'page should use i-lucide-pencil')
  assert.match(source, /i-lucide-trash-2/, 'page should use i-lucide-trash-2')
  assert.match(source, /i-lucide-search/, 'page should use i-lucide-search')
  assert.match(source, /i-lucide-refresh-cw/, 'page should use i-lucide-refresh-cw')
})

test('helpdesk page includes accessible ARIA labels for buttons and inputs', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /aria-label="Dodaj nową kolejkę"/, 'should have ARIA label for adding queue')
  assert.match(source, /aria-label="Dodaj nową kategorię"/, 'should have ARIA label for adding category')
  assert.match(source, /aria-label="Wyszukiwanie w zgłoszeniach"/, 'should have ARIA label for ticket search')
  assert.match(source, /:aria-label="'Edytuj kolejkę ' \+ row\.name"/, 'should have dynamic ARIA label for queue edit')
  assert.match(source, /:aria-label="'Usuń kolejkę ' \+ row\.name"/, 'should have dynamic ARIA label for queue remove')
  assert.match(source, /:aria-label="'Edytuj zgłoszenie ' \+ row\.title"/, 'should have dynamic ARIA label for ticket edit')
})

test('helpdesk page incorporates useToast feedback notifications and correct Nuxt UI props', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /const toast = useToast\(\)/, 'should inject useToast hook')
  assert.match(source, /toast\.add\(/, 'should trigger toast feedback on operations')
  assert.equal(source.includes(':data="3"'), false, 'UTextarea should not use legacy invalid :data prop')
  assert.match(source, /:rows="3"/, 'UTextarea should use :rows prop')
  assert.match(source, /v-model:open="isQueueModalOpen"/, 'UModal should use v-model:open')
})
