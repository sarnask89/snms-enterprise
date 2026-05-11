<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Abonenci</h1>
        <p class="text-sm text-gray-500">Zarządzanie bazą klientów i ich usługami</p>
      </div>
      <UButton icon="i-heroicons-user-plus" color="primary" label="Nowy abonent" />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Szukaj po nazwisku, kodzie lub email..."
            class="flex-1"
          />
          <USelect
            v-model="statusFilter"
            :options="statusOptions"
            placeholder="Status"
            class="w-48"
          />
        </div>
      </template>

      <UTable
        :rows="customers"
        :columns="columns"
        :loading="pending"
      >
        <template #status-data="{ row }">
          <UBadge
            :color="statusColor(row.status)"
            variant="soft"
            size="xs"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-pencil-square"
              size="xs"
              color="gray"
              variant="ghost"
              @click="editCustomer(row)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="red"
              variant="ghost"
              @click="confirmDelete(row)"
            />
          </div>
        </template>
      </UTable>

      <template #footer>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            Pokazano {{ customers.length }} abonentów
          </span>
          <UPagination
            v-model="page"
            :total="total"
            :page-count="limit"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const search = ref('')
const statusFilter = ref('')
const page = ref(1)
const limit = 20
const total = ref(0)

const statusOptions = [
  { label: 'Aktywny', value: 'active' },
  { label: 'Zawieszony', value: 'suspended' },
  { label: 'Zakończony', value: 'terminated' }
]

const columns = [
  { key: 'customer_code', label: 'Kod' },
  { key: 'first_name', label: 'Imię' },
  { key: 'last_name', label: 'Nazwisko' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

// Fetching logic
const { data: customers, pending, refresh } = await useFetch('/api/v1/customers', {
  query: {
    q: search,
    skip: computed(() => (page.value - 1) * limit),
    limit: limit
  },
  onResponse({ response }) {
    // total.value = response.headers.get('x-total-count')
  }
})

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'emerald'
    case 'suspended': return 'yellow'
    case 'terminated': return 'red'
    default: return 'gray'
  }
}

const editCustomer = (row) => {
  console.log('Edit', row)
}

const confirmDelete = (row) => {
  console.log('Delete', row)
}

watch(search, () => {
  page.value = 1
  refresh()
})
</script>
