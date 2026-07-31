<template>
  <div class="space-y-6 overflow-x-hidden">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Operacje sieciowe</h1>
        <p class="text-sm text-gray-500">Standardowy widok roboczy dla discovery, importu i zdalnych testów Mikrotik API oraz Dasan SSH.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-lucide-refresh-cw"
          label="Odśwież"
          aria-label="Odśwież wszystkie dane operacji sieciowych"
          @click="refreshAll"
        />
        <UButton
          color="primary"
          icon="i-lucide-download"
          label="Pobierz PIT GML"
          aria-label="Pobierz eksport PIT GML dla węzłów sieciowych"
          @click="downloadPitExport"
        />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <UCard>
        <div class="text-sm text-gray-500">Discovery devices</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ discoveryDevices?.length || 0 }}</div>
        <div class="text-xs text-gray-500 mt-1">gotowe do skanu</div>
      </UCard>
      <UCard>
        <div class="text-sm text-gray-500">Access profiles</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ accessProfiles?.length || 0 }}</div>
        <div class="text-xs text-gray-500 mt-1">profile live-connect</div>
      </UCard>
      <UCard>
        <div class="text-sm text-gray-500">Discovery sessions</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ discoverySessions?.length || 0 }}</div>
        <div class="text-xs text-gray-500 mt-1">aktywna: {{ activeSessionId || 'brak' }}</div>
      </UCard>
      <UCard>
        <div class="text-sm text-gray-500">Zaimportowane urządzenia</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ importedLeases?.length || 0 }}</div>
        <div class="text-xs text-gray-500 mt-1">staging i leasing</div>
      </UCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Profil dostępu do urządzenia</h2>
            <p class="text-sm text-gray-500">Konfiguracja live-connect dla Mikrotika lub Dasana</p>
          </div>
        </template>

        <form class="space-y-4" @submit.prevent="saveAccessProfile">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Urządzenie" required>
              <USelect v-model="accessProfileForm.netDeviceId" :items="deviceOptions" label-key="label" aria-label="Wybierz urządzenie sieciowe" />
            </UFormField>
            <UFormField label="Driver" required>
              <USelect v-model="accessProfileForm.driver" :items="driverOptions" label-key="label" aria-label="Wybierz driver połączenia" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Host" required>
              <UInput v-model="accessProfileForm.host" placeholder="10.0.222.x" aria-label="Adres hosta urządzenia" />
            </UFormField>
            <UFormField label="Port">
              <UInput v-model="accessProfileForm.port" type="number" aria-label="Port połączenia" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Login" required>
              <UInput v-model="accessProfileForm.username" aria-label="Nazwa użytkownika logowania" />
            </UFormField>
            <UFormField label="Hasło" required>
              <UInput v-model="accessProfileForm.password" type="password" aria-label="Hasło użytkownika logowania" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Enable password">
              <UInput v-model="accessProfileForm.enablePassword" type="password" aria-label="Hasło trybu uprzywilejowanego" />
            </UFormField>
            <UFormField label="Mikrotik TLS">
              <USelect v-model="accessProfileForm.useTls" :items="booleanOptions" label-key="label" aria-label="Użyj połączenia TLS Mikrotik" />
            </UFormField>
          </div>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isSavingProfile" label="Zapisz profil" aria-label="Zapisz nowy profil dostępu" />
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

        <UTable :data="accessProfiles || []" :columns="profileColumns">
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
          <template #actions-data="{ row }">
            <div class="flex justify-end">
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-lucide-zap"
                :loading="activeProfileTestId === row.id"
                label="Test połączenia"
                :aria-label="'Przetestuj połączenie dla profilu #' + row.id"
                @click="runProfileTest(row.id)"
              />
            </div>
          </template>
        </UTable>

        <div v-if="profileTestResult" class="mt-4 rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800">
          <div class="font-medium text-gray-900 dark:text-white">
            Test profilu #{{ profileTestResult.profile.id }}: {{ profileTestResult.result.driver }}
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <UBadge :color="profileTestResult.result.ok ? 'green' : 'red'" variant="soft">
              {{ profileTestResult.result.ok ? 'Połączenie OK' : 'Błąd połączenia' }}
            </UBadge>
            <span
              v-for="(value, key) in profileTestResult.result.summary"
              :key="key"
              class="text-gray-500 dark:text-gray-400"
            >
              {{ key }}: <span class="font-medium text-gray-900 dark:text-white">{{ value }}</span>
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Discovery devices</h2>
            <p class="text-sm text-gray-500">Uruchamianie skanów live dla urządzeń szkieletowych</p>
          </div>
        </template>

        <UTable :data="discoveryDevices || []" :columns="deviceColumns">
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
                icon="i-lucide-zap"
                :disabled="!row.readyForDiscovery"
                :loading="activeScanDeviceId === row.id"
                label="Skanuj"
                :aria-label="'Uruchom skanowanie dla urządzenia ' + row.name"
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
              aria-label="Automatyczne tworzenie taryf i subskrypcji podczas auto-importu"
            />
          </div>
        </template>

        <UTable :data="discoverySessions || []" :columns="sessionColumns">
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
                icon="i-lucide-eye"
                :loading="activeSessionId === row.id && isLoadingSessionRecords"
                label="Rekordy"
                :aria-label="'Pokaż rekordy dla sesji discovery #' + row.id"
                @click="loadSessionRecords(row.id)"
              />
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-lucide-download"
                :loading="autoImportingSessionId === row.id"
                label="Auto-import"
                :aria-label="'Uruchom automatyczny import dla sesji #' + row.id"
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

    <div class="grid gap-6 xl:grid-cols-2">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Rekordy sesji</h2>
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

        <UTable :data="sessionRecords" :columns="recordColumns">
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
                icon="i-lucide-arrow-down-circle"
                label="Wybierz"
                :aria-label="'Wybierz rekord ' + (row.hostname || row.macAddress)"
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
            <UFormField label="Klient">
              <USelectMenu v-model="recordImportForm.customerId" :items="customerOptions" value-key="value" label-key="label" searchable aria-label="Przypisz klienta do rekordu" />
            </UFormField>
            <UFormField label="Sieć IP">
              <USelectMenu v-model="recordImportForm.ipNetworkId" :items="ipNetworkOptions" value-key="value" label-key="label" searchable aria-label="Wybierz sieć IP dla rekordu" />
            </UFormField>
          </div>

          <UFormField label="Nazwa / hostname override">
            <UInput v-model="recordImportForm.name" aria-label="Nazwa lub hostname override" />
          </UFormField>

          <UFormField label="Komentarz">
            <UTextarea v-model="recordImportForm.comment" :rows="2" aria-label="Dodatkowy komentarz do importu rekordu" />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :disabled="!selectedRecord"
              :loading="isImportingRecord"
              label="Importuj rekord"
              aria-label="Wykonaj import wybranego rekordu"
            />
          </div>
        </form>
      </UCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Zaimportowane urządzenia</h2>
              <p class="text-sm text-gray-500">Customer-devices po imporcie discovery</p>
            </div>
            <UInput
              v-model="leaseSearch"
              icon="i-lucide-search"
              placeholder="Szukaj IP, MAC, serial..."
              class="w-72"
              aria-label="Wyszukaj zaimportowane urządzenia po adresie IP, MAC lub numerze seryjnym"
            />
          </div>
        </template>

        <UTable :data="importedLeases || []" :columns="leaseColumns" :loading="pendingImportedLeases">
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
              <UButton
                color="gray"
                variant="soft"
                icon="i-lucide-zap"
                label="Readiness"
                :loading="isCheckingDiagnostics"
                aria-label="Uruchom diagnostykę lokalną readiness"
                @click="runDiagnostics"
              />
              <UButton
                color="primary"
                variant="soft"
                icon="i-lucide-signal"
                label="Test zdalny"
                :loading="isRunningRemoteTest"
                aria-label="Uruchom test zdalny na urządzeniu klienta"
                @click="runRemoteTest"
              />
            </div>
          </div>
        </template>

        <UFormField label="Urządzenie klienta">
          <USelectMenu v-model="diagnosticsDeviceId" :items="customerDeviceOptions" value-key="value" label-key="label" searchable aria-label="Wybierz urządzenie klienta do diagnostyki" />
        </UFormField>

        <div v-if="diagnosticsResult" class="mt-4 space-y-3">
          <UBadge :color="diagnosticsResult.ready ? 'green' : 'red'" variant="soft">
            {{ diagnosticsResult.ready ? 'Gotowe lokalnie' : 'Brakuje danych lokalnych' }}
          </UBadge>

          <div class="flex justify-end">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-refresh-cw"
              label="Sync lease"
              :loading="isSyncingLease"
              aria-label="Zsynchronizuj lease urządzenia z serwerem DHCP"
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
            <UFormField label="Klient" required>
              <USelectMenu v-model="leaseForm.customerId" :items="customerOptions" value-key="value" label-key="label" searchable aria-label="Wybierz klienta do ręcznego przypisania" />
            </UFormField>
            <UFormField label="Urządzenie sieciowe">
              <USelectMenu v-model="leaseForm.netDeviceId" :items="deviceOptions" value-key="value" label-key="label" searchable aria-label="Wybierz powiązane urządzenie sieciowe" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Sieć IP">
              <USelectMenu v-model="leaseForm.ipNetworkId" :items="ipNetworkOptions" value-key="value" label-key="label" searchable aria-label="Wybierz podsieć IP" />
            </UFormField>
            <UFormField label="Hostname" required>
              <UInput v-model="leaseForm.hostname" aria-label="Wpisz hostname urządzenia" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Adres IP">
              <UInput v-model="leaseForm.ipAddress" aria-label="Wpisz adres IP urządzenia" />
            </UFormField>
            <UFormField label="MAC">
              <UInput v-model="leaseForm.macAddress" aria-label="Wpisz adres fizyczny MAC urządzenia" />
            </UFormField>
          </div>

          <UFormField label="Komentarz">
            <UTextarea v-model="leaseForm.comment" :rows="2" aria-label="Dodatkowy komentarz dla ręcznego wpisu" />
          </UFormField>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isImportingLease" label="Importuj lease" aria-label="Wykonaj ręczny import lease" />
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
            <UFormField label="Nazwa">
              <UInput v-model="networkForm.name" aria-label="Nazwa podsieci IP" />
            </UFormField>
            <UFormField label="CIDR" required>
              <UInput v-model="networkForm.cidr" placeholder="10.10.200.0/24" aria-label="Zakres CIDR podsieci" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormField label="Gateway">
              <UInput v-model="networkForm.gateway" aria-label="Adres bramy domyślnej podsieci" />
            </UFormField>
            <UFormField label="VLAN">
              <UInput v-model="networkForm.vlanId" type="number" aria-label="Identyfikator VLAN podsieci" />
            </UFormField>
            <UFormField label="Źródłowe urządzenie">
              <USelectMenu v-model="networkForm.deviceId" :items="deviceOptions" value-key="value" label-key="label" searchable aria-label="Wybierz urządzenie źródłowe dla podsieci" />
            </UFormField>
          </div>

          <UFormField label="Komentarz">
            <UTextarea v-model="networkForm.comment" :rows="2" aria-label="Komentarz dla ręcznej sieci" />
          </UFormField>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isImportingNetwork" label="Importuj sieć" aria-label="Wykonaj ręczny import sieci" />
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const toast = useToast()

