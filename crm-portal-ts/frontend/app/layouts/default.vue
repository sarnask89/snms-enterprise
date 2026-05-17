<template>
  <div class="flex h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
    <aside class="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div class="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-cpu-chip" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">CRM</div>
            <h1 class="truncate text-lg font-bold text-primary-600 dark:text-primary-400">CRM Portal</h1>
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <section
          v-for="section in filteredSections"
          :key="section.label"
          class="space-y-2"
        >
          <div class="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            {{ section.label }}
          </div>
          <UVerticalNavigation
            :links="section.links"
            class="space-y-1"
            :ui="{
              base: 'group rounded-lg',
              padding: 'px-3 py-2',
              rounded: 'rounded-lg',
              font: 'font-medium',
              inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800',
              active: 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
            }"
          />
        </section>
      </div>

      <div class="border-t border-gray-200 px-4 py-4 dark:border-gray-800">
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

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-800 dark:bg-gray-950">
        <div class="min-w-0 space-y-1">
          <UBreadcrumb
            :links="[
              { label: currentSectionLabel, icon: 'i-heroicons-home' },
              { label: currentPageLabel }
            ]"
          />
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ currentPageLabel }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right md:block">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ currentUser?.username ?? 'Gość' }}
            </div>
            <div class="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              {{ sessionSummary }}
            </div>
          </div>
          <UButton
            v-if="currentUser"
            color="gray"
            variant="ghost"
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
      </header>

      <div class="flex-1 overflow-auto bg-transparent">
        <div class="h-full">
          <slot v-if="$route.path !== '/'" />
          <iframe
            v-else
            src="http://localhost:8081/dashboard?embed=true"
            class="h-full w-full border-none bg-white dark:bg-gray-950"
          ></iframe>
        </div>
      </div>
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
        children: [
          { label: 'Finanse', to: '/finances' },
          { label: 'Subskrypcje', to: '/subscriptions' }
        ]
      },
      {
        label: 'Helpdesk',
        icon: 'i-heroicons-lifebuoy',
        to: '/helpdesk'
      },
      {
        label: 'Dokumenty',
        icon: 'i-heroicons-folder',
        to: '/documents'
      },
      {
        label: 'TERYT',
        icon: 'i-heroicons-map',
        to: '/teryt'
      }
    ]
  },
  {
    label: 'Operacje',
    links: [
      {
        label: 'Operacje',
        icon: 'i-heroicons-wrench-screwdriver',
        to: '/operations'
      },
      {
        label: 'Analityka',
        icon: 'i-heroicons-chart-bar',
        to: '/analytics'
      },
      {
        label: 'Monitoring',
        icon: 'i-heroicons-signal',
        to: '/monitoring'
      },
      {
        label: 'SNMS',
        icon: 'i-heroicons-chat-bubble-left-right',
        to: '/snms'
      }
    ]
  },
  {
    label: 'Administracja',
    links: [
      {
        label: 'Administracja',
        icon: 'i-heroicons-shield-check',
        to: '/admin'
      },
      {
        label: 'Ustawienia',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings'
      }
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
