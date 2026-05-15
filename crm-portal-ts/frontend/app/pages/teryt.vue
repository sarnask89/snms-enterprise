<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">TERYT i adresy</h1>
        <p class="text-sm text-gray-500">Lokalny import TERC/SIMC/ULIC oraz zarządzanie miastami oznaczonymi jako managed/default</p>
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard v-for="importJob in importJobs" :key="importJob.key">
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">{{ importJob.title }}</h2>
            <p class="text-sm text-gray-500">{{ importJob.description }}</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="submitImport(importJob.key)">
          <UFormGroup label="XML content" required>
            <UTextarea v-model="importForms[importJob.key]" :rows="8" />
          </UFormGroup>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">{{ importResults[importJob.key] }}</div>
            <UButton type="submit" color="primary" :loading="loadingImports[importJob.key]" label="Importuj" />
          </div>
        </form>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div>
            <h2 class="font-semibold text-lg">Miasta i ulice</h2>
            <p class="text-sm text-gray-500">Wyszukiwanie lokalnego słownika i zarządzanie flagami adresowymi</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="Szukaj miasta po nazwie lub TERYT..."
              class="w-full md:w-80"
            />
            <USelect
              v-model="managedFilter"
              :options="managedOptions"
              option-attribute="label"
              class="w-full md:w-56"
            />
          </div>
        </div>
      </template>

      <UTable :rows="filteredCities" :columns="columns" :loading="pendingCities">
        <template #district-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.district?.name || 'Brak powiatu' }}</div>
        </template>

        <template #flags-data="{ row }">
          <div class="flex gap-2">
            <UBadge :color="row.isManaged ? 'emerald' : 'gray'" variant="soft">
              {{ row.isManaged ? 'managed' : 'unmanaged' }}
            </UBadge>
            <UBadge :color="row.isDefault ? 'primary' : 'gray'" variant="soft">
              {{ row.isDefault ? 'default' : 'standard' }}
            </UBadge>
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              :icon="row.isManaged ? 'i-heroicons-minus-circle' : 'i-heroicons-check-circle'"
              @click="toggleManaged(row)"
            />
            <UButton
              size="xs"
              color="primary"
              variant="ghost"
              icon="i-heroicons-star"
              :disabled="row.isDefault"
              @click="setDefault(row)"
            />
            <UButton
              size="xs"
              color="yellow"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              @click="scheduleSync(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <div class="grid lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Szybkie wyszukiwanie TERYT</h2>
            <p class="text-sm text-gray-500">Wynik z `/api/v1/addresses/search-teryt`</p>
          </div>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="search"
            icon="i-heroicons-map-pin"
            placeholder="np. Ożarów"
          />
          <div class="space-y-2">
            <div
              v-for="city in addressSearchResults"
              :key="city.id"
              class="rounded-lg border border-gray-200 dark:border-gray-800 p-3"
            >
              <div class="font-medium text-gray-900 dark:text-white">{{ city.name }}</div>
              <div class="text-sm text-gray-500">TERYT: {{ city.terytCode || 'brak' }}</div>
            </div>
            <p v-if="search.length >= 2 && !addressSearchResults.length" class="text-sm text-gray-500">Brak wyników.</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Ulice wybranego miasta</h2>
            <p class="text-sm text-gray-500">Podgląd ulic dla aktywnego miasta z listy</p>
          </div>
        </template>

        <div v-if="selectedCity" class="space-y-4">
          <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="font-medium text-gray-900 dark:text-white">{{ selectedCity.name }}</div>
            <div class="text-sm text-gray-500">{{ selectedCity.district?.name || 'Brak powiatu' }}</div>
          </div>
          <div class="space-y-2">
            <div
              v-for="street in streets"
              :key="street.id"
              class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-700 dark:text-gray-300"
            >
              {{ street.name }}
            </div>
            <p v-if="!streets.length" class="text-sm text-gray-500">Brak ulic dla wybranego miasta.</p>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">Wybierz miasto z tabeli, aby zobaczyć ulice.</p>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const importJobs = [
  { key: 'terc', title: 'Import TERC', description: 'Województwa i powiaty' },
  { key: 'simc', title: 'Import SIMC', description: 'Miejscowości' },
  { key: 'ulic', title: 'Import ULIC', description: 'Ulice' }
]

const columns = [
  { key: 'name', label: 'Miasto' },
  { key: 'district', label: 'Powiat' },
  { key: 'streetCount', label: 'Ulice' },
  { key: 'flags', label: 'Flagi' },
  { key: 'actions', label: 'Akcje' }
]

const managedOptions = [
  { label: 'Wszystkie miasta', value: 'all' },
  { label: 'Tylko managed', value: 'managed' },
  { label: 'Tylko unmanaged', value: 'unmanaged' }
]

const search = ref('')
const managedFilter = ref('all')
const selectedCityId = ref(null)

const importForms = reactive({
  terc: '',
  simc: '',
  ulic: ''
})

const importResults = reactive({
  terc: '',
  simc: '',
  ulic: ''
})

const loadingImports = reactive({
  terc: false,
  simc: false,
  ulic: false
})

const { data: cities, pending: pendingCities, refresh: refreshCities } = await useFetch('/api/v1/teryt/cities')
const { data: addressSearchData, refresh: refreshAddressSearch } = await useFetch('/api/v1/addresses/search-teryt', {
  query: { q: search }
})

const selectedCity = computed(() => (cities.value || []).find((city) => city.id === selectedCityId.value) || null)

const { data: streets, refresh: refreshStreets } = await useFetch('/api/v1/teryt/streets', {
  query: {
    cityId: selectedCityId
  },
  default: () => []
})

const filteredCities = computed(() => {
  const rows = cities.value || []
  const query = search.value.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesFilter =
      managedFilter.value === 'all' ||
      (managedFilter.value === 'managed' && row.isManaged) ||
      (managedFilter.value === 'unmanaged' && !row.isManaged)

    if (!matchesFilter) {
      return false
    }

    if (!query) {
      return true
    }

    return [row.name, row.terytCode || '', row.district?.name || '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const addressSearchResults = computed(() => addressSearchData.value || [])

watch(filteredCities, (rows) => {
  if (!rows.length) {
    selectedCityId.value = null
    return
  }

  if (!rows.some((row) => row.id === selectedCityId.value)) {
    selectedCityId.value = rows[0].id
  }
}, { immediate: true })

watch(search, async () => {
  await refreshAddressSearch()
})

watch(selectedCityId, async () => {
  if (!selectedCityId.value) {
    return
  }
  await refreshStreets()
})

const refreshAll = async () => {
  await Promise.all([refreshCities(), refreshAddressSearch(), refreshStreets()])
}

const submitImport = async (kind) => {
  loadingImports[kind] = true
  try {
    const result = await $fetch(`/api/v1/teryt/import/${kind}`, {
      method: 'POST',
      body: { xmlContent: importForms[kind] }
    })
    importResults[kind] = Object.entries(result)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    await refreshCities()
    await refreshAddressSearch()
  } finally {
    loadingImports[kind] = false
  }
}

const toggleManaged = async (row) => {
  await $fetch(`/api/v1/addresses/cities/${row.id}/toggle-managed`, { method: 'POST' })
  await refreshCities()
  await refreshAddressSearch()
}

const setDefault = async (row) => {
  await $fetch(`/api/v1/addresses/cities/${row.id}/set-default`, { method: 'POST' })
  await refreshCities()
}

const scheduleSync = async (row) => {
  await $fetch('/api/v1/teryt/sync-geoportal', {
    method: 'POST',
    body: { cityId: row.id }
  })
}
</script>