const leaseSearch = ref('')
const diagnosticsDeviceId = ref('')
const diagnosticsResult = ref(null)
const leaseSyncResult = ref(null)
const remoteTestResult = ref(null)
const activeScanDeviceId = ref(null)
const activeProfileTestId = ref(null)
const activeSessionId = ref(null)
const sessionRecords = ref([])
const selectedRecord = ref(null)
const autoImportingSessionId = ref(null)
const autoImportSummary = ref(null)
const profileTestResult = ref(null)
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
  { label: 'Nie', value: 'false' },
  { label: 'Tak', value: 'true' }
]

const profileColumns = [
  { accessorKey: 'netDeviceId', header: 'Net device' },
  { accessorKey: 'driver', header: 'Driver' },
  { accessorKey: 'host', header: 'Host' },
  { accessorKey: 'port', header: 'Port' },
  { accessorKey: 'hasPassword', header: 'Secret' },
  { accessorKey: 'hasEnablePassword', header: 'Enable' },
  { id: 'actions', header: '' }
]

const deviceColumns = [
  { accessorKey: 'name', header: 'Urządzenie' },
  { accessorKey: 'deviceType', header: 'Typ' },
  { accessorKey: 'managementIp', header: 'Management IP' },
  { accessorKey: 'readyForDiscovery', header: 'Ready' },
  { id: 'actions', header: '' }
]

