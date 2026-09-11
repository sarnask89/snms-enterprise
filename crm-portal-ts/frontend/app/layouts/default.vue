<script setup>
const { session: authSession, visibleLinks, loadSession, logout } = usePortalAuth()

await loadSession({ silent: true })

const open = ref(false)
const currentUser = computed(() => authSession.value?.user ?? null)

const navigationSections = [
  [{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Abonenci',
    icon: 'i-lucide-users',
    to: '/customers',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Urządzenia klientów',
    icon: 'i-lucide-monitor-smartphone',
    to: '/customer-devices',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Operacje',
    icon: 'i-lucide-wrench',
    to: '/operations',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Monitoring',
    icon: 'i-lucide-chart-no-axes-column',
    to: '/monitoring',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Analityka',
    icon: 'i-lucide-chart-pie',
    to: '/analytics',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Sieć',
    icon: 'i-lucide-network',
    type: 'trigger',
    defaultOpen: true,
    children: [
      {
        label: 'Węzły',
        to: '/network/nodes',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Urządzenia sieciowe',
        to: '/network/devices',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'IP Networks',
        to: '/network/ip-networks',
        onSelect: () => {
          open.value = false
        }
      }
    ]
  }],
  [{
    label: 'Finanse',
    icon: 'i-lucide-banknote',
    to: '/finances',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Subskrypcje',
    icon: 'i-lucide-receipt',
    to: '/subscriptions',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Helpdesk',
    icon: 'i-lucide-life-buoy',
    to: '/helpdesk',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Dokumenty',
    icon: 'i-lucide-folder',
    to: '/documents',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'TERYT',
    icon: 'i-lucide-map',
    to: '/teryt',
    onSelect: () => {
      open.value = false
    }
  }],
  [{
    label: 'Administracja',
    icon: 'i-lucide-shield',
    type: 'trigger',
    children: [
      {
        label: 'Panel administracyjny',
        to: '/admin',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Ustawienia',
        to: '/settings',
        onSelect: () => {
          open.value = false
        }
      }
    ]
  }, {
    label: 'AI Architekt',
    icon: 'i-lucide-sparkles',
    to: '/architect',
    onSelect: () => {
      open.value = false
    }
  }]
]

const visibleSections = computed(() =>
  navigationSections
    .map(section => visibleLinks(section))
    .filter(section => section.length > 0)
)

const links = computed(() => visibleSections.value)

const groups = computed(() => [
  {
    id: 'links',
    label: 'Przejdź do',
    items: links.value.flat()
  }
])

const userMenuItems = computed(() => [[{
  type: 'label',
  label: currentUser.value?.username ?? 'Gość',
  icon: 'i-lucide-user'
}], [{
  label: 'Ustawienia',
  icon: 'i-lucide-settings',
  to: '/settings'
}, {
  label: currentUser.value ? 'Wyloguj' : 'Zaloguj',
  icon: currentUser.value ? 'i-lucide-log-out' : 'i-lucide-log-in',
  click: async () => {
    if (currentUser.value) {
      await logout()
      await navigateTo('/settings')
      return
    }

    await navigateTo('/settings')
  }
}]])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/30"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-3 px-1">
          <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon name="i-lucide-cpu" class="size-5" />
          </div>
          <div v-if="!collapsed" class="min-w-0">
            <div class="truncate text-sm font-semibold text-highlighted">SNMS Enterprise</div>
            <div class="text-xs text-muted">CRM Portal</div>
          </div>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0] || []"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          v-if="links[1]?.length"
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          popover
          class="mt-4"
        />

        <UNavigationMenu
          v-if="links[2]?.length"
          :collapsed="collapsed"
          :items="links[2]"
          orientation="vertical"
          tooltip
          popover
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            :label="collapsed ? undefined : (currentUser?.username ?? 'Gość')"
            :icon="currentUser ? 'i-lucide-user-check' : 'i-lucide-user'"
            :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <AiAssistant />
  </UDashboardGroup>
</template>
