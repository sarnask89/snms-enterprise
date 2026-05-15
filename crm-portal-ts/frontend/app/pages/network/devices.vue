<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Urządzenia sieciowe</h1>
        <p class="text-sm text-gray-500">Routery, switche i urządzenia zarządzane powiązane z klientem, siecią i węzłem</p>
      </div>
      <div class="flex gap-3">
        <UButton to="/network/nodes" color="gray" variant="soft" icon="i-heroicons-map-pin" label="Węzły" />
        <UButton to="/network/ip-networks" color="gray" variant="soft" icon="i-heroicons-globe-alt" label="Sieci IP" />
        <UButton color="primary" icon="i-heroicons-plus" label="Nowe urządzenie" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Szukaj po nazwie, hostname, IP lub typie..."
        />
      </template>

      <UTable :rows="filteredDevices" :columns="columns" :loading="pendingDevices">
        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="soft">{{ row.status }}</UBadge>
        </template>

        <template #relations-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <div>{{ row.netNode?.name || 'Brak węzła' }}</div>
            <div>{{ row.ipNetwork?.name || 'Brak sieci' }}</div>
          </div>
        </template>

        <template #customer-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : 'Nieprzypisane' }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openEditModal(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeDevice(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">{{ form.id ? 'Edytuj urządzenie' : 'Dodaj urządzenie' }}</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveDevice">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Nazwa" required>
              <UInput v-model="form.name" />
            </UFormGroup>
            <UFormGroup label="Hostname">
              <UInput v-model="form.hostname" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="IP zarządzania">
              <UInput v-model="form.managementIp" />
            </UFormGroup>
            <UFormGroup label="Typ urządzenia">
              <UInput v-model="form.deviceType" placeholder="router, switch, olt..." />
            </UFormGroup>
            <UFormGroup label="Status">
              <USelect v-model="form.status" :options="statusOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Numer seryjny">
              <UInput v-model="form.serialNumber" />
            </UFormGroup>
            <UFormGroup label="MAC">
              <UInput v-model="form.macAddress" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="Węzeł">
              <USelect v-model="form.netNodeId" :options="nodeOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Sieć IP">
              <USelect v-model="form.ipNetworkId" :options="networkOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Klient">
              <USelect v-model="form.customerId" :options="customerOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <UFormGroup label="Notatki">
            <UTextarea v-model="form.notes" :rows="3" />
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
  { key: 'hostname', label: 'Hostname' },
  { key: 'managementIp', label: 'IP zarządzania' },
  { key: 'deviceType', label: 'Typ' },
  { key: 'relations', label: 'Powiązania' },
  { key: 'customer', label: 'Klient' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

const statusOptions = [
  { label: 'Aktywne', value: 'active' },
  { label: 'Nieaktywne', value: 'inactive' },
  { label: 'Serwis', value: 'maintenance' }
]

const form = reactive({
  id: null,
  name: '',
  hostname: '',
  serialNumber: '',
  macAddress: '',
  managementIp: '',
  deviceType: 'other',
  status: 'active',
  netNodeId: null,
  ipNetworkId: null,
  customerId: null,
  notes: ''
})

const { data: devices, pending: pendingDevices, refresh: refreshDevices } = await useFetch('/api/v1/net-devices')
const { data: nodes, refresh: refreshNodes } = await useFetch('/api/v1/net-nodes')
const { data: networks, refresh: refreshNetworks } = await useFetch('/api/v1/ip-networks')
const { data: customers, refresh: refreshCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 200 }
})

const filteredDevices = computed(() => {
  const rows = devices.value || []
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    row.name.toLowerCase().includes(query) ||
    (row.hostname || '').toLowerCase().includes(query) ||
    (row.managementIp || '').toLowerCase().includes(query) ||
    (row.deviceType || '').toLowerCase().includes(query)
  )
})

const nodeOptions = computed(() => [
  { label: 'Brak', value: null },
  ...((nodes.value || []).map((node) => ({
    label: node.name,
    value: node.id
  })))
])

const networkOptions = computed(() => [
  { label: 'Brak', value: null },
  ...((networks.value || []).map((network) => ({
    label: `${network.name} (${network.cidr})`,
    value: network.id
  })))
])

const customerOptions = computed(() => [
  { label: 'Brak', value: null },
  ...((customers.value || []).map((customer) => ({
    label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
    value: customer.id
  })))
])

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'emerald'
    case 'maintenance': return 'yellow'
    case 'inactive': return 'gray'
    default: return 'gray'
  }
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    hostname: '',
    serialNumber: '',
    macAddress: '',
    managementIp: '',
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
    deviceType: device.deviceType || 'other',
    status: device.status || 'active',
    netNodeId: device.netNodeId,
    ipNetworkId: device.ipNetworkId,
    customerId: device.customerId,
    notes: device.notes || ''
  })
  isModalOpen.value = true
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

    isModalOpen.value = false
    resetForm()
    await Promise.all([refreshDevices(), refreshNodes(), refreshNetworks(), refreshCustomers()])
  } catch (error) {
    console.error('Failed to save net device', error)
  } finally {
    isSaving.value = false
  }
}

const removeDevice = async (row) => {
  if (!confirm(`Czy na pewno chcesz usunąć urządzenie "${row.name}"?`)) {
    return
  }

  await $fetch(`/api/v1/net-devices/${row.id}`, { method: 'DELETE' })
  await refreshDevices()
}
</script>
