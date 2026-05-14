<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  series: Array<{
    timestamp: string
    bytes: number
  }>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const buildChart = () => {
  if (!canvasRef.value) {
    return
  }

  const labels = props.series.map(item => {
    return new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  const data = props.series.map(item => item.bytes / 1024 / 1024)

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Traffic MB',
          data,
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  })
}

watch(() => props.series, () => {
  buildChart()
}, {
  deep: true
})

onMounted(() => {
  buildChart()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span>Traffic Timeseries</span>
        <span class="text-xs text-gray-500">24h</span>
      </div>
    </template>

    <div class="h-[320px]">
      <canvas ref="canvasRef" />
    </div>
  </UCard>
</template>
