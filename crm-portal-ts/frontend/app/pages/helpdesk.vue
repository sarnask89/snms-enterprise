<template>
  <div class="p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Helpdesk</h1>
        <p class="text-sm text-gray-500">Obsługa zgłoszeń klientów i wewnętrznych prac serwisowych</p>
      </div>
      <UBadge color="orange" variant="soft">API v2</UBadge>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <UCard class="xl:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Zgłoszenia</h3>
            <UButton icon="i-heroicons-arrow-path" size="xs" variant="ghost" @click="loadTickets" />
          </div>
        </template>

        <UTable :rows="tickets" :columns="columns" :loading="loading">
          <template #status-data="{ row }">
            <UBadge :color="statusColor(row.status)" variant="soft" size="xs">
              {{ row.status }}
            </UBadge>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-bold">Nowe zgłoszenie</h3>
        </template>

        <form class="space-y-4" @submit.prevent="createTicket">
          <UFormGroup label="Temat">
            <UInput v-model="form.title" placeholder="Brak internetu u klienta..." />
          </UFormGroup>

          <UFormGroup label="Opis">
            <UTextarea v-model="form.body" :rows="8" placeholder="Opisz problem, lokalizację, urządzenie lub MAC..." />
          </UFormGroup>

          <UButton type="submit" color="primary" icon="i-heroicons-plus" :loading="saving" block>
            Utwórz ticket
          </UButton>

          <UAlert v-if="message" color="green" variant="soft" :title="message" />
          <UAlert v-if="error" color="red" variant="soft" :title="error" />
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const tickets = ref([])
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const error = ref('')

const form = reactive({
  title: '',
  body: ''
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Temat' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Utworzono' }
]

const statusColor = (status) => {
  switch (status) {
    case 'open': return 'orange'
    case 'in_progress': return 'blue'
    case 'resolved': return 'emerald'
    case 'closed': return 'gray'
    default: return 'gray'
  }
}

const loadTickets = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/v2/helpdesk/tickets')
    tickets.value = data.items || []
  } catch (e) {
    error.value = 'Nie udało się pobrać zgłoszeń.'
  } finally {
    loading.value = false
  }
}

const createTicket = async () => {
  message.value = ''
  error.value = ''
  if (!form.title || !form.body) {
    error.value = 'Temat i opis są wymagane.'
    return
  }

  saving.value = true
  try {
    await $fetch('/api/v2/helpdesk/tickets', {
      method: 'POST',
      body: {
        title: form.title,
        body: form.body
      }
    })
    form.title = ''
    form.body = ''
    message.value = 'Zgłoszenie utworzone.'
    await loadTickets()
  } catch (e) {
    error.value = 'Nie udało się utworzyć zgłoszenia.'
  } finally {
    saving.value = false
  }
}

onMounted(loadTickets)
</script>
