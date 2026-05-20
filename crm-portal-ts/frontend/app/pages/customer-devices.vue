<script setup>
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UTooltip = resolveComponent('UTooltip')

const toast = useToast()

const search = ref('')
const statusFilter = ref('all')
const deviceTypeFilter = ref('all')
const vendorFilter = ref('all')
const isEditorOpen = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deviceToDelete = ref(null)

const columns = [
  { accessorKey: 'hostname', header: 'Urządzenie' },
  { accessorKey: 'customer', header: 'Klient' },
  { accessorKey: 'deviceType', header: 'Typ' },
  { accessorKey: 'network', header: 'Sieć' },
  { accessorKey: 'origin', header: 'Źródło' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const form = reactive({
  id: null,
  customerId: null,
  name: '',
  hostname: '',
  deviceType: '',
  login: '',
  passwd: '',
  ipAddress: '',
  macAddress: '',
  status: 'active',
  notes: '',
  netDeviceId: null,
  ipNetworkId: null,
  remoteVendor: '',
  remoteSerialNumber: '',
  remoteOlt: '',
  remoteOnu: '',
  remotePort: '',
  remoteProfileName: '',
  installationCityId: null,
  installationStreetId: null,
  installationCity: '',
  installationStreet: '',
  installationStreetNumber: '',
  installationApartmentNumber: '',
  installationPostalCode: '',
  locationDescription: ''
})

const query = computed(() => ({
  q: search.value || undefined,
  limit: 500
}))

const { data: devices, pending, refresh } = await useFetch('/api/v1/customer-devices', {
  query,
  default: () => []
})
const { data: customers } = await useFetch('/api/v1/customers', {
  query: { limit: 500 },
  default: () => []
})
const { data: netDevices } = await useFetch('/api/v1/net-devices', {
  default: () => []
})
const { data: ipNetworks } = await useFetch('/api/v1/ip-networks', {
  default: () => []
})
const { data: defaultArea } = await useFetch('/api/v1/addresses/default-area')

const addressFieldMap = {
  cityId: 'installationCityId',
  streetId: 'installationStreetId',
  city: 'installationCity',
  street: 'installationStreet'
}

const installationAddress = useManagedTerytAddress(form, addressFieldMap, defaultArea)

const preparedDevices = computed(() =>
  (devices.value || []).map(device => ({
    ...device,
    customerDisplayName: device.customer?.companyName || [device.customer?.firstName, device.customer?.lastName].filter(Boolean).join(' ') || 'Nieprzypisany klient',
    customerCode: device.customer?.customerCode || null
  }))
)

const filteredDevices = computed(() =>
  preparedDevices.value.filter((device) => {
    if (statusFilter.value !== 'all' && device.status !== statusFilter.value) {
      return false
    }

    if (deviceTypeFilter.value === 'onu' && device.deviceType !== 'onu') {
      return false
    }

    if (deviceTypeFilter.value === 'other' && device.deviceType === 'onu') {
      return false
    }

    if (vendorFilter.value === 'dasan' && device.remoteVendor !== 'dasan') {
      return false
    }

    if (vendorFilter.value === 'mikrotik' && device.remoteVendor !== 'mikrotik') {
      return false
    }

    if (vendorFilter.value === 'manual' && device.remoteVendor) {
      return false
    }

    return true
  })
)

const customerOptions = computed(() => [
  { label: 'Wybierz klienta', value: null },
  ...((customers.value || []).map((customer) => ({
    label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.customerCode,
    value: customer.id
  })))
])

const netDeviceOptions = computed(() => [
  { label: 'Brak urządzenia sieciowego', value: null },
  ...((netDevices.value || []).map((device) => ({
    label: device.name,
    value: device.id
  })))
])

const ipNetworkOptions = computed(() => [
  { label: 'Brak sieci IP', value: null },
  ...((ipNetworks.value || []).map((network) => ({
    label: `${network.name} (${network.cidr})`,
    value: network.id
  })))
])

function getRowItems(row) {
  return [[{
    type: 'label',
    label: row.hostname
  }], [{
    label: 'Otwórz klienta',
    icon: 'i-lucide-user',
    onSelect: async () => {
      if (row.customerId) {
        await navigateTo(`/customers/${row.customerId}`)
      }
    }
  }, {
    label: 'Diagnostyka w operacjach',
    icon: 'i-lucide-wrench',
    onSelect: async () => {
      await navigateTo(`/operations?deviceId=${row.id}&mode=diagnostics`)
    }
  }, {
    label: 'Edytuj urządzenie',
    icon: 'i-lucide-pencil',
    onSelect: async () => {
      await openEditor(row.id)
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

const statusItems = [
  { label: 'Wszystkie statusy', value: 'all' },
  { label: 'Aktywny', value: 'active' },
  { label: 'Nieaktywny', value: 'inactive' },
  { label: 'Uszkodzony', value: 'broken' }
]

const typeItems = [
  { label: 'Wszystkie typy', value: 'all' },
  { label: 'ONU', value: 'onu' },
  { label: 'Pozostałe', value: 'other' }
]

const vendorItems = [
  { label: 'Wszystkie źródła', value: 'all' },
  { label: 'Dasan', value: 'dasan' },
  { label: 'Mikrotik', value: 'mikrotik' },
  { label: 'Manualne', value: 'manual' }
]

const statusOptions = [
  { label: 'Aktywny', value: 'active' },
  { label: 'Nieaktywny', value: 'inactive' },
  { label: 'Uszkodzony', value: 'broken' }
]

const deviceTypeOptions = [
  { label: 'ONU', value: 'onu' },
  { label: 'Router CPE', value: 'router' },
  { label: 'AP', value: 'ap' },
  { label: 'Inne', value: 'other' }
]

const vendorOptions = [
  { label: 'Brak vendor lock', value: '' },
  { label: 'Dasan', value: 'dasan' },
  { label: 'Mikrotik', value: 'mikrotik' }
]

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
    case 'active': return 'success'
    case 'inactive': return 'neutral'
    case 'broken': return 'error'
    default: return 'neutral'
  }
}

const deviceTypeLabel = (deviceType) => {
  return deviceType === 'onu' ? 'ONU' : (deviceType || 'inne')
}

const vendorLabel = (vendor) => {
  if (vendor === 'dasan') return 'Dasan'
  if (vendor === 'mikrotik') return 'Mikrotik'
  return 'manualny'
}

const formatRemoteDetails = (device) => {
  if (device.remoteVendor === 'dasan') {
    const onu = [device.remoteOlt, device.remoteOnu].every(value => value !== null && value !== undefined)
      ? `OLT ${device.remoteOlt} / ONU ${device.remoteOnu}`
      : null

    return [onu, device.remoteSerialNumber, device.remotePort].filter(Boolean).join(' · ') || 'rekord discovery'
  }

  return device.remoteSerialNumber || device.remotePort || 'rekord lokalny'
}

const formatStreet = (street, number, apartment) => {
  const line = [street, number].filter(Boolean).join(' ')
  if (!line && !apartment) {
    return 'brak adresu'
  }

  return apartment ? `${line}/${apartment}` : (line || 'brak adresu')
}

const resetForm = () => {
  Object.assign(form, {
    id: null,
    customerId: null,
    name: '',
    hostname: '',
    deviceType: '',
    login: '',
    passwd: '',
    ipAddress: '',
    macAddress: '',
    status: 'active',
    notes: '',
    netDeviceId: null,
    ipNetworkId: null,
    remoteVendor: '',
    remoteSerialNumber: '',
    remoteOlt: '',
    remoteOnu: '',
    remotePort: '',
    remoteProfileName: '',
    installationCityId: null,
    installationStreetId: null,
    installationCity: '',
    installationStreet: '',
    installationStreetNumber: '',
    installationApartmentNumber: '',
    installationPostalCode: '',
    locationDescription: ''
  })
}

const openEditor = async (id) => {
  const device = await $fetch(`/api/v1/customer-devices/${id}`)
  Object.assign(form, {
    id: device.id,
    customerId: device.customerId ?? null,
    name: device.name || '',
    hostname: device.hostname || '',
    deviceType: device.deviceType || '',
    login: device.login || '',
    passwd: '',
    ipAddress: device.ipAddress || '',
    macAddress: device.macAddress || '',
    status: device.status || 'active',
    notes: device.notes || '',
    netDeviceId: device.netDeviceId ?? null,
    ipNetworkId: device.ipNetworkId ?? null,
    remoteVendor: device.remoteVendor || '',
    remoteSerialNumber: device.remoteSerialNumber || '',
    remoteOlt: device.remoteOlt ?? '',
    remoteOnu: device.remoteOnu ?? '',
    remotePort: device.remotePort || '',
    remoteProfileName: device.remoteProfileName || '',
    installationCityId: device.installationCityEntry?.id || device.installationCityId || null,
    installationStreetId: device.installationStreetEntry?.id || device.installationStreetId || null,
    installationCity: device.installationCity || '',
    installationStreet: device.installationStreet || '',
    installationStreetNumber: device.installationStreetNumber || '',
    installationApartmentNumber: device.installationApartmentNumber || '',
    installationPostalCode: device.installationPostalCode || '',
    locationDescription: device.locationDescription || ''
  })
  installationAddress.clearSuggestions()
  isEditorOpen.value = true
}

const saveDevice = async () => {
  isSaving.value = true
  try {
    await $fetch(`/api/v1/customer-devices/${form.id}`, {
      method: 'PUT',
      body: {
        customerId: form.customerId,
        name: form.name || null,
        hostname: form.hostname,
        deviceType: form.deviceType || null,
        login: form.login || null,
        passwd: form.passwd || undefined,
        ipAddress: form.ipAddress || null,
        macAddress: form.macAddress || null,
        status: form.status,
        notes: form.notes || null,
        netDeviceId: form.netDeviceId,
        ipNetworkId: form.ipNetworkId,
        remoteVendor: form.remoteVendor || null,
        remoteSerialNumber: form.remoteSerialNumber || null,
        remoteOlt: form.remoteOlt === '' ? null : Number(form.remoteOlt),
        remoteOnu: form.remoteOnu === '' ? null : Number(form.remoteOnu),
        remotePort: form.remotePort || null,
        remoteProfileName: form.remoteProfileName || null,
        installationCityId: form.installationCityId,
        installationStreetId: form.installationStreetId,
        installationCity: form.installationCity || null,
        installationStreet: form.installationStreet || null,
        installationStreetNumber: form.installationStreetNumber || null,
        installationApartmentNumber: form.installationApartmentNumber || null,
        installationPostalCode: form.installationPostalCode || null,
        locationDescription: form.locationDescription || null
      }
    })

    toast.add({
      title: 'Urządzenie zapisane',
      description: `${form.hostname} zostało zaktualizowane.`,
      color: 'success'
    })

    isEditorOpen.value = false
    resetForm()
    await refresh()
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
    await $fetch(`/api/v1/customer-devices/${deviceToDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.add({
      title: 'Urządzenie usunięte',
      description: `${deviceToDelete.value.hostname} zostało usunięte.`,
      color: 'success'
    })
    isDeleteModalOpen.value = false
    deviceToDelete.value = null
    await refresh()
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="customer-devices">
    <template #header>
      <UDashboardNavbar title="Urządzenia klientów">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" label="Odśwież" @click="refresh" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            class="w-full max-w-md"
            icon="i-lucide-search"
            placeholder="Szukaj po hoście, IP, MAC lub adresie..."
          />
        </template>

        <template #right>
          <div class="flex flex-wrap items-center gap-2">
            <USelect v-model="statusFilter" :items="statusItems" class="min-w-32" />
            <USelect v-model="deviceTypeFilter" :items="typeItems" class="min-w-32" />
            <USelect v-model="vendorFilter" :items="vendorItems" class="min-w-36" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="filteredDevices"
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
        <template #hostname-data="{ row }">
          <div class="min-w-[16rem]">
            <div class="font-medium text-highlighted">{{ row.hostname }}</div>
            <div class="mt-1 text-xs text-muted">{{ row.name || 'bez nazwy pomocniczej' }}</div>
          </div>
        </template>

        <template #customer-data="{ row }">
          <div class="space-y-1">
            <div class="font-medium text-highlighted">{{ row.customerDisplayName }}</div>
            <div class="text-xs text-muted">{{ row.customerCode || 'bez kodu' }}</div>
          </div>
        </template>

        <template #deviceType-data="{ row }">
          <UBadge :color="row.deviceType === 'onu' ? 'primary' : 'neutral'" variant="subtle">
            {{ deviceTypeLabel(row.deviceType) }}
          </UBadge>
        </template>

        <template #network-data="{ row }">
          <div class="space-y-1">
            <div>{{ row.ipAddress || 'brak IP' }}</div>
            <div class="text-xs text-muted">{{ row.macAddress || 'brak MAC' }}</div>
            <div class="text-xs text-muted">
              {{ formatStreet(row.installationStreet, row.installationStreetNumber, row.installationApartmentNumber) }}
            </div>
          </div>
        </template>

        <template #origin-data="{ row }">
          <div class="space-y-1">
            <UBadge :color="row.remoteVendor === 'dasan' ? 'warning' : row.remoteVendor === 'mikrotik' ? 'primary' : 'neutral'" variant="subtle">
              {{ vendorLabel(row.remoteVendor) }}
            </UBadge>
            <div class="text-xs text-muted">{{ formatRemoteDetails(row) }}</div>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusColor(row.status)" variant="subtle">
            {{ statusLabel(row.status) }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="text-right">
            <UDropdownMenu :items="getRowItems(row)" :content="{ align: 'end' }">
              <UTooltip text="Więcej opcji">
                <UButton
                  icon="i-lucide-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  class="ml-auto"
                  aria-label="Więcej opcji"
                />
              </UTooltip>
            </UDropdownMenu>
          </div>
        </template>
      </UTable>

      <div class="mt-auto flex items-center justify-between gap-3 border-t border-default pt-4">
        <div class="text-sm text-muted">
          {{ filteredDevices.length }} z {{ devices?.length || 0 }} urządzeń widocznych
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <UModal v-model:open="isEditorOpen">
    <template #content>
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-highlighted">Edytuj urządzenie klienta</h3>
            <p class="text-sm text-muted">Dane techniczne, powiązania discovery i adres instalacyjny.</p>
          </div>
        </template>

        <UForm :state="form" class="space-y-4" @submit="saveDevice">
          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Klient" name="customerId" required>
              <USelectMenu v-model="form.customerId" :items="customerOptions" value-key="value" label-key="label" />
            </UFormField>
            <UFormField label="Hostname" name="hostname" required>
              <UInput v-model="form.hostname" placeholder="np. cpe-klient-42" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="Nazwa pomocnicza" name="name">
              <UInput v-model="form.name" />
            </UFormField>
            <UFormField label="Typ urządzenia" name="deviceType">
              <USelect v-model="form.deviceType" :items="deviceTypeOptions" />
            </UFormField>
            <UFormField label="Status" name="status">
              <USelect v-model="form.status" :items="statusOptions" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="IP" name="ipAddress">
              <UInput v-model="form.ipAddress" placeholder="np. 10.0.50.100" />
            </UFormField>
            <UFormField label="MAC" name="macAddress">
              <UInput v-model="form.macAddress" placeholder="np. 00:11:22:33:44:55" />
            </UFormField>
            <UFormField label="Login" name="login">
              <UInput v-model="form.login" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="Urządzenie sieciowe" name="netDeviceId">
              <USelectMenu v-model="form.netDeviceId" :items="netDeviceOptions" value-key="value" label-key="label" />
            </UFormField>
            <UFormField label="Sieć IP" name="ipNetworkId">
              <USelectMenu v-model="form.ipNetworkId" :items="ipNetworkOptions" value-key="value" label-key="label" />
            </UFormField>
            <UFormField label="Vendor discovery" name="remoteVendor">
              <USelect v-model="form.remoteVendor" :items="vendorOptions" />
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-4">
            <UFormField label="Serial zdalny" name="remoteSerialNumber">
              <UInput v-model="form.remoteSerialNumber" />
            </UFormField>
            <UFormField label="OLT" name="remoteOlt">
              <UInput v-model="form.remoteOlt" type="number" />
            </UFormField>
            <UFormField label="ONU" name="remoteOnu">
              <UInput v-model="form.remoteOnu" type="number" />
            </UFormField>
            <UFormField label="Port zdalny" name="remotePort">
              <UInput v-model="form.remotePort" />
            </UFormField>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div class="text-sm text-muted">
              Adres instalacyjny korzysta z miast zarządzanych i słowników TERYT.
            </div>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              label="Użyj domyślnego miasta"
              @click="installationAddress.applyDefaultArea"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <UFormField label="Miasto instalacji" name="installationCity">
              <UInput v-model="form.installationCity" @input="installationAddress.onCityInput" />
              <div v-if="installationAddress.suggestions.cities.length" class="mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden">
                <button
                  v-for="suggestion in installationAddress.suggestions.cities"
                  :key="suggestion.id"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-elevated"
                  @click="installationAddress.selectCity(suggestion)"
                >
                  <div class="font-medium text-highlighted">{{ suggestion.text }}</div>
                </button>
              </div>
            </UFormField>
            <UFormField label="Ulica instalacji" name="installationStreet">
              <UInput v-model="form.installationStreet" @input="installationAddress.onStreetInput" />
              <div v-if="installationAddress.suggestions.streets.length" class="mt-2 rounded-lg border border-default divide-y divide-default overflow-hidden">
                <button
                  v-for="suggestion in installationAddress.suggestions.streets"
                  :key="suggestion.id"
                  type="button"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-elevated"
                  @click="installationAddress.selectStreet(suggestion)"
                >
                  <div class="font-medium text-highlighted">{{ suggestion.text }}</div>
                </button>
              </div>
            </UFormField>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <UFormField label="Nr budynku" name="installationStreetNumber">
              <UInput v-model="form.installationStreetNumber" />
            </UFormField>
            <UFormField label="Nr lokalu" name="installationApartmentNumber">
              <UInput v-model="form.installationApartmentNumber" />
            </UFormField>
            <UFormField label="Kod pocztowy" name="installationPostalCode">
              <UInput v-model="form.installationPostalCode" />
            </UFormField>
          </div>

          <UFormField label="Opis lokalizacji" name="locationDescription">
            <UTextarea v-model="form.locationDescription" :rows="2" autoresize />
          </UFormField>

          <UFormField label="Notatki" name="notes">
            <UTextarea v-model="form.notes" :rows="3" autoresize />
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
            <h3 class="text-lg font-semibold text-highlighted">Usuń urządzenie klienta</h3>
            <p class="text-sm text-muted">Ta operacja usunie urządzenie z inventory klienta.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :title="deviceToDelete ? `Usunąć ${deviceToDelete.hostname}?` : 'Brak urządzenia do usunięcia.'"
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
