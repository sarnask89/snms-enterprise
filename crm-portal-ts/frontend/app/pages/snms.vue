<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">SNMS entities</h1>
        <p class="text-sm text-gray-500">Wiadomości, szablony, terminarz, statystyki ruchu i ustawienia runtime.</p>
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="font-semibold text-lg">Szablony i wiadomości</h2>
              <p class="text-sm text-gray-500">Tworzenie szablonów i wiadomości wychodzących.</p>
            </div>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid md:grid-cols-3 gap-3">
            <UInput v-model="templateForm.name" placeholder="Nazwa szablonu" />
            <UInput v-model="templateForm.subject" placeholder="Temat szablonu" class="md:col-span-2" />
          </div>
          <UTextarea v-model="templateForm.body" :data="3" placeholder="Treść szablonu" />
          <div class="flex justify-end">
            <UButton color="primary" :loading="isSavingTemplate" label="Dodaj szablon" @click="saveTemplate" />
          </div>

          <UTable :data="templates || []" :columns="templateColumns" />

          <USeparator />

          <div class="grid md:grid-cols-2 gap-3">
            <USelectMenu
              v-model="messageForm.templateId"
              :items="templateOptions"
              value-key="value"
              label-key="label"
              placeholder="Szablon opcjonalny"
            />
            <USelectMenu
              v-model="messageForm.customerId"
              :items="customerOptions"
              value-key="value"
              label-key="label"
              placeholder="Klient opcjonalny"
            />
          </div>
          <UInput v-model="messageForm.subject" placeholder="Temat wiadomości" />
          <UTextarea v-model="messageForm.body" :data="4" placeholder="Treść wiadomości" />
          <div class="flex items-center justify-between">
            <UCheckbox v-model="messageForm.sent" label="Oznacz jako sent" />
            <UButton color="primary" variant="soft" :loading="isSavingMessage" label="Dodaj wiadomość" @click="saveMessage" />
          </div>

          <UTable :data="messages || []" :columns="messageColumns" />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Terminarz i ruch</h2>
            <p class="text-sm text-gray-500">Wydarzenia kalendarza i ręczne wpisy statystyk ruchu.</p>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="eventForm.title" placeholder="Tytuł wydarzenia" />
            <USelectMenu
              v-model="eventForm.customerId"
              :items="customerOptions"
              value-key="value"
              label-key="label"
              placeholder="Klient opcjonalny"
            />
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="eventForm.startsAt" type="datetime-local" />
            <UInput v-model="eventForm.endsAt" type="datetime-local" />
          </div>
          <UTextarea v-model="eventForm.description" :data="3" placeholder="Opis wydarzenia" />
          <div class="flex items-center justify-between">
            <UCheckbox v-model="eventForm.done" label="Done" />
            <UButton color="primary" :loading="isSavingEvent" label="Dodaj wydarzenie" @click="saveEvent" />
          </div>

          <UTable :data="timetable || []" :columns="eventColumns" />

          <USeparator />

          <div class="grid md:grid-cols-2 gap-3">
            <USelectMenu
              v-model="trafficForm.deviceId"
              :items="customerDeviceOptions"
              value-key="value"
              label-key="label"
              placeholder="Urządzenie klienta"
            />
            <UInput v-model="trafficForm.note" placeholder="Notatka" />
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="trafficForm.periodStart" type="date" />
            <UInput v-model="trafficForm.periodEnd" type="date" />
          </div>
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="trafficForm.bytesIn" type="number" placeholder="Bytes in" />
            <UInput v-model="trafficForm.bytesOut" type="number" placeholder="Bytes out" />
          </div>
          <div class="flex justify-end">
            <UButton color="primary" variant="soft" :loading="isSavingTrafficStat" label="Dodaj statystykę ruchu" @click="saveTrafficStat" />
          </div>

          <UTable :data="trafficStats || []" :columns="trafficColumns" />
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <div>
          <h2 class="font-semibold text-lg">App settings</h2>
          <p class="text-sm text-gray-500">Lekkie ustawienia runtime współdzielone z modułami TS.</p>
        </div>
      </template>

      <div class="grid md:grid-cols-[1fr_2fr_auto] gap-3 mb-4">
        <UInput v-model="settingForm.key" placeholder="Klucz" />
        <UInput v-model="settingForm.value" placeholder="Wartość" />
        <UButton color="primary" :loading="isSavingSetting" label="Dodaj ustawienie" @click="saveSetting" />
      </div>

      <UTable :data="settings || []" :columns="settingColumns" />
    </UCard>
  </div>
</template>

<script setup>
const templateColumns = [
  { accessorKey: 'name', header: 'Nazwa' },
  { accessorKey: 'subject', header: 'Temat' }
]

