<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Panel Sterowania</h1>
      <p class="text-sm text-gray-500">Witaj w systemie SNMS. Oto podsumowanie Twojej sieci.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UCard v-for="(stat, key) in statsMap" :key="key">
        <div class="flex items-center gap-4">
          <div :class="['p-3 rounded-xl', stat.bg, stat.text]">
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
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Customers -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold">Ostatnio dodani abonenci</h3>
            <UButton
              to="/customers"
              label="Zobacz wszystkich"
              variant="ghost"
              size="xs"
              color="neutral"
              aria-label="Zobacz wszystkich abonentów"
            />
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
            icon="i-lucide-search"
            label="Szukaj urządzenia"
            color="neutral"
            variant="soft"
            block
            aria-label="Otwórz wyszukiwarkę urządzeń"
          />
          <UButton
            icon="i-lucide-file-plus"
            label="Generuj raport PIT"
            color="neutral"
            variant="soft"
            block
            aria-label="Przejdź do generatora raportów PIT"
          />
          <UButton
            icon="i-lucide-zap"
            label="Diagnostyka OLT"
            color="neutral"
            variant="soft"
            block
            aria-label="Uruchom diagnostykę OLT"
          />
        </div>
        
        <div class="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div class="flex items-center gap-2 text-primary mb-2">
            <UIcon name="i-lucide-sparkles" />
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
  customers: { label: 'Abonenci', icon: 'i-lucide-users', bg: 'bg-info/10', text: 'text-info' },
  nodes: { label: 'Węzły', icon: 'i-lucide-map-pin', bg: 'bg-success/10', text: 'text-success' },
  devices: { label: 'Urządzenia', icon: 'i-lucide-cpu', bg: 'bg-primary/10', text: 'text-primary' },
  tickets: { label: 'Zgłoszenia', icon: 'i-lucide-ticket', bg: 'bg-warning/10', text: 'text-warning' }
}

// Ensure Tailwind JIT picks up these classes
const _jit = [
  'bg-info/10', 'text-info',
  'bg-success/10', 'text-success',
  'bg-primary/10', 'text-primary',
  'bg-warning/10', 'text-warning'
]

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
