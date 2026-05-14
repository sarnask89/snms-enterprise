<script setup lang="ts">
defineProps<{
  talkers: Array<{
    ip: string
    bytes: number
  }>
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
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span>Top Talkers</span>
        <span class="text-xs text-gray-500">NetFlow</span>
      </div>
    </template>

    <div v-if="!talkers.length" class="text-sm text-gray-500 py-6 text-center">
      No NetFlow talkers yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="talker in talkers"
        :key="talker.ip"
        class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
      >
        <div>
          <div class="font-mono text-sm">{{ talker.ip }}</div>
          <div class="text-xs text-gray-500">source IP</div>
        </div>
        <div class="text-sm font-semibold">
          {{ formatBytes(talker.bytes) }}
        </div>
      </div>
    </div>
  </UCard>
</template>
