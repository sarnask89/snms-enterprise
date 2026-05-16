<template>
  <div class="space-y-4">
    <section class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div class="space-y-2">
          <div class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Rejestr adresowy</div>
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">TERYT i adresy</h1>
            <p class="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Import pojedynczych plików XML TERC/SIMC/ULIC, domyślne obszary i lokalne słowniki autosugestii w jednym, gęstym panelu operatorskim.
            </p>
          </div>
        </div>
        <UButton color="gray" variant="soft" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
      </div>
    </section>

    <section class="grid xl:grid-cols-[1.2fr,0.8fr] gap-4">
      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: 'px-5 py-5' } }">
        <template #header>
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Rejestr importu</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Kompaktowy import XML dla słowników TERC, SIMC i ULIC.</p>
          </div>
        </template>

        <div class="grid gap-4 lg:grid-cols-3">
          <section
            v-for="importJob in importJobs"
            :key="importJob.key"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ importJob.title }}</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ importJob.description }}</p>
            </div>

            <form class="mt-4 space-y-3" @submit.prevent="submitImport(importJob.key)">
              <UFormGroup label="Plik XML" required>
                <input
                  type="file"
                  accept=".xml,text/xml,application/xml"
                  class="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  @change="onFileSelected(importJob.key, $event)"
                >
              </UFormGroup>

              <UFormGroup label="Podgląd treści">
                <UTextarea v-model="importForms[importJob.key]" :rows="7" />
              </UFormGroup>

              <div class="flex items-center justify-between gap-3">
                <div class="min-h-[20px] text-xs text-slate-500 dark:text-slate-400">{{ importResults[importJob.key] }}</div>
                <UButton type="submit" color="primary" size="sm" :loading="loadingImports[importJob.key]" label="Importuj XML" />
              </div>
            </form>
          </section>
        </div>
      </UCard>

      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: 'px-5 py-5' } }">
        <template #header>
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Obszar domyślny</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Prefill formularzy klienta i urządzeń na bazie aktywnego obszaru.</p>
          </div>
        </template>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Województwo</div>
            <div class="mt-1 font-semibold text-slate-900 dark:text-white">{{ defaultArea?.state?.name || 'Brak województwa domyślnego' }}</div>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Powiat</div>
            <div class="mt-1 font-semibold text-slate-900 dark:text-white">{{ defaultArea?.district?.name || 'Brak powiatu domyślnego' }}</div>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Gmina</div>
            <div class="mt-1 font-semibold text-slate-900 dark:text-white">{{ defaultArea?.commune?.name || 'Brak gminy domyślnej' }}</div>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Miasto</div>
            <div class="mt-1 font-semibold text-slate-900 dark:text-white">{{ defaultArea?.city?.name || 'Brak miasta domyślnego' }}</div>
          </div>
        </div>
      </UCard>
    </section>

    <section class="grid xl:grid-cols-2 gap-4">
      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: '!p-0' } }">
        <template #header>
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Rejestr gmin</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Managed/default na poziomie gminy steruje domyślnym obszarem systemu.</p>
            </div>
            <UInput
              v-model="communeSearch"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="Szukaj gminy..."
              class="w-full lg:w-80"
            />
          </div>
        </template>

        <UTable :rows="filteredCommunes" :columns="communeColumns" :loading="pendingCommunes">
          <template #district-data="{ row }">
            <div class="text-sm text-slate-600 dark:text-slate-300">
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
                color="gray"
                variant="ghost"
                :icon="row.isManaged ? 'i-heroicons-minus-circle' : 'i-heroicons-check-circle'"
                :label="row.isManaged ? 'Zdejmij managed' : 'Oznacz managed'"
                @click="toggleManagedCommune(row)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="ghost"
                icon="i-heroicons-star"
                label="Ustaw domyślną"
                :disabled="row.isDefault"
                @click="setDefaultCommune(row)"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: '!p-0' } }">
        <template #header>
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Rejestr miast</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Wyszukiwanie lokalnego słownika i zarządzanie flagami na poziomie miasta.</p>
            </div>
            <div class="flex w-full flex-col gap-3 md:flex-row lg:w-auto">
              <UInput
                v-model="search"
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Szukaj miasta po nazwie lub TERYT..."
                class="w-full md:w-72"
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

        <UTable :rows="filteredCities" :columns="cityColumns" :loading="pendingCities">
          <template #district-data="{ row }">
            <div class="text-sm text-slate-600 dark:text-slate-300">{{ row.district?.name || 'Brak powiatu' }}</div>
          </template>

          <template #commune-data="{ row }">
            <div class="text-sm text-slate-600 dark:text-slate-300">{{ row.commune?.name || 'Brak gminy' }}</div>
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
                :label="row.isManaged ? 'Zdejmij managed' : 'Oznacz managed'"
                @click="toggleManagedCity(row)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="ghost"
                icon="i-heroicons-star"
                label="Ustaw domyślne"
                :disabled="row.isDefault"
                @click="setDefaultCity(row)"
              />
              <UButton
                size="xs"
                color="yellow"
                variant="ghost"
                icon="i-heroicons-arrow-path"
                label="Synchronizuj"
                @click="scheduleSync(row)"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </section>

    <section class="grid xl:grid-cols-[0.9fr,1.1fr] gap-4">
      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: 'px-5 py-5' } }">
        <template #header>
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Szybkie wyszukiwanie TERYT</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Wsparcie operatora oparte o `/api/v1/addresses/search-teryt`.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UInput v-model="search" icon="i-heroicons-map-pin" placeholder="np. Ożarów" />
          <div class="space-y-2">
            <div
              v-for="city in addressSearchRows"
              :key="city.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div class="font-medium text-slate-900 dark:text-white">{{ city.name }}</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">TERYT: {{ city.terytCode || 'brak' }}</div>
            </div>
            <p v-if="search.length >= 2 && !addressSearchRows.length" class="text-sm text-slate-500 dark:text-slate-400">Brak wyników.</p>
          </div>
        </div>
      </UCard>

      <UCard :ui="{ base: 'rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', header: { padding: 'px-5 py-4' }, body: { padding: 'px-5 py-5' } }">
        <template #header>
          <div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Podgląd ulic</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Ulice dla aktywnego miasta z rejestru, bez odrywania się od głównej tabeli.</p>
          </div>
        </template>

        <div v-if="selectedCity" class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="font-medium text-slate-900 dark:text-white">{{ selectedCity.name }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">
              {{ selectedCity.commune?.name || 'Brak gminy' }} · {{ selectedCity.district?.name || 'Brak powiatu' }}
            </div>
          </div>
          <div class="grid gap-2 md:grid-cols-2">
            <div
              v-for="street in streetRows"
              :key="street.id"
              class="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {{ street.name }}
            </div>
          </div>
          <p v-if="!streetRows.length" class="text-sm text-slate-500 dark:text-slate-400">Brak ulic dla wybranego miasta.</p>
        </div>
        <p v-else class="text-sm text-slate-500 dark:text-slate-400">Wybierz miasto z tabeli, aby zobaczyć ulice.</p>
      </UCard>
    </section>
  </div>
</template>

<script setup>
const importJobs = [
  { key: 'terc', title: 'Import TERC', description: 'Województwa, powiaty i gminy' },
  { key: 'simc', title: 'Import SIMC', description: 'Miejscowości i powiązania z gminami' },
  { key: 'ulic', title: 'Import ULIC', description: 'Ulice powiązane z miastami i gminami' }
]

const cityColumns = [
  { key: 'name', label: 'Miasto' },
  { key: 'commune', label: 'Gmina' },
  { key: 'district', label: 'Powiat' },
  { key: 'streetCount', label: 'Ulice' },
  { key: 'flags', label: 'Flagi' },
  { key: 'actions', label: 'Akcje' }
]

const communeColumns = [
  { key: 'name', label: 'Gmina' },
  { key: 'district', label: 'Powiat / województwo' },
  { key: 'flags', label: 'Flagi' },
  { key: 'actions', label: 'Akcje' }
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
  await Promise.all([
    refreshCities(),
    refreshCommunes(),
    refreshDefaultArea(),
    refreshAddressSearch(),
    refreshStreets()
  ])
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
  } finally {
    loadingImports[kind] = false
  }
}

const toggleManagedCity = async (row) => {
  await $fetch(`/api/v1/addresses/cities/${row.id}/toggle-managed`, { method: 'POST' })
  await Promise.all([refreshCities(), refreshDefaultArea()])
}

const setDefaultCity = async (row) => {
  await $fetch(`/api/v1/addresses/cities/${row.id}/set-default`, { method: 'POST' })
  await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()])
}

const toggleManagedCommune = async (row) => {
  await $fetch(`/api/v1/addresses/communes/${row.id}/toggle-managed`, { method: 'POST' })
  await Promise.all([refreshCommunes(), refreshDefaultArea()])
}

const setDefaultCommune = async (row) => {
  await $fetch(`/api/v1/addresses/communes/${row.id}/set-default`, { method: 'POST' })
  await Promise.all([refreshCities(), refreshCommunes(), refreshDefaultArea()])
}

const scheduleSync = async (row) => {
  await $fetch('/api/v1/teryt/sync-geoportal', {
    method: 'POST',
    body: { cityId: row.id }
  })
}
</script>
