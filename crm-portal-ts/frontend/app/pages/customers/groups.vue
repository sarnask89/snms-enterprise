<template>
  <div class="p-8 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Grupy klientów</h1>
        <p class="text-sm text-gray-500">Pierwszy moduł parity po stronie TS/Nuxt: CRUD grup i przypisania członków</p>
      </div>
      <div class="flex gap-3">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" to="/customers" label="Lista klientów" />
        <UButton icon="i-heroicons-plus" color="primary" label="Nowa grupa" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Filtruj po nazwie lub opisie grupy..."
            class="flex-1"
          />
        </div>
      </template>

      <UTable :data="filteredGroups" :columns="columns" :loading="pendingGroups">
        <template #customerCount-data="{ row }">
          <UBadge color="primary" variant="soft">{{ row.customerCount }}</UBadge>
        </template>

        <template #members-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ memberPreview(row) }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" size="xs" @click="openEditModal(row)" />
            <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs" @click="removeGroup(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="font-bold text-lg">
            {{ form.id ? 'Edytuj grupę klientów' : 'Dodaj grupę klientów' }}
          </h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveGroup">
          <UFormField label="Nazwa grupy" required>
            <UInput v-model="form.name" />
          </UFormField>

          <UFormField label="Opis">
            <UTextarea v-model="form.description" :data="3" />
          </UFormField>

          <div>
            <div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Członkowie grupy</div>
            <div class="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2">
              <label
                v-for="customer in customerOptions"
                :key="customer.id"
                class="flex items-center gap-3 text-sm"
              >
                <input
                  v-model="form.memberIds"
                  type="checkbox"
                  :value="customer.id"
                  class="rounded border-gray-300"
                >
                <span>{{ customer.customerCode }} · {{ customer.firstName }} {{ customer.lastName }}</span>
              </label>
              <p v-if="!customerOptions.length" class="text-sm text-gray-500">Brak klientów do przypisania.</p>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSaving" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const search = ref('')
const isModalOpen = ref(false)
const isSaving = ref(false)

const columns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'description', header: 'Opis' },
  { accessorKey: 'customerCount', header: 'Liczba klientów' },
  { accessorKey: 'members', header: 'Członkowie' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const form = reactive({
  id: null,
  name: '',
  description: '',
  memberIds: []
})

const { data: groups, pending: pendingGroups, refresh: refreshGroups } = await useFetch('/api/v1/customer-groups')
const { data: customers, refresh: refreshCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 200 }
})

const customerOptions = computed(() => customers.value || [])
const filteredGroups = computed(() => {
  const rows = groups.value || []
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return rows
  }

  return rows.filter((group) =>
    group.name.toLowerCase().includes(query) ||
    (group.description || '').toLowerCase().includes(query)
  )
})

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    description: '',
    memberIds: []
  })
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = async (row) => {
  const group = await $fetch(`/api/v1/customer-groups/${row.id}`)
  Object.assign(form, {
    id: group.id,
    name: group.name,
    description: group.description || '',
    memberIds: [...(group.memberIds || [])]
  })
  isModalOpen.value = true
}

const memberPreview = (row) => {
  if (!row.customers?.length) {
    return 'Brak przypisanych klientów'
  }

  return row.customers
    .slice(0, 3)
    .map((customer) => `${customer.firstName} ${customer.lastName}`)
    .join(', ')
}

const saveGroup = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      description: form.description || null,
      memberIds: [...form.memberIds]
    }

    if (form.id) {
      await $fetch(`/api/v1/customer-groups/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/v1/customer-groups', {
        method: 'POST',
        body: payload
      })
    }

    isModalOpen.value = false
    resetForm()
    await Promise.all([refreshGroups(), refreshCustomers()])
  } catch (error) {
    console.error('Failed to save customer group', error)
  } finally {
    isSaving.value = false
  }
}

const removeGroup = async (row) => {
  if (!confirm(`Czy na pewno chcesz usunąć grupę "${row.name}"?`)) {
    return
  }

  await $fetch(`/api/v1/customer-groups/${row.id}`, { method: 'DELETE' })
  await refreshGroups()
}
</script>
