<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">TERYT i adresy</h1>
        <p class="text-sm text-gray-500">Import XML, domyślne obszary i słowniki adresowe do autosugestii formularzy.</p>
      </div>
      <UButton color="neutral" variant="ghost" icon="i-lucide-refresh-cw" label="Odśwież" aria-label="Odśwież rejestr TERYT" @click="refreshAll" />
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
          <UFormField label="Plik XML" required>
            <input
              type="file"
              accept=".xml,text/xml,application/xml"
              class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
              @change="onFileSelected(importJob.key, $event)"
            >
          </UFormField>

          <UFormField label="Podgląd treści">
            <UTextarea v-model="importForms[importJob.key]" :data="8" />
          </UFormField>

          <div class="flex items-center justify-between gap-3">
            <div class="min-h-[20px] text-sm text-gray-500">{{ importResults[importJob.key] }}</div>
            <UButton type="submit" color="primary" :loading="loadingImports[importJob.key]" label="Importuj XML" />
          </div>
        </form>
      </UCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-1">
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Domyślny obszar</h2>
            <p class="text-sm text-gray-500">Prefill dla formularzy klienta i urządzeń.</p>
          </div>
        </template>

        <div class="space-y-3 text-sm">
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div class="font-medium text-gray-900 dark:text-white">{{ defaultArea?.state?.name || 'Brak województwa domyślnego' }}</div>
            <div class="text-gray-500">Województwo</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div class="font-medium text-gray-900 dark:text-white">{{ defaultArea?.district?.name || 'Brak powiatu domyślnego' }}</div>
            <div class="text-gray-500">Powiat</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div class="font-medium text-gray-900 dark:text-white">{{ defaultArea?.commune?.name || 'Brak gminy domyślnej' }}</div>
            <div class="text-gray-500">Gmina</div>
          </div>
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div class="font-medium text-gray-900 dark:text-white">{{ defaultArea?.city?.name || 'Brak miasta domyślnego' }}</div>
            <div class="text-gray-500">Miasto</div>
          </div>
        </div>
      </UCard>

      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 class="font-semibold text-lg">Rejestr gmin</h2>
              <p class="text-sm text-gray-500">Managed/default na poziomie gminy steruje domyślnym obszarem systemu.</p>
            </div>
            <UInput
              v-model="communeSearch"
              icon="i-lucide-search"
              placeholder="Szukaj gminy..."
              aria-label="Szukaj gminy"
              class="w-full lg:w-80"
            />
          </div>
        </template>

        <UTable :data="filteredCommunes" :columns="communeColumns" :loading="pendingCommunes">
          <template #district-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">
              {{ row.district?.name || 'Brak powiatu' }}
              <span v-if="row.district?.state?.name">· {{ row.district.state.name }}</span>
            </div>
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
                color="neutral"
                variant="ghost"
                :icon="row.isManaged ? 'i-lucide-minus-circle' : 'i-lucide-check-circle'"
                :label="row.isManaged ? 'Zdejmij managed' : 'Oznacz managed'"
                :aria-label="row.isManaged ? 'Zdejmij status managed dla gminy' : 'Oznacz gmine jako managed'"
                @click="toggleManagedCommune(row)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="ghost"
                icon="i-lucide-star"
                label="Ustaw domyślną"
                :disabled="row.isDefault"
                aria-label="Ustaw gmine jako domyślną"
                @click="setDefaultCommune(row)"
              />
            </div>
          </template>
        </UTable>
      </UCard>

    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div>
            <h2 class="font-semibold text-lg">Rejestr miast</h2>
            <p class="text-sm text-gray-500">Lokalny słownik miast i flagi zarządzające adresem domyślnym.</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              placeholder="Szukaj miasta po nazwie lub TERYT..."
              aria-label="Szukaj miasta po nazwie lub TERYT"
              class="w-full md:w-80"
            />
            <USelect
              v-model="managedFilter"
              :items="managedOptions"
              label-key="label"
              class="w-full md:w-56"
            />
          </div>
        </div>
      </template>

      <UTable :data="filteredCities" :columns="cityColumns" :loading="pendingCities">
        <template #district-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.district?.name || 'Brak powiatu' }}</div>
        </template>

        <template #commune-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.commune?.name || 'Brak gminy' }}</div>
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
              color="neutral"
              variant="ghost"
              :icon="row.isManaged ? 'i-lucide-minus-circle' : 'i-lucide-check-circle'"
              :label="row.isManaged ? 'Zdejmij managed' : 'Oznacz managed'"
              :aria-label="row.isManaged ? 'Zdejmij status managed dla miasta' : 'Oznacz miasto jako managed'"
              @click="toggleManagedCity(row)"
            />
            <UButton
              size="xs"
              color="primary"
              variant="ghost"
              icon="i-lucide-star"
              label="Ustaw domyślne"
              :disabled="row.isDefault"
              aria-label="Ustaw miasto jako domyślne"
              @click="setDefaultCity(row)"
            />
            <UButton
              size="xs"
              color="warning"
              variant="ghost"
              icon="i-lucide-refresh-cw"
              label="Synchronizuj"
              aria-label="Synchronizuj miasto z Geoportalem"
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
            <p class="text-sm text-gray-500">Wyniki z lokalnego słownika do weryfikacji importu i podpowiedzi.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UInput v-model="search" icon="i-lucide-map-pin" placeholder="np. Ożarów" aria-label="Wyszukiwanie TERYT po nazwie" />
          <div class="space-y-2">
            <div
              v-for="city in addressSearchRows"
              :key="city.id"
              class="rounded-lg border border-gray-200 p-3 dark:border-gray-800"
            >
              <div class="font-medium text-gray-900 dark:text-white">{{ city.name }}</div>
              <div class="text-sm text-gray-500">TERYT: {{ city.terytCode || 'brak' }}</div>
            </div>
            <p v-if="search.length >= 2 && !addressSearchRows.length" class="text-sm text-gray-500">Brak wyników.</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Podgląd ulic</h2>
            <p class="text-sm text-gray-500">Ulice dla wybranego miasta bez odrywania się od rejestru.</p>
          </div>
        </template>

        <div v-if="selectedCity" class="space-y-4">
          <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div class="font-medium text-gray-900 dark:text-white">{{ selectedCity.name }}</div>
            <div class="text-sm text-gray-500">
              {{ selectedCity.commune?.name || 'Brak gminy' }} · {{ selectedCity.district?.name || 'Brak powiatu' }}
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="street in streetRows"
              :key="street.id"
              class="rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              {{ street.name }}
            </div>
          </div>
          <p v-if="!streetRows.length" class="text-sm text-gray-500">Brak ulic dla wybranego miasta.</p>
        </div>
        <p v-else class="text-sm text-gray-500">Wybierz miasto z tabeli, aby zobaczyć ulice.</p>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const toast = useToast()

