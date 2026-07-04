import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const monitoringPath = new URL('../app/pages/monitoring.vue', import.meta.url)

test('monitoring page has been modernized with Lucide icons and Polish ARIA labels', async () => {
  const source = await readFile(monitoringPath, 'utf8')

  assert.match(source, /icon="i-lucide-refresh-cw"/, 'should use lucide refresh icon')
  assert.match(source, /color="neutral"/, 'should use neutral color for refresh button')
  assert.match(source, /aria-label="Odśwież monitoring"/, 'should have ARIA label for refresh button')
  assert.match(source, /aria-label="Pobierz statystyki urządzenia"/, 'should have ARIA label for device stats button')
  assert.match(source, /aria-label="Pobierz statystyki klienta"/, 'should have ARIA label for customer stats button')
  assert.match(source, /aria-label="ID urządzenia klienta"/, 'should have ARIA label for customer device ID input')
})

test('monitoring page has toast feedback for statistics loading', async () => {
  const source = await readFile(monitoringPath, 'utf8')

  assert.match(source, /const toast = useToast\(\)/, 'should initialize useToast')
  assert.match(source, /toast\.add\(\{/, 'should use toast.add for feedback')
  assert.match(source, /title: 'Statystyki pobrane'/, 'should have success toast title')
  assert.match(source, /title: 'Błąd pobierania'/, 'should have error toast title')
  assert.match(source, /color: 'error'/, 'should use error color for error toast')
})
