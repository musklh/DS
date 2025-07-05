import { ref, computed } from 'vue'
import { caseVisualizationDataCreate } from '../api/caseVisualizationData'

export function useChartData(patientData) {
  const chartTitle = ref('')
  const chartValues = ref([]) // y值数组
  const tableData = ref([])

  // 检查是否显示结果
  const showResult = computed(() => {
    return chartValues.value.length > 0
  })

  // eCharts配置选项
  const echartsOption = computed(() => {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: 'category',
        data: tableData.value.map(item => item.date),
        axisLabel: { rotate: 30 },
        axisLine: { lineStyle: { color: '#409EFF' } },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e6f1' } }
      },
      yAxis: {
        type: 'value',
        min: val => Math.floor(val.min * 0.9),
        max: val => Math.ceil(val.max * 1.1),
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e6f1' } },
        axisLine: { lineStyle: { color: '#409EFF' } }
      },
      series: [
        {
          name: chartTitle.value,
          type: 'line',
          data: chartValues.value,
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: { color: '#67C23A', width: 3 },
          itemStyle: { color: '#409EFF', borderColor: '#fff', borderWidth: 2 },
          areaStyle: { color: 'rgba(64,158,255,0.08)' }
        }
      ]
    }
  })

  // 处理选择变化，获取图表数据
  const handleSelectionChange = async (selectedY, selectedX) => {
    if (!selectedY || selectedX.length === 0) {
      chartValues.value = []
      tableData.value = []
      chartTitle.value = ''
      return
    }

    // x轴转字符串并排序
    const xAxisStr = selectedX.map(x => {
      if (x instanceof Date) {
        return x.toISOString().slice(0, 10)
      }
      return x
    }).sort()

    const body = {
      case_code: patientData.value.caseId,
      y_axis_word_codes: [selectedY],
      x_axis_times: xAxisStr
    }

    try {
      const res = await caseVisualizationDataCreate(body)
      if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const yData = res.data.data[0]
        chartTitle.value = yData.word_name || ''
        
        // 保证chartValues顺序与xAxisStr一致
        const valueMap = {}
        ;(yData.data_points || []).forEach(p => { 
          valueMap[p.check_time] = Number(p.value) 
        })
        
        chartValues.value = xAxisStr.map(x => valueMap[x] ?? 0)
        tableData.value = xAxisStr.map((x, i) => ({ 
          date: x, 
          value: chartValues.value[i] ?? '' 
        }))
      } else {
        chartValues.value = []
        tableData.value = []
        chartTitle.value = ''
      }
    } catch (e) {
      console.error('获取图表数据异常:', e)
      chartValues.value = []
      tableData.value = []
      chartTitle.value = ''
    }
  }

  // 重置数据
  const resetData = () => {
    chartValues.value = []
    tableData.value = []
    chartTitle.value = ''
  }

  return {
    chartTitle,
    chartValues,
    tableData,
    showResult,
    echartsOption,
    handleSelectionChange,
    resetData
  }
} 