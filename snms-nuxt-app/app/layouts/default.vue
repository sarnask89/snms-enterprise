<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div class="p-6">
        <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400">SNMS Enterprise</h1>
      </div>
      <nav class="flex-1 px-4 space-y-1">
        <template v-for="group in navigation" :key="group.label">
          <div v-if="group.label" class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            {{ group.label }}
          </div>
          <ULink
            v-for="item in group.items"
            :key="item.label"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            active-class="bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400"
            inactive-class="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <UIcon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </ULink>
        </template>
      </nav>
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          icon="i-heroicons-arrow-left-on-rectangle"
          label="Wyloguj"
          variant="ghost"
          color="gray"
          block
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Navbar -->
      <header class="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-bars-3" variant="ghost" color="gray" class="md:hidden" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentTitle }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <UColorModeButton />
          <UAvatar src="https://github.com/benjamincanac.png" alt="User" />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const navigation = [
  {
    items: [
      { label: 'Pulpit', icon: 'i-heroicons-home', to: '/' },
    ]
  },
  {
    label: 'CRM',
    items: [
      { label: 'Abonenci', icon: 'i-heroicons-users', to: '/customers' },
      { label: 'Finanse', icon: 'i-heroicons-banknotes', to: '/finances' },
    ]
  },
  {
    label: 'Infrastruktura',
    items: [
      { label: 'Węzły sieciowe', icon: 'i-heroicons-map-pin', to: '/network/nodes' },
      { label: 'Urządzenia', icon: 'i-heroicons-cpu-chip', to: '/network/devices' },
    ]
  },
  {
    label: 'Wsparcie',
    items: [
      { label: 'Helpdesk', icon: 'i-heroicons-ticket', to: '/helpdesk' },
    ]
  }
]

const currentTitle = computed(() => {
  const allItems = navigation.flatMap(g => g.items)
  const activeItem = allItems.find(i => i.to === route.path)
  return activeItem?.label || 'SNMS'
})

const handleLogout = () => {
  // Logic for logout
}
</script>
