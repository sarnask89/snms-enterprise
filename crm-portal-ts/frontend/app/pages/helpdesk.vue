<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Helpdesk</h1>
        <p class="text-sm text-gray-500">Kolejki, kategorie i zgłoszenia klientów w aktywnym baseline TS/Nuxt</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">Kolejki</h2>
              <p class="text-sm text-gray-500">Kanały obsługi zgłoszeń</p>
            </div>
            <UButton color="primary" size="sm" icon="i-heroicons-plus" label="Dodaj" @click="isQueueModalOpen = true" />
          </div>
        </template>

        <UTable :data="queues || []" :columns="queueColumns" :loading="pendingQueues">
          <template #actions-data="{ row }">
            <div class="flex gap-2">
              <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openQueueEdit(row)" />
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeQueue(row)" />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold text-lg">Kategorie</h2>
              <p class="text-sm text-gray-500">Klasyfikacja zgłoszeń</p>
            </div>
            <UButton color="primary" size="sm" icon="i-heroicons-plus" label="Dodaj" @click="isCategoryModalOpen = true" />
          </div>
        </template>

        <UTable :data="categories || []" :columns="categoryColumns" :loading="pendingCategories">
          <template #queue-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.queue?.name || 'Brak kolejki' }}</div>
          </template>

          <template #actions-data="{ row }">
            <div class="flex gap-2">
              <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openCategoryEdit(row)" />
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeCategory(row)" />
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="font-semibold text-lg">Zgłoszenia</h2>
            <p class="text-sm text-gray-500">Podstawowy workflow: create, search, status, assign</p>
          </div>
          <div class="flex items-center gap-3">
            <UInput
              v-model="ticketSearch"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="Szukaj po tytule lub treści..."
              class="w-72"
            />
            <UButton color="primary" icon="i-heroicons-plus" label="Nowe zgłoszenie" @click="openTicketCreate" />
          </div>
        </div>
      </template>

      <UTable :data="filteredTickets" :columns="ticketColumns" :loading="pendingTickets">
        <template #customer-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : 'Brak klienta' }}
          </div>
        </template>

        <template #queue-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.queue?.name || 'Brak kolejki' }}<span v-if="row.category"> · {{ row.category.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="ticketStatusColor(row.status)" variant="soft">{{ row.status }}</UBadge>
        </template>

        <template #assigneeId-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.assigneeId ? `#${row.assigneeId}` : 'Nieprzypisane' }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openTicketEdit(row)" />
            <UButton size="xs" color="yellow" variant="ghost" icon="i-heroicons-arrow-path" @click="cycleTicketStatus(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeTicket(row)" />
          </div>
        </template>
      </UTable>

      <template #footer>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="text-gray-500">Wszystkie tickety</div>
            <div class="text-2xl font-bold">{{ reports?.totalTickets || 0 }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="text-gray-500">Open</div>
            <div class="text-2xl font-bold">{{ reports?.byStatus?.open || 0 }}</div>
          </div>
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="text-gray-500">Pending</div>
            <div class="text-2xl font-bold">{{ reports?.byStatus?.pending || 0 }}</div>
          </div>
        </div>
      </template>
    </UCard>

    <UModal v-model="isQueueModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">{{ queueForm.id ? 'Edytuj kolejkę' : 'Dodaj kolejkę' }}</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveQueue">
          <UFormField label="Nazwa" required><UInput v-model="queueForm.name" /></UFormField>
          <UFormField label="Opis"><UTextarea v-model="queueForm.description" :data="3" /></UFormField>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isQueueModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingQueue" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isCategoryModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">{{ categoryForm.id ? 'Edytuj kategorię' : 'Dodaj kategorię' }}</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveCategory">
          <UFormField label="Kolejka" required><USelect v-model="categoryForm.queueId" :items="queueOptions" label-key="label" /></UFormField>
          <UFormField label="Nazwa" required><UInput v-model="categoryForm.name" /></UFormField>
          <UFormField label="Opis"><UTextarea v-model="categoryForm.description" :data="3" /></UFormField>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isCategoryModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingCategory" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isTicketModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">{{ ticketForm.id ? 'Edytuj zgłoszenie' : 'Dodaj zgłoszenie' }}</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveTicket">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Klient"><USelect v-model="ticketForm.customerId" :items="customerOptionsWithEmpty" label-key="label" /></UFormField>
            <UFormField label="Assignee ID"><UInput v-model="ticketForm.assigneeId" type="number" placeholder="np. 101" /></UFormField>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Kolejka"><USelect v-model="ticketForm.queueId" :items="queueOptionsWithEmpty" label-key="label" /></UFormField>
            <UFormField label="Kategoria"><USelect v-model="ticketForm.categoryId" :items="categoryOptionsWithEmpty" label-key="label" /></UFormField>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Status"><USelect v-model="ticketForm.status" :items="ticketStatusOptions" label-key="label" /></UFormField>
            <UFormField label="Tytuł" required><UInput v-model="ticketForm.title" /></UFormField>
          </div>
          <UFormField label="Treść" required><UTextarea v-model="ticketForm.body" :data="5" /></UFormField>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isTicketModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingTicket" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const queueColumns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'description', header: 'Opis' },
  { accessorKey: 'categoryCount', header: 'Kategorie' },
  { accessorKey: 'ticketCount', header: 'Tickety' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const categoryColumns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'queue', header: 'Kolejka' },
  { accessorKey: 'description', header: 'Opis' },
  { accessorKey: 'ticketCount', header: 'Tickety' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const ticketColumns = [
  { accessorKey: 'title', header: 'Tytuł' },
  { accessorKey: 'customer', header: 'Klient' },
  { accessorKey: 'queue', header: 'Kolejka / kategoria' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'assigneeId', header: 'Assignee' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const ticketStatusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' }
]

const isQueueModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const isTicketModalOpen = ref(false)
const isSavingQueue = ref(false)
const isSavingCategory = ref(false)
const isSavingTicket = ref(false)
const ticketSearch = ref('')

const queueForm = reactive({
  id: null,
  name: '',
  description: ''
})

const categoryForm = reactive({
  id: null,
  queueId: null,
  name: '',
  description: ''
})

const ticketForm = reactive({
  id: null,
  customerId: null,
  queueId: null,
  categoryId: null,
  assigneeId: '',
  title: '',
  body: '',
  status: 'open'
})

const { data: queues, pending: pendingQueues, refresh: refreshQueues } = await useFetch('/api/v1/helpdesk/queues')
const { data: categories, pending: pendingCategories, refresh: refreshCategories } = await useFetch('/api/v1/helpdesk/categories')
const { data: tickets, pending: pendingTickets, refresh: refreshTickets } = await useFetch('/api/v1/helpdesk/tickets')
const { data: reports, refresh: refreshReports } = await useFetch('/api/v1/helpdesk/reports')
const { data: customers } = await useFetch('/api/v1/customers', { query: { limit: 200 } })

const filteredTickets = computed(() => {
  const rows = tickets.value || []
  const query = ticketSearch.value.trim().toLowerCase()
  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    row.title.toLowerCase().includes(query) ||
    (row.body || '').toLowerCase().includes(query)
  )
})

const queueOptions = computed(() => (queues.value || []).map((queue) => ({
  label: queue.name,
  value: queue.id
})))

const queueOptionsWithEmpty = computed(() => [
  { label: 'Brak kolejki', value: null },
  ...queueOptions.value
])

const categoryOptions = computed(() => {
  const queueId = ticketForm.queueId ?? categoryForm.queueId
  const rows = categories.value || []
  return rows
    .filter((category) => !queueId || category.queueId === queueId)
    .map((category) => ({
      label: category.name,
      value: category.id
    }))
})

const categoryOptionsWithEmpty = computed(() => [
  { label: 'Brak kategorii', value: null },
  ...categoryOptions.value
])

const customerOptionsWithEmpty = computed(() => [
  { label: 'Brak klienta', value: null },
  ...((customers.value || []).map((customer) => ({
    label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
    value: customer.id
  })))
])

const ticketStatusColor = (status) => {
  switch (status) {
    case 'open': return 'red'
    case 'pending': return 'yellow'
    case 'closed': return 'emerald'
    default: return 'gray'
  }
}

const resetQueueForm = () => Object.assign(queueForm, { id: null, name: '', description: '' })
const resetCategoryForm = () => Object.assign(categoryForm, { id: null, queueId: null, name: '', description: '' })
const resetTicketForm = () => Object.assign(ticketForm, {
  id: null,
  customerId: null,
  queueId: null,
  categoryId: null,
  assigneeId: '',
  title: '',
  body: '',
  status: 'open'
})

const openQueueEdit = (row) => {
  Object.assign(queueForm, { id: row.id, name: row.name, description: row.description || '' })
  isQueueModalOpen.value = true
}

const openCategoryEdit = (row) => {
  Object.assign(categoryForm, {
    id: row.id,
    queueId: row.queueId,
    name: row.name,
    description: row.description || ''
  })
  isCategoryModalOpen.value = true
}

const openTicketCreate = () => {
  resetTicketForm()
  isTicketModalOpen.value = true
}

const openTicketEdit = async (row) => {
  const ticket = await $fetch(`/api/v1/helpdesk/tickets/${row.id}`)
  Object.assign(ticketForm, {
    id: ticket.id,
    customerId: ticket.customerId,
    queueId: ticket.queueId,
    categoryId: ticket.categoryId,
    assigneeId: ticket.assigneeId ?? '',
    title: ticket.title,
    body: ticket.body,
    status: ticket.status
  })
  isTicketModalOpen.value = true
}

const saveQueue = async () => {
  isSavingQueue.value = true
  try {
    const payload = { name: queueForm.name, description: queueForm.description || null }
    if (queueForm.id) {
      await $fetch(`/api/v1/helpdesk/queues/${queueForm.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/helpdesk/queues', { method: 'POST', body: payload })
    }
    isQueueModalOpen.value = false
    resetQueueForm()
    await Promise.all([refreshQueues(), refreshReports()])
  } finally {
    isSavingQueue.value = false
  }
}

const saveCategory = async () => {
  isSavingCategory.value = true
  try {
    const payload = {
      queueId: categoryForm.queueId,
      name: categoryForm.name,
      description: categoryForm.description || null
    }
    if (categoryForm.id) {
      await $fetch(`/api/v1/helpdesk/categories/${categoryForm.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/helpdesk/categories', { method: 'POST', body: payload })
    }
    isCategoryModalOpen.value = false
    resetCategoryForm()
    await Promise.all([refreshCategories(), refreshQueues()])
  } finally {
    isSavingCategory.value = false
  }
}

const saveTicket = async () => {
  isSavingTicket.value = true
  try {
    const payload = {
      customerId: ticketForm.customerId,
      queueId: ticketForm.queueId,
      categoryId: ticketForm.categoryId,
      assigneeId: ticketForm.assigneeId === '' ? null : Number(ticketForm.assigneeId),
      title: ticketForm.title,
      body: ticketForm.body,
      status: ticketForm.status
    }
    if (ticketForm.id) {
      await $fetch(`/api/v1/helpdesk/tickets/${ticketForm.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/helpdesk/tickets', { method: 'POST', body: payload })
    }
    isTicketModalOpen.value = false
    resetTicketForm()
    await Promise.all([refreshTickets(), refreshQueues(), refreshCategories(), refreshReports()])
  } finally {
    isSavingTicket.value = false
  }
}

const cycleTicketStatus = async (row) => {
  const next = row.status === 'open' ? 'pending' : row.status === 'pending' ? 'closed' : 'open'
  await $fetch(`/api/v1/helpdesk/tickets/${row.id}/status`, {
    method: 'POST',
    body: { status: next }
  })
  await Promise.all([refreshTickets(), refreshReports()])
}

const removeQueue = async (row) => {
  if (!confirm(`Usunąć kolejkę "${row.name}"?`)) return
  await $fetch(`/api/v1/helpdesk/queues/${row.id}`, { method: 'DELETE' })
  await Promise.all([refreshQueues(), refreshCategories(), refreshTickets(), refreshReports()])
}

const removeCategory = async (row) => {
  if (!confirm(`Usunąć kategorię "${row.name}"?`)) return
  await $fetch(`/api/v1/helpdesk/categories/${row.id}`, { method: 'DELETE' })
  await Promise.all([refreshCategories(), refreshTickets()])
}

const removeTicket = async (row) => {
  if (!confirm(`Usunąć zgłoszenie "${row.title}"?`)) return
  await $fetch(`/api/v1/helpdesk/tickets/${row.id}`, { method: 'DELETE' })
  await Promise.all([refreshTickets(), refreshQueues(), refreshCategories(), refreshReports()])
}
</script>
