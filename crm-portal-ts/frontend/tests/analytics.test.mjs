import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('analytics page uses Lucide icons, accessible ARIA labels, and feedback toasts', () => {
  const filePath = path.join(process.cwd(), 'app/pages/analytics.vue')
  const content = fs.readFileSync(filePath, 'utf8')

  assert.match(content, /i-lucide-refresh-cw/)
  assert.match(content, /i-lucide-download/)
  assert.match(content, /i-lucide-map/)
  assert.match(content, /i-lucide-search/)

  assert.match(content, /aria-label="Odśwież statystyki analityczne"/)
  assert.match(content, /aria-label="Pobierz raport PIT CSV"/)
  assert.match(content, /aria-label="Pobierz mapę PIT GML"/)
  assert.match(content, /aria-label="Wyszukaj klientów i urządzenia"/)
  assert.match(content, /aria-label="Uruchom wyszukiwanie"/)

  assert.match(content, /const toast = useToast\(\)/)
})
