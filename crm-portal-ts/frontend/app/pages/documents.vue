<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dokumenty</h1>
        <p class="text-sm text-gray-500">Upload, pobieranie i usuwanie dokumentów w aktywnym baseline TS/Nuxt</p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" label="Dodaj dokument" @click="openCreateModal" />
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div class="flex flex-1 gap-3">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="Szukaj po tytule, typie, notatkach lub nazwie pliku..."
              class="flex-1"
            />
            <USelect
              v-model="customerFilter"
              :items="customerOptionsWithEmpty"
              label-key="label"
              class="w-full md:w-72"
            />
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshDocuments" />
        </div>
      </template>

      <UTable :data="filteredDocuments" :columns="columns" :loading="pendingDocuments">
        <template #customer-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : 'Dokument ogólny' }}
          </div>
        </template>

        <template #docType-data="{ row }">
          <UBadge color="primary" variant="soft">{{ row.docType }}</UBadge>
        </template>

        <template #file-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <div class="font-medium text-gray-900 dark:text-white">{{ row.originalFilename || 'Brak nazwy pliku' }}</div>
            <div>{{ formatFileSize(row.fileSize) }}<span v-if="row.mimeType"> · {{ row.mimeType }}</span></div>
          </div>
        </template>

        <template #createdAt-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(row.createdAt) }}</div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton size="xs" color="primary" variant="ghost" icon="i-heroicons-arrow-down-tray" @click="downloadDocument(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeDocument(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">Dodaj dokument</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveDocument">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Tytuł" required>
              <UInput v-model="form.title" />
            </UFormField>

            <UFormField label="Typ dokumentu" required>
              <USelect v-model="form.docType" :items="docTypeOptions" label-key="label" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Klient">
              <USelect v-model="form.customerId" :items="customerOptionsWithEmpty" label-key="label" />
            </UFormField>

            <UFormField label="Plik" required>
              <input
                :key="fileInputKey"
                type="file"
                class="block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"
                @change="onFileChange"
              >
            </UFormField>
          </div>

          <UFormField label="Notatki">
            <UTextarea v-model="form.notes" :data="4" />
          </UFormField>

          <div v-if="selectedFileName" class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm text-gray-600 dark:text-gray-300">
            Wybrany plik: <span class="font-medium text-gray-900 dark:text-white">{{ selectedFileName }}</span>
            <span v-if="selectedMimeType"> · {{ selectedMimeType }}</span>
          </div>

          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSaving" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const columns = [
  { accessorKey: 'title', header: 'Tytuł' },
  { accessorKey: 'customer', header: 'Klient' },
  { accessorKey: 'docType', header: 'Typ' },
  { accessorKey: 'file', header: 'Plik' },
  { accessorKey: 'createdAt', header: 'Dodano' },
  { accessorKey: 'actions', header: 'Akcje' }
]

const docTypeOptions = [
  { label: 'Contract', value: 'contract' },
  { label: 'Invoice', value: 'invoice' },
  { label: 'Protocol', value: 'protocol' },
  { label: 'Attachment', value: 'attachment' },
  { label: 'Other', value: 'other' }
]

const search = ref('')
const customerFilter = ref(null)
const isModalOpen = ref(false)
const isSaving = ref(false)
const fileInputKey = ref(0)
const selectedFileName = ref('')
const selectedMimeType = ref('')
const selectedFileBase64 = ref('')

const form = reactive({
  title: '',
  docType: 'contract',
  customerId: null,
  notes: ''
})

const { data: documents, pending: pendingDocuments, refresh: refreshDocuments } = await useFetch('/api/v1/documents')
const { data: customers } = await useFetch('/api/v1/customers', {
  query: { limit: 200 }
})

const customerOptionsWithEmpty = computed(() => [
  { label: 'Wszyscy / bez klienta', value: null },
  ...((customers.value || []).map((customer) => ({
    label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
    value: customer.id
  })))
])

const filteredDocuments = computed(() => {
  const rows = documents.value || []
  const query = search.value.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesCustomer = !customerFilter.value || row.customerId === customerFilter.value
    if (!matchesCustomer) {
      return false
    }

    if (!query) {
      return true
    }

    return [
      row.title,
      row.docType,
      row.notes || '',
      row.originalFilename || ''
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const resetForm = () => {
  Object.assign(form, {
    title: '',
    docType: 'contract',
    customerId: null,
    notes: ''
  })
  selectedFileName.value = ''
  selectedMimeType.value = ''
  selectedFileBase64.value = ''
  fileInputKey.value += 1
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const onFileChange = async (event) => {
  const file = event.target?.files?.[0]
  if (!file) {
    selectedFileName.value = ''
    selectedMimeType.value = ''
    selectedFileBase64.value = ''
    return
  }

  selectedFileName.value = file.name
  selectedMimeType.value = file.type || 'application/octet-stream'
  selectedFileBase64.value = await readFileAsBase64(file)
}

const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : ''
    resolve(result.includes(',') ? result.split(',')[1] : result)
  }
  reader.onerror = () => reject(reader.error || new Error('Nie udało się odczytać pliku'))
  reader.readAsDataURL(file)
})

const formatDate = (value) => {
  if (!value) {
    return 'Brak daty'
  }

  return new Date(value).toLocaleString('pl-PL')
}

const formatFileSize = (bytes) => {
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

const saveDocument = async () => {
  if (!selectedFileBase64.value || !selectedFileName.value) {
    return
  }

  isSaving.value = true
  try {
    await $fetch('/api/v1/documents', {
      method: 'POST',
      body: {
        title: form.title,
        docType: form.docType,
        customerId: form.customerId,
        notes: form.notes || null,
        originalFilename: selectedFileName.value,
        mimeType: selectedMimeType.value || null,
        contentBase64: selectedFileBase64.value
      }
    })
    isModalOpen.value = false
    resetForm()
    await refreshDocuments()
  } finally {
    isSaving.value = false
  }
}

const downloadDocument = (row) => {
  window.open(row.downloadUrl, '_blank', 'noopener')
}

const removeDocument = async (row) => {
  if (!confirm(`Usunąć dokument "${row.title}"?`)) {
    return
  }

  await $fetch(`/api/v1/documents/${row.id}`, { method: 'DELETE' })
  await refreshDocuments()
}
</script>
