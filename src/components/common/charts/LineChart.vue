<!-- src/components/charts/LineChart.vue -->
<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
  
  export default defineComponent({
    name: 'LineChart',
    components: { Line },
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
        const labels = props.data.map((item: any) => item[props.config.xAxis] || '未知')
        const values = props.data.map((item: any) => item[props.config.yAxis] || 0)
  
        return {
          labels,
          datasets: [
            {
              label: props.config.yAxis || '值',
              data: values,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
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
            text: props.config.title || '折线图'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
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