<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Urządzenia Sieciowe</h1>
      <UButton icon="i-heroicons-plus" label="Dodaj urządzenie" />
    </div>

    <UCard>
      <UTable :rows="devices" :columns="columns" :loading="pending">
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'active' ? 'emerald' : 'gray'" variant="soft">
            {{ row.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const { data: devices, pending } = await useFetch('/api/v2/network/devices')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'hostname', label: 'Hostname' },
  { key: 'ip_address', label: 'Adres IP' },
  { key: 'status', label: 'Status' }
]
</script>
