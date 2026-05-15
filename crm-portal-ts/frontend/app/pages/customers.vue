<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Abonenci</h1>
        <p class="text-sm text-gray-500">Zarządzanie bazą klientów i ich usługami</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-user-group" color="gray" variant="soft" label="Grupy klientów" to="/customers/groups" />
        <UButton icon="i-heroicons-user-plus" color="primary" label="Nowy abonent" @click="isCreateModalOpen = true" />
      </div>
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
              :to="`/customers/${row.id}`"
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
            Pokazano {{ customers?.length || 0 }} abonentów
          </span>
          <UPagination
            v-model="page"
            :total="total"
            :page-count="limit"
          />
        </div>
      </template>
    </UCard>

    <!-- Create Modal -->
    <UModal v-model="isCreateModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="font-bold text-lg">Dodaj nowego abonenta</h3>
        </template>
        
        <form @submit.prevent="createCustomer" class="p-4 space-y-4">
          <UFormGroup label="Kod klienta" required>
            <UInput v-model="newCustomer.customerCode" />
          </UFormGroup>
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Imię" required>
              <UInput v-model="newCustomer.firstName" />
            </UFormGroup>
            <UFormGroup label="Nazwisko" required>
              <UInput v-model="newCustomer.lastName" />
            </UFormGroup>
          </div>
          <UFormGroup label="Email">
            <UInput v-model="newCustomer.email" type="email" />
          </UFormGroup>
          
          <div class="flex justify-end gap-2 mt-4">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isCreateModalOpen = false" />
            <UButton type="submit" color="primary" label="Zapisz" :loading="isSaving" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const search = ref('')
const statusFilter = ref('')
const page = ref(1)
const limit = 20
const total = ref(0)
const isCreateModalOpen = ref(false)
const isSaving = ref(false)

const newCustomer = reactive({
  customerCode: '',
  firstName: '',
  lastName: '',
  email: '',
  status: 'active'
})

const statusOptions = [
  { label: 'Aktywny', value: 'active' },
  { label: 'Zawieszony', value: 'suspended' },
  { label: 'Zakończony', value: 'terminated' }
]

const columns = [
  { key: 'customerCode', label: 'Kod' },
  { key: 'firstName', label: 'Imię' },
  { key: 'lastName', label: 'Nazwisko' },
  { key: 'email', label: 'Email' },
  { key: 'groupCount', label: 'Grupy' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

// Fetching logic
const { data: customers, pending, refresh } = await useFetch('/api/v1/customers', {
  query: {
    q: search,
    status: statusFilter,
    skip: computed(() => (page.value - 1) * limit),
    limit: limit
  },
  onResponse({ response }) {
    const count = response.headers.get('x-total-count')
    if (count) total.value = parseInt(count)
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

const createCustomer = async () => {
  isSaving.value = true
  try {
    await $fetch('/api/v1/customers', {
      method: 'POST',
      body: newCustomer
    })
    isCreateModalOpen.value = false
    Object.assign(newCustomer, {
      customerCode: '',
      firstName: '',
      lastName: '',
      email: '',
      status: 'active'
    })
    refresh()
  } catch (error) {
    console.error('Failed to create customer', error)
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async (row) => {
  if (confirm(`Czy na pewno chcesz usunąć klienta ${row.firstName} ${row.lastName}?`)) {
    await $fetch(`/api/v1/customers/${row.id}`, { method: 'DELETE' })
    refresh()
  }
}

watch(search, () => {
  page.value = 1
  refresh()
})

watch(statusFilter, () => {
  page.value = 1
  refresh()
})
</script>
