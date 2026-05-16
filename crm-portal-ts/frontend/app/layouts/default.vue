<template>
  <div class="flex h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
    <aside class="flex w-72 flex-col border-r border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95">
      <div class="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/12 text-primary-600 dark:text-primary-400">
            <UIcon name="i-heroicons-cpu-chip" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">CRM</div>
            <h1 class="truncate text-lg font-semibold text-slate-900 dark:text-white">Portal operatora</h1>
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <section
          v-for="section in filteredSections"
          :key="section.label"
          class="space-y-2"
        >
          <div class="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {{ section.label }}
          </div>
          <UVerticalNavigation
            :links="section.links"
            class="rounded-2xl bg-slate-50/90 p-2 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-800"
            :ui="{
              base: 'group rounded-xl',
              padding: 'px-3 py-2.5',
              rounded: 'rounded-xl',
              font: 'font-medium',
              inactive: 'text-slate-600 hover:text-slate-950 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/90',
              active: 'bg-primary-500/12 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300'
            }"
          />
        </section>
      </div>

      <div class="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
        <UButton
          icon="i-heroicons-sparkles"
          label="AI Architekt Modułów"
          color="primary"
          variant="soft"
          block
          to="/architect"
          class="justify-center"
        />
      </div>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header class="flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-5 dark:border-slate-800 dark:bg-slate-950/90">
        <div class="min-w-0">
          <div class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {{ currentSectionLabel }}
          </div>
          <div class="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {{ currentPageLabel }}
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <div class="text-sm font-medium text-slate-900 dark:text-white">
              {{ currentUser?.username ?? 'Gość' }}
            </div>
            <div class="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
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

      <div class="flex-1 overflow-auto bg-transparent p-3 sm:p-4">
        <div class="h-full rounded-2xl">
          <slot v-if="$route.path !== '/'" />
          <iframe
            v-else
            src="http://localhost:8081/dashboard?embed=true"
            class="h-full w-full rounded-2xl border-none bg-white dark:bg-slate-950"
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
