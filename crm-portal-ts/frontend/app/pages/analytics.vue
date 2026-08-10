<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analityka i raporty</h1>
        <p class="text-sm text-gray-500">Statystyki runtime TS, globalne wyszukiwanie oraz eksporty raportowe.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-lucide-refresh-cw"
          label="Odśwież"
          aria-label="Odśwież raporty i statystyki"
          :loading="isRefreshing"
          @click="refreshAll"
        />
        <UButton
          color="primary"
          icon="i-lucide-download"
          label="Pobierz PIT CSV"
          aria-label="Pobierz raport PIT w formacie CSV"
          :loading="isDownloadingCsv"
          :disabled="isDownloadingGml"
          @click="downloadPitCsv"
        />
        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-map"
          label="Pobierz PIT GML"
          aria-label="Pobierz raport PIT w formacie GML"
          :loading="isDownloadingGml"
          :disabled="isDownloadingCsv"
          @click="downloadPitGml"
        />
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
          <UInput
            v-model="searchQuery"
            class="flex-1"
            icon="i-lucide-search"
            placeholder="Minimum 3 znaki..."
            aria-label="Wyszukiwanie w bazie"
            @keyup.enter="runSearch"
          />
          <UButton
            color="primary"
            :loading="isSearching"
            label="Szukaj"
            aria-label="Wyszukiwanie w bazie"
            @click="runSearch"
          />
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
const isRefreshing = ref(false)
const isDownloadingCsv = ref(false)
const isDownloadingGml = ref(false)

const toast = useToast()

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
  isRefreshing.value = true
  try {
    await Promise.all([
      refreshNetworkHealth(),
      refreshInventorySummary(),
      refreshFinancialSummary(),
      refreshCustomerGrowth(),
      refreshPitSummary(),
      refreshPassportNodes()
    ])
    toast.add({
      title: 'Raporty odświeżone',
      description: 'Wszystkie statystyki i raporty zostały zaktualizowane.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd odświeżania',
      description: 'Nie udało się zaktualizować statystyk i raportów.',
      color: 'error'
    })
  } finally {
    isRefreshing.value = false
  }
}

const runSearch = async () => {
  if (searchQuery.value.trim().length < 3) {
    searchResults.value = {
      searchType: 'name',
      customers: [],
      devices: []
    }
    toast.add({
      title: 'Wyszukiwanie',
      description: 'Wpisz co najmniej 3 znaki, aby rozpocząć wyszukiwanie.',
      color: 'warning'
    })
    return
  }

  isSearching.value = true
  try {
    searchResults.value = await $fetch('/api/v1/search', {
      query: { q: searchQuery.value.trim() }
    })
    toast.add({
      title: 'Wyszukiwanie zakończone',
      description: `Znaleziono ${searchResults.value.customers.length} klientów oraz ${searchResults.value.devices.length} urządzeń.`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd wyszukiwania',
      description: 'Wystąpił problem podczas wyszukiwania w bazie.',
      color: 'error'
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
  isDownloadingCsv.value = true
  try {
    const blob = await $fetch('/api/v1/reports/pit-uke/export', { responseType: 'blob' })
    downloadBlob(blob, 'pit_uke_export.csv')
    toast.add({
      title: 'Pobieranie zakończone',
      description: 'Raport PIT UKE w formacie CSV został pobrany pomyślnie.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd pobierania',
      description: 'Nie udało się wyeksportować raportu PIT UKE CSV.',
      color: 'error'
    })
  } finally {
    isDownloadingCsv.value = false
  }
}

const downloadPitGml = async () => {
  isDownloadingGml.value = true
  try {
    const blob = await $fetch('/api/v1/pit/export/nodes', { responseType: 'blob' })
    downloadBlob(blob, 'pit-net-nodes.gml')
    toast.add({
      title: 'Pobieranie zakończone',
      description: 'Raport PIT GML został pobrany pomyślnie.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd pobierania',
      description: 'Nie udało się wyeksportować raportu PIT GML.',
      color: 'error'
    })
  } finally {
    isDownloadingGml.value = false
  }
}
</script>