const importJobs = [
  { accessorKey: 'terc', title: 'Import TERC', description: 'Województwa, powiaty i gminy' },
  { accessorKey: 'simc', title: 'Import SIMC', description: 'Miejscowości i powiązania z gminami' },
  { accessorKey: 'ulic', title: 'Import ULIC', description: 'Ulice powiązane z miastami i gminami' }
]

const cityColumns = [
  { accessorKey: 'name', header: 'Miasto' },
  { accessorKey: 'commune', header: 'Gmina' },
  { accessorKey: 'district', header: 'Powiat' },
  { accessorKey: 'streetCount', header: 'Ulice' },
  { accessorKey: 'flags', header: 'Flagi' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const communeColumns = [
  { accessorKey: 'name', header: 'Gmina' },
  { accessorKey: 'district', header: 'Powiat / województwo' },
  { accessorKey: 'flags', header: 'Flagi' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const managedOptions = [
  { label: 'Wszystkie miasta', value: 'all' },
  { label: 'Tylko managed', value: 'managed' },
  { label: 'Tylko unmanaged', value: 'unmanaged' }
]

const search = ref('')
const communeSearch = ref('')
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

const { data: cities, pending: pendingCities, refresh: refreshCities } = await useFetch('/api/v1/teryt/cities', {
  default: () => []
})
const { data: communes, pending: pendingCommunes, refresh: refreshCommunes } = await useFetch('/api/v1/teryt/communes', {
  default: () => []
})
const { data: defaultArea, refresh: refreshDefaultArea } = await useFetch('/api/v1/addresses/default-area')
const { data: addressSearchData, refresh: refreshAddressSearch } = await useFetch('/api/v1/addresses/search-teryt', {
  query: { q: search },
  default: () => []
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

    return [row.name, row.terytCode || '', row.district?.name || '', row.commune?.name || '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const filteredCommunes = computed(() => {
  const rows = communes.value || []
  const query = communeSearch.value.trim().toLowerCase()
  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    [row.name, row.terytCode || '', row.district?.name || '', row.district?.state?.name || '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
})

const addressSearchRows = computed(() => addressSearchData.value || [])
const streetRows = computed(() => streets.value || [])

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
  try {
    await Promise.all([
      refreshCities(),
      refreshCommunes(),
      refreshDefaultArea(),
      refreshAddressSearch(),
      refreshStreets()
    ])
    toast.add({
      title: 'Odświeżono dane',
      description: 'Pomyślnie zaktualizowano widok rejestru TERYT',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd odświeżania',
      description: 'Nie udało się pobrać aktualnych danych TERYT',
      color: 'error'
    })
  }
}

const onFileSelected = async (kind, event) => {
  const file = event?.target?.files?.[0]
  if (!file) {
    return
  }

  importForms[kind] = await file.text()
  importResults[kind] = `Załadowano plik: ${file.name}`
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

    await Promise.all([
      refreshCities(),
      refreshCommunes(),
      refreshDefaultArea(),
      refreshAddressSearch()
    ])
    toast.add({
      title: 'Import zakończony',
      description: `Pomyślnie zaimportowano plik dla ${kind.toUpperCase()}`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd importu',
      description: error.message || 'Wystąpił nieoczekiwany błąd podczas importu XML',
      color: 'error'
    })
  } finally {
    loadingImports[kind] = false
  }
}

const toggleManagedCity = async (row) => {
  try {
    await $fetch(`/api/v1/addresses/cities/${row.id}/toggle-managed`, { method: 'POST' })
    await Promise.all([refreshCities(), refreshDefaultArea()])
    toast.add({
      title: 'Zaktualizowano miasto',
      description: `Zmieniono status managed dla miasta ${row.name}`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd aktualizacji',
      description: error.message || 'Nie udało się zmienić statusu managed',
      color: 'error'
    })
  }
}

const setDefaultCity = async (row) => {
  try {
    await $fetch(`/api/v1/addresses/cities/${row.id}/set-default`, { method: 'POST' })
    await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()])
    toast.add({
      title: 'Ustawiono domyślne miasto',
      description: `Miasto ${row.name} zostało ustawione jako domyślne`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd',
      description: error.message || 'Nie udało się ustawić domyślnego miasta',
      color: 'error'
    })
  }
}

const toggleManagedCommune = async (row) => {
  try {
    await $fetch(`/api/v1/addresses/communes/${row.id}/toggle-managed`, { method: 'POST' })
    await Promise.all([refreshCommunes(), refreshDefaultArea()])
    toast.add({
      title: 'Zaktualizowano gminę',
      description: `Zmieniono status managed dla gminy ${row.name}`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd aktualizacji',
      description: error.message || 'Nie udało się zmienić statusu managed dla gminy',
      color: 'error'
    })
  }
}

const setDefaultCommune = async (row) => {
  try {
    await $fetch(`/api/v1/addresses/communes/${row.id}/set-default`, { method: 'POST' })
    await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()])
    toast.add({
      title: 'Ustawiono domyślną gminę',
      description: `Gmina ${row.name} została ustawiona jako domyślna`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd',
      description: error.message || 'Nie udało się ustawić domyślnej gminy',
      color: 'error'
    })
  }
}

const scheduleSync = async (row) => {
  try {
    await $fetch('/api/v1/teryt/sync-geoportal', {
      method: 'POST',
      body: { cityId: row.id }
    })
    toast.add({
      title: 'Synchronizacja uruchomiona',
      description: `Rozpoczęto synchronizację Geoportalu dla miasta ${row.name}`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Błąd synchronizacji',
      description: error.message || 'Nie udało się rozpocząć synchronizacji z Geoportalem',
      color: 'error'
    })
  }
}
</script>
