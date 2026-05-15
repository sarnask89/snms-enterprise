<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Szukaj..."
        class="max-w-xs"
        aria-label="Szukaj"
      />
      <slot name="actions" />
    </div>

    <UTable
      :rows="rows"
      :columns="columns"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </UTable>

    <div v-if="total > limit" class="flex justify-center px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <UPagination
        v-model="page"
        :page-count="limit"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: Array,
  columns: Array,
  loading: Boolean,
  total: Number,
  limit: { type: Number, default: 20 }
})

const emit = defineEmits(['update:page', 'update:search'])

const page = useVModel(props, 'page', emit)
const search = useVModel(props, 'search', emit)
</script>
