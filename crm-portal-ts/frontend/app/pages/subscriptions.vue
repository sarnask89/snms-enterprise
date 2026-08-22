<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subskrypcje</h1>
        <p class="text-sm text-gray-500">Powiązanie klienta, taryfy i opcjonalnego urządzenia dostępowego</p>
      </div>
      <div class="flex gap-3">
        <UButton to="/finances" color="neutral" variant="soft" icon="i-lucide-banknote" label="Finanse" aria-label="Przejdź do finansów" />
        <UButton color="primary" icon="i-lucide-plus" label="Nowa subskrypcja" aria-label="Dodaj nową subskrypcję" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <UTable :data="subscriptions || []" :columns="columns" :loading="pendingSubscriptions">
        <template #active-cell="{ row }">
          <UBadge :color="(row.original || row).active ? 'success' : 'neutral'" variant="soft">
            {{ (row.original || row).active ? 'Aktywna' : 'Wyłączona' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-pencil" :aria-label="`Edytuj subskrypcję ${getItemCode(row.original || row)}`" @click="openEditModal(row.original || row)" />
            <UButton size="xs" :color="(row.original || row).active ? 'warning' : 'success'" variant="ghost" :icon="(row.original || row).active ? 'i-lucide-power-off' : 'i-lucide-power'" :aria-label="`${(row.original || row).active ? 'Dezaktywuj' : 'Aktywuj'} subskrypcję ${getItemCode(row.original || row)}`" @click="toggleSubscription(row.original || row)" />
            <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" :aria-label="`Usuń subskrypcję ${getItemCode(row.original || row)}`" @click="removeSubscription(row.original || row)" />
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
            <UFormField label="Klient" required>
              <USelect v-model="form.customerId" :items="customerOptions" label-key="label" aria-label="Wybierz klienta" />
            </UFormField>
            <UFormField label="Taryfa" required>
              <USelect v-model="form.tariffId" :items="tariffOptions" label-key="label" aria-label="Wybierz taryfę" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Urządzenie">
              <USelect v-model="form.deviceId" :items="deviceOptions" label-key="label" aria-label="Wybierz urządzenie" />
            </UFormField>
            <UFormField label="Technologia">
              <USelect v-model="form.technology" :items="technologyOptions" label-key="label" aria-label="Wybierz technologię" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Start" required>
              <UInput v-model="form.startDate" type="date" aria-label="Data rozpoczęcia subskrypcji" />
            </UFormField>
            <UFormField label="Koniec">
              <UInput v-model="form.endDate" type="date" aria-label="Data zakończenia subskrypcji" />
            </UFormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Download (Mbps)">
              <UInput v-model="form.speedDownMbps" type="number" aria-label="Prędkość pobierania w Mbps" />
            </UFormField>
            <UFormField label="Upload (Mbps)">
              <UInput v-model="form.speedUpMbps" type="number" aria-label="Prędkość wysyłania w Mbps" />
            </UFormField>
          </div>

          <div class="pt-2">
            <UCheckbox v-model="form.active" label="Subskrypcja aktywna" />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="ghost" label="Anuluj" aria-label="Anuluj edycję subskrypcji" @click="isModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSaving" label="Zapisz" aria-label="Zapisz subskrypcję" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const toast = useToast()

const getCustomerLabel = (item) => {
  if (!item?.customer) return 'Brak klienta'
  return `${item.customer.customerCode} · ${item.customer.firstName} ${item.customer.lastName}`
}

const getTariffLabel = (item) => {
  if (!item?.tariff) return 'Brak taryfy'
  return `${item.tariff.name} · ${Number(item.tariff.monthlyPrice || 0).toFixed(2)} PLN`
}

const getDeviceLabel = (item) => {
  if (!item?.device) return 'Wszystkie urządzenia'
  return `${item.device.hostname}${item.device.ipAddress ? ` (${item.device.ipAddress})` : ''}`
}

const getItemCode = (item) => {
  return item?.customer?.customerCode || item?.customerId || item?.id || ''
}

const columns = [
  { id: 'customer', header: 'Klient', accessorFn: (row) => getCustomerLabel(row) },
  { id: 'tariff', header: 'Taryfa', accessorFn: (row) => getTariffLabel(row) },
  { id: 'device', header: 'Urządzenie', accessorFn: (row) => getDeviceLabel(row) },
  { accessorKey: 'technology', header: 'Technologia' },
  { accessorKey: 'startDate', header: 'Start' },
  { id: 'active', header: 'Status' },
  { id: 'actions', header: 'Akcje' }
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

  try {
    customerDevices.value = await $fetch(`/api/v1/subscriptions/customer-nodes/${customerId}`)
  } catch {
    customerDevices.value = []
  }
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
  try {
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
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się pobrać danych subskrypcji.', color: 'error' })
  }
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
      toast.add({ title: 'Sukces', description: 'Subskrypcja została zaktualizowana.', color: 'success' })
    } else {
      await $fetch('/api/v1/subscriptions', { method: 'POST', body: payload })
      toast.add({ title: 'Sukces', description: 'Nowa subskrypcja została dodana.', color: 'success' })
    }

    isModalOpen.value = false
    resetForm()
    customerDevices.value = []
    await refreshSubscriptions()
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się zapisać subskrypcji.', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

const toggleSubscription = async (row) => {
  try {
    await $fetch(`/api/v1/subscriptions/${row.id}/toggle`, { method: 'POST' })
    toast.add({ title: 'Sukces', description: 'Zmieniono status subskrypcji.', color: 'success' })
    await refreshSubscriptions()
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się zmienić statusu subskrypcji.', color: 'error' })
  }
}

const removeSubscription = async (row) => {
  const code = row.customer?.customerCode || row.customerId
  if (!confirm(`Usunąć subskrypcję klienta ${code}?`)) return
  try {
    await $fetch(`/api/v1/subscriptions/${row.id}`, { method: 'DELETE' })
    toast.add({ title: 'Sukces', description: 'Subskrypcja została usunięta.', color: 'success' })
    await refreshSubscriptions()
  } catch {
    toast.add({ title: 'Błąd', description: 'Nie udało się usunąć subskrypcji.', color: 'error' })
  }
}
</script>
