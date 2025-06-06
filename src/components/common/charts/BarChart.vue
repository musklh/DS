<!-- src/components/charts/BarChart.vue -->
<template>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  
  // 注册 Chart.js 组件
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default defineComponent({
    name: 'BarChart',
    components: { Bar },
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
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
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
            text: props.config.title || '柱状图'
          },
          legend: {
            position: 'top' as const
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