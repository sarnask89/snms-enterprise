import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const componentPath = new URL('../app/components/AiAssistant.vue', import.meta.url)

test('AiAssistant component includes explicit ARIA labels and accessibility attributes', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /aria-label="Open AI Assistant"/, 'floating button should have an explicit ARIA label')
  assert.match(source, /:aria-expanded="false"/, 'floating trigger button should declare aria-expanded state')
  assert.match(source, /aria-label="Close AI Assistant"/, 'close button should have an explicit ARIA label')
  assert.match(source, /aria-label="Configure API documentation context"/, 'API doc configuration button should have an explicit ARIA label')
  assert.match(source, /aria-label="Type command or ask AI"/, 'chat input field should have an explicit ARIA label')
  assert.match(source, /aria-label="Send message to AI"/, 'submit button should have an explicit ARIA label')
})

test('AiAssistant component uses standard Lucide icons and modern Nuxt UI v4 color tokens', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /icon="i-lucide-message-square"/, 'floating button should use Lucide message square icon')
  assert.match(source, /<UIcon name="i-lucide-sparkles" \/>/, 'header should use Lucide sparkles icon')
  assert.match(source, /:icon="systemContext \? 'i-lucide-file-check' : 'i-lucide-file-plus'"/, 'context button should toggle Lucide file icons')
  assert.match(source, /icon="i-lucide-x"/, 'close button should use Lucide x icon')
  assert.match(source, /icon="i-lucide-send"/, 'send button should use Lucide send icon')

  assert.doesNotMatch(source, /i-heroicons-/, 'component should not use legacy heroicons')
  assert.match(source, /:color="systemContext \? 'success' : 'neutral'"/, 'context button should use v4 success/neutral semantic color tokens')
})

test('AiAssistant component includes chat feed auto-scrolling and context modal configuration', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /ref="chatFeed"/, 'chat feed container should bind a template ref for scroll positioning')
  assert.match(source, /const scrollToBottom = async \(\) =>/, 'component should define an auto-scrolling helper')
  assert.match(source, /watch\(messages, scrollToBottom, \{ deep: true \}\)/, 'component should watch messages array to auto-scroll chat feed')
  assert.match(source, /<UModal v-model:open="isContextModalOpen">/, 'component should expose a modal for API context configuration')
})