const sessionColumns = [
  { accessorKey: 'id', header: 'Sesja' },
  { accessorKey: 'driver', header: 'Driver' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'recordCount', header: 'Rekordy' },
  { id: 'actions', header: '' }
]

const recordColumns = [
  { accessorKey: 'recordKind', header: 'Kind' },
  { accessorKey: 'hostname', header: 'Hostname / serial' },
  { accessorKey: 'ipAddress', header: 'IP / CIDR' },
  { accessorKey: 'macAddress', header: 'MAC' },
  { accessorKey: 'recordStatus', header: 'Status' },
  { id: 'actions', header: '' }
]

const leaseColumns = [
  { accessorKey: 'hostname', header: 'Hostname' },
  { accessorKey: 'ipAddress', header: 'IP' },
  { accessorKey: 'macAddress', header: 'MAC' },
  { accessorKey: 'remoteSerialNumber', header: 'Remote serial' },
  { accessorKey: 'netDeviceId', header: 'Net device' }
]

const accessProfileForm = reactive({
  netDeviceId: null,
  driver: 'mikrotik_api',
  host: '',
  port: '',
  username: '',
  password: '',
  enablePassword: '',
  useTls: 'false'
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
  default: () => []
})
const { data: accessProfiles, refresh: refreshAccessProfiles } = await useFetch('/api/v1/network-discovery/access-profiles', {
  default: () => []
})
const { data: discoverySessions, refresh: refreshDiscoverySessions } = await useFetch('/api/v1/network-discovery/sessions', {
  default: () => []
})
const { refresh: refreshPitSync } = await useFetch('/api/v1/pit/sync', {
  method: 'POST',
  server: false
})
const {
  data: importedLeases,
  pending: pendingImportedLeases,
  refresh: refreshImportedLeases
} = await useFetch('/api/v1/network-discovery/imported-leases', {
  query: { q: leaseSearch },
  default: () => []
})
const { data: customers } = await useFetch('/api/v1/customers', {
  query: { limit: 500 },
  default: () => []
})
const { data: ipNetworks } = await useFetch('/api/v1/ip-networks', {
  default: () => []
})
const { data: customerDevices } = await useFetch('/api/v1/customer-devices', {
  query: { limit: 500 },
  default: () => []
})

