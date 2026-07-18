<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analityka i raporty</h1>
        <p class="text-sm text-gray-500">Statystyki runtime TS, globalne wyszukiwanie oraz eksporty raportowe.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
        <UButton color="primary" icon="i-heroicons-arrow-down-tray" label="Pobierz PIT CSV" @click="downloadPitCsv" />
        <UButton color="primary" variant="soft" icon="i-heroicons-map" label="Pobierz PIT GML" @click="downloadPitGml" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Routery online</div>
        <div class="text-2xl font-bold">{{ networkHealth?.onlineNow ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Typy inventory</div>
        <div class="text-2xl font-bold">{{ inventorySummary?.labels?.length ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Nodes on map</div>
        <div class="text-2xl font-bold">{{ passportNodes?.length ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">PIT UKE rows</div>
        <div class="text-2xl font-bold">{{ pitSummary?.customerDeviceCount ?? 0 }}</div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Globalne wyszukiwanie</h2>
            <p class="text-sm text-gray-500">Klienci i urządzenia klienta z aktywnego runtime TS.</p>
          </div>
        </template>

        <div class="flex gap-3">
          <UInput v-model="searchQuery" class="flex-1" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Minimum 3 znaki..." />
          <UButton color="primary" :loading="isSearching" label="Szukaj" @click="runSearch" />
        </div>

        <div v-if="searchResults" class="mt-4 space-y-4">
          <div class="text-sm text-gray-500">Typ zapytania: <span class="font-medium text-gray-900 dark:text-white">{{ searchResults.searchType }}</span></div>

          <div>
            <div class="font-medium mb-2">Klienci</div>
            <UTable :data="searchResults.customers" :columns="customerColumns" />
          </div>

          <div>
            <div class="font-medium mb-2">Urządzenia</div>
            <UTable :data="searchResults.devices" :columns="deviceColumns" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Snapshot statystyk</h2>
            <p class="text-sm text-gray-500">Serie i agregaty z modułów `stats` oraz `reports`.</p>
          </div>
        </template>

        <div class="space-y-4 text-sm">
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="font-medium mb-2">Network health</div>
            <div>Total devices: {{ networkHealth?.totalDevices ?? 0 }}</div>
            <div>History points: {{ networkHealth?.history?.length ?? 0 }}</div>
          </div>

          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="font-medium mb-2">Financial summary</div>
            <div>Months: {{ financialSummary?.labels?.length ?? 0 }}</div>
            <div>Revenue buckets: {{ financialSummary?.series?.[0]?.data?.length ?? 0 }}</div>
          </div>

          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="font-medium mb-2">Customer growth</div>
            <div>Labels: {{ customerGrowth?.labels?.join(', ') || 'n/a' }}</div>
            <div>Last value: {{ customerGrowth?.values?.[customerGrowth.values.length - 1] ?? 0 }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const searchResults = ref(null)
const isSearching = ref(false)

const customerColumns = [
  { accessorKey: 'customerCode', header: 'Kod' },
  { accessorKey: 'lastName', header: 'Nazwisko' },
  { accessorKey: 'firstName', header: 'Imie' },
  { accessorKey: 'status', header: 'Status' }
]

const deviceColumns = [
  { accessorKey: 'hostname', header: 'Hostname' },
  { accessorKey: 'ipAddress', header: 'IP' },
  { accessorKey: 'macAddress', header: 'MAC' },
  { accessorKey: 'customerName', header: 'Klient' }
]

const { data: networkHealth, refresh: refreshNetworkHealth } = await useFetch('/api/v1/stats/network-health')
const { data: inventorySummary, refresh: refreshInventorySummary } = await useFetch('/api/v1/stats/inventory-summary')
const { data: financialSummary, refresh: refreshFinancialSummary } = await useFetch('/api/v1/stats/financial-summary')
const { data: customerGrowth, refresh: refreshCustomerGrowth } = await useFetch('/api/v1/stats/customer-growth')
const { data: pitSummary, refresh: refreshPitSummary } = await useFetch('/api/v1/reports/pit-uke/summary')
const { data: passportNodes, refresh: refreshPassportNodes } = await useFetch('/api/v1/reports/passport/map')

const refreshAll = async () => {
  await Promise.all([
    refreshNetworkHealth(),
    refreshInventorySummary(),
    refreshFinancialSummary(),
    refreshCustomerGrowth(),
    refreshPitSummary(),
    refreshPassportNodes()
  ])
}

const runSearch = async () => {
  if (searchQuery.value.trim().length < 3) {
    searchResults.value = {
      searchType: 'name',
      customers: [],
      devices: []
    }
    return
  }

  isSearching.value = true
  try {
    searchResults.value = await $fetch('/api/v1/search', {
      query: { q: searchQuery.value.trim() }
    })
  } finally {
    isSearching.value = false
  }
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const downloadPitCsv = async () => {
  const blob = await $fetch('/api/v1/reports/pit-uke/export', { responseType: 'blob' })
  downloadBlob(blob, 'pit_uke_export.csv')
}

const downloadPitGml = async () => {
  const blob = await $fetch('/api/v1/pit/export/nodes', { responseType: 'blob' })
  downloadBlob(blob, 'pit-net-nodes.gml')
}
</script>
