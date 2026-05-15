<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sieci IP</h1>
        <p class="text-sm text-gray-500">Ewidencja podsieci management i access z liczbą powiązanych urządzeń</p>
      </div>
      <div class="flex gap-3">
        <UButton to="/network/nodes" color="gray" variant="soft" icon="i-heroicons-map-pin" label="Węzły" />
        <UButton to="/network/devices" color="gray" variant="soft" icon="i-heroicons-cpu-chip" label="Urządzenia" />
        <UButton color="primary" icon="i-heroicons-plus" label="Nowa sieć" @click="openCreateModal" />
      </div>
    </div>

    <UCard>
      <template #header>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Szukaj po nazwie, CIDR, bramie lub VLAN..."
        />
      </template>

      <UTable :rows="filteredNetworks" :columns="columns" :loading="pending">
        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'emerald' : 'gray'" variant="soft">
            {{ row.active ? 'Aktywna' : 'Wyłączona' }}
          </UBadge>
        </template>

        <template #usage-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <div>Urządzenia sieciowe: {{ row.deviceCount }}</div>
            <div>Urządzenia klientów: {{ row.customerDeviceCount }}</div>
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openEditModal(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeNetwork(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h3 class="text-lg font-bold">{{ form.id ? 'Edytuj sieć IP' : 'Dodaj sieć IP' }}</h3>
        </template>

        <form class="space-y-4 p-4" @submit.prevent="saveNetwork">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Nazwa" required>
              <UInput v-model="form.name" />
            </UFormGroup>
            <UFormGroup label="CIDR" required>
              <UInput v-model="form.cidr" placeholder="10.10.100.0/24" />
            </UFormGroup>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Brama">
              <UInput v-model="form.gateway" placeholder="10.10.100.1" />
            </UFormGroup>
            <UFormGroup label="VLAN ID">
              <UInput v-model="form.vlanId" type="number" />
            </UFormGroup>
          </div>

          <UFormGroup label="Opis">
            <UTextarea v-model="form.description" :rows="3" />
          </UFormGroup>

          <label class="flex items-center gap-3 text-sm">
            <input v-model="form.active" type="checkbox" class="rounded border-gray-300">
            <span>Sieć aktywna</span>
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
const search = ref('')
const isModalOpen = ref(false)
const isSaving = ref(false)

const columns = [
  { key: 'name', label: 'Nazwa' },
  { key: 'cidr', label: 'CIDR' },
  { key: 'gateway', label: 'Brama' },
  { key: 'vlanId', label: 'VLAN' },
  { key: 'usage', label: 'Wykorzystanie' },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

const form = reactive({
  id: null,
  name: '',
  cidr: '',
  gateway: '',
  vlanId: '',
  description: '',
  active: true
})

const { data: networks, pending, refresh } = await useFetch('/api/v1/ip-networks')

const filteredNetworks = computed(() => {
  const rows = networks.value || []
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return rows
  }

  return rows.filter((row) =>
    row.name.toLowerCase().includes(query) ||
    row.cidr.toLowerCase().includes(query) ||
    (row.gateway || '').toLowerCase().includes(query) ||
    String(row.vlanId || '').includes(query)
  )
})

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: '',
    cidr: '',
    gateway: '',
    vlanId: '',
    description: '',
    active: true
  })
}

const openCreateModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = async (row) => {
  const network = await $fetch(`/api/v1/ip-networks/${row.id}`)
  Object.assign(form, {
    id: network.id,
    name: network.name,
    cidr: network.cidr,
    gateway: network.gateway || '',
    vlanId: network.vlanId ?? '',
    description: network.description || '',
    active: !!network.active
  })
  isModalOpen.value = true
}

const saveNetwork = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      cidr: form.cidr,
      gateway: form.gateway || null,
      vlanId: form.vlanId === '' ? null : Number(form.vlanId),
      description: form.description || null,
      active: !!form.active
    }

    if (form.id) {
      await $fetch(`/api/v1/ip-networks/${form.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/v1/ip-networks', {
        method: 'POST',
        body: payload
      })
    }

    isModalOpen.value = false
    resetForm()
    await refresh()
  } catch (error) {
    console.error('Failed to save IP network', error)
  } finally {
    isSaving.value = false
  }
}

const removeNetwork = async (row) => {
  if (!confirm(`Czy na pewno chcesz usunąć sieć "${row.name}"?`)) {
    return
  }

  await $fetch(`/api/v1/ip-networks/${row.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
