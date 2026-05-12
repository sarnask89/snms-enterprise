<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Helpdesk</h1>
      <UButton icon="i-heroicons-plus" label="Nowe zgłoszenie" />
    </div>

    <UCard>
      <DataTable
        v-model:page="page"
        :rows="tickets?.items"
        :columns="columns"
        :loading="status === 'pending'"
        :total="tickets?.total || 0"
      >
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'open' ? 'red' : 'gray'" variant="soft">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <UButton label="Szczegóły" variant="ghost" color="primary" size="xs" />
        </template>
      </DataTable>
    </UCard>
  </div>
</template>

<script setup>
const page = ref(1)
const { data: tickets, status } = await useFetch('/api/v2/helpdesk/tickets', {
  query: { page },
  watch: [page]
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Temat' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Data utworzenia' },
  { key: 'actions', label: 'Akcje' }
]
</script>
