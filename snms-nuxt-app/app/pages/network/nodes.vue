<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Węzły Sieciowe</h1>
      <div class="flex gap-2">
        <UButton icon="i-heroicons-map" label="Pokaż mapę" variant="soft" color="gray" />
        <UButton icon="i-heroicons-plus" label="Dodaj węzeł" />
      </div>
    </div>

    <UCard>
      <UTable :rows="nodes" :columns="columns" :loading="pending">
        <template #location_type-data="{ row }">
          <UBadge variant="soft" color="blue">
            {{ row.location_type }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const { data: nodes, pending } = await useFetch('/api/v2/network/nodes')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nazwa' },
  { key: 'location_type', label: 'Typ' },
  { key: 'address', label: 'Adres' }
]
</script>
