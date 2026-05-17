<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Urządzenia klientów</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Lista urządzeń końcowych, ONU i wpisów zaimportowanych z discovery.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UDropdown :items="extraActions" :popper="{ placement: 'bottom-end' }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" label="Więcej" />
        </UDropdown>
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refresh" />
      </div>
    </div>

    <UCard>
      <div class="grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))]">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Szukaj po hoście, IP, MAC, mieście lub ulicy..."
        />
        <USelect v-model="statusFilter" :options="statusOptions" placeholder="Status" />
        <USelect v-model="deviceTypeFilter" :options="deviceTypeOptions" placeholder="Typ urządzenia" />
        <USelect v-model="vendorFilter" :options="vendorOptions" placeholder="Źródło / vendor" />
      </div>
    </UCard>

    <UCard
      :ui="{
        base: 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950',
        body: { padding: '!p-0' },
        footer: { padding: 'px-4 py-4 sm:px-5' }
      }"
    >
      <UTable
        :data="filteredDevices"
        :columns="columns"
        class="w-full"
      >
        <template #hostname-data="{ row }">
          <div class="min-w-[14rem]">
            <div class="font-medium text-gray-900 dark:text-white">{{ row.hostname }}</div>
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ row.name || 'bez nazwy pomocniczej' }}
            </div>
          </div>
        </template>

        <template #deviceType-data="{ row }">
          <UBadge :color="deviceTypeColor(row.deviceType)" variant="soft" size="xs">
            {{ deviceTypeLabel(row.deviceType) }}
          </UBadge>
        </template>

        <template #network-data="{ row }">
          <div class="space-y-1 text-sm">
            <div>{{ row.ipAddress || 'brak IP' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ row.macAddress || 'brak MAC' }}</div>
          </div>
        </template>

        <template #customer-data="{ row }">
          <div class="space-y-1">
            <div class="font-medium text-gray-900 dark:text-white">{{ row.customerDisplayName }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ row.customerCode || 'bez kodu' }}</div>
          </div>
        </template>

        <template #location-data="{ row }">
          <div class="space-y-1 text-sm">
            <div>{{ row.installationCity || 'brak miasta' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatStreet(row.installationStreet, row.installationStreetNumber, row.installationApartmentNumber) }}
            </div>
          </div>
        </template>

        <template #origin-data="{ row }">
          <div class="space-y-1">
            <UBadge :color="vendorColor(row.remoteVendor)" variant="soft" size="xs">
              {{ vendorLabel(row.remoteVendor) }}
            </UBadge>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRemoteDetails(row) }}
            </div>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="soft" size="xs">
            {{ statusLabel(row.status) }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex flex-wrap gap-2">
            <UButton
              v-if="row.customerId"
              size="xs"
              color="primary"
              variant="soft"
              label="Klient"
              :to="`/customers/${row.customerId}`"
            />
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              label="Urządzenie"
              :to="`/snms`"
            />
          </div>
        </template>
      </UTable>

      <template #footer>
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Pokazano {{ filteredDevices.length }} z {{ devices?.length || 0 }} urządzeń klientów
          </span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const search = ref('')
const statusFilter = ref('')
const deviceTypeFilter = ref('')
const vendorFilter = ref('')

const statusOptions = [
  { label: 'Wszystkie statusy', value: '' },
  { label: 'Aktywny', value: 'active' },
  { label: 'Nieaktywny', value: 'inactive' },
  { label: 'Uszkodzony', value: 'broken' }
]

const deviceTypeOptions = [
  { label: 'Wszystkie typy', value: '' },
  { label: 'ONU', value: 'onu' },
  { label: 'Inne', value: '__other__' }
]

const vendorOptions = [
  { label: 'Wszyscy vendorzy', value: '' },
  { label: 'Dasan', value: 'dasan' },
  { label: 'Mikrotik', value: 'mikrotik' },
  { label: 'Brak źródła', value: '__none__' }
]

const columns = [
  { key: 'hostname', label: 'Host / nazwa' },
  { key: 'deviceType', label: 'Typ' },
  { key: 'network', label: 'Sieć' },
  { key: 'customer', label: 'Klient' },
  { key: 'location', label: 'Adres instalacji' },
  { key: 'origin', label: 'Źródło' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

const extraActions = computed(() => [[
  {
    label: 'Pokaż tylko ONU',
    icon: 'i-heroicons-radio',
    click: () => {
      deviceTypeFilter.value = 'onu'
    }
  },
  {
    label: 'Wyczyść filtry',
    icon: 'i-heroicons-funnel',
    click: () => {
      search.value = ''
      statusFilter.value = ''
      deviceTypeFilter.value = ''
      vendorFilter.value = ''
    }
  }
]])

const query = computed(() => ({
  q: search.value || undefined,
  limit: 500
}))

const { data: devices, refresh } = await useFetch('/api/v1/customer-devices', {
  query
})

const filteredDevices = computed(() => {
  const rows = devices.value || []

  return rows
    .map((device) => ({
      ...device,
      customerDisplayName: device.customer?.companyName || [device.customer?.firstName, device.customer?.lastName].filter(Boolean).join(' ') || 'Nieprzypisany klient',
      customerCode: device.customer?.customerCode || null
    }))
    .filter((device) => {
      if (statusFilter.value && device.status !== statusFilter.value) {
        return false
      }

      if (deviceTypeFilter.value === 'onu' && device.deviceType !== 'onu') {
        return false
      }

      if (deviceTypeFilter.value === '__other__' && device.deviceType === 'onu') {
        return false
      }

      if (vendorFilter.value === 'dasan' && device.remoteVendor !== 'dasan') {
        return false
      }

      if (vendorFilter.value === 'mikrotik' && device.remoteVendor !== 'mikrotik') {
        return false
      }

      if (vendorFilter.value === '__none__' && device.remoteVendor) {
        return false
      }

      return true
    })
})

const statusLabel = (status) => {
  switch (status) {
    case 'active': return 'Aktywny'
    case 'inactive': return 'Nieaktywny'
    case 'broken': return 'Uszkodzony'
    default: return status || 'Nieznany'
  }
}

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'emerald'
    case 'inactive': return 'gray'
    case 'broken': return 'red'
    default: return 'gray'
  }
}

const deviceTypeLabel = (deviceType) => {
  if (deviceType === 'onu') return 'ONU'
  return deviceType || 'inne'
}

const deviceTypeColor = (deviceType) => {
  return deviceType === 'onu' ? 'blue' : 'gray'
}

const vendorLabel = (vendor) => {
  if (vendor === 'dasan') return 'Dasan'
  if (vendor === 'mikrotik') return 'Mikrotik'
  return 'manualny'
}

const vendorColor = (vendor) => {
  if (vendor === 'dasan') return 'orange'
  if (vendor === 'mikrotik') return 'sky'
  return 'gray'
}

const formatStreet = (street, number, apartment) => {
  const line = [street, number].filter(Boolean).join(' ')
  if (!line && !apartment) return 'brak adresu'
  return apartment ? `${line}/${apartment}` : (line || 'brak adresu')
}

const formatRemoteDetails = (device) => {
  if (device.remoteVendor === 'dasan') {
    const onu = [device.remoteOlt, device.remoteOnu].every((value) => value !== null && value !== undefined)
      ? `OLT ${device.remoteOlt} / ONU ${device.remoteOnu}`
      : null
    return [onu, device.remoteSerialNumber, device.remotePort].filter(Boolean).join(' · ') || 'rekord discovery'
  }

  return device.remoteSerialNumber || device.remotePort || 'rekord lokalny'
}
</script>
