import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/helpdesk.vue', import.meta.url)

test('helpdesk page exposes queues, categories and tickets with modern layout', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /Helpdesk/, 'page should keep the main helpdesk heading')
  assert.match(source, /Kolejki/, 'page should expose queues card')
  assert.match(source, /Kategorie/, 'page should expose categories card')
  assert.match(source, /Zgłoszenia/, 'page should expose tickets card')
})

test('helpdesk page has modern Lucide icons instead of legacy heroicons', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /i-lucide-plus/, 'should use modern i-lucide-plus icon')
  assert.match(source, /i-lucide-pencil/, 'should use modern i-lucide-pencil icon')
  assert.match(source, /i-lucide-trash-2/, 'should use modern i-lucide-trash-2 icon')
  assert.match(source, /i-lucide-search/, 'should use modern i-lucide-search icon')
  assert.match(source, /i-lucide-refresh-cw/, 'should use modern i-lucide-refresh-cw icon')
  assert.equal(source.includes('i-heroicons'), false, 'should not contain any legacy i-heroicons')
})

test('helpdesk page has Polish ARIA labels for icon-only action buttons', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /:aria-label="`Edytuj kolejkę \${row.name}`"/, 'should have Polish ARIA label for edit queue button')
  assert.match(source, /:aria-label="`Usuń kolejkę \${row.name}`"/, 'should have Polish ARIA label for delete queue button')
  assert.match(source, /:aria-label="`Edytuj kategorię \${row.name}`"/, 'should have Polish ARIA label for edit category button')
  assert.match(source, /:aria-label="`Usuń kategorię \${row.name}`"/, 'should have Polish ARIA label for delete category button')
  assert.match(source, /:aria-label="`Edytuj zgłoszenie \${row.title}`"/, 'should have Polish ARIA label for edit ticket button')
  assert.match(source, /:aria-label="`Zmień status zgłoszenia \${row.title}`"/, 'should have Polish ARIA label for status cycling button')
  assert.match(source, /:aria-label="`Usuń zgłoszenie \${row.title}`"/, 'should have Polish ARIA label for delete ticket button')
})

test('helpdesk page has toast notifications integrated for user feedback', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /const toast = useToast\(\)/, 'should initialize useToast')
  assert.match(source, /toast\.add/, 'should call toast.add for feedback on operations')
})
