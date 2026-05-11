<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">
      <div class="p-6">
        <h1 class="text-xl font-bold text-primary-500 flex items-center gap-2">
          <UIcon name="i-heroicons-cpu-chip" />
          CRM Portal
        </h1>
      </div>

      <UVerticalNavigation :links="links" class="px-4 flex-1" />

      <!-- Module Architect Button -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          icon="i-heroicons-sparkles"
          label="AI Architekt Modułów"
          color="primary"
          variant="soft"
          block
          to="/architect"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <UBreadcrumb :links="[{ label: 'Główna', icon: 'i-heroicons-home' }]" />
        </div>
        <div class="flex items-center gap-4">
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Użytkownik" size="sm" />
        </div>
      </header>

      <!-- Frame for Legacy Content / Slot for Vue Pages -->
      <div class="flex-1 overflow-auto relative bg-transparent">
        <slot v-if="$route.path !== '/'" />
        <iframe 
          v-else
          src="http://localhost:8081/dashboard?embed=true" 
          class="w-full h-full border-none"
        ></iframe>
      </div>
    </main>
    
    <!-- AI Assistant Floating Widget -->
    <AiAssistant />
  </div>
</template>

<script setup>
const links = [
  {
    label: 'Pulpit',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: 'Abonenci',
    icon: 'i-heroicons-users',
    to: '/customers'
  },
  {
    label: 'Sieć',
    icon: 'i-heroicons-globe-alt',
    children: [
      { label: 'Węzły', to: '/network/nodes' },
      { label: 'Urządzenia', to: '/network/devices' }
    ]
  },
  {
    label: 'Finanse',
    icon: 'i-heroicons-banknotes',
    to: '/finances'
  },
  {
    label: 'Ustawienia',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings'
  }
]
</script>
