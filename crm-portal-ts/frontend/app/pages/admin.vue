<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administracja</h1>
        <p class="text-sm text-gray-500">Info runtime, backupy, reload oraz log audytowy dla aktywnego baseline TS/Nuxt</p>
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
    </div>

    <div class="grid md:grid-cols-4 gap-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Engine</div>
        <div class="text-xl font-bold">{{ info?.engine || 'n/a' }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Platforma</div>
        <div class="text-xl font-bold">{{ info?.platform || 'n/a' }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Baza</div>
        <div class="text-xl font-bold">{{ info?.dbKind || 'n/a' }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="text-sm text-gray-500">Plik DB</div>
        <div class="text-base font-semibold break-all">{{ info?.databasePath || 'n/a' }}</div>
      </div>
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Backupy</h2>
              <p class="text-sm text-gray-500">Tworzenie, pobieranie i usuwanie kopii SQLite</p>
            </div>
            <UButton color="primary" icon="i-heroicons-circle-stack" label="Utwórz backup" :loading="isCreatingBackup" @click="createBackup" />
          </div>
        </template>

        <UTable :data="backups || []" :columns="backupColumns" :loading="pendingBackups">
          <template #createdAt-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(row.createdAt) }}</div>
          </template>

          <template #sizeBytes-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatBytes(row.sizeBytes) }}</div>
          </template>

          <template #actions-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton size="xs" color="primary" variant="ghost" icon="i-heroicons-arrow-down-tray" @click="downloadBackup(row)" />
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeBackup(row)" />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Reload konfiguracji</h2>
              <p class="text-sm text-gray-500">Log kontrolnych przeładowań i notatek operatorskich</p>
            </div>
            <UButton color="primary" icon="i-heroicons-bolt" label="Dodaj reload" :loading="isCreatingReload" @click="isReloadModalOpen = true" />
          </div>
        </template>

        <UTable :data="reloadLogs || []" :columns="reloadColumns" :loading="pendingReloadLogs">
          <template #createdAt-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(row.createdAt) }}</div>
          </template>

          <template #note-data="{ row }">
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.note || 'Brak notatki' }}</div>
          </template>
        </UTable>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="font-semibold text-lg">Dziennik audytowy</h2>
            <p class="text-sm text-gray-500">Ostatnie operacje administracyjne i destrukcyjne</p>
          </div>
          <UInput
            v-model="auditSearch"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Filtruj po akcji lub szczegółach..."
            class="w-full md:w-80"
          />
        </div>
      </template>

      <UTable :data="filteredAuditLogs" :columns="auditColumns" :loading="pendingAuditLogs">
        <template #timestamp-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(row.timestamp) }}</div>
        </template>

        <template #details-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ row.details || 'Brak szczegółów' }}</div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isReloadModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">Dodaj wpis reload</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="createReload">
          <UFormField label="Notatka">
            <UTextarea v-model="reloadForm.note" :data="4" placeholder="np. ręczne przeładowanie po zmianie konfiguracji" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isReloadModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isCreatingReload" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const backupColumns = [
  { accessorKey: 'filename', header: 'Plik' },
  { accessorKey: 'createdAt', header: 'Utworzono' },
  { accessorKey: 'sizeBytes', header: 'Rozmiar' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const reloadColumns = [
  { accessorKey: 'createdAt', header: 'Data' },
  { accessorKey: 'note', header: 'Notatka' }
]

const auditColumns = [
  { accessorKey: 'timestamp', header: 'Data' },
  { accessorKey: 'action', header: 'Akcja' },
  { accessorKey: 'resourceType', header: 'Zasób' },
  { accessorKey: 'details', header: 'Szczegóły' }
]

const auditSearch = ref('')
const isCreatingBackup = ref(false)
const isCreatingReload = ref(false)
const isReloadModalOpen = ref(false)

const reloadForm = reactive({
  note: ''
})

const { data: info, refresh: refreshInfo } = await useFetch('/api/v1/admin/info')
const { data: backups, pending: pendingBackups, refresh: refreshBackups } = await useFetch('/api/v1/admin/backups')
const { data: reloadLogs, pending: pendingReloadLogs, refresh: refreshReloadLogs } = await useFetch('/api/v1/admin/reload')
const { data: auditLogs, pending: pendingAuditLogs, refresh: refreshAuditLogs } = await useFetch('/api/v1/admin/audit-logs')

const filteredAuditLogs = computed(() => {
  const rows = auditLogs.value || []
  const query = auditSearch.value.trim().toLowerCase()
  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    [row.action, row.resourceType || '', row.details || '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
})

const formatDate = (value) => {
  if (!value) {
    return 'Brak daty'
  }

  return new Date(value).toLocaleString('pl-PL')
}

const formatBytes = (bytes) => {
  if (!bytes) {
    return '0 B'
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const refreshAll = async () => {
  await Promise.all([
    refreshInfo(),
    refreshBackups(),
    refreshReloadLogs(),
    refreshAuditLogs()
  ])
}

const createBackup = async () => {
  isCreatingBackup.value = true
  try {
    await $fetch('/api/v1/admin/backups/create', { method: 'POST' })
    await Promise.all([refreshBackups(), refreshAuditLogs()])
  } finally {
    isCreatingBackup.value = false
  }
}

const downloadBackup = (row) => {
  window.open(row.downloadUrl, '_blank', 'noopener')
}

const removeBackup = async (row) => {
  if (!confirm(`Usunąć backup "${row.filename}"?`)) {
    return
  }

  await $fetch(`/api/v1/admin/backups/${encodeURIComponent(row.filename)}`, { method: 'DELETE' })
  await Promise.all([refreshBackups(), refreshAuditLogs()])
}

const createReload = async () => {
  isCreatingReload.value = true
  try {
    await $fetch('/api/v1/admin/reload', {
      method: 'POST',
      body: { note: reloadForm.note || null }
    })
    reloadForm.note = ''
    isReloadModalOpen.value = false
    await Promise.all([refreshReloadLogs(), refreshAuditLogs()])
  } finally {
    isCreatingReload.value = false
  }
}
</script>
