<template>
  <div class="p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Import / Export urządzeń</h1>
        <p class="text-sm text-gray-500">Wgraj inwentaryzację JSON lub pobierz konfigurację urządzenia z API v2</p>
      </div>
      <UBadge color="indigo" variant="soft">Devices API</UBadge>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h3 class="font-bold">Import urządzeń z JSON</h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-500">
            Format: tablica obiektów z polami <code>name</code>, <code>hostname</code>, <code>management_ip</code>, <code>device_type</code>.
          </p>

          <input type="file" accept="application/json,.json" @change="onFileChange" />

          <UButton icon="i-heroicons-arrow-up-tray" color="primary" :loading="importing" :disabled="!selectedFile" @click="importDevices">
            Importuj
          </UButton>

          <UAlert v-if="importMessage" color="green" variant="soft" :title="importMessage" />
          <UAlert v-if="importError" color="red" variant="soft" :title="importError" />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-bold">Export urządzenia</h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="ID urządzenia">
            <UInput v-model="deviceId" type="number" placeholder="np. 1" />
          </UFormGroup>

          <UButton icon="i-heroicons-arrow-down-tray" color="gray" :loading="exporting" @click="exportDevice">
            Pobierz JSON
          </UButton>

          <UTextarea v-if="exportedJson" v-model="exportedJson" :rows="12" readonly />
          <UAlert v-if="exportError" color="red" variant="soft" :title="exportError" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null)
const importing = ref(false)
const exporting = ref(false)
const importMessage = ref('')
const importError = ref('')
const exportError = ref('')
const deviceId = ref('')
const exportedJson = ref('')

const onFileChange = (event) => {
  selectedFile.value = event.target.files?.[0] || null
}

const importDevices = async () => {
  importMessage.value = ''
  importError.value = ''

  if (!selectedFile.value) {
    importError.value = 'Wybierz plik JSON.'
    return
  }

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const result = await $fetch('/api/v2/devices/import', {
      method: 'POST',
      body: formData
    })

    if (result.error) {
      importError.value = result.error
    } else {
      importMessage.value = `Zaimportowano urządzeń: ${result.imported || 0}`
    }
  } catch (e) {
    importError.value = 'Import nie powiódł się.'
  } finally {
    importing.value = false
  }
}

const exportDevice = async () => {
  exportError.value = ''
  exportedJson.value = ''

  if (!deviceId.value) {
    exportError.value = 'Podaj ID urządzenia.'
    return
  }

  exporting.value = true
  try {
    const result = await $fetch(`/api/v2/devices/${deviceId.value}/export`)
    if (result.error) {
      exportError.value = result.error
    } else {
      exportedJson.value = JSON.stringify(result, null, 2)
    }
  } catch (e) {
    exportError.value = 'Export nie powiódł się.'
  } finally {
    exporting.value = false
  }
}
</script>
