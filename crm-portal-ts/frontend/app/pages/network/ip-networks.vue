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
const networkToDelete = ref(null)

const columns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'cidr', header: 'CIDR' },
  { accessorKey: 'gateway', header: 'Brama' },
  { accessorKey: 'vlanId', header: 'VLAN' },
  { accessorKey: 'usage', header: 'Wykorzystanie' },
  { accessorKey: 'active', header: 'Status' },
  { id: 'actions', header: '' }
]

const form = reactive({
  id: null,
  name: '',
  cidr: '',
  gateway: '',
  vlanId: '',
  description: '',
  active: true
})

const { data: networks, pending, refresh } = await useFetch('/api/v1/ip-networks', {
  default: () => []
})

const filteredNetworks = computed(() => {
  const query = search.value.trim().toLowerCase()
  const rows = networks.value || []

  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    row.name.toLowerCase().includes(query) ||
    row.cidr.toLowerCase().includes(query) ||
    (row.gateway || '').toLowerCase().includes(query) ||
    String(row.vlanId || '').includes(query)
  )
})

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    cidr: '',
    gateway: '',
    vlanId: '',
    description: '',
    active: true
  })
}

const openCreateModal = () => {
  resetForm()
  isEditorOpen.value = true
}

const openEditModal = async (row) => {
  const network = await $fetch(`/api/v1/ip-networks/${row.id}`)
  Object.assign(form, {
    id: network.id,
    name: network.name,
    cidr: network.cidr,
    gateway: network.gateway || '',
    vlanId: network.vlanId ?? '',
    description: network.description || '',
    active: !!network.active
  })
  isEditorOpen.value = true
}

const saveNetwork = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      cidr: form.cidr,
      gateway: form.gateway || null,
      vlanId: form.vlanId === '' ? null : Number(form.vlanId),
      description: form.description || null,
      active: !!form.active
    }

    if (form.id) {
      await $fetch(`/api/v1/ip-networks/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/v1/ip-networks', {
        method: 'POST',
        body: payload
      })
    }

    toast.add({
      title: form.id ? 'Sieć zaktualizowana' : 'Sieć dodana',
      description: `${form.name} została zapisana.`,
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
  label: 'Edytuj sieć',
  icon: 'i-lucide-pencil',
  onSelect: async () => {
    await openEditModal(row)
  }
}, {
  label: 'Powiązane urządzenia',
  icon: 'i-lucide-cpu',
  onSelect: async () => {
    await navigateTo('/network/devices')
  }
}], [{
  label: 'Usuń sieć',
  icon: 'i-lucide-trash',
  color: 'error',
  onSelect: () => {
    networkToDelete.value = row
    isDeleteModalOpen.value = true
  }
}]]

const confirmDelete = async () => {
  if (!networkToDelete.value) {
    return
  }

  isDeleting.value = true
  try {
    await $fetch(`/api/v1/ip-networks/${networkToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Sieć usunięta',
      description: `${networkToDelete.value.name} została usunięta.`,
      color: 'success'
    })
    isDeleteModalOpen.value = false
    networkToDelete.value = null
    await refresh()
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="ip-networks">
    <template #header>
      <UDashboardNavbar title="Sieci IP">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <UButton to="/network/nodes" color="neutral" variant="outline" icon="i-lucide-map-pinned" label="Węzły" />
            <UButton to="/network/devices" color="neutral" variant="outline" icon="i-lucide-cpu" label="Urządzenia" />
            <UButton color="primary" icon="i-lucide-plus" label="Nowa sieć" @click="openCreateModal" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            class="w-full max-w-md"
            icon="i-lucide-search"
            placeholder="Szukaj po nazwie, CIDR, bramie lub VLAN..."
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="filteredNetworks"
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
          <div class="min-w-[15rem]">
            <div class="font-medium text-highlighted">{{ row.name }}</div>
            <div class="mt-1 text-xs text-muted">{{ row.description || 'brak opisu' }}</div>
          </div>
        </template>

        <template #gateway-data="{ row }">
          <div class="space-y-1">
            <div>{{ row.gateway || 'brak bramy' }}</div>
            <div class="text-xs text-muted">VLAN {{ row.vlanId ?? '—' }}</div>
          </div>
        </template>

        <template #usage-data="{ row }">
          <div class="space-y-1 text-sm">
            <div>Sieciowe: {{ row.deviceCount || 0 }}</div>
            <div class="text-xs text-muted">Klienci: {{ row.customerDeviceCount || 0 }}</div>
          </div>
        </template>

        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'success' : 'neutral'" variant="subtle">
            {{ row.active ? 'Aktywna' : 'Wyłączona' }}
          </UBadge>
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
          {{ filteredNetworks.length }} z {{ networks?.length || 0 }} sieci widocznych
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isEditorOpen">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-highlighted">{{ form.id ? 'Edytuj sieć IP' : 'Dodaj sieć IP' }}</h3>
            <p class="text-sm text-muted">Podsieć access lub management z podstawowymi parametrami operatorskimi.</p>
          </div>
        </template>

        <UForm :state="form" class="space-y-4" @submit="saveNetwork">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Nazwa" name="name" required>
              <UInput v-model="form.name" />
            </UFormField>
            <UFormField label="CIDR" name="cidr" required>
              <UInput v-model="form.cidr" placeholder="10.10.100.0/24" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Brama" name="gateway">
              <UInput v-model="form.gateway" placeholder="10.10.100.1" />
            </UFormField>
            <UFormField label="VLAN ID" name="vlanId">
              <UInput v-model="form.vlanId" type="number" />
            </UFormField>
          </div>

          <UFormField label="Opis" name="description">
            <UTextarea v-model="form.description" :rows="3" autoresize />
          </UFormField>

          <UCheckbox v-model="form.active" label="Sieć aktywna" />

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
            <h3 class="text-lg font-semibold text-highlighted">Usuń sieć IP</h3>
            <p class="text-sm text-muted">Ta operacja usuwa podsieć z inventory operatorskiego.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :title="networkToDelete ? `Usunąć ${networkToDelete.name}?` : 'Brak sieci do usunięcia.'"
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
