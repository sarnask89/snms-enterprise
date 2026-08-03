<template>
  <ClientOnly>
    <div>
      <!-- The Floating Button -->
      <UTooltip v-if="!isOpen" text="Open CRM Assistant" :popper="{ placement: 'left' }">
        <UButton
          icon="i-heroicons-chat-bubble-left-ellipsis-solid"
          size="xl"
          color="primary"
          class="fixed bottom-6 right-6 shadow-2xl rounded-full w-14 h-14 flex items-center justify-center animate-bounce-slow z-50"
          aria-label="Open CRM Assistant"
          @click="isOpen = true"
        />
      </UTooltip>

      <!-- The Draggable Chat Window -->
      <div
        v-show="isOpen"
        ref="chatWindow"
        class="fixed z-50 w-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        :style="{ left: `${x}px`, top: `${y}px` }"
      >
        <!-- Header (Draggable Handle) -->
        <div
          ref="chatHandle"
          class="bg-primary-500 text-white p-3 flex justify-between items-center cursor-move select-none"
        >
          <div class="flex items-center gap-2 font-bold">
            <UIcon name="i-heroicons-sparkles" />
            CRM Assistant
          </div>
          <div class="flex items-center gap-1">
            <UTooltip :text="systemContext ? 'API documentation loaded' : 'Add API documentation as context'">
              <UButton
                :icon="systemContext ? 'i-heroicons-document-check' : 'i-heroicons-document-plus'"
                :color="systemContext ? 'green' : 'white'"
                variant="ghost"
                size="xs"
                label="API Doc"
                aria-label="Configure API documentation for the assistant"
                @click="promptForContext"
              />
            </UTooltip>
            <UTooltip text="Close Assistant">
              <UButton
                icon="i-heroicons-x-mark"
                color="white"
                variant="ghost"
                size="xs"
                aria-label="Close Assistant"
                @click="isOpen = false"
              />
            </UTooltip>
          </div>
        </div>

        <!-- Chat Feed -->
        <div
          ref="chatFeed"
          class="flex-1 h-[450px] overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-950 scroll-smooth"
        >
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="p-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap"
            :class="msg.role === 'user' ? 'bg-primary-500 text-white self-end rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start rounded-tl-none'"
          >
            {{ msg.content }}
          </div>
          <div v-if="isLoading" class="self-start">
            <UProgress animation="carousel" class="w-20" />
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <UInput
              v-model="input"
              placeholder="Type command or ask AI..."
              class="flex-1"
              autocomplete="off"
              :disabled="isLoading"
              aria-label="Message to Assistant"
            />
            <UTooltip text="Send message">
              <UButton
                type="submit"
                icon="i-heroicons-paper-airplane"
                color="primary"
                :loading="isLoading"
                aria-label="Send message"
              />
            </UTooltip>
          </form>
        </div>
      </div>

         </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useDraggable, useWindowSize } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const chatFeed = ref(null)
const isLoading = ref(false)
const isContextModalOpen = ref(false)
const input = ref('')
const systemContext = ref('')
const tempContext = ref('')

const messages = ref([
  { role: 'assistant', content: 'Hi! I am your CRM Architect. Paste some API documentation (using the button above) or ask me to build a module.' }
])

// Dragging logic
const chatWindow = ref(null)
const chatHandle = ref(null)
const { width, height } = useWindowSize()
const x = ref(0)
const y = ref(0)

const scrollToBottom = async () => {
  await nextTick()
  if (chatFeed.value) {
    chatFeed.value.scrollTop = chatFeed.value.scrollHeight
  }
}

// Watch messages to auto scroll
watch(
  () => messages.value,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

// Also scroll when assistant window is opened
watch(isOpen, (newVal) => {
  if (newVal) {
    scrollToBottom()
  }
})

onMounted(() => {
  x.value = width.value - 450
  y.value = height.value - 600
  scrollToBottom()
})

useDraggable(chatWindow, { handle: chatHandle, onMove: (pos) => { x.value = pos.x; y.value = pos.y } })

const promptForContext = () => {
  tempContext.value = systemContext.value
  isContextModalOpen.value = true
}

const sendMessage = async () => {
  if (!input.value.trim()) return

  const userText = input.value.trim()
  messages.value.push({ role: 'user', content: userText })
  input.value = ''

  // 1. Check for Agent Commands
  if (userText.startsWith('/agent')) {
    const parts = userText.split(' ')
    const cmd = parts[1]
    const target = parts[2] || 'app'

    if (cmd === 'start') {
      isLoading.value = true
      try {
        const res = await $fetch('/api/agent/start', { method: 'POST', body: { target } })
        messages.value.push({ role: 'assistant', content: `🤖 Agent Status: ${res.message}` })
      } catch {
        messages.value.push({ role: 'assistant', content: `❌ Failed to start agent.` })
      }
      isLoading.value = false
      return
    }

    if (cmd === 'status' || cmd === 'logs') {
      isLoading.value = true
      try {
        const res = await $fetch('/api/agent/status')
        messages.value.push({ 
          role: 'assistant', 
          content: `🤖 Agent is ${res.isRunning ? 'RUNNING' : 'STOPPED'}.\n\nLast logs:\n${res.logs || 'No logs yet.'}` 
        })
      } catch {
        messages.value.push({ role: 'assistant', content: `❌ Failed to fetch agent status.` })
      }
      isLoading.value = false
      return
    }
  }

  // 2. Check for MAC commands (Instant UI navigation)
  const macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/i
  const hasMac = userText.match(macRegex)

  if (hasMac) {
    const mac = hasMac[0]
    if (userText.toLowerCase().includes('test')) {
      messages.value.push({ role: 'assistant', content: `Routing to diagnostics for ${mac}...` })
      router.push(`/network/devices/test/${mac}`)
      return
    }
    if (userText.toLowerCase().includes('info')) {
      messages.value.push({ role: 'assistant', content: `Opening client profile for ${mac}...` })
      router.push(`/customers/device/${mac}`)
      return
    }
  }

  // 2. Send to Ollama for Generation/Chat
  isLoading.value = true
  const config = useRuntimeConfig()
  const ollamaUrl = config.public.ollamaUrl || 'http://localhost:11434'
  const ollamaModel = config.public.ollamaModel || 'deepseek-coder:1.3b'

  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: `You are the CRM Portal Architect. ${systemContext.value ? 'Use this API documentation as reference: ' + systemContext.value : ''}` },
          ...messages.value.slice(-5) // Send last 5 messages for context
        ],
        stream: false
      })
    })

    const data = await response.json()
    messages.value.push({ role: 'assistant', content: data.message.content })
  } catch {
    messages.value.push({ role: 'assistant', content: '❌ Error connecting to Ollama. Make sure the server is running on port 11434.' })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-bounce-slow { animation: bounce 3s infinite; }
</style>