watch(leaseSearch, () => refreshImportedLeases())

const deviceOptions = computed(() => [
  { label: 'Wybierz urządzenie', value: null },
  ...((discoveryDevices.value || []).map((device) => ({
    label: `${device.name} (#${device.id})`,
    value: device.id
  })))
])

const customerOptions = computed(() => [
  { label: 'Wybierz klienta', value: null },
  ...((customers.value || []).map((customer) => ({
    label: customer.companyName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.customerCode,
    value: customer.id
  })))
])

const ipNetworkOptions = computed(() => [
  { label: 'Wybierz sieć IP', value: null },
  ...((ipNetworks.value || []).map((network) => ({
    label: `${network.name} (${network.cidr})`,
    value: network.id
  })))
])

const customerDeviceOptions = computed(() => [
  { label: 'Wybierz urządzenie klienta', value: null },
  ...((customerDevices.value || []).map((device) => ({
    label: `${device.hostname}${device.ipAddress ? ` · ${device.ipAddress}` : ''}`,
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
  try {
    await Promise.all([
      refreshDiscoveryDevices(),
      refreshAccessProfiles(),
      refreshDiscoverySessions(),
      refreshPitSync(),
      refreshImportedLeases()
    ])
    toast.add({
      title: 'Odświeżono dane',
      description: 'Pomyślnie zsynchronizowano i odświeżono informacje o operacjach sieciowych.',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Błąd odświeżania',
      description: err.message || 'Wystąpił problem podczas odświeżania danych.',
      color: 'error'
    })
  }
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
        useTls: accessProfileForm.useTls === 'true'
      }
    })

    toast.add({
      title: 'Zapisano profil',
      description: `Profil dostępu dla urządzenia na hoście ${accessProfileForm.host} został zapisany.`,
      color: 'success'
    })

    Object.assign(accessProfileForm, {
      netDeviceId: null,
      driver: 'mikrotik_api',
      host: '',
      port: '',
      username: '',
      password: '',
      enablePassword: '',
      useTls: 'false'
    })

    await Promise.all([
      refreshDiscoveryDevices(),
      refreshAccessProfiles()
    ])
  } catch (err) {
    toast.add({
      title: 'Błąd zapisu',
      description: err.data?.message || err.message || 'Nie udało się zapisać profilu dostępu.',
      color: 'error'
    })
  } finally {
    isSavingProfile.value = false
  }
}

const runScan = async (deviceId) => {
  activeScanDeviceId.value = deviceId
  const deviceName = (discoveryDevices.value || []).find((d) => d.id === deviceId)?.name || `#${deviceId}`
  try {
    const result = await $fetch(`/api/v1/network-discovery/scan/${deviceId}`, {
      method: 'POST'
    })
    activeSessionId.value = result.session.id
    sessionRecords.value = result.records
    selectedRecord.value = null

    toast.add({
      title: 'Skanowanie zakończone',
      description: `Skanowanie urządzenia ${deviceName} zakończyło się sukcesem. Sesja: #${result.session.id}.`,
      color: 'success'
    })

    await Promise.all([
      refreshDiscoverySessions(),
      refreshImportedLeases()
    ])
  } catch (err) {
    toast.add({
      title: 'Błąd skanowania',
      description: err.data?.message || err.message || 'Nie udało się ukończyć skanowania live.',
      color: 'error'
    })
  } finally {
    activeScanDeviceId.value = null
  }
}

const runProfileTest = async (profileId) => {
  activeProfileTestId.value = profileId
  try {
    const result = await $fetch(`/api/v1/network-discovery/access-profiles/${profileId}/test`, {
      method: 'POST'
    })
    profileTestResult.value = result

    if (result.result?.ok) {
      toast.add({
        title: 'Test połączenia udany',
        description: `Profil #${profileId} pomyślnie połączył się z urządzeniem.`,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Test połączenia nieudany',
        description: `Brak połączenia dla profilu #${profileId}.`,
        color: 'warning'
      })
    }
  } catch (err) {
    toast.add({
      title: 'Błąd testu połączenia',
      description: err.data?.message || err.message || 'Wystąpił nieoczekiwany błąd podczas testu połączenia.',
      color: 'error'
    })
  } finally {
    activeProfileTestId.value = null
  }
}

const loadSessionRecords = async (sessionId) => {
  activeSessionId.value = sessionId
  isLoadingSessionRecords.value = true
  try {
    const records = await $fetch(`/api/v1/network-discovery/sessions/${sessionId}/records`)
    sessionRecords.value = records
    selectedRecord.value = null

    toast.add({
      title: 'Rekordy sesji wczytane',
      description: `Wczytano ${records.length} rekordów dla sesji #${sessionId}.`,
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Błąd wczytywania rekordów',
      description: err.data?.message || err.message || 'Nie udało się pobrać rekordów sesji.',
      color: 'error'
    })
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

    toast.add({
      title: 'Auto-import zakończony',
      description: `Zaimportowano pomyślnie ${result.summary.importedCustomerDevices} urządzeń oraz ${result.summary.createdCustomers} klientów.`,
      color: 'success'
    })

    await loadSessionRecords(sessionId)
    await Promise.all([
      refreshImportedLeases(),
      refreshDiscoverySessions()
    ])
  } catch (err) {
    toast.add({
      title: 'Błąd auto-importu',
      description: err.data?.message || err.message || 'Automatyczny import sesji zakończył się niepowodzeniem.',
      color: 'error'
    })
  } finally {
    autoImportingSessionId.value = null
  }
}

const selectRecord = (record) => {
  selectedRecord.value = record
  recordImportForm.name = record.hostname || ''
  toast.add({
    title: 'Wybrano rekord',
    description: `Rekord ${record.recordKind} z hostem ${record.hostname || 'n/a'} jest gotowy do importu.`,
    color: 'neutral'
  })
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

    toast.add({
      title: 'Rekord zaimportowany',
      description: `Pomyślnie zaimportowano rekord jako ${recordImportForm.name || 'nowe urządzenie'}.`,
      color: 'success'
    })

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
  } catch (err) {
    toast.add({
      title: 'Błąd importu rekordu',
      description: err.data?.message || err.message || 'Nie udało się zaimportować wybranego rekordu.',
      color: 'error'
    })
  } finally {
    isImportingRecord.value = false
  }
}

