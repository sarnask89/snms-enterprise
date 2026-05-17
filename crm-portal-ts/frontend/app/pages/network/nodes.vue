<script setup>
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const search = ref('')
const isEditorOpen = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const nodeToDelete = ref(null)

const columns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'locationDetail', header: 'Lokalizacja' },
  { accessorKey: 'locationType', header: 'Typ lokalizacji' },
  { accessorKey: 'nodeType', header: 'Typ węzła' },
  { accessorKey: 'flags', header: 'Warunki' },
  { accessorKey: 'deviceCount', header: 'Urządzenia' },
  { id: 'actions', header: '' }
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

const { data: nodes, pending, refresh } = await useFetch('/api/v1/net-nodes', {
  default: () => []
})

const filteredNodes = computed(() => {
  const query = search.value.trim().toLowerCase()
  const rows = nodes.value || []

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
  return locationTypeOptions.find((option) => option.value === value)?.label || value || 'Inne'
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
  isEditorOpen.value = true
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
  isEditorOpen.value = true
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

    toast.add({
      title: form.id ? 'Węzeł zaktualizowany' : 'Węzeł dodany',
      description: `${form.name} został zapisany.`,
      color: 'success'
    })

    isEditorOpen.value = false
    resetForm()
    await refresh()
  } finally {
    isSaving.value = false
  }
}

const getRowItems = (row) => [[{
  type: 'label',
  label: row.name
}], [{
  label: 'Edytuj węzeł',
  icon: 'i-lucide-pencil',
  onSelect: async () => {
    await openEditModal(row)
  }
}, {
  label: 'Urządzenia węzła',
  icon: 'i-lucide-cpu',
  onSelect: async () => {
    await navigateTo('/network/devices')
  }
}], [{
  label: 'Usuń węzeł',
  icon: 'i-lucide-trash',
  color: 'error',
  onSelect: () => {
    nodeToDelete.value = row
    isDeleteModalOpen.value = true
  }
}]]

const confirmDelete = async () => {
  if (!nodeToDelete.value) {
    return
  }

  isDeleting.value = true
  try {
    await $fetch(`/api/v1/net-nodes/${nodeToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Węzeł usunięty',
      description: `${nodeToDelete.value.name} został usunięty.`,
      color: 'success'
    })
    isDeleteModalOpen.value = false
    nodeToDelete.value = null
    await refresh()
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="network-nodes">
    <template #header>
      <UDashboardNavbar title="Węzły sieciowe">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <UButton to="/network/ip-networks" color="neutral" variant="outline" icon="i-lucide-network" label="Sieci IP" />
            <UButton to="/network/devices" color="neutral" variant="outline" icon="i-lucide-cpu" label="Urządzenia" />
            <UButton color="primary" icon="i-lucide-plus" label="Nowy węzeł" @click="openCreateModal" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            class="w-full max-w-md"
            icon="i-lucide-search"
            placeholder="Szukaj po nazwie, lokalizacji lub typie..."
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="filteredNodes"
        :columns="columns"
        :loading="pending"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default align-top',
          separator: 'h-0'
        }"
      >
        <template #name-data="{ row }">
          <div class="min-w-[16rem]">
            <div class="font-medium text-highlighted">{{ row.name }}</div>
            <div class="mt-1 text-xs text-muted">{{ row.ownerType || 'brak własności' }}</div>
          </div>
        </template>

        <template #locationDetail-data="{ row }">
          <div class="space-y-1">
            <div>{{ row.locationDetail || 'brak szczegółu' }}</div>
            <div class="text-xs text-muted">{{ row.latitude ?? '—' }}, {{ row.longitude ?? '—' }}</div>
          </div>
        </template>

        <template #locationType-data="{ row }">
          <UBadge color="neutral" variant="subtle">
            {{ locationTypeLabel(row.locationType) }}
          </UBadge>
        </template>

        <template #flags-data="{ row }">
          <div class="space-y-1 text-sm">
            <div>{{ row.hasPower ? 'Zasilanie dostępne' : 'Brak zasilania' }}</div>
            <div class="text-xs text-muted">{{ row.hasEnvControl ? 'Kontrola środowiska' : 'Bez klimatyzacji' }}</div>
          </div>
        </template>

        <template #deviceCount-data="{ row }">
          <div class="font-medium text-highlighted">{{ row.deviceCount || 0 }}</div>
        </template>

        <template #actions-data="{ row }">
          <div class="text-right">
            <UDropdownMenu :items="getRowItems(row)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" class="ml-auto" />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>

      <div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ filteredNodes.length }} z {{ nodes?.length || 0 }} węzłów widocznych
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isEditorOpen">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-highlighted">{{ form.id ? 'Edytuj węzeł' : 'Dodaj węzeł' }}</h3>
            <p class="text-sm text-muted">Fizyczny punkt infrastruktury z podstawowymi parametrami środowiskowymi.</p>
          </div>
        </template>

        <UForm :state="form" class="space-y-4" @submit="saveNode">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Nazwa" name="name" required>
              <UInput v-model="form.name" />
            </UFormField>
            <UFormField label="Szczegóły lokalizacji" name="locationDetail">
              <UInput v-model="form.locationDetail" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="Typ lokalizacji" name="locationType">
              <USelect v-model="form.locationType" :items="locationTypeOptions" />
            </UFormField>
            <UFormField label="Typ węzła" name="nodeType">
              <UInput v-model="form.nodeType" placeholder="POP, ODF, szafa..." />
            </UFormField>
            <UFormField label="Własność" name="ownerType">
              <UInput v-model="form.ownerType" placeholder="own, lease..." />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Szerokość geograficzna" name="latitude">
              <UInput v-model="form.latitude" type="number" step="0.000001" />
            </UFormField>
            <UFormField label="Długość geograficzna" name="longitude">
              <UInput v-model="form.longitude" type="number" step="0.000001" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="PUWG 1992 X" name="x1992">
              <UInput v-model="form.x1992" type="number" step="0.01" />
            </UFormField>
            <UFormField label="PUWG 1992 Y" name="y1992">
              <UInput v-model="form.y1992" type="number" step="0.01" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UCheckbox v-model="form.hasPower" label="Dostępne zasilanie" />
            <UCheckbox v-model="form.hasEnvControl" label="Kontrola środowiska" />
          </div>

          <UFormField label="Informacje" name="info">
            <UTextarea v-model="form.info" :rows="3" autoresize />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="outline" label="Anuluj" @click="isEditorOpen = false" />
            <UButton type="submit" color="primary" :loading="isSaving" label="Zapisz" />
          </div>
        </UForm>
      </UCard>
    </template>
  </UModal>

  <UModal v-model:open="isDeleteModalOpen">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-highlighted">Usuń węzeł</h3>
            <p class="text-sm text-muted">Ta operacja usuwa węzeł z inventory infrastruktury.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :title="nodeToDelete ? `Usunąć ${nodeToDelete.name}?` : 'Brak węzła do usunięcia.'"
          />

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="outline" label="Anuluj" @click="isDeleteModalOpen = false" />
            <UButton color="error" :loading="isDeleting" label="Usuń" @click="confirmDelete" />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
