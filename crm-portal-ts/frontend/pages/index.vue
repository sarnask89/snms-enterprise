<script setup lang="ts">
import SummaryCards from '~/components/monitoring/SummaryCards.vue'
import TopTalkers from '~/components/monitoring/TopTalkers.vue'
import TrafficChart from '~/components/monitoring/TrafficChart.vue'

const { get } = useApi()

const summary = ref(null)
const talkers = ref([])
const series = ref([])
const loading = ref(true)

const loadDashboard = async () => {
  try {
    loading.value = true

    const [summaryData, talkersData, seriesData] = await Promise.all([
      get('/api/v2/monitoring/summary'),
      get('/api/v2/monitoring/top-talkers'),
      get('/api/v2/monitoring/timeseries')
    ])

    summary.value = summaryData
    talkers.value = talkersData
    series.value = seriesData
  } finally {
    loading.value = false
  }
}

let refreshHandle: NodeJS.Timeout | null = null

onMounted(async () => {
  await loadDashboard()

  refreshHandle = setInterval(() => {
    loadDashboard()
  }, 30000)
})

onBeforeUnmount(() => {
  if (refreshHandle) {
    clearInterval(refreshHandle)
  }
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          SNMS Enterprise
        </h1>
        <p class="text-gray-500">
          Real-time network monitoring dashboard
        </p>
      </div>

      <UBadge color="primary" variant="soft">
        NetFlow v5/v9 Active
      </UBadge>
    </div>

    <div v-if="loading" class="py-20 text-center text-gray-500">
      Loading monitoring data...
    </div>

    <template v-else>
      <SummaryCards :summary="summary" />

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-2">
          <TrafficChart :series="series" />
        </div>

        <div>
          <TopTalkers :talkers="talkers" />
        </div>
      </div>
    </template>
  </div>
</template>
