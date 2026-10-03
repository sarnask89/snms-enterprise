import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('AiAssistant component includes ARIA labels, Lucide icons, auto-scroll watcher, and context modal', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/components/AiAssistant.vue'),
    'utf8'
  )

  assert.match(source, /aria-label="Open AI Assistant"/)
  assert.match(source, /aria-label="Close AI Assistant"/)
  assert.match(source, /aria-label="Configure API documentation context"/)
  assert.match(source, /aria-label="Send message to AI"/)
  assert.match(source, /i-lucide-message-square/)
  assert.match(source, /i-lucide-sparkles/)
  assert.match(source, /i-lucide-send/)
  assert.match(source, /scrollToBottom/)
  assert.match(source, /watch\(messages, scrollToBottom/)
  assert.match(source, /<UModal v-model:open="isContextModalOpen"/)
})
