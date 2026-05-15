<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Abonenci</h1>
      <UButton icon="i-heroicons-plus" label="Dodaj abonenta" />
    </div>

    <UCard>
      <DataTable
        v-model:page="page"
        v-model:search="search"
        :rows="customers"
        :columns="columns"
        :loading="status === 'pending'"
        :total="total"
      >
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'active' ? 'emerald' : 'gray'" variant="soft">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UTooltip text="Edytuj">
              <UButton
                icon="i-heroicons-pencil-square"
                variant="ghost"
                color="gray"
                size="xs"
                aria-label="Edytuj abonenta"
              />
            </UTooltip>
            <UTooltip text="Usuń">
              <UButton
                icon="i-heroicons-trash"
                variant="ghost"
                color="red"
                size="xs"
                aria-label="Usuń abonenta"
              />
            </UTooltip>
          </div>
        </template>
      </DataTable>
    </UCard>
  </div>
</template>

<script setup>
const page = ref(1)
const search = ref('')
const limit = 20

const { data: response, status } = await useFetch('/api/v2/customers', {
  query: {
    page,
    q: search,
    limit
  },
  watch: [page, search]
})

const customers = computed(() => response.value?.items || [])
const total = computed(() => response.value?.total || 0)

const columns = [
  { key: 'customer_code', label: 'Kod' },
  { key: 'first_name', label: 'Imię' },
  { key: 'last_name', label: 'Nazwisko' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefon' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]
</script>
