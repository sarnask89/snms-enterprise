import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('AI assistant component exposes accessible controls, Lucide icons, and context modal', () => {
  const source = readFileSync(
    resolve(process.cwd(), 'app/components/AiAssistant.vue'),
    'utf8'
  )

  // Floating trigger button accessibility and state
  assert.match(source, /aria-label="Open AI Assistant"/)
  assert.match(source, /:aria-expanded="isOpen"/)
  assert.match(source, /icon="i-lucide-message-square"/)

  // Header controls accessibility and standard icons
  assert.match(source, /i-lucide-sparkles/)
  assert.match(source, /aria-label="Configure API documentation context"/)
  assert.match(source, /aria-label="Close AI Assistant"/)
  assert.match(source, /icon="i-lucide-x"/)

  // Input area accessibility and standard icons
  assert.match(source, /aria-label="Type command or ask AI"/)
  assert.match(source, /aria-label="Send message to AI"/)
  assert.match(source, /icon="i-lucide-send"/)

  // Auto-scroll logic and system context modal
  assert.match(source, /ref="chatFeed"/)
  assert.match(source, /scrollToBottom/)
  assert.match(source, /<UModal v-model:open="isContextModalOpen"/)
  assert.match(source, /aria-label="API documentation context input"/)
  assert.match(source, /saveContext/)
})
