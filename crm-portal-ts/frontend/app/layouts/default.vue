<template>
  <div class="min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
    <header class="border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <UContainer class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4 py-4">
          <div class="min-w-0">
            <NuxtLink to="/" class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <UIcon name="i-heroicons-cpu-chip" class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-medium text-gray-500 dark:text-gray-400">CRM Portal</div>
                <div class="truncate text-lg font-semibold">SNMS Enterprise</div>
              </div>
            </NuxtLink>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UDropdown
              v-for="section in filteredSections"
              :key="section.label"
              :items="[section.links]"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                :label="section.label"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              />
            </UDropdown>
            <UButton color="gray" variant="ghost" to="/architect" label="AI Architekt" icon="i-heroicons-sparkles" />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ currentUser?.username ?? 'Gość' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ sessionSummary }}
              </div>
            </div>
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

        <div class="flex flex-wrap items-center gap-3 border-t border-gray-100 py-3 text-sm dark:border-gray-800">
          <UBreadcrumb
            :links="[
              { label: currentSectionLabel, icon: 'i-heroicons-home' },
              { label: currentPageLabel }
            ]"
          />
          <span class="text-gray-400">/</span>
          <span class="text-gray-500 dark:text-gray-400">{{ currentPageLabel }}</span>
        </div>
      </UContainer>
    </header>

    <main class="overflow-x-hidden">
      <UContainer class="max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div class="overflow-x-hidden">
          <slot v-if="$route.path !== '/'" />
          <iframe
            v-else
            src="http://localhost:8081/dashboard?embed=true"
            class="h-[calc(100dvh-11rem)] w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
          ></iframe>
        </div>
      </UContainer>
    </main>

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
