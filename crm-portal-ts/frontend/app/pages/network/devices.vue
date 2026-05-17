<script setup>
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const search = ref('')
const statusFilter = ref('all')
const driverFilter = ref('all')
const deviceTypeFilter = ref('all')
const isModalOpen = ref(false)
const isSaving = ref(false)
const deviceToDelete = ref(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

const columns = [
  { accessorKey: 'device', header: 'Urządzenie' },
  { accessorKey: 'management', header: 'Management' },
  { accessorKey: 'access', header: 'Dostęp' },
  { accessorKey: 'relations', header: 'Powiązania' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const statusItems = [
  { label: 'Wszystkie statusy', value: 'all' },
  { label: 'Aktywne', value: 'active' },
  { label: 'Nieaktywne', value: 'inactive' },
  { label: 'Serwis', value: 'maintenance' }
]

const driverItems = [
  { label: 'Wszystkie drivery', value: 'all' },
  { label: 'Mikrotik API', value: 'mikrotik_api' },
  { label: 'Dasan SSH', value: 'dasan_ssh' },
  { label: 'SNMP', value: 'snmp' },
  { label: 'Brak drivera', value: 'none' }
]

const deviceTypeItems = [
  { label: 'Wszystkie typy', value: 'all' },
  { label: 'Router', value: 'router' },
  { label: 'Switch', value: 'switch' },
  { label: 'OLT', value: 'olt' },
  { label: 'ONU', value: 'onu' },
  { label: 'Inne', value: 'other' }
]

const form = reactive({
  id: null,
  name: '',
  hostname: '',
  serialNumber: '',
  macAddress: '',
  managementIp: '',
  snmpCommunity: '',
  loginUrl: '',
  driverType: '',
  mgmtUsername: '',
  deviceType: 'other',
  status: 'active',
  netNodeId: null,
  ipNetworkId: null,
  customerId: null,
  notes: ''
})

const { data: devices, pending: pendingDevices, refresh: refreshDevices } = await useFetch('/api/v1/net-devices', {
  default: () => []
})
const { data: nodes, refresh: refreshNodes } = await useFetch('/api/v1/net-nodes', { default: () => [] })
const { data: networks, refresh: refreshNetworks } = await useFetch('/api/v1/ip-networks', { default: () => [] })
const { data: customers, refresh: refreshCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 500 },
  default: () => []
})

const filteredDevices = computed(() => {
  const rows = devices.value || []
  const query = search.value.trim().toLowerCase()

  return rows.filter((row) => {
    if (statusFilter.value !== 'all' && row.status !== statusFilter.value) {
      return false
    }

    if (driverFilter.value === 'none' && row.driverType) {
      return false
    }

    if (driverFilter.value !== 'all' && driverFilter.value !== 'none' && row.driverType !== driverFilter.value) {
      return false
    }

    if (deviceTypeFilter.value !== 'all' && (row.deviceType || 'other') !== deviceTypeFilter.value) {
      return false
    }

    if (!query) {
      return true
    }

    return [
      row.name,
      row.hostname || '',
      row.managementIp || '',
      row.deviceType || '',
      row.driverType || '',
      row.serialNumber || '',
      row.netNode?.name || '',
      row.ipNetwork?.name || ''
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const nodeOptions = computed(() => [
  { label: 'Brak węzła', value: null },
  ...((nodes.value || []).map((node) => ({
    label: node.name,
    value: node.id
  })))
])

const networkOptions = computed(() => [
  { label: 'Brak sieci', value: null },
  ...((networks.value || []).map((network) => ({
    label: `${network.name} (${network.cidr})`,
    value: network.id
  })))
])

const customerOptions = computed(() => [
  { label: 'Nieprzypisane', value: null },
  ...((customers.value || []).map((customer) => ({
    label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.customerCode,
    value: customer.id
  })))
])

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'maintenance': return 'warning'
    case 'inactive': return 'neutral'
    default: return 'neutral'
  }
}

const statusLabel = (status) => {
  switch (status) {
    case 'active': return 'Aktywne'
    case 'maintenance': return 'Serwis'
    case 'inactive': return 'Nieaktywne'
    default: return status || 'Nieznany'
  }
}

const driverLabel = (driver) => {
  return driverItems.find((item) => item.value === driver)?.label || driver || 'brak'
}

const customerLabel = (customer) => {
  if (!customer) {
    return 'Nieprzypisane'
  }

  return customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.customerCode
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    hostname: '',
    serialNumber: '',
    macAddress: '',
    managementIp: '',
    snmpCommunity: '',
    loginUrl: '',
    driverType: '',
    mgmtUsername: '',
    deviceType: 'other',
    status: 'active',
    netNodeId: null,
    ipNetworkId: null,
    customerId: null,
    notes: ''
  })
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = async (row) => {
  const device = await $fetch(`/api/v1/net-devices/${row.id}`)
  Object.assign(form, {
    id: device.id,
    name: device.name,
    hostname: device.hostname || '',
    serialNumber: device.serialNumber || '',
    macAddress: device.macAddress || '',
    managementIp: device.managementIp || '',
    snmpCommunity: device.snmpCommunity || '',
    loginUrl: device.loginUrl || '',
    driverType: device.driverType || '',
    mgmtUsername: device.mgmtUsername || '',
    deviceType: device.deviceType || 'other',
    status: device.status || 'active',
    netNodeId: device.netNodeId ?? null,
    ipNetworkId: device.ipNetworkId ?? null,
    customerId: device.customerId ?? null,
    notes: device.notes || ''
  })
  isModalOpen.value = true
}

function getRowItems(row) {
  return [[{
    type: 'label',
    label: row.name
  }], [{
    label: 'Edytuj urządzenie',
    icon: 'i-lucide-pencil',
    onSelect: async () => {
      await openEditModal(row)
    }
  }, {
    label: 'Operacje discovery',
    icon: 'i-lucide-wrench',
    onSelect: async () => {
      await navigateTo('/operations')
    }
  }, {
    label: 'Otwórz klienta',
    icon: 'i-lucide-user',
    disabled: !row.customerId,
    onSelect: async () => {
      if (row.customerId) {
        await navigateTo(`/customers/${row.customerId}`)
      }
    }
  }], [{
    label: 'Usuń urządzenie',
    icon: 'i-lucide-trash',
    color: 'error',
    onSelect: () => {
      deviceToDelete.value = row
      isDeleteModalOpen.value = true
    }
  }]]
}

const saveDevice = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      hostname: form.hostname || null,
      serialNumber: form.serialNumber || null,
      macAddress: form.macAddress || null,
      managementIp: form.managementIp || null,
      snmpCommunity: form.snmpCommunity || null,
      loginUrl: form.loginUrl || null,
      driverType: form.driverType || null,
      mgmtUsername: form.mgmtUsername || null,
      deviceType: form.deviceType || 'other',
      status: form.status,
      netNodeId: form.netNodeId,
      ipNetworkId: form.ipNetworkId,
      customerId: form.customerId,
      notes: form.notes || null
    }

    if (form.id) {
      await $fetch(`/api/v1/net-devices/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/v1/net-devices', {
        method: 'POST',
        body: payload
      })
    }

    toast.add({
      title: form.id ? 'Urządzenie zapisane' : 'Urządzenie dodane',
      description: `${form.name} jest już dostępne w katalogu urządzeń sieciowych.`,
      color: 'success'
    })

    isModalOpen.value = false
    resetForm()
    await Promise.all([refreshDevices(), refreshNodes(), refreshNetworks(), refreshCustomers()])
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = async () => {
  if (!deviceToDelete.value) {
    return
  }

  isDeleting.value = true
  try {
    await $fetch(`/api/v1/net-devices/${deviceToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Urządzenie usunięte',
      description: `${deviceToDelete.value.name} zostało usunięte z katalogu.`,
      color: 'success'
    })
    isDeleteModalOpen.value = false
    deviceToDelete.value = null
    await refreshDevices()
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="network-devices">
    <template #header>
      <UDashboardNavbar title="Urządzenia sieciowe">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <UButton to="/network/nodes" color="neutral" variant="outline" icon="i-lucide-map-pin" label="Węzły" />
            <UButton to="/network/ip-networks" color="neutral" variant="outline" icon="i-lucide-network" label="Sieci IP" />
            <UButton color="primary" icon="i-lucide-plus" label="Nowe urządzenie" @click="openCreateModal" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            class="w-full max-w-md"
            icon="i-lucide-search"
            placeholder="Szukaj po nazwie, IP, typie, driverze lub serialu..."
          />
        </template>

        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <USelect v-model="statusFilter" :items="statusItems" class="min-w-36" />
            <USelect v-model="driverFilter" :items="driverItems" class="min-w-40" />
            <USelect v-model="deviceTypeFilter" :items="deviceTypeItems" class="min-w-32" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="filteredDevices"
        :columns="columns"
        :loading="pendingDevices"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default align-top',
          separator: 'h-0'
        }"
      >
        <template #device-data="{ row }">
          <div class="min-w-[16rem]">
            <div class="font-medium text-highlighted">{{ row.name }}</div>
            <div class="mt-1 text-xs text-muted">{{ row.hostname || 'brak hostname' }}</div>
            <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span>{{ row.serialNumber || 'brak serialu' }}</span>
              <span>•</span>
              <span>{{ row.macAddress || 'brak MAC' }}</span>
            </div>
          </div>
        </template>

        <template #management-data="{ row }">
          <div class="space-y-1">
            <div>{{ row.managementIp || 'brak IP zarządzania' }}</div>
            <div class="text-xs text-muted">{{ row.loginUrl || 'brak login URL' }}</div>
            <div class="text-xs text-muted">{{ row.snmpCommunity || 'brak SNMP community' }}</div>
          </div>
        </template>

        <template #access-data="{ row }">
          <div class="space-y-1">
            <UBadge :color="row.driverType ? 'primary' : 'neutral'" variant="subtle">
              {{ driverLabel(row.driverType) }}
            </UBadge>
            <div class="text-xs text-muted">{{ row.mgmtUsername || 'brak loginu management' }}</div>
            <div class="text-xs text-muted">
              {{ row.accessProfile ? `profil #${row.accessProfile.id} · ${row.accessProfile.host}` : 'brak profilu discovery' }}
            </div>
          </div>
        </template>

        <template #relations-data="{ row }">
          <div class="space-y-1">
            <div>{{ row.netNode?.name || 'brak węzła' }}</div>
            <div class="text-xs text-muted">{{ row.ipNetwork?.name || 'brak sieci IP' }}</div>
            <div class="text-xs text-muted">{{ customerLabel(row.customer) }}</div>
          </div>
        </template>

        <template #status-data="{ row }">
          <div class="space-y-1">
            <UBadge :color="statusColor(row.status)" variant="subtle">
              {{ statusLabel(row.status) }}
            </UBadge>
            <div class="text-xs text-muted">{{ row.deviceType || 'other' }}</div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="text-right">
            <UDropdownMenu :items="getRowItems(row)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" class="ml-auto" />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isModalOpen">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-highlighted">{{ form.id ? 'Edytuj urządzenie' : 'Dodaj urządzenie' }}</h3>
            <p class="text-sm text-muted">Katalog backbone inventory wraz z parametrami management i discovery.</p>
          </div>
        </template>

        <UForm :state="form" class="space-y-4" @submit="saveDevice">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Nazwa" name="name" required>
              <UInput v-model="form.name" />
            </UFormField>
            <UFormField label="Hostname" name="hostname">
              <UInput v-model="form.hostname" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="IP zarządzania" name="managementIp">
              <UInput v-model="form.managementIp" />
            </UFormField>
            <UFormField label="Typ urządzenia" name="deviceType">
              <USelect v-model="form.deviceType" :items="deviceTypeItems.slice(1)" />
            </UFormField>
            <UFormField label="Status" name="status">
              <USelect v-model="form.status" :items="statusItems.slice(1)" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Numer seryjny" name="serialNumber">
              <UInput v-model="form.serialNumber" />
            </UFormField>
            <UFormField label="MAC" name="macAddress">
              <UInput v-model="form.macAddress" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Driver discovery" name="driverType">
              <USelect v-model="form.driverType" :items="driverItems.slice(1)" />
            </UFormField>
            <UFormField label="Login management" name="mgmtUsername">
              <UInput v-model="form.mgmtUsername" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="SNMP community" name="snmpCommunity">
              <UInput v-model="form.snmpCommunity" />
            </UFormField>
            <UFormField label="Login URL" name="loginUrl">
              <UInput v-model="form.loginUrl" placeholder="http://10.0.0.1/" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="Węzeł" name="netNodeId">
              <USelectMenu v-model="form.netNodeId" :items="nodeOptions" value-key="value" label-key="label" />
            </UFormField>
            <UFormField label="Sieć IP" name="ipNetworkId">
              <USelectMenu v-model="form.ipNetworkId" :items="networkOptions" value-key="value" label-key="label" />
            </UFormField>
            <UFormField label="Klient" name="customerId">
              <USelectMenu v-model="form.customerId" :items="customerOptions" value-key="value" label-key="label" />
            </UFormField>
          </div>

          <UFormField label="Notatki" name="notes">
            <UTextarea v-model="form.notes" :rows="3" autoresize />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="outline" label="Anuluj" @click="isModalOpen = false" />
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
            <h3 class="text-lg font-semibold text-highlighted">Usuń urządzenie</h3>
            <p class="text-sm text-muted">Ta operacja usunie rekord z katalogu urządzeń sieciowych.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :title="deviceToDelete ? `Usunąć urządzenie ${deviceToDelete.name}?` : 'Brak urządzenia do usunięcia.'"
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
