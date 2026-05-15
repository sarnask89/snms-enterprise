<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subskrypcje</h1>
        <p class="text-sm text-gray-500">Powiązanie klienta, taryfy i opcjonalnego urządzenia dostępowego</p>
      </div>
      <div class="flex gap-3">
        <UButton to="/finances" color="gray" variant="soft" icon="i-heroicons-banknotes" label="Finanse" />
        <UButton color="primary" icon="i-heroicons-plus" label="Nowa subskrypcja" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <UTable :rows="subscriptions || []" :columns="columns" :loading="pendingSubscriptions">
        <template #customer-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : 'Brak klienta' }}
          </div>
        </template>

        <template #tariff-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.tariff ? `${row.tariff.name} · ${row.tariff.monthlyPrice.toFixed(2)} PLN` : 'Brak taryfy' }}
          </div>
        </template>

        <template #device-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.device ? `${row.device.hostname} ${row.device.ipAddress ? `(${row.device.ipAddress})` : ''}` : 'Wszystkie urządzenia' }}
          </div>
        </template>

        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'emerald' : 'gray'" variant="soft">
            {{ row.active ? 'Aktywna' : 'Wyłączona' }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openEditModal(row)" />
            <UButton size="xs" :color="row.active ? 'yellow' : 'emerald'" variant="ghost" icon="i-heroicons-power" @click="toggleSubscription(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeSubscription(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">{{ form.id ? 'Edytuj subskrypcję' : 'Dodaj subskrypcję' }}</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveSubscription">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Klient" required>
              <USelect v-model="form.customerId" :options="customerOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Taryfa" required>
              <USelect v-model="form.tariffId" :options="tariffOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Urządzenie">
              <USelect v-model="form.deviceId" :options="deviceOptions" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Technologia">
              <USelect v-model="form.technology" :options="technologyOptions" option-attribute="label" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Start" required>
              <UInput v-model="form.startDate" type="date" />
            </UFormGroup>
            <UFormGroup label="Koniec">
              <UInput v-model="form.endDate" type="date" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Download (Mbps)">
              <UInput v-model="form.speedDownMbps" type="number" />
            </UFormGroup>
            <UFormGroup label="Upload (Mbps)">
              <UInput v-model="form.speedUpMbps" type="number" />
            </UFormGroup>
          </div>

          <label class="flex items-center gap-3 text-sm">
            <input v-model="form.active" type="checkbox" class="rounded border-gray-300">
            <span>Subskrypcja aktywna</span>
          </label>

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
  { key: 'customer', label: 'Klient' },
  { key: 'tariff', label: 'Taryfa' },
  { key: 'device', label: 'Urządzenie' },
  { key: 'technology', label: 'Technologia' },
  { key: 'startDate', label: 'Start' },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

const technologyOptions = [
  { label: 'FTTH', value: 'FTTH' },
  { label: 'HFC', value: 'HFC' },
  { label: 'ADSL', value: 'ADSL' },
  { label: 'Ethernet', value: 'Ethernet' },
  { label: 'Wireless', value: 'Wireless' },
  { label: 'Copper', value: 'Copper' },
  { label: 'Other', value: 'Other' }
]

const isModalOpen = ref(false)
const isSaving = ref(false)
const customerDevices = ref([])

const form = reactive({
  id: null,
  customerId: null,
  tariffId: null,
  deviceId: null,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  active: true,
  technology: 'FTTH',
  speedDownMbps: '',
  speedUpMbps: ''
})

const { data: subscriptions, pending: pendingSubscriptions, refresh: refreshSubscriptions } = await useFetch('/api/v1/subscriptions')
const { data: customers } = await useFetch('/api/v1/customers', { query: { limit: 200 } })
const { data: tariffs } = await useFetch('/api/v1/finances/tariffs')

const customerOptions = computed(() => (customers.value || []).map((customer) => ({
  label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
  value: customer.id
})))

const tariffOptions = computed(() => (tariffs.value || []).map((tariff) => ({
  label: `${tariff.name} · ${tariff.monthlyPrice.toFixed(2)} PLN`,
  value: tariff.id
})))

const deviceOptions = computed(() => [
  { label: 'Wszystkie urządzenia', value: null },
  ...customerDevices.value.map((device) => ({
    label: `${device.hostname}${device.ipAddress ? ` (${device.ipAddress})` : ''}`,
    value: device.id
  }))
])

const loadCustomerDevices = async (customerId) => {
  if (!customerId) {
    customerDevices.value = []
    return
  }

  customerDevices.value = await $fetch(`/api/v1/subscriptions/customer-nodes/${customerId}`)
}

watch(() => form.customerId, async (customerId) => {
  await loadCustomerDevices(customerId)
  if (!customerDevices.value.some((device) => device.id === form.deviceId)) {
    form.deviceId = null
  }
})

const resetForm = () => Object.assign(form, {
  id: null,
  customerId: null,
  tariffId: null,
  deviceId: null,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  active: true,
  technology: 'FTTH',
  speedDownMbps: '',
  speedUpMbps: ''
})

const openCreateModal = async () => {
  resetForm()
  customerDevices.value = []
  isModalOpen.value = true
}

const openEditModal = async (row) => {
  const subscription = await $fetch(`/api/v1/subscriptions/${row.id}`)
  Object.assign(form, {
    id: subscription.id,
    customerId: subscription.customerId,
    tariffId: subscription.tariffId,
    deviceId: subscription.deviceId,
    startDate: subscription.startDate,
    endDate: subscription.endDate || '',
    active: !!subscription.active,
    technology: subscription.technology,
    speedDownMbps: subscription.speedDownMbps ?? '',
    speedUpMbps: subscription.speedUpMbps ?? ''
  })
  await loadCustomerDevices(subscription.customerId)
  isModalOpen.value = true
}

const saveSubscription = async () => {
  isSaving.value = true
  try {
    const payload = {
      customerId: form.customerId,
      tariffId: form.tariffId,
      deviceId: form.deviceId,
      startDate: form.startDate,
      endDate: form.endDate || null,
      active: !!form.active,
      technology: form.technology,
      speedDownMbps: form.speedDownMbps === '' ? null : Number(form.speedDownMbps),
      speedUpMbps: form.speedUpMbps === '' ? null : Number(form.speedUpMbps)
    }

    if (form.id) {
      await $fetch(`/api/v1/subscriptions/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/subscriptions', { method: 'POST', body: payload })
    }

    isModalOpen.value = false
    resetForm()
    customerDevices.value = []
    await refreshSubscriptions()
  } finally {
    isSaving.value = false
  }
}

const toggleSubscription = async (row) => {
  await $fetch(`/api/v1/subscriptions/${row.id}/toggle`, { method: 'POST' })
  await refreshSubscriptions()
}

const removeSubscription = async (row) => {
  if (!confirm(`Usunąć subskrypcję klienta ${row.customer?.customerCode || row.customerId}?`)) return
  await $fetch(`/api/v1/subscriptions/${row.id}`, { method: 'DELETE' })
  await refreshSubscriptions()
}
</script>
