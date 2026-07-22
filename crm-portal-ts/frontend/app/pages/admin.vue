<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Administracja</h1>
        <p class="text-sm text-gray-500">Info runtime, backupy, reload oraz log audytowy dla aktywnego baseline TS/Nuxt</p>
      </div>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        label="Odśwież"
        aria-label="Odśwież panel administracyjny"
        @click="refreshAll"
      />
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
            <UButton
              color="primary"
              icon="i-lucide-database"
              label="Utwórz backup"
              aria-label="Utwórz nowy backup bazy danych"
              :loading="isCreatingBackup"
              @click="createBackup"
            />
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
              <UButton
                size="xs"
                color="primary"
                variant="ghost"
                icon="i-lucide-download"
                aria-label="Pobierz backup"
                @click="downloadBackup(row)"
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                aria-label="Usuń backup"
                @click="removeBackup(row)"
              />
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
            <UButton
              color="primary"
              icon="i-lucide-bolt"
              label="Dodaj reload"
              aria-label="Zarejestruj przeładowanie konfiguracji"
              :loading="isCreatingReload"
              @click="isReloadModalOpen = true"
            />
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
            icon="i-lucide-search"
            placeholder="Filtruj po akcji lub szczegółach..."
            aria-label="Filtruj dziennik audytowy"
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

    <UModal v-model:open="isReloadModalOpen">
      <template #content>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <h3 class="text-lg font-bold">Dodaj wpis reload</h3>
          </template>

          <form class="space-y-4 p-4" @submit.prevent="createReload">
            <UFormField label="Notatka">
              <UTextarea v-model="reloadForm.note" :rows="4" placeholder="np. ręczne przeładowanie po zmianie konfiguracji" />
            </UFormField>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="outline" label="Anuluj" @click="isReloadModalOpen = false" />
              <UButton type="submit" color="primary" :loading="isCreatingReload" label="Zapisz" />
            </div>
          </form>
        </UCard>
      </template>
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

const toast = useToast()
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
  try {
    await Promise.all([
      refreshInfo(),
      refreshBackups(),
      refreshReloadLogs(),
      refreshAuditLogs()
    ])
    toast.add({
      title: 'Odświeżono dane',
      description: 'Z powodzeniem pobrano aktualny stan administracyjny.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd odświeżania',
      description: 'Nie udało się pobrać danych administracyjnych.',
      color: 'error'
    })
  }
}

const createBackup = async () => {
  isCreatingBackup.value = true
  try {
    await $fetch('/api/v1/admin/backups/create', { method: 'POST' })
    await Promise.all([refreshBackups(), refreshAuditLogs()])
    toast.add({
      title: 'Backup utworzony',
      description: 'Nowa kopia bazy danych SQLite została poprawnie zapisana.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd tworzenia backupu',
      description: 'Wystąpił problem podczas zapisu kopii bazy danych.',
      color: 'error'
    })
  } finally {
    isCreatingBackup.value = false
  }
}

const downloadBackup = (row) => {
  try {
    window.open(row.downloadUrl, '_blank', 'noopener')
    toast.add({
      title: 'Pobieranie rozpoczęte',
      description: `Rozpoczęto pobieranie pliku backupu: ${row.filename}`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd pobierania',
      description: 'Nie udało się otworzyć pliku backupu.',
      color: 'error'
    })
  }
}

const removeBackup = async (row) => {
  if (!confirm(`Usunąć backup "${row.filename}"?`)) {
    return
  }

  try {
    await $fetch(`/api/v1/admin/backups/${encodeURIComponent(row.filename)}`, { method: 'DELETE' })
    await Promise.all([refreshBackups(), refreshAuditLogs()])
    toast.add({
      title: 'Backup usunięty',
      description: `Pomyślnie usunięto plik backupu: ${row.filename}`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd usuwania',
      description: 'Wystąpił problem przy próbie skasowania backupu.',
      color: 'error'
    })
  }
}

const createReload = async () => {
  isCreatingReload.value = true
  try {
    await $fetch('/api/v1/admin/reload', {
      method: 'POST',
      body: { note: reloadForm.note || null }
    })
    const savedNote = reloadForm.note
    reloadForm.note = ''
    isReloadModalOpen.value = false
    await Promise.all([refreshReloadLogs(), refreshAuditLogs()])
    toast.add({
      title: 'Zapisano reload',
      description: savedNote ? `Dodano notatkę: "${savedNote}"` : 'Zarejestrowano puste przeładowanie.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Błąd zapisu',
      description: 'Nie udało się dodać wpisu reload.',
      color: 'error'
    })
  } finally {
    isCreatingReload.value = false
  }
}
</script>
