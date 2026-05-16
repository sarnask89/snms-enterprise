<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Operacje sieciowe</h1>
        <p class="text-sm text-gray-500">Live discovery, import i zdalne testy dla Mikrotik API oraz Dasan SSH</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
        <UButton color="primary" icon="i-heroicons-arrow-down-tray" label="Pobierz PIT GML" @click="downloadPitExport" />
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Discovery devices</div>
        <div class="text-2xl font-bold">{{ discoveryDevices?.length || 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Access profiles</div>
        <div class="text-2xl font-bold">{{ accessProfiles?.length || 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Discovery sessions</div>
        <div class="text-2xl font-bold">{{ discoverySessions?.length || 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Zaimportowane urządzenia</div>
        <div class="text-2xl font-bold">{{ importedLeases?.length || 0 }}</div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Profil dostępu do urządzenia</h2>
            <p class="text-sm text-gray-500">Konfiguracja live-connect dla Mikrotika lub Dasana</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="saveAccessProfile">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Urządzenie" required>
              <USelect v-model="accessProfileForm.netDeviceId" :options="deviceOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Driver" required>
              <USelect v-model="accessProfileForm.driver" :options="driverOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Host" required>
              <UInput v-model="accessProfileForm.host" placeholder="10.0.222.x" />
            </UFormGroup>
            <UFormGroup label="Port">
              <UInput v-model="accessProfileForm.port" type="number" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Login" required>
              <UInput v-model="accessProfileForm.username" />
            </UFormGroup>
            <UFormGroup label="Hasło" required>
              <UInput v-model="accessProfileForm.password" type="password" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Enable password">
              <UInput v-model="accessProfileForm.enablePassword" type="password" />
            </UFormGroup>
            <UFormGroup label="Mikrotik TLS">
              <USelect v-model="accessProfileForm.useTls" :options="booleanOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isSavingProfile" label="Zapisz profil" />
          </div>
        </form>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Aktywne profile</h2>
            <p class="text-sm text-gray-500">Zapisane profile dostępu używane przez skany live</p>
          </div>
        </template>

        <UTable :rows="accessProfiles || []" :columns="profileColumns">
          <template #hasPassword-data="{ row }">
            <UBadge :color="row.hasPassword ? 'green' : 'gray'" variant="soft">
              {{ row.hasPassword ? 'has secret' : 'missing' }}
            </UBadge>
          </template>
          <template #hasEnablePassword-data="{ row }">
            <UBadge :color="row.hasEnablePassword ? 'green' : 'gray'" variant="soft">
              {{ row.hasEnablePassword ? 'yes' : 'no' }}
            </UBadge>
          </template>
        </UTable>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Discovery devices</h2>
            <p class="text-sm text-gray-500">Uruchamianie skanów live dla urządzeń szkieletowych</p>
          </div>
        </template>

        <UTable :rows="discoveryDevices || []" :columns="deviceColumns">
          <template #readyForDiscovery-data="{ row }">
            <UBadge :color="row.readyForDiscovery ? 'green' : 'amber'" variant="soft">
              {{ row.readyForDiscovery ? 'ready' : 'needs profile' }}
            </UBadge>
          </template>
          <template #actions-data="{ row }">
            <div class="flex justify-end">
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-heroicons-bolt"
                :disabled="!row.readyForDiscovery"
                :loading="activeScanDeviceId === row.id"
                label="Skanuj"
                @click="runScan(row.id)"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div class="space-y-3">
            <div>
              <h2 class="font-semibold text-lg">Sesje discovery</h2>
              <p class="text-sm text-gray-500">Ostatnie skany i ich rekordy stagingowe</p>
            </div>
            <UCheckbox
              v-model="autoImportOptions.importTariffsAndSubscriptions"
              label="Auto-import ma tworzyć też taryfy i subskrypcje z rate-limit DHCP"
            />
          </div>
        </template>

        <UTable :rows="discoverySessions || []" :columns="sessionColumns">
          <template #status-data="{ row }">
            <UBadge :color="row.status === 'succeeded' ? 'green' : row.status === 'failed' ? 'red' : 'amber'" variant="soft">
              {{ row.status }}
            </UBadge>
          </template>
          <template #actions-data="{ row }">
            <div class="flex justify-end gap-2">
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-heroicons-eye"
                :loading="activeSessionId === row.id && isLoadingSessionRecords"
                label="Rekordy"
                @click="loadSessionRecords(row.id)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-heroicons-arrow-down-tray"
                :loading="autoImportingSessionId === row.id"
                label="Auto-import"
                @click="runAutoImport(row.id)"
              />
            </div>
          </template>
        </UTable>

        <div v-if="autoImportSummary" class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2">
          <div class="font-medium text-gray-900 dark:text-white">
            Wynik auto-importu sesji #{{ autoImportSummary.sessionId }}
          </div>
          <div class="grid md:grid-cols-3 gap-2">
            <div>Urządzenia: <span class="font-medium">{{ autoImportSummary.summary.importedCustomerDevices }}</span></div>
            <div>Klienci: <span class="font-medium">{{ autoImportSummary.summary.createdCustomers }}</span></div>
            <div>Auto-generated: <span class="font-medium">{{ autoImportSummary.summary.autoGeneratedCustomers }}</span></div>
            <div>Taryfy: <span class="font-medium">{{ autoImportSummary.summary.createdTariffs }}</span></div>
            <div>Subskrypcje: <span class="font-medium">{{ autoImportSummary.summary.createdSubscriptions }}</span></div>
            <div>Pominięte rekordy: <span class="font-medium">{{ autoImportSummary.summary.skippedRecords }}</span></div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Rekordy ostatniej sesji</h2>
            <p class="text-sm text-gray-500">Staging rekordów z live discovery przed importem</p>
          </div>
        </template>

        <div class="mb-4 flex items-center justify-between gap-4">
          <div class="text-sm text-gray-500">
            Aktywna sesja: <span class="font-medium">{{ activeSessionId || 'brak' }}</span>
          </div>
          <div v-if="selectedRecord" class="text-sm text-gray-500">
            Wybrany rekord: <span class="font-medium">{{ selectedRecord.recordKind }} #{{ selectedRecord.id }}</span>
          </div>
        </div>

        <UTable :rows="sessionRecords" :columns="recordColumns">
          <template #recordStatus-data="{ row }">
            <UBadge :color="row.recordStatus === 'active' || row.recordStatus === 'bound' ? 'green' : 'gray'" variant="soft">
              {{ row.recordStatus || 'n/a' }}
            </UBadge>
          </template>
          <template #actions-data="{ row }">
            <div class="flex justify-end">
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-heroicons-arrow-down-circle"
                label="Wybierz"
                @click="selectRecord(row)"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Import wybranego rekordu</h2>
            <p class="text-sm text-gray-500">Import do customer-devices albo ip-networks</p>
          </div>
        </template>

        <div class="mb-4 text-sm text-gray-500">
          {{ selectedRecord ? `Wybrano ${selectedRecord.recordKind} #${selectedRecord.id}` : 'Najpierw wybierz rekord z tabeli obok.' }}
        </div>

        <form class="space-y-4" @submit.prevent="importSelectedRecord">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="ID klienta">
              <UInput v-model="recordImportForm.customerId" type="number" />
            </UFormGroup>
            <UFormGroup label="ID sieci IP">
              <UInput v-model="recordImportForm.ipNetworkId" type="number" />
            </UFormGroup>
          </div>

          <UFormGroup label="Nazwa / hostname override">
            <UInput v-model="recordImportForm.name" />
          </UFormGroup>

          <UFormGroup label="Komentarz">
            <UTextarea v-model="recordImportForm.comment" :rows="2" />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :disabled="!selectedRecord"
              :loading="isImportingRecord"
              label="Importuj rekord"
            />
          </div>
        </form>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Zaimportowane urządzenia</h2>
              <p class="text-sm text-gray-500">Customer-devices po imporcie discovery</p>
            </div>
            <UInput v-model="leaseSearch" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Szukaj IP, MAC, serial..." class="w-72" />
          </div>
        </template>

        <UTable :rows="importedLeases || []" :columns="leaseColumns" :loading="pendingImportedLeases">
          <template #ipAddress-data="{ row }">
            <span class="font-mono text-sm">{{ row.ipAddress || 'n/a' }}</span>
          </template>
          <template #remoteSerialNumber-data="{ row }">
            <span class="font-mono text-sm">{{ row.remoteSerialNumber || 'n/a' }}</span>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Diagnostyka lokalna i zdalna</h2>
              <p class="text-sm text-gray-500">Readiness, sync lease i live test z urządzenia dostępowego</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton color="gray" variant="soft" icon="i-heroicons-bolt" label="Readiness" :loading="isCheckingDiagnostics" @click="runDiagnostics" />
              <UButton color="primary" variant="soft" icon="i-heroicons-signal" label="Test zdalny" :loading="isRunningRemoteTest" @click="runRemoteTest" />
            </div>
          </div>
        </template>

        <UFormGroup label="Customer device ID">
          <UInput v-model="diagnosticsDeviceId" type="number" placeholder="np. 1" />
        </UFormGroup>

        <div v-if="diagnosticsResult" class="mt-4 space-y-3">
          <UBadge :color="diagnosticsResult.ready ? 'green' : 'red'" variant="soft">
            {{ diagnosticsResult.ready ? 'Gotowe lokalnie' : 'Brakuje danych lokalnych' }}
          </UBadge>

          <div class="flex justify-end">
            <UButton
              color="primary"
              variant="soft"
              icon="i-heroicons-arrow-path-rounded-square"
              label="Sync lease"
              :loading="isSyncingLease"
              @click="syncLease"
            />
          </div>

          <div class="space-y-2">
            <div v-for="check in diagnosticsResult.checks" :key="check.key" class="flex items-center justify-between gap-4 text-sm">
              <span>{{ check.label }}</span>
              <UBadge :color="check.ok ? 'green' : check.severity === 'blocking' ? 'red' : 'amber'" variant="soft">
                {{ check.ok ? 'OK' : check.severity }}
              </UBadge>
            </div>
          </div>
        </div>

        <div v-if="leaseSyncResult" class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-1">
          <div class="font-medium text-gray-900 dark:text-white">Wynik sync lease</div>
          <div>Status: <span class="font-medium">{{ leaseSyncResult.synced ? 'zsynchronizowano' : 'bez zmian' }}</span></div>
          <div v-if="leaseSyncResult.reason" class="text-gray-500">Powód: {{ leaseSyncResult.reason }}</div>
        </div>

        <div v-if="remoteTestResult" class="mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm space-y-2">
          <div class="font-medium text-gray-900 dark:text-white">
            Remote test: {{ remoteTestResult.remoteDiagnostics.driver }}
          </div>
          <UBadge :color="remoteTestResult.remoteDiagnostics.ok ? 'green' : 'red'" variant="soft">
            {{ remoteTestResult.remoteDiagnostics.ok ? 'PASS' : 'FAIL' }}
          </UBadge>
          <div v-for="check in remoteTestResult.remoteDiagnostics.checks" :key="check.key" class="flex items-center justify-between gap-4">
            <span>{{ check.label }}</span>
            <UBadge :color="check.ok ? 'green' : check.severity === 'blocking' ? 'red' : 'amber'" variant="soft">
              {{ check.ok ? 'OK' : check.severity }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Ręczny import lease</h2>
            <p class="text-sm text-gray-500">Fallback dla ręcznych wpisów spoza live discovery</p>
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
            <h2 class="font-semibold text-lg">Ręczny import sieci</h2>
            <p class="text-sm text-gray-500">Fallback dla ręcznego zapisu podsieci</p>
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
  </div>
</template>

<script setup>
const leaseSearch = ref('')
const diagnosticsDeviceId = ref('')
const diagnosticsResult = ref(null)
const leaseSyncResult = ref(null)
const remoteTestResult = ref(null)
const activeScanDeviceId = ref(null)
const activeSessionId = ref(null)
const sessionRecords = ref([])
const selectedRecord = ref(null)
const autoImportingSessionId = ref(null)
const autoImportSummary = ref(null)
const isImportingLease = ref(false)
const isImportingNetwork = ref(false)
const isSavingProfile = ref(false)
const isImportingRecord = ref(false)
const isCheckingDiagnostics = ref(false)
const isRunningRemoteTest = ref(false)
const isSyncingLease = ref(false)
const isLoadingSessionRecords = ref(false)

const driverOptions = [
  { label: 'Mikrotik API', value: 'mikrotik_api' },
  { label: 'Dasan SSH', value: 'dasan_ssh' }
]

const booleanOptions = [
  { label: 'Nie', value: false },
  { label: 'Tak', value: true }
]

const profileColumns = [
  { key: 'netDeviceId', label: 'Net device' },
  { key: 'driver', label: 'Driver' },
  { key: 'host', label: 'Host' },
  { key: 'port', label: 'Port' },
  { key: 'hasPassword', label: 'Secret' },
  { key: 'hasEnablePassword', label: 'Enable' }
]

const deviceColumns = [
  { key: 'name', label: 'Urządzenie' },
  { key: 'deviceType', label: 'Typ' },
  { key: 'managementIp', label: 'Management IP' },
  { key: 'readyForDiscovery', label: 'Ready' },
  { key: 'actions', label: '' }
]

const sessionColumns = [
  { key: 'id', label: 'Sesja' },
  { key: 'driver', label: 'Driver' },
  { key: 'status', label: 'Status' },
  { key: 'recordCount', label: 'Rekordy' },
  { key: 'actions', label: '' }
]

const recordColumns = [
  { key: 'recordKind', label: 'Kind' },
  { key: 'hostname', label: 'Hostname / serial' },
  { key: 'ipAddress', label: 'IP / CIDR' },
  { key: 'macAddress', label: 'MAC' },
  { key: 'recordStatus', label: 'Status' },
  { key: 'actions', label: '' }
]

const leaseColumns = [
  { key: 'hostname', label: 'Hostname' },
  { key: 'ipAddress', label: 'IP' },
  { key: 'macAddress', label: 'MAC' },
  { key: 'remoteSerialNumber', label: 'Remote serial' },
  { key: 'netDeviceId', label: 'Net device' }
]

const accessProfileForm = reactive({
  netDeviceId: null,
  driver: 'mikrotik_api',
  host: '',
  port: '',
  username: '',
  password: '',
  enablePassword: '',
  useTls: false
})

const recordImportForm = reactive({
  customerId: '',
  ipNetworkId: '',
  name: '',
  comment: ''
})

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

const autoImportOptions = reactive({
  importTariffsAndSubscriptions: true
})

const { data: discoveryDevices, refresh: refreshDiscoveryDevices } = await useFetch('/api/v1/network-discovery/devices', {
  server: false
})
const { data: accessProfiles, refresh: refreshAccessProfiles } = await useFetch('/api/v1/network-discovery/access-profiles', {
  server: false
})
const { data: discoverySessions, refresh: refreshDiscoverySessions } = await useFetch('/api/v1/network-discovery/sessions', {
  server: false
})
const { data: pitSync, refresh: refreshPitSync } = await useFetch('/api/v1/pit/sync', {
  method: 'POST',
  server: false
})
const {
  data: importedLeases,
  pending: pendingImportedLeases,
  refresh: refreshImportedLeases
} = await useFetch('/api/v1/network-discovery/imported-leases', {
  query: { q: leaseSearch },
  server: false
})

watch(leaseSearch, () => refreshImportedLeases())

const deviceOptions = computed(() => [
  { label: 'Wybierz urządzenie', value: null },
  ...((discoveryDevices.value || []).map((device) => ({
    label: `${device.name} (#${device.id})`,
    value: device.id
  })))
])

watch(() => accessProfileForm.netDeviceId, (netDeviceId) => {
  const selected = (discoveryDevices.value || []).find((device) => device.id === netDeviceId)
  if (!selected) {
    return
  }

  accessProfileForm.host = selected.managementIp || accessProfileForm.host
  if (String(selected.deviceType || '').toLowerCase().includes('dasan')) {
    accessProfileForm.driver = 'dasan_ssh'
    if (!accessProfileForm.port) {
      accessProfileForm.port = 22502
    }
  } else if (String(selected.deviceType || '').toLowerCase().includes('mikrotik') || String(selected.deviceType || '').toLowerCase().includes('router')) {
    accessProfileForm.driver = 'mikrotik_api'
    if (!accessProfileForm.port) {
      accessProfileForm.port = 8728
    }
  }
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
    refreshDiscoveryDevices(),
    refreshAccessProfiles(),
    refreshDiscoverySessions(),
    refreshPitSync(),
    refreshImportedLeases()
  ])
}

const saveAccessProfile = async () => {
  isSavingProfile.value = true
  try {
    await $fetch('/api/v1/network-discovery/access-profiles', {
      method: 'POST',
      body: {
        netDeviceId: asNumberOrNull(accessProfileForm.netDeviceId),
        driver: accessProfileForm.driver,
        host: accessProfileForm.host,
        port: asNumberOrNull(accessProfileForm.port),
        username: accessProfileForm.username,
        password: accessProfileForm.password,
        enablePassword: accessProfileForm.enablePassword || null,
        useTls: accessProfileForm.useTls
      }
    })

    Object.assign(accessProfileForm, {
      netDeviceId: null,
      driver: 'mikrotik_api',
      host: '',
      port: '',
      username: '',
      password: '',
      enablePassword: '',
      useTls: false
    })

    await Promise.all([
      refreshDiscoveryDevices(),
      refreshAccessProfiles()
    ])
  } finally {
    isSavingProfile.value = false
  }
}

const runScan = async (deviceId) => {
  activeScanDeviceId.value = deviceId
  try {
    const result = await $fetch(`/api/v1/network-discovery/scan/${deviceId}`, {
      method: 'POST'
    })
    activeSessionId.value = result.session.id
    sessionRecords.value = result.records
    selectedRecord.value = null
    await Promise.all([
      refreshDiscoverySessions(),
      refreshImportedLeases()
    ])
  } finally {
    activeScanDeviceId.value = null
  }
}

const loadSessionRecords = async (sessionId) => {
  activeSessionId.value = sessionId
  isLoadingSessionRecords.value = true
  try {
    sessionRecords.value = await $fetch(`/api/v1/network-discovery/sessions/${sessionId}/records`)
    selectedRecord.value = null
  } finally {
    isLoadingSessionRecords.value = false
  }
}

const runAutoImport = async (sessionId) => {
  autoImportingSessionId.value = sessionId
  try {
    const result = await $fetch(`/api/v1/network-discovery/sessions/${sessionId}/auto-import`, {
      method: 'POST',
      body: {
        importTariffsAndSubscriptions: autoImportOptions.importTariffsAndSubscriptions
      }
    })

    autoImportSummary.value = {
      sessionId,
      summary: result.summary
    }
    await loadSessionRecords(sessionId)
    await Promise.all([
      refreshImportedLeases(),
      refreshDiscoverySessions()
    ])
  } finally {
    autoImportingSessionId.value = null
  }
}

const selectRecord = (record) => {
  selectedRecord.value = record
  recordImportForm.name = record.hostname || ''
}

const importSelectedRecord = async () => {
  if (!selectedRecord.value) {
    return
  }

  isImportingRecord.value = true
  try {
    const result = await $fetch(`/api/v1/network-discovery/import-record/${selectedRecord.value.id}`, {
      method: 'POST',
      body: {
        customerId: asNumberOrNull(recordImportForm.customerId),
        ipNetworkId: asNumberOrNull(recordImportForm.ipNetworkId),
        name: recordImportForm.name || null,
        comment: recordImportForm.comment || null
      }
    })

    if (result.customerDevice?.id) {
      diagnosticsDeviceId.value = String(result.customerDevice.id)
      diagnosticsResult.value = result.diagnostics
      remoteTestResult.value = null
    }

    Object.assign(recordImportForm, {
      customerId: '',
      ipNetworkId: '',
      name: '',
      comment: ''
    })

    await Promise.all([
      refreshImportedLeases(),
      refreshPitSync()
    ])
  } finally {
    isImportingRecord.value = false
  }
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
    leaseSyncResult.value = null
    remoteTestResult.value = null
    Object.assign(leaseForm, {
      customerId: '',
      netDeviceId: '',
      ipNetworkId: '',
      hostname: '',
      ipAddress: '',
      macAddress: '',
      comment: ''
    })
    await Promise.all([
      refreshImportedLeases(),
      refreshPitSync()
    ])
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
    await refreshPitSync()
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
    leaseSyncResult.value = null
    remoteTestResult.value = null
    diagnosticsResult.value = await $fetch(`/api/v1/diagnostics/check/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
  } finally {
    isCheckingDiagnostics.value = false
  }
}

const runRemoteTest = async () => {
  if (!diagnosticsDeviceId.value) {
    return
  }

  isRunningRemoteTest.value = true
  try {
    remoteTestResult.value = await $fetch(`/api/v1/diagnostics/remote-test/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
  } finally {
    isRunningRemoteTest.value = false
  }
}

const syncLease = async () => {
  if (!diagnosticsDeviceId.value) {
    return
  }

  isSyncingLease.value = true
  try {
    leaseSyncResult.value = await $fetch(`/api/v1/diagnostics/sync-lease/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
    await refreshImportedLeases()
  } finally {
    isSyncingLease.value = false
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

onMounted(async () => {
  await refreshAll()
})
</script>