const messageColumns = [
  { accessorKey: 'subject', header: 'Temat' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Utworzono' }
]

const eventColumns = [
  { accessorKey: 'title', header: 'Tytuł' },
  { accessorKey: 'startsAt', header: 'Start' },
  { accessorKey: 'endsAt', header: 'Koniec' },
  { accessorKey: 'done', header: 'Done' }
]

const trafficColumns = [
  { accessorKey: 'periodStart', header: 'Od' },
  { accessorKey: 'periodEnd', header: 'Do' },
  { accessorKey: 'bytesIn', header: 'Bytes in' },
  { accessorKey: 'bytesOut', header: 'Bytes out' }
]

const settingColumns = [
  { accessorKey: 'key', header: 'Klucz' },
  { accessorKey: 'value', header: 'Wartość' }
]

const templateForm = reactive({ name: '', subject: '', body: '' })
const messageForm = reactive({ templateId: null, customerId: null, subject: '', body: '', sent: false })
const eventForm = reactive({ title: '', description: '', startsAt: '', endsAt: '', customerId: null, done: false })
const trafficForm = reactive({ deviceId: null, periodStart: '', periodEnd: '', bytesIn: '', bytesOut: '', note: '' })
const settingForm = reactive({ accessorKey: '', value: '' })

const isSavingTemplate = ref(false)
const isSavingMessage = ref(false)
const isSavingEvent = ref(false)
const isSavingTrafficStat = ref(false)
const isSavingSetting = ref(false)

const { data: templates, refresh: refreshTemplates } = await useFetch('/api/v1/snms/messages/templates')
const { data: messages, refresh: refreshMessages } = await useFetch('/api/v1/snms/messages')
const { data: timetable, refresh: refreshTimetable } = await useFetch('/api/v1/snms/timetable')
const { data: trafficStats, refresh: refreshTrafficStats } = await useFetch('/api/v1/snms/traffic-stats')
const { data: settings, refresh: refreshSettings } = await useFetch('/api/v1/snms/config')
const { data: customers } = await useFetch('/api/v1/customers', { query: { limit: 200 } })
const { data: customerDevices } = await useFetch('/api/v1/customer-devices', { query: { limit: 200 } })

const templateOptions = computed(() => (templates.value || []).map((row) => ({
  label: row.name,
  value: row.id
})))

const customerOptions = computed(() => [
  { label: 'Bez klienta', value: null },
  ...((customers.value || []).map((customer) => ({
    label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
    value: customer.id
  })))
])

const customerDeviceOptions = computed(() => [
  { label: 'Bez urządzenia', value: null },
  ...((customerDevices.value || []).map((device) => ({
    label: `${device.hostname}${device.ipAddress ? ` · ${device.ipAddress}` : ''}`,
    value: device.id
  })))
])

const refreshAll = async () => {
  await Promise.all([
    refreshTemplates(),
    refreshMessages(),
    refreshTimetable(),
    refreshTrafficStats(),
    refreshSettings()
  ])
}

const saveTemplate = async () => {
  isSavingTemplate.value = true
  try {
    await $fetch('/api/v1/snms/messages/templates', {
      method: 'POST',
      body: { ...templateForm }
    })
    Object.assign(templateForm, { name: '', subject: '', body: '' })
    await refreshTemplates()
  } finally {
    isSavingTemplate.value = false
  }
}

const saveMessage = async () => {
  isSavingMessage.value = true
  try {
    await $fetch('/api/v1/snms/messages', {
      method: 'POST',
      body: { ...messageForm }
    })
    Object.assign(messageForm, { templateId: null, customerId: null, subject: '', body: '', sent: false })
    await refreshMessages()
  } finally {
    isSavingMessage.value = false
  }
}

const saveEvent = async () => {
  isSavingEvent.value = true
  try {
    await $fetch('/api/v1/snms/timetable', {
      method: 'POST',
      body: { ...eventForm }
    })
    Object.assign(eventForm, { title: '', description: '', startsAt: '', endsAt: '', customerId: null, done: false })
    await refreshTimetable()
  } finally {
    isSavingEvent.value = false
  }
}

const saveTrafficStat = async () => {
  isSavingTrafficStat.value = true
  try {
    await $fetch('/api/v1/snms/traffic-stats', {
      method: 'POST',
      body: { ...trafficForm }
    })
    Object.assign(trafficForm, { deviceId: null, periodStart: '', periodEnd: '', bytesIn: '', bytesOut: '', note: '' })
    await refreshTrafficStats()
  } finally {
    isSavingTrafficStat.value = false
  }
}

const saveSetting = async () => {
  isSavingSetting.value = true
  try {
    await $fetch('/api/v1/snms/config', {
      method: 'POST',
      body: { ...settingForm }
    })
    Object.assign(settingForm, { accessorKey: '', value: '' })
    await refreshSettings()
  } finally {
    isSavingSetting.value = false
  }
}
</script>
