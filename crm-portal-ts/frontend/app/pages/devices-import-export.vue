<template>
  <div class="p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Import / Export urządzeń</h1>
        <p class="text-sm text-gray-500">Wgraj inwentaryzację JSON, pobierz konfigurację lub wygeneruj backup RouterOS-style</p>
      </div>
      <UBadge color="indigo" variant="soft">Devices API</UBadge>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
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

      <UCard>
        <template #header>
          <h3 class="font-bold">Backup konfiguracji</h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Metoda">
            <USelect v-model="backupMethod" :options="backupMethods" />
          </UFormGroup>

          <template v-if="backupMethod === 'routeros_ssh'">
            <UFormGroup label="Login RouterOS">
              <UInput v-model="routerOs.username" placeholder="admin" />
            </UFormGroup>
            <UFormGroup label="Hasło RouterOS">
              <UInput v-model="routerOs.password" type="password" placeholder="opcjonalnie" />
            </UFormGroup>
          </template>

          <UButton icon="i-heroicons-circle-stack" color="orange" :loading="backingUp" :disabled="!deviceId" @click="backupDevice">
            Wygeneruj backup
          </UButton>

          <UTextarea v-if="backupOutput" v-model="backupOutput" :rows="14" readonly />
          <UAlert v-if="backupError" color="red" variant="soft" :title="backupError" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null)
const importing = ref(false)
const exporting = ref(false)
const backingUp = ref(false)
const importMessage = ref('')
const importError = ref('')
const exportError = ref('')
const backupError = ref('')
const deviceId = ref('')
const exportedJson = ref('')
const backupOutput = ref('')
const backupMethod = ref('inventory')
const backupMethods = [
  { label: 'Inventory export (bez połączenia z urządzeniem)', value: 'inventory' },
  { label: 'RouterOS SSH /export terse hide-sensitive', value: 'routeros_ssh' }
]
const routerOs = reactive({
  username: '',
  password: ''
})

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

const backupDevice = async () => {
  backupError.value = ''
  backupOutput.value = ''

  if (!deviceId.value) {
    backupError.value = 'Podaj ID urządzenia.'
    return
  }

  backingUp.value = true
  try {
    const body = {
      method: backupMethod.value,
      username: routerOs.username || undefined,
      password: routerOs.password || undefined
    }
    const result = await $fetch(`/api/v2/devices/${deviceId.value}/backup`, {
      method: 'POST',
      body
    })

    if (result.error || result.success === false) {
      backupError.value = result.error || 'Backup nie powiódł się.'
    } else {
      backupOutput.value = result.content || JSON.stringify(result, null, 2)
    }
  } catch (e) {
    backupError.value = 'Backup nie powiódł się.'
  } finally {
    backingUp.value = false
  }
}
</script>
