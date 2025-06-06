<template>
  <div class="chart-wrapper" ref="chartRef"></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import BaseChart from './BaseChart'
import type { ChartData } from '../../types/chart'

export default defineComponent({
  name: 'PieChart',
  extends: BaseChart,
  setup(props) {
    const updateChart = () => {
      if (!props.chart) return

      const pieData = props.data.map((item: ChartData) => ({
        name: String(item[props.config.xAxis]),
        value: Number(item[props.config.yAxis])
      }))

      const option = {
        title: {
          text: props.config.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          type: 'scroll'
        },
        series: [
          {
            name: props.config.title,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }
        ]
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