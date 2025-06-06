<template>
  <div class="chart-wrapper" ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import BaseChart from './BaseChart'
import type { ChartData } from '../../types/chart'

export default defineComponent({
  name: 'BarChart',
  extends: BaseChart,
  setup(props) {
    const updateChart = () => {
      if (!props.chart) return

      const option = {
        title: {
          text: props.config.title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.data.map((item: ChartData) => String(item[props.config.xAxis])),
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: props.config.yAxis,
          type: 'bar',
          data: props.data.map((item: ChartData) => Number(item[props.config.yAxis])),
          barWidth: '60%'
        }]
      }

      props.chart.setOption(option)
    }

    watch(() => props.config, updateChart, { deep: true })
    watch(() => props.data, updateChart, { deep: true })

    return {
      updateChart
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