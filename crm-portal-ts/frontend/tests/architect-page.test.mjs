import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const pagePath = new URL('../app/pages/architect.vue', import.meta.url)

test('architect page maintains main layout heading and title', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /AI Architekt Modułów/, 'page should keep the main title heading')
  assert.match(source, /Czat z Architektem/, 'page should keep the chat interface card header')
  assert.match(source, /Wygenerowana Specyfikacja/, 'page should keep the generated specification card header')
})

test('architect page uses standard Lucide icons and no legacy heroicons', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.equal(source.includes('i-heroicons-'), false, 'page should not use legacy heroicons')
  assert.match(source, /i-lucide-sparkles/, 'page should use i-lucide-sparkles')
  assert.match(source, /i-lucide-trash-2/, 'page should use i-lucide-trash-2')
  assert.match(source, /i-lucide-send/, 'page should use i-lucide-send')
  assert.match(source, /i-lucide-zap/, 'page should use i-lucide-zap')
  assert.match(source, /i-lucide-file-search/, 'page should use i-lucide-file-search')
  assert.match(source, /i-lucide-info/, 'page should use i-lucide-info')
})

test('architect page includes accessible Polish ARIA labels and toast notifications', async () => {
  const source = await readFile(pagePath, 'utf8')

  assert.match(source, /aria-label="Wyczyść historię czatu"/, 'chat clear button should have explicit Polish ARIA label')
  assert.match(source, /aria-label="Opis modułu do zbudowania"/, 'chat input field should have explicit Polish ARIA label')
  assert.match(source, /aria-label="Wyślij wiadomość do AI Architekta"/, 'chat submit button should have explicit Polish ARIA label')
  assert.match(source, /aria-label="Wdróż wygenerowany moduł"/, 'implement module button should have explicit Polish ARIA label')
  assert.match(source, /const toast = useToast\(\)/, 'page should use useToast hook for user feedback')
  assert.equal(source.includes('alert('), false, 'page should not use native browser alert dialogs')
  assert.match(source, /color="neutral"/, 'clear button should use Nuxt UI v4 neutral token')
  assert.match(source, /color="success"/, 'deploy button should use Nuxt UI v4 success token')
})
