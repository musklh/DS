<template>
  <div class="chart-wrapper" ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'ScatterChart',
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
      const scatterData = props.data.map((item: any) => [
        item[props.config.xAxis],
        item[props.config.yAxis]
      ])

      const option = {
        title: {
          text: props.config.title
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${props.config.xAxis}: ${params.value[0]}<br/>${props.config.yAxis}: ${params.value[1]}`
          }
        },
        xAxis: {
          type: 'value',
          name: props.config.xAxis
        },
        yAxis: {
          type: 'value',
          name: props.config.yAxis
        },
        series: [{
          type: 'scatter',
          data: scatterData,
          symbolSize: 10,
          itemStyle: {
            opacity: 0.8
          }
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