const importLease = async () => {
  isImportingLease.value = true
  const leaseHost = leaseForm.hostname
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

    toast.add({
      title: 'Zaimportowano lease',
      description: `Ręczny lease dla ${leaseHost} został pomyślnie zaimportowany.`,
      color: 'success'
    })

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
  } catch (err) {
    toast.add({
      title: 'Błąd importu lease',
      description: err.data?.message || err.message || 'Ręczny import lease zakończył się niepowodzeniem.',
      color: 'error'
    })
  } finally {
    isImportingLease.value = false
  }
}

const importNetwork = async () => {
  isImportingNetwork.value = true
  const cidr = networkForm.cidr
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

    toast.add({
      title: 'Sieć zaimportowana',
      description: `Sieć ${cidr} została pomyślnie zapisana.`,
      color: 'success'
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
  } catch (err) {
    toast.add({
      title: 'Błąd importu sieci',
      description: err.data?.message || err.message || 'Ręczny import sieci nie powiódł się.',
      color: 'error'
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
    leaseSyncResult.value = null
    remoteTestResult.value = null
    const result = await $fetch(`/api/v1/diagnostics/check/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
    diagnosticsResult.value = result

    toast.add({
      title: 'Diagnostyka zakończona',
      description: result.ready ? 'Urządzenie jest gotowe i zweryfikowane lokalnie.' : 'Wykryto brakujące dane w diagnostyce lokalnej.',
      color: result.ready ? 'success' : 'warning'
    })
  } catch (err) {
    toast.add({
      title: 'Błąd diagnostyki',
      description: err.data?.message || err.message || 'Nie udało się przeprowadzić testu readiness.',
      color: 'error'
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
    const result = await $fetch(`/api/v1/diagnostics/remote-test/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
    remoteTestResult.value = result

    if (result.remoteDiagnostics?.ok) {
      toast.add({
        title: 'Test zdalny OK',
        description: 'Urządzenie pomyślnie przeszło wszystkie testy zdalne.',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Test zdalny nieudany',
        description: 'Wykryto problemy podczas komunikacji lub konfiguracji urządzenia.',
        color: 'warning'
      })
    }
  } catch (err) {
    toast.add({
      title: 'Błąd testu zdalnego',
      description: err.data?.message || err.message || 'Wystąpił problem podczas zdalnego testowania.',
      color: 'error'
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
    const result = await $fetch(`/api/v1/diagnostics/sync-lease/${diagnosticsDeviceId.value}`, {
      method: 'POST'
    })
    leaseSyncResult.value = result

    toast.add({
      title: result.synced ? 'Zsynchronizowano lease' : 'Brak zmian lease',
      description: result.synced ? 'Pomyślnie zsynchronizowano dzierżawę z serwerem DHCP.' : (result.reason || 'Dane dzierżawy DHCP są aktualne.'),
      color: result.synced ? 'success' : 'neutral'
    })

    await refreshImportedLeases()
  } catch (err) {
    toast.add({
      title: 'Błąd synchronizacji lease',
      description: err.data?.message || err.message || 'Nie udało się zsynchronizować dzierżawy.',
      color: 'error'
    })
  } finally {
    isSyncingLease.value = false
  }
}

const downloadPitExport = async () => {
  try {
    const blob = await $fetch('/api/v1/pit/export/nodes', { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pit-net-nodes.gml'
    link.click()
    URL.revokeObjectURL(url)

    toast.add({
      title: 'Pobieranie rozpoczęte',
      description: 'Plik eksportu PIT GML (pit-net-nodes.gml) został pomyślnie pobrany.',
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: 'Błąd pobierania',
      description: err.message || 'Nie udało się wygenerować ani pobrać pliku eksportu GML.',
      color: 'error'
    })
  }
}

const applyRoutePrefill = () => {
  const candidate = route.query.deviceId
  if (typeof candidate === 'string' && candidate.trim()) {
    diagnosticsDeviceId.value = Number(candidate)
  }
}

watch(() => route.query.deviceId, () => {
  applyRoutePrefill()
})

onMounted(async () => {
  applyRoutePrefill()
  await refreshAll()
})
</script>
