<script setup lang="ts">
defineProps<{
  summary: {
    total_devices: number
    active_devices: number
    traffic_today_bytes: number
    alerts_last_24h: number
  } | null
}>()

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let index = 0

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index++
  }

  return `${value.toFixed(2)} ${units[index]}`
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <UCard>
      <template #header>Total Devices</template>
      <div class="text-3xl font-bold">
        {{ summary?.total_devices ?? 0 }}
      </div>
    </UCard>

    <UCard>
      <template #header>Active Devices</template>
      <div class="text-3xl font-bold text-green-500">
        {{ summary?.active_devices ?? 0 }}
      </div>
    </UCard>

    <UCard>
      <template #header>Traffic (24h)</template>
      <div class="text-xl font-semibold">
        {{ formatBytes(summary?.traffic_today_bytes ?? 0) }}
      </div>
    </UCard>

    <UCard>
      <template #header>Alerts (24h)</template>
      <div class="text-3xl font-bold text-orange-500">
        {{ summary?.alerts_last_24h ?? 0 }}
      </div>
    </UCard>
  </div>
</template>
