import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import type { PropType } from 'vue'
import type { ChartConfig, ChartData } from '../../types/chart'

export default defineComponent({
  name: 'BaseChart',
  props: {
    config: {
      type: Object as PropType<ChartConfig>,
      required: true
    },
    data: {
      type: Array as PropType<ChartData[]>,
      required: true
    },
    chart: Object
  },
  setup() {
    const chartRef = ref<HTMLElement | null>(null)
    let chart: echarts.ECharts | null = null

    const initChart = () => {
      if (!chartRef.value) return
      chart = echarts.init(chartRef.value)
      return chart
    }

    const resizeChart = () => {
      chart?.resize()
    }
    onMounted(() => {
      chart = initChart() as echarts.ECharts
      window.addEventListener('resize', resizeChart)
    })

    onUnmounted(() => {
      chart?.dispose()
      window.removeEventListener('resize', resizeChart)
    })


    return {
      chartRef,
      chart: computed(() => chart)
    }
  }
}) 