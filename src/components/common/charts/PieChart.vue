<!-- src/components/charts/PieChart.vue -->

  <template>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </template>
  <script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Pie } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
  export default defineComponent({
    name: 'PieChart',
    components: { Pie },
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
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
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
            text: props.config.title || '饼图'
          },
          legend: {
            position: 'top'
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