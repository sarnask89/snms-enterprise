<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ customer ? `${customer.firstName} ${customer.lastName}` : 'Klient' }}
        </h1>
        <p class="text-sm text-gray-500">Edycja podstawowych danych klienta w runtime TS</p>
      </div>
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" to="/customers" label="Wróć do listy" />
    </div>

    <UAlert
      v-if="fetchError"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="Nie udało się pobrać klienta"
      :description="fetchError"
      class="mb-6"
    />

    <UCard v-if="customer">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-bold">Dane klienta</h2>
            <p class="text-sm text-gray-500">Kod: {{ customer.customerCode }}</p>
          </div>
          <UBadge :color="statusColor(form.status)" variant="soft">
            {{ form.status }}
          </UBadge>
        </div>
      </template>

      <form class="space-y-6" @submit.prevent="saveCustomer">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Kod klienta" required>
            <UInput v-model="form.customerCode" />
          </UFormGroup>
          <UFormGroup label="Status">
            <USelect v-model="form.status" :options="statusOptions" />
          </UFormGroup>
          <UFormGroup label="Imię" required>
            <UInput v-model="form.firstName" />
          </UFormGroup>
          <UFormGroup label="Nazwisko" required>
            <UInput v-model="form.lastName" />
          </UFormGroup>
          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" />
          </UFormGroup>
          <UFormGroup label="Telefon">
            <UInput v-model="form.phone" />
          </UFormGroup>
        </div>

        <UFormGroup label="Notatki">
          <UTextarea v-model="form.notes" :rows="5" />
        </UFormGroup>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <h3 class="font-semibold">Grupy klientów</h3>
            </template>
            <div v-if="customer.groups?.length" class="flex flex-wrap gap-2">
              <UBadge v-for="group in customer.groups" :key="group.id" color="primary" variant="soft">
                {{ group.name }}
              </UBadge>
            </div>
            <p v-else class="text-sm text-gray-500">Klient nie jest przypisany do żadnej grupy.</p>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="font-semibold">Urządzenia klienta</h3>
            </template>
            <div v-if="customer.devices?.length" class="space-y-2">
              <div
                v-for="device in customer.devices"
                :key="device.id"
                class="rounded-lg border border-gray-200 dark:border-gray-800 p-3"
              >
                <div class="font-medium">{{ device.hostname }}</div>
                <div class="text-sm text-gray-500">
                  IP: {{ device.ipAddress || 'brak' }} · MAC: {{ device.macAddress || 'brak' }}
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">Brak powiązanych urządzeń.</p>
          </UCard>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" to="/customers" label="Anuluj" />
          <UButton type="submit" color="primary" :loading="isSaving" label="Zapisz zmiany" />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup>
const route = useRoute()
const customerId = computed(() => route.params.id)
const isSaving = ref(false)
const fetchError = ref('')

const statusOptions = [
  { label: 'Aktywny', value: 'active' },
  { label: 'Zawieszony', value: 'suspended' },
  { label: 'Zakończony', value: 'terminated' }
]

const form = reactive({
  customerCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'active',
  notes: ''
})

const { data: customer, refresh } = await useFetch(() => `/api/v1/customers/${customerId.value}`, {
  onResponseError({ response }) {
    fetchError.value = response._data?.message || 'Nieznany błąd'
  }
})

watchEffect(() => {
  if (!customer.value) {
    return
  }

  fetchError.value = ''
  Object.assign(form, {
    customerCode: customer.value.customerCode || '',
    firstName: customer.value.firstName || '',
    lastName: customer.value.lastName || '',
    email: customer.value.email || '',
    phone: customer.value.phone || '',
    status: customer.value.status || 'active',
    notes: customer.value.notes || ''
  })
})

const statusColor = (status) => {
  switch (status) {
    case 'active': return 'emerald'
    case 'suspended': return 'yellow'
    case 'terminated': return 'red'
    default: return 'gray'
  }
}

const saveCustomer = async () => {
  isSaving.value = true
  try {
    await $fetch(`/api/v1/customers/${customerId.value}`, {
      method: 'PUT',
      body: {
        customerCode: form.customerCode,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || null,
        phone: form.phone || null,
        status: form.status,
        notes: form.notes || null
      }
    })

    await refresh()
  } catch (error) {
    fetchError.value = error?.data?.message || error?.message || 'Nie udało się zapisać klienta'
  } finally {
    isSaving.value = false
  }
}
</script>
