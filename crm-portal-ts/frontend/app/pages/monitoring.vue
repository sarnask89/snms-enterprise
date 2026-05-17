<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monitoring runtime</h1>
        <p class="text-sm text-gray-500">Lokalny monitoring urządzeń i ruchu na aktywnym backendzie TS.</p>
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Devices</div>
        <div class="text-2xl font-bold">{{ summary?.totalDevices ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Online</div>
        <div class="text-2xl font-bold">{{ summary?.onlineDevices ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Offline</div>
        <div class="text-2xl font-bold">{{ summary?.offlineDevices ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Maintenance</div>
        <div class="text-2xl font-bold">{{ summary?.maintenanceDevices ?? 0 }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Customer devices</div>
        <div class="text-2xl font-bold">{{ summary?.customerDevices ?? 0 }}</div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Urządzenia sieciowe</h2>
            <p class="text-sm text-gray-500">Wybierz urządzenie, żeby pobrać lokalną serię CPU i throughput.</p>
          </div>
        </template>

        <div class="space-y-4">
          <USelectMenu
            v-model="selectedNetDeviceId"
            :items="deviceOptions"
            value-key="value"
            label-key="label"
            placeholder="Wybierz urządzenie"
          />
          <UButton color="primary" :loading="isLoadingDeviceStats" label="Pobierz statystyki urządzenia" @click="loadDeviceStats" />

          <div v-if="deviceStats" class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2">
            <div>Samples: {{ deviceStats.labels.length }}</div>
            <div>CPU last: {{ deviceStats.datasets[0]?.data?.[deviceStats.datasets[0].data.length - 1] ?? 0 }}</div>
            <div>Traffic in last: {{ deviceStats.datasets[1]?.data?.[deviceStats.datasets[1].data.length - 1] ?? 0 }} Mbps</div>
            <div>Traffic out last: {{ deviceStats.datasets[2]?.data?.[deviceStats.datasets[2].data.length - 1] ?? 0 }} Mbps</div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Urządzenia klienta</h2>
            <p class="text-sm text-gray-500">Read-only seria ruchu dla importowanych i lokalnych urządzeń klienta.</p>
          </div>
        </template>

        <div class="space-y-4">
          <UInput v-model="customerDeviceId" type="number" placeholder="ID urządzenia klienta" />
          <UButton color="primary" variant="soft" :loading="isLoadingCustomerStats" label="Pobierz statystyki klienta" @click="loadCustomerStats" />

          <div v-if="customerStats" class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2">
            <div>Samples: {{ customerStats.labels.length }}</div>
            <div>Inbound last: {{ customerStats.in_mbps[customerStats.in_mbps.length - 1] ?? 0 }} Mbps</div>
            <div>Outbound last: {{ customerStats.out_mbps[customerStats.out_mbps.length - 1] ?? 0 }} Mbps</div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Global traffic</h2>
            <p class="text-sm text-gray-500">Zagregowany lokalny throughput dla całego runtime.</p>
          </div>
        </template>

        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm space-y-2">
          <div>Samples: {{ globalStats?.labels?.length ?? 0 }}</div>
          <div>Last throughput: {{ globalStats?.total_mbps?.[globalStats.total_mbps.length - 1] ?? 0 }} Mbps</div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Recent events</h2>
            <p class="text-sm text-gray-500">Ostatnie zdarzenia operacyjne z audytu.</p>
          </div>
        </template>

        <UTable :data="summary?.recentEvents || []" :columns="eventColumns" />
      </UCard>
    </div>
  </div>
</template>

<script setup>
const selectedNetDeviceId = ref(null)
const customerDeviceId = ref('')
const deviceStats = ref(null)
const customerStats = ref(null)
const isLoadingDeviceStats = ref(false)
const isLoadingCustomerStats = ref(false)

const eventColumns = [
  { accessorKey: 'action', header: 'Akcja' },
  { accessorKey: 'resourceType', header: 'Typ' },
  { accessorKey: 'details', header: 'Szczegóły' }
]

const { data: summary, refresh: refreshSummary } = await useFetch('/api/v1/monitoring/summary')
const { data: globalStats, refresh: refreshGlobalStats } = await useFetch('/api/v1/monitoring/global/stats')

const deviceOptions = computed(() => {
  return (summary.value?.devices || []).map((device) => ({
    value: device.id,
    header: `${device.name} (${device.status})`
  }))
})

const refreshAll = async () => {
  await Promise.all([
    refreshSummary(),
    refreshGlobalStats()
  ])
}

const loadDeviceStats = async () => {
  if (!selectedNetDeviceId.value) {
    return
  }

  isLoadingDeviceStats.value = true
  try {
    deviceStats.value = await $fetch(`/api/v1/monitoring/devices/${selectedNetDeviceId.value}/stats`)
  } finally {
    isLoadingDeviceStats.value = false
  }
}

const loadCustomerStats = async () => {
  if (!customerDeviceId.value) {
    return
  }

  isLoadingCustomerStats.value = true
  try {
    customerStats.value = await $fetch(`/api/v1/monitoring/customer-devices/${customerDeviceId.value}/stats`)
  } finally {
    isLoadingCustomerStats.value = false
  }
}
</script>
