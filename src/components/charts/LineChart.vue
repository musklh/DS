<template>
  <div class="chart-wrapper" ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ChartData } from '../../types/chart'

export default defineComponent({
  name: 'LineChart',
  props: {
    config: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref<HTMLElement | null>(null)
    let chart: echarts.ECharts | null = null

    const initChart = () => {
      if (!chartRef.value) return
      
      chart = echarts.init(chartRef.value)
      updateChart()
    }

    const updateChart = () => {
      if (!chart) return

      const option = {
        title: {
          text: props.config.title
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: props.data.map((item: any) => String(item[props.config.xAxis]))
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: props.data.map((item: any) => Number((item as ChartData)[props.config.yAxis])),
          type: 'line',
          smooth: true
        }]
      }

      chart.setOption(option)
    }

    onMounted(() => {
      initChart()
    })

    watch(() => props.config, updateChart, { deep: true })
    watch(() => props.data, updateChart, { deep: true })

    return {
      chartRef
    }
  }
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 500px;
}
</style> 