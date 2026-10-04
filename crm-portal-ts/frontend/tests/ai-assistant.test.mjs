import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const componentPath = new URL('../app/components/AiAssistant.vue', import.meta.url)

test('AiAssistant component has accessible ARIA labels and state attributes', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /aria-label="Open AI Assistant"/, 'floating button should have Open AI Assistant ARIA label')
  assert.match(source, /:aria-expanded="isOpen"/, 'floating button should set aria-expanded state')
  assert.match(source, /aria-label="Configure API documentation context"/, 'API Doc button should have explicit ARIA label')
  assert.match(source, /aria-label="Close AI Assistant"/, 'close button should have explicit ARIA label')
  assert.match(source, /aria-label="Type command or ask AI"/, 'input field should have explicit ARIA label')
  assert.match(source, /aria-label="Send message to AI"/, 'send button should have explicit ARIA label')
})

test('AiAssistant component uses standard Lucide icons', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /i-lucide-message-square/, 'should use Lucide message square icon for floating trigger')
  assert.match(source, /i-lucide-sparkles/, 'should use Lucide sparkles icon in header')
  assert.match(source, /i-lucide-file-check/, 'should use Lucide file check icon for set context')
  assert.match(source, /i-lucide-file-plus/, 'should use Lucide file plus icon for unset context')
  assert.match(source, /i-lucide-x/, 'should use Lucide x icon for close button')
  assert.match(source, /i-lucide-send/, 'should use Lucide send icon for submit button')
  assert.equal(source.includes('i-heroicons-'), false, 'should not contain legacy Heroicons')
})

test('AiAssistant component integrates system context modal and auto-scrolling', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.match(source, /<UModal[\s\S]*v-model:open="isContextModalOpen"/, 'should contain UModal bound to isContextModalOpen')
  assert.match(source, /const scrollToBottom = \(\) =>/, 'should define scrollToBottom auto-scrolling helper')
  assert.match(source, /ref="chatFeed"/, 'should tag chat feed container with ref for auto-scrolling')
})
