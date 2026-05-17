<template>
  <div class="flex h-dvh overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
    <aside class="hidden w-72 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-5 py-5 dark:border-gray-800">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-cpu-chip" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="text-xs font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">CRM Portal</div>
            <div class="truncate text-lg font-semibold">SNMS Enterprise</div>
          </div>
        </NuxtLink>
      </div>

      <div class="sidebar-scroll flex-1 overflow-y-auto px-4 py-4">
        <div class="flex min-h-full flex-col gap-5">
          <section
            v-for="section in sidebarSections"
            :key="section.label"
            class="min-h-0 space-y-2"
          >
            <div class="px-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {{ section.label }}
            </div>
            <UVerticalNavigation :links="section.links" />
          </section>
        </div>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div class="flex min-w-0 items-center gap-3">
            <UDropdown
              class="lg:hidden"
              :items="mobileNavigationItems"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton color="gray" variant="ghost" icon="i-heroicons-bars-3" label="Menu" />
            </UDropdown>

            <div class="min-w-0">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ currentPageLabel }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ currentSectionLabel }}</div>
            </div>
          </div>

          <div class="flex min-w-0 flex-1 items-center justify-end gap-2">
            <div class="hidden min-w-[20rem] max-w-xl flex-1 xl:block">
              <UInput
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Szukaj modułu lub funkcji..."
                readonly
                size="md"
              >
                <template #trailing>
                  <UKbd value="K" />
                </template>
              </UInput>
            </div>
            <UButton color="gray" variant="ghost" to="/architect" label="AI Architekt" icon="i-heroicons-sparkles" />
            <UDropdown
              v-if="adminLinks.length > 0"
              :items="[adminLinks]"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton color="gray" variant="ghost" label="Administracja" trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
            <UButton
              v-if="currentUser"
              color="gray"
              variant="soft"
              size="sm"
              icon="i-heroicons-cog-6-tooth"
              to="/settings"
              label="Sesja"
            />
            <UButton
              v-else
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-arrow-right-end-on-rectangle"
              to="/settings"
              label="Zaloguj"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm sm:px-6 lg:px-8 dark:border-gray-800">
          <UBreadcrumb
            :links="[
              { label: currentSectionLabel, icon: 'i-heroicons-home' },
              { label: currentPageLabel }
            ]"
          />
          <div class="ml-auto text-right">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ currentUser?.username ?? 'Gość' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ sessionSummary }}
            </div>
          </div>
        </div>
      </header>

      <main class="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div class="overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          <slot v-if="$route.path !== '/'" />
          <iframe
            v-else
            src="http://localhost:8081/dashboard?embed=true"
            class="h-[calc(100dvh-11rem)] w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
          ></iframe>
        </div>
      </main>
    </div>

    <AiAssistant />
  </div>
</template>

<script setup>
const route = useRoute()
const { session: authSession, visibleLinks, loadSession } = usePortalAuth()
await loadSession({ silent: true })
const currentUser = computed(() => authSession.value?.user ?? null)

const navigationSections = [
  {
    label: 'CRM',
    links: [
      { label: 'Pulpit', icon: 'i-heroicons-home', to: '/' },
      { label: 'Abonenci', icon: 'i-heroicons-users', to: '/customers' },
      { label: 'Urządzenia klientów', icon: 'i-heroicons-computer-desktop', to: '/customer-devices' },
      { label: 'Węzły', icon: 'i-heroicons-circle-stack', to: '/network/nodes' },
      { label: 'Urządzenia', icon: 'i-heroicons-server-stack', to: '/network/devices' },
      { label: 'Finanse', icon: 'i-heroicons-banknotes', to: '/finances' },
      { label: 'Subskrypcje', icon: 'i-heroicons-receipt-percent', to: '/subscriptions' },
      { label: 'Helpdesk', icon: 'i-heroicons-lifebuoy', to: '/helpdesk' },
      { label: 'Dokumenty', icon: 'i-heroicons-folder', to: '/documents' },
      { label: 'TERYT', icon: 'i-heroicons-map', to: '/teryt' }
    ]
  },
  {
    label: 'Operacje',
    links: [
      { label: 'Operacje', icon: 'i-heroicons-wrench-screwdriver', to: '/operations' },
      { label: 'Analityka', icon: 'i-heroicons-chart-bar', to: '/analytics' },
      { label: 'Monitoring', icon: 'i-heroicons-signal', to: '/monitoring' },
      { label: 'SNMS', icon: 'i-heroicons-chat-bubble-left-right', to: '/snms' }
    ]
  },
  {
    label: 'Administracja',
    links: [
      { label: 'Administracja', icon: 'i-heroicons-shield-check', to: '/admin' },
      { label: 'Ustawienia', icon: 'i-heroicons-cog-6-tooth', to: '/settings' }
    ]
  }
]

const filteredSections = computed(() =>
  navigationSections.reduce((result, section) => {
    const sectionLinks = visibleLinks(section.links)

    if (sectionLinks.length > 0) {
      result.push({
        ...section,
        links: sectionLinks
      })
    }

    return result
  }, [])
)

const sidebarSections = computed(() =>
  filteredSections.value.filter((section) => section.label !== 'Administracja')
)

const adminLinks = computed(() =>
  filteredSections.value.find((section) => section.label === 'Administracja')?.links ?? []
)

const mobileNavigationItems = computed(() => {
  const items = sidebarSections.value.map((section) => section.links)

  if (adminLinks.value.length > 0) {
    items.push(adminLinks.value)
  }

  return items
})

const staticRouteLabels = [
  {
    path: '/architect',
    sectionLabel: 'AI',
    pageLabel: 'Architekt Modułów'
  }
]

const currentRoutePath = computed(() => normalizePath(route.path))

const activeNavigation = computed(() =>
  findActiveNavigation(filteredSections.value, currentRoutePath.value, staticRouteLabels)
)

const currentSectionLabel = computed(() => activeNavigation.value?.sectionLabel ?? 'CRM')
const currentPageLabel = computed(() => activeNavigation.value?.pageLabel ?? 'Pulpit')

const sessionSummary = computed(() => {
  if (!currentUser.value) {
    return 'Brak sesji'
  }

  return `${currentUser.value.role} · sesja aktywna`
})

function normalizePath(path) {
  if (!path) {
    return '/'
  }

  return String(path).split('?')[0] || '/'
}

function matchesPath(candidate, currentPath) {
  const normalizedCandidate = normalizePath(candidate)
  return currentPath === normalizedCandidate || currentPath.startsWith(`${normalizedCandidate}/`)
}

function findActiveLink(links, currentPath) {
  for (const link of links) {
    if (link.to && matchesPath(link.to, currentPath)) {
      return link.label
    }

    if (Array.isArray(link.children)) {
      const childLabel = findActiveLink(link.children, currentPath)

      if (childLabel) {
        return childLabel
      }
    }
  }

  return null
}

function findActiveNavigation(sections, currentPath, staticLabels = []) {
  const staticLabel = staticLabels.find(({ path }) => matchesPath(path, currentPath))

  if (staticLabel) {
    return {
      sectionLabel: staticLabel.sectionLabel,
      pageLabel: staticLabel.pageLabel
    }
  }

  for (const section of sections) {
    const pageLabel = findActiveLink(section.links, currentPath)

    if (pageLabel) {
      return {
        sectionLabel: section.label,
        pageLabel
      }
    }
  }

  return null
}
</script>

<style scoped>
.sidebar-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-scroll::-webkit-scrollbar {
  display: none;
}
</style>
