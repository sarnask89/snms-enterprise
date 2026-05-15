<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dzień dobry!</h1>
      <p class="text-sm text-gray-500">Oto podsumowanie stanu Twojej sieci i firmy.</p>
    </div>

    <StatsGrid :stats="statsItems" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Ostatni Abonenci</h3>
            <UButton to="/customers" label="Wszyscy" variant="ghost" size="xs" icon="i-heroicons-arrow-right" trailing />
          </div>
        </template>

        <UTable :rows="recentCustomers" :columns="columns">
          <template #status-data="{ row }">
            <UBadge :color="row.status === 'active' ? 'emerald' : 'gray'" variant="soft">
              {{ row.status }}
            </UBadge>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-bold">Szybkie Akcje</h3>
        </template>
        <div class="space-y-3">
          <UButton label="Dodaj Abonenta" icon="i-heroicons-user-plus" block color="primary" />
          <UButton label="Wystaw Fakturę" icon="i-heroicons-document-plus" block color="gray" variant="soft" />
          <UButton label="Mapa Sieci" icon="i-heroicons-map" block color="gray" variant="soft" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { data: stats } = await useFetch('/api/v2/dashboard/stats')
const { data: recentCustomers } = await useFetch('/api/v2/customers?limit=5')

const statsItems = computed(() => [
  { label: 'Abonenci', value: stats.value?.customers || 0, icon: 'i-heroicons-users', color: 'blue' },
  { label: 'Węzły', value: stats.value?.nodes || 0, icon: 'i-heroicons-map-pin', color: 'emerald' },
  { label: 'Urządzenia', value: stats.value?.devices || 0, icon: 'i-heroicons-cpu-chip', color: 'indigo' },
  { label: 'Zgłoszenia', value: stats.value?.tickets || 0, icon: 'i-heroicons-ticket', color: 'orange' }
])

const columns = [
  { key: 'customer_code', label: 'Kod' },
  { key: 'first_name', label: 'Imię' },
  { key: 'last_name', label: 'Nazwisko' },
  { key: 'status', label: 'Status' }
]
</script>
