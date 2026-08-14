<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Panel Sterowania</h1>
      <p class="text-sm text-gray-500">Witaj w systemie SNMS. Oto podsumowanie Twojej sieci.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <NuxtLink
        v-for="(stat, key) in statsMap"
        :key="key"
        :to="stat.to"
        :aria-label="`Przejdź do sekcji: ${stat.label}. Obecna wartość: ${stats ? stats[key] : 'wczytywanie'}`"
        class="focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl outline-none"
      >
        <UCard class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer">
          <div class="flex items-center gap-4">
            <div :class="`p-3 rounded-xl ${stat.bgClass} ${stat.textClass}`">
              <UIcon :name="stat.icon" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats ? stats[key] : '...' }}
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Customers -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Ostatnio dodani abonenci</h3>
            <UButton to="/customers" label="Zobacz wszystkich" variant="ghost" size="xs" />
          </div>
        </template>
        
        <UTable :data="recentCustomers" :columns="recentColumns">
           <template #status-data="{ row }">
            <UBadge :color="row.status === 'active' ? 'success' : 'neutral'" variant="soft" size="xs">
              {{ row.status }}
            </UBadge>
          </template>
        </UTable>
      </UCard>

      <!-- Quick Actions / AI Insights -->
      <UCard>
        <template #header>
          <h3 class="font-bold">Szybkie Akcje</h3>
        </template>
        <div class="flex flex-col gap-2">
          <UButton
            to="/customer-devices"
            icon="i-lucide-search"
            label="Szukaj urządzenia"
            color="neutral"
            variant="soft"
            block
            aria-label="Wyszukiwanie i filtrowanie urządzeń w sieci"
          />
          <UButton
            to="/analytics"
            icon="i-lucide-file-plus"
            label="Generuj raport PIT"
            color="neutral"
            variant="soft"
            block
            aria-label="Przejdź do strony raportów i wygeneruj raport PIT"
          />
          <UButton
            to="/operations"
            icon="i-lucide-zap"
            label="Diagnostyka OLT"
            color="neutral"
            variant="soft"
            block
            aria-label="Otwórz diagnostykę sieci i testy połączeń"
          />
        </div>
        
        <div class="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10">
          <div class="flex items-center gap-2 text-primary-500 mb-2">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
            <span class="text-xs font-bold uppercase tracking-wider">AI Insight</span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 italic">
            "Wykryto 3 nowe urządzenia GPON na porcie PON 1. Sugeruję synchronizację bazy danych."
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const statsMap = {
  customers: {
    label: 'Abonenci',
    icon: 'i-lucide-users',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500',
    to: '/customers'
  },
  nodes: {
    label: 'Węzły',
    icon: 'i-lucide-map-pin',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-500',
    to: '/network/nodes'
  },
  devices: {
    label: 'Urządzenia',
    icon: 'i-lucide-cpu',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-500',
    to: '/customer-devices'
  },
  tickets: {
    label: 'Zgłoszenia',
    icon: 'i-lucide-ticket',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500',
    to: '/helpdesk'
  }
}

const { data: stats } = await useFetch('/api/v1/dashboard/stats')

const { data: recentCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 5 }
})

const recentColumns = [
  { accessorKey: 'customer_code', header: 'Kod' },
  { accessorKey: 'last_name', header: 'Nazwisko' },
  { accessorKey: 'status', header: 'Status' }
]
</script>
