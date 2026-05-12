<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Finanse</h1>
      <UButton icon="i-heroicons-plus" label="Nowa faktura" />
    </div>

    <UTabs :items="tabItems" class="w-full">
      <template #invoices>
        <UCard>
          <DataTable
            v-model:page="page"
            :rows="invoices?.items"
            :columns="invoiceColumns"
            :loading="status === 'pending'"
            :total="invoices?.total || 0"
          >
            <template #status-data="{ row }">
              <UBadge :color="row.status === 'paid' ? 'emerald' : 'orange'" variant="soft">
                {{ row.status }}
              </UBadge>
            </template>
          </DataTable>
        </UCard>
      </template>

      <template #tariffs>
        <UCard>
          <UTable :rows="tariffs" :columns="tariffColumns" />
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup>
const tabItems = [
  { slot: 'invoices', label: 'Faktury', icon: 'i-heroicons-document-text' },
  { slot: 'tariffs', label: 'Taryfy', icon: 'i-heroicons-adjustments-horizontal' }
]

const page = ref(1)
const { data: invoices, status } = await useFetch('/api/v2/finances/invoices', {
  query: { page },
  watch: [page]
})

const { data: tariffs } = await useFetch('/api/v2/finances/tariffs')

const invoiceColumns = [
  { key: 'number', label: 'Numer' },
  { key: 'issue_date', label: 'Data wystawienia' },
  { key: 'total_gross', label: 'Suma brutto' },
  { key: 'status', label: 'Status' }
]

const tariffColumns = [
  { key: 'name', label: 'Nazwa' },
  { key: 'price_gross', label: 'Cena brutto' },
  { key: 'bandwidth_down', label: 'Download (Mbps)' },
  { key: 'bandwidth_up', label: 'Upload (Mbps)' }
]
</script>
