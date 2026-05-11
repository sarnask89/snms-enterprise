<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="flex items-center gap-4 mb-8">
      <div class="p-3 rounded-2xl bg-primary-500/10 text-primary-500">
        <UIcon name="i-heroicons-sparkles" class="w-8 h-8" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">AI Architekt Modułów</h1>
        <p class="text-sm text-gray-500">Projektuj i twórz nowe moduły CRM za pomocą sztucznej inteligencji</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Chat Interface -->
      <UCard class="flex flex-col h-[600px]">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Czat z Architektem</h3>
            <UButton icon="i-heroicons-trash" color="gray" variant="ghost" size="xs" @click="clearChat" />
          </div>
        </template>

        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-gray-950 rounded-lg mb-4">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="p-4 rounded-2xl max-w-[90%] text-sm"
            :class="msg.role === 'user' ? 'bg-primary-500 text-white self-end' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start'"
          >
            <div v-if="msg.role === 'assistant'" class="prose dark:prose-invert prose-xs">
              {{ msg.content }}
            </div>
            <div v-else>{{ msg.content }}</div>
          </div>
          <div v-if="isLoading" class="self-start">
            <UProgress animation="carousel" class="w-20" />
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="flex gap-2">
          <UInput
            v-model="input"
            placeholder="Opisz moduł, który chcesz zbudować..."
            class="flex-1"
            :disabled="isLoading"
          />
          <UButton type="submit" icon="i-heroicons-paper-airplane" :loading="isLoading" />
        </form>
      </UCard>

      <!-- Preview & Implementation -->
      <div class="flex flex-col gap-6">
        <UCard class="flex-1">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold">Wygenerowana Specyfikacja</h3>
              <UButton 
                v-if="lastSpec" 
                icon="i-heroicons-cpu-chip" 
                label="Wdróż Moduł" 
                color="green" 
                @click="implementModule" 
              />
            </div>
          </template>
          
          <div v-if="lastSpec" class="prose dark:prose-invert prose-sm max-h-[400px] overflow-y-auto">
             <pre class="text-[10px] bg-gray-900 text-green-400 p-4 rounded-lg"><code>{{ lastSpec }}</code></pre>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 mb-2" />
            <p>Jeszcze nie wygenerowano specyfikacji</p>
          </div>
        </UCard>

        <UAlert
          icon="i-heroicons-information-circle"
          color="primary"
          variant="soft"
          title="Uwaga dotycząca bezpieczeństwa"
          description="Sztuczna inteligencja wygeneruje kod na podstawie Twojego opisu. Zawsze sprawdzaj wygenerowaną implementację przed wdrożeniem na produkcję."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const input = ref('')
const isLoading = ref(false)
const lastSpec = ref('')
const messages = ref([
  { role: 'assistant', content: 'Witaj! Jestem Architektem Modułów. Jaką funkcjonalność lub moduł zaprojektujemy dzisiaj? (np. "Dodaj system śledzenia pojazdów" albo "Stwórz menedżera inwentarza")' }
])

const clearChat = () => {
  messages.value = [messages.value[0]]
  lastSpec.value = ''
}

const sendMessage = async () => {
  if (!input.value.trim()) return
  
  const userText = input.value.trim()
  messages.value.push({ role: 'user', content: userText })
  input.value = ''
  isLoading.value = true

  try {
    const response = await fetch(`${config.public.ollamaUrl}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: config.public.ollamaModel,
        messages: [
          { 
            role: 'system', 
            content: `You are the CRM Portal Architect. Your job is to design database models and API structures for new modules. 
            When the user asks for a module, provide a concise Markdown specification including:
            1. Database Model (SQLAlchemy style)
            2. API Endpoints
            3. UI Components needed
            
            Keep it focused and professional.` 
          },
          ...messages.value.slice(-5)
        ],
        stream: false
      })
    })

    const data = await response.json()
    const content = data.message.content
    messages.value.push({ role: 'assistant', content })
    
    // Extract code block if present for the "Specification" window
    const codeMatch = content.match(/```(?:python|sql|json|typescript)?\s*([\s\S]*?)```/)
    if (codeMatch) {
      lastSpec.value = codeMatch[1]
    } else {
      lastSpec.value = content
    }
  } catch (error) {
    messages.value.push({ role: 'assistant', content: '❌ Error connecting to Ollama Architect.' })
  } finally {
    isLoading.value = false
  }
}

const implementModule = async () => {
  // This would call the backend to actually create files
  alert('Implementation logic would be triggered here. Sending spec to backend...')
}
</script>
