<!-- src/components/charts/ScatterChart.vue -->
<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Scatter } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LinearScale
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale)
  
  export default defineComponent({
    name: 'ScatterChart',
    components: { Scatter },
    props: {
      config: {
        type: Object,
        default: () => ({})
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      const chartData = computed(() => {
        const dataPoints = props.data.map((item: any) => ({
          x: item[props.config.xAxis] || 0,
          y: item[props.config.yAxis] || 0
        }))
  
        return {
          datasets: [
            {
              label: '散点图',
              data: dataPoints,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              pointRadius: 5
            }
          ]
        }
      })
  
      const chartOptions = computed(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: props.config.title || '散点图'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: props.config.xAxis || 'X轴'
            }
          },
          y: {
            title: {
              display: true,
              text: props.config.yAxis || 'Y轴'
            }
          }
        }
      }))
  
      return {
        chartData,
        chartOptions
      }
    }
  })
  </script>
  
  <style scoped lang="scss">
  .chart-wrapper {
    width: 100%;
    height: 400px;
  }
  </style>