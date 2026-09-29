import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('AI assistant component uses Lucide icons, accessible ARIA attributes, modal context, and auto-scroll logic', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/components/AiAssistant.vue'),
    'utf8'
  )

  // Lucide icons
  assert.match(source, /i-lucide-message-square/)
  assert.match(source, /i-lucide-sparkles/)
  assert.match(source, /i-lucide-file-check/)
  assert.match(source, /i-lucide-file-plus/)
  assert.match(source, /i-lucide-x/)
  assert.match(source, /i-lucide-send/)

  // ARIA attributes
  assert.match(source, /aria-label="Open AI Assistant"/)
  assert.match(source, /:aria-expanded="isOpen"/)
  assert.match(source, /aria-label="Configure API documentation context"/)
  assert.match(source, /aria-label="Close AI Assistant"/)
  assert.match(source, /aria-label="Type command or ask AI"/)
  assert.match(source, /aria-label="Send message to AI"/)

  // Context Modal
  assert.match(source, /<UModal[\s\S]*v-model:open="isContextModalOpen"/)
  assert.match(source, /API Documentation Context/)

  // Auto scroll logic
  assert.match(source, /chatFeedRef/)
  assert.match(source, /scrollToBottom/)
  assert.match(source, /nextTick/)
})
