<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <UCard v-for="stat in stats" :key="stat.label">
      <div class="flex items-center gap-4">
        <div :class="`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`">
          <UIcon :name="stat.icon" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>
