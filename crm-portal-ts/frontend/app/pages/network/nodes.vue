<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Węzły sieciowe</h1>
        <p class="text-sm text-gray-500">Fizyczne punkty infrastruktury z podstawową ewidencją zasilania i urządzeń</p>
      </div>
      <div class="flex gap-3">
        <UButton to="/network/ip-networks" color="gray" variant="soft" icon="i-heroicons-globe-alt" label="Sieci IP" />
        <UButton to="/network/devices" color="gray" variant="soft" icon="i-heroicons-cpu-chip" label="Urządzenia" />
        <UButton color="primary" icon="i-heroicons-plus" label="Nowy węzeł" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Szukaj po nazwie, lokalizacji lub typie..."
        />
      </template>

      <UTable :rows="filteredNodes" :columns="columns" :loading="pending">
        <template #locationType-data="{ row }">
          <UBadge color="gray" variant="soft">{{ locationTypeLabel(row.locationType) }}</UBadge>
        </template>

        <template #flags-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.hasPower ? 'Zasilanie' : 'Brak zasilania' }} · {{ row.hasEnvControl ? 'Klimatyzacja' : 'Bez klimatyzacji' }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openEditModal(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeNode(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">{{ form.id ? 'Edytuj węzeł' : 'Dodaj węzeł' }}</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveNode">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Nazwa" required>
              <UInput v-model="form.name" />
            </UFormGroup>
            <UFormGroup label="Szczegóły lokalizacji">
              <UInput v-model="form.locationDetail" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="Typ lokalizacji">
              <USelect v-model="form.locationType" :options="locationTypeOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Typ węzła">
              <UInput v-model="form.nodeType" placeholder="POP, ODF, szafa..." />
            </UFormGroup>
            <UFormGroup label="Własność">
              <UInput v-model="form.ownerType" placeholder="own, lease..." />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Szerokość geograficzna">
              <UInput v-model="form.latitude" type="number" step="0.000001" />
            </UFormGroup>
            <UFormGroup label="Długość geograficzna">
              <UInput v-model="form.longitude" type="number" step="0.000001" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="PUWG 1992 X">
              <UInput v-model="form.x1992" type="number" step="0.01" />
            </UFormGroup>
            <UFormGroup label="PUWG 1992 Y">
              <UInput v-model="form.y1992" type="number" step="0.01" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <label class="flex items-center gap-3 text-sm">
              <input v-model="form.hasPower" type="checkbox" class="rounded border-gray-300">
              <span>Dostępne zasilanie</span>
            </label>
            <label class="flex items-center gap-3 text-sm">
              <input v-model="form.hasEnvControl" type="checkbox" class="rounded border-gray-300">
              <span>Kontrola środowiska</span>
            </label>
          </div>

          <UFormGroup label="Informacje">
            <UTextarea v-model="form.info" :rows="3" />
          </UFormGroup>

          <div class="flex justify-end gap-2">
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
  { key: 'name', label: 'Nazwa' },
  { key: 'locationDetail', label: 'Lokalizacja' },
  { key: 'locationType', label: 'Typ lokalizacji' },
  { key: 'nodeType', label: 'Typ węzła' },
  { key: 'deviceCount', label: 'Urządzenia' },
  { key: 'flags', label: 'Warunki' },
  { key: 'actions', label: 'Akcje' }
]

const locationTypeOptions = [
  { label: 'Piwnica', value: 'basement' },
  { label: 'Klatka schodowa', value: 'staircase' },
  { label: 'Piętro', value: 'floor' },
  { label: 'Inne', value: 'other' }
]

const form = reactive({
  id: null,
  name: '',
  locationDetail: '',
  locationType: 'other',
  nodeType: '',
  ownerType: '',
  latitude: '',
  longitude: '',
  x1992: '',
  y1992: '',
  hasPower: false,
  hasEnvControl: false,
  info: ''
})

const { data: nodes, pending, refresh } = await useFetch('/api/v1/net-nodes')

const filteredNodes = computed(() => {
  const rows = nodes.value || []
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    row.name.toLowerCase().includes(query) ||
    (row.locationDetail || '').toLowerCase().includes(query) ||
    (row.nodeType || '').toLowerCase().includes(query)
  )
})

const locationTypeLabel = (value) => {
  return locationTypeOptions.find((option) => option.value === value)?.label || value
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    locationDetail: '',
    locationType: 'other',
    nodeType: '',
    ownerType: '',
    latitude: '',
    longitude: '',
    x1992: '',
    y1992: '',
    hasPower: false,
    hasEnvControl: false,
    info: ''
  })
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = async (row) => {
  const node = await $fetch(`/api/v1/net-nodes/${row.id}`)
  Object.assign(form, {
    id: node.id,
    name: node.name,
    locationDetail: node.locationDetail || '',
    locationType: node.locationType || 'other',
    nodeType: node.nodeType || '',
    ownerType: node.ownerType || '',
    latitude: node.latitude ?? '',
    longitude: node.longitude ?? '',
    x1992: node.x1992 ?? '',
    y1992: node.y1992 ?? '',
    hasPower: !!node.hasPower,
    hasEnvControl: !!node.hasEnvControl,
    info: node.info || ''
  })
  isModalOpen.value = true
}

const saveNode = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      locationDetail: form.locationDetail || null,
      locationType: form.locationType,
      nodeType: form.nodeType || null,
      ownerType: form.ownerType || null,
      latitude: form.latitude === '' ? null : Number(form.latitude),
      longitude: form.longitude === '' ? null : Number(form.longitude),
      x1992: form.x1992 === '' ? null : Number(form.x1992),
      y1992: form.y1992 === '' ? null : Number(form.y1992),
      hasPower: !!form.hasPower,
      hasEnvControl: !!form.hasEnvControl,
      info: form.info || null
    }

    if (form.id) {
      await $fetch(`/api/v1/net-nodes/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/v1/net-nodes', {
        method: 'POST',
        body: payload
      })
    }

    isModalOpen.value = false
    resetForm()
    await refresh()
  } catch (error) {
    console.error('Failed to save net node', error)
  } finally {
    isSaving.value = false
  }
}

const removeNode = async (row) => {
  if (!confirm(`Czy na pewno chcesz usunąć węzeł "${row.name}"?`)) {
    return
  }

  await $fetch(`/api/v1/net-nodes/${row.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
