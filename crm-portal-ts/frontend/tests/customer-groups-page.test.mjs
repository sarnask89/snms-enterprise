import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const customerGroupsPath = new URL('../app/pages/customers/groups.vue', import.meta.url)

test('customer groups page follows modern UI standards with Lucide icons and semantic tokens', async () => {
  const source = await readFile(customerGroupsPath, 'utf8')

  // Icons
  assert.match(source, /icon="i-lucide-arrow-left"/, 'should use lucide arrow icon')
  assert.match(source, /icon="i-lucide-plus"/, 'should use lucide plus icon')
  assert.match(source, /icon="i-lucide-search"/, 'should use lucide search icon')
  assert.match(source, /icon="i-lucide-pencil"/, 'should use lucide pencil icon')
  assert.match(source, /icon="i-lucide-trash-2"/, 'should use lucide trash icon')

  // Color tokens
  assert.match(source, /color="neutral"/, 'should use neutral color token instead of gray')
  assert.match(source, /color="error"/, 'should use error color token instead of red')

  // Accessibility
  assert.match(source, /aria-label="Edytuj grupę"/, 'should have ARIA label for edit button')
  assert.match(source, /aria-label="Usuń grupę"/, 'should have ARIA label for delete button')
  assert.match(source, /<UCheckbox/, 'should use UCheckbox for member selection')

  // Script logic
  assert.match(source, /const toast = useToast\(\)/, 'should initialize toast')
  assert.match(source, /toast\.add/, 'should use toast for notifications')
  assert.match(source, /i \${row\.customers\.length - 3} więcej/, 'should have overflow indicator in member preview')
})
