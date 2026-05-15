<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Operacje sieciowe</h1>
        <p class="text-sm text-gray-500">Discovery, diagnostyka gotowości i eksport PIT na aktywnym backendzie TS</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
        <UButton color="primary" icon="i-heroicons-arrow-down-tray" label="Pobierz PIT GML" @click="downloadPitExport" />
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Routery discovery</div>
        <div class="text-2xl font-bold">{{ routers?.length || 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Zaimportowane lease</div>
        <div class="text-2xl font-bold">{{ importedLeases?.length || 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">PIT exportable</div>
        <div class="text-2xl font-bold">{{ pitSync?.exportableNodes ?? 'n/a' }}</div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Import lease z discovery</h2>
            <p class="text-sm text-gray-500">Tworzy lokalne urządzenie klienta i od razu uruchamia readiness diagnostyki</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="importLease">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="ID klienta" required>
              <UInput v-model="leaseForm.customerId" type="number" />
            </UFormGroup>
            <UFormGroup label="ID urządzenia sieciowego">
              <UInput v-model="leaseForm.netDeviceId" type="number" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="ID sieci IP">
              <UInput v-model="leaseForm.ipNetworkId" type="number" />
            </UFormGroup>
            <UFormGroup label="Hostname" required>
              <UInput v-model="leaseForm.hostname" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Adres IP">
              <UInput v-model="leaseForm.ipAddress" />
            </UFormGroup>
            <UFormGroup label="MAC">
              <UInput v-model="leaseForm.macAddress" />
            </UFormGroup>
          </div>

          <UFormGroup label="Komentarz">
            <UTextarea v-model="leaseForm.comment" :rows="2" />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isImportingLease" label="Importuj lease" />
          </div>
        </form>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Import sieci</h2>
            <p class="text-sm text-gray-500">Zapisuje wykrytą podsieć jako aktywną sieć IP w TS</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="importNetwork">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Nazwa">
              <UInput v-model="networkForm.name" />
            </UFormGroup>
            <UFormGroup label="CIDR" required>
              <UInput v-model="networkForm.cidr" placeholder="10.10.200.0/24" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="Gateway">
              <UInput v-model="networkForm.gateway" />
            </UFormGroup>
            <UFormGroup label="VLAN">
              <UInput v-model="networkForm.vlanId" type="number" />
            </UFormGroup>
            <UFormGroup label="Źródłowe device ID">
              <UInput v-model="networkForm.deviceId" type="number" />
            </UFormGroup>
          </div>

          <UFormGroup label="Komentarz">
            <UTextarea v-model="networkForm.comment" :rows="2" />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isImportingNetwork" label="Importuj sieć" />
          </div>
        </form>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Zaimportowane lease</h2>
              <p class="text-sm text-gray-500">Lokalny widok customer-devices po imporcie discovery</p>
            </div>
            <UInput v-model="leaseSearch" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Szukaj IP, MAC, hostname..." class="w-72" />
          </div>
        </template>

        <UTable :rows="importedLeases || []" :columns="leaseColumns" :loading="pendingImportedLeases">
          <template #ipAddress-data="{ row }">
            <span class="font-mono text-sm">{{ row.ipAddress || 'n/a' }}</span>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Diagnostyka</h2>
              <p class="text-sm text-gray-500">Readiness bez live-calli do urządzeń zewnętrznych</p>
            </div>
            <UButton color="gray" variant="soft" icon="i-heroicons-bolt" label="Sprawdź" :loading="isCheckingDiagnostics" @click="runDiagnostics" />
          </div>
        </template>

        <UFormGroup label="Customer device ID">
          <UInput v-model="diagnosticsDeviceId" type="number" placeholder="np. 1" />
        </UFormGroup>

        <div v-if="diagnosticsResult" class="mt-4 space-y-3">
          <UBadge :color="diagnosticsResult.ready ? 'green' : 'red'" variant="soft">
            {{ diagnosticsResult.ready ? 'Gotowe do diagnostyki' : 'Wymaga uzupełnienia danych' }}
          </UBadge>

          <div class="space-y-2">
            <div v-for="check in diagnosticsResult.checks" :key="check.key" class="flex items-center justify-between gap-4 text-sm">
              <span>{{ check.label }}</span>
              <UBadge :color="check.ok ? 'green' : check.severity === 'blocking' ? 'red' : 'amber'" variant="soft">
                {{ check.ok ? 'OK' : check.severity }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const leaseSearch = ref('')
const diagnosticsDeviceId = ref('')
const diagnosticsResult = ref(null)
const isImportingLease = ref(false)
const isImportingNetwork = ref(false)
const isCheckingDiagnostics = ref(false)

const leaseColumns = [
  { key: 'hostname', label: 'Hostname' },
  { key: 'ipAddress', label: 'IP' },
  { key: 'macAddress', label: 'MAC' },
  { key: 'netDeviceId', label: 'Net device' },
  { key: 'ipNetworkId', label: 'Sieć IP' }
]

const leaseForm = reactive({
  customerId: '',
  netDeviceId: '',
  ipNetworkId: '',
  hostname: '',
  ipAddress: '',
  macAddress: '',
  comment: ''
})

const networkForm = reactive({
  deviceId: '',
  name: '',
  cidr: '',
  gateway: '',
  vlanId: '',
  comment: ''
})

const { data: routers, refresh: refreshRouters } = await useFetch('/api/v1/network-discovery/routers')
const { data: pitSync, refresh: refreshPitSync } = await useFetch('/api/v1/pit/sync', { method: 'POST' })
const {
  data: importedLeases,
  pending: pendingImportedLeases,
  refresh: refreshImportedLeases
} = await useFetch('/api/v1/network-discovery/imported-leases', {
  query: { q: leaseSearch }
})

const asNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const refreshAll = async () => {
  await Promise.all([
    refreshRouters(),
    refreshPitSync(),
    refreshImportedLeases()
  ])
}

const importLease = async () => {
  isImportingLease.value = true
  try {
    const result = await $fetch('/api/v1/network-discovery/import-lease', {
      method: 'POST',
      body: {
        customerId: asNumberOrNull(leaseForm.customerId),
        netDeviceId: asNumberOrNull(leaseForm.netDeviceId),
        ipNetworkId: asNumberOrNull(leaseForm.ipNetworkId),
        hostname: leaseForm.hostname,
        ipAddress: leaseForm.ipAddress || null,
        macAddress: leaseForm.macAddress || null,
        comment: leaseForm.comment || null
      }
    })

    diagnosticsDeviceId.value = String(result.customerDevice.id)
    diagnosticsResult.value = result.diagnostics
    Object.assign(leaseForm, {
      customerId: '',
      netDeviceId: '',
      ipNetworkId: '',
      hostname: '',
      ipAddress: '',
      macAddress: '',
      comment: ''
    })
    await refreshImportedLeases()
  } finally {
    isImportingLease.value = false
  }
}

const importNetwork = async () => {
  isImportingNetwork.value = true
  try {
    await $fetch('/api/v1/network-discovery/import-network', {
      method: 'POST',
      body: {
        deviceId: asNumberOrNull(networkForm.deviceId),
        name: networkForm.name || null,
        cidr: networkForm.cidr,
        gateway: networkForm.gateway || null,
        vlanId: asNumberOrNull(networkForm.vlanId),
        comment: networkForm.comment || null
      }
    })

    Object.assign(networkForm, {
      deviceId: '',
      name: '',
      cidr: '',
      gateway: '',
      vlanId: '',
      comment: ''
    })
  } finally {
    isImportingNetwork.value = false
  }
}

const runDiagnostics = async () => {
  if (!diagnosticsDeviceId.value) {
    return
  }

  isCheckingDiagnostics.value = true
  try {
    diagnosticsResult.value = await $fetch(`/api/v1/diagnostics/check/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
  } finally {
    isCheckingDiagnostics.value = false
  }
}

const downloadPitExport = async () => {
  const blob = await $fetch('/api/v1/pit/export/nodes', { responseType: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'pit-net-nodes.gml'
  link.click()
  URL.revokeObjectURL(url)
}
</script>
