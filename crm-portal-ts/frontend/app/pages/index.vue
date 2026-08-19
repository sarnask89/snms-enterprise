<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-highlighted">Panel Sterowania</h1>
      <p class="text-sm text-muted">Witaj w systemie SNMS. Oto podsumowanie Twojej sieci.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="(stat, key) in statsMap" :key="key">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-xl ${statColorClasses[stat.color] || 'bg-primary-500/10 text-primary-500'}`">
            <UIcon :name="stat.icon" class="size-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-muted">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-highlighted">
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
            <h3 class="font-bold text-highlighted">Ostatnio dodani abonenci</h3>
            <UButton
              to="/customers"
              label="Zobacz wszystkich"
              variant="ghost"
              color="neutral"
              size="xs"
              aria-label="Zobacz wszystkich abonentów"
            />
          </div>
        </template>
        
        <UTable :data="recentCustomers || []" :columns="recentColumns">
          <template #status-data="{ row }">
            <UBadge :color="row.status === 'active' ? 'success' : 'neutral'" variant="subtle" size="xs">
              {{ row.status === 'active' ? 'Aktywny' : (row.status || 'Nieznany') }}
            </UBadge>
          </template>
        </UTable>
      </UCard>

      <!-- Quick Actions / AI Insights -->
      <UCard>
        <template #header>
          <h3 class="font-bold text-highlighted">Szybkie Akcje</h3>
        </template>
        <div class="flex flex-col gap-2">
          <UButton
            icon="i-lucide-search"
            label="Szukaj urządzenia"
            color="neutral"
            variant="subtle"
            block
            aria-label="Szukaj urządzenia w sieci"
            @click="handleQuickAction('Szukaj urządzenia', '/operations')"
          />
          <UButton
            icon="i-lucide-file-plus"
            label="Generuj raport PIT"
            color="neutral"
            variant="subtle"
            block
            aria-label="Generuj raport PIT dla urzędu"
            @click="handleQuickAction('Generuj raport PIT', '/analytics')"
          />
          <UButton
            icon="i-lucide-zap"
            label="Diagnostyka OLT"
            color="neutral"
            variant="subtle"
            block
            aria-label="Uruchom diagnostykę OLT"
            @click="handleQuickAction('Diagnostyka OLT', '/operations')"
          />
        </div>
        
        <div class="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10">
          <div class="flex items-center gap-2 text-primary-500 mb-2">
            <UIcon name="i-lucide-sparkles" class="size-4" />
            <span class="text-xs font-bold uppercase tracking-wider">AI Insight</span>
          </div>
          <p class="text-xs text-muted italic">
            "Wykryto 3 nowe urządzenia GPON na porcie PON 1. Sugeruję synchronizację bazy danych."
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const toast = useToast()

const statColorClasses = {
  blue: 'bg-blue-500/10 text-blue-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  orange: 'bg-orange-500/10 text-orange-500'
}

const statsMap = {
  customers: { label: 'Abonenci', icon: 'i-lucide-users', color: 'blue' },
  nodes: { label: 'Węzły', icon: 'i-lucide-map-pin', color: 'emerald' },
  devices: { label: 'Urządzenia', icon: 'i-lucide-cpu', color: 'indigo' },
  tickets: { label: 'Zgłoszenia', icon: 'i-lucide-ticket', color: 'orange' }
}

const { data: stats } = await useFetch('/api/v1/dashboard/stats')

const { data: recentCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 5 }
})

const recentColumns = [
  { accessorKey: 'customerCode', header: 'Kod' },
  { accessorKey: 'lastName', header: 'Nazwisko / Nazwa' },
  { accessorKey: 'status', header: 'Status' }
]

const handleQuickAction = async (actionTitle, targetPath) => {
  toast.add({
    title: actionTitle,
    description: `Przekierowywanie do modułu: ${targetPath}...`
  })
  await navigateTo(targetPath)
}
</script>
