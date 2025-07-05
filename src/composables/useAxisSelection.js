import { ref, computed, watch } from 'vue'
import { caseVisualizationXaxisOptionsCreate } from '../api/caseVisualizationXaxisOptions'

export function useAxisSelection(patientData, axisData) {
  const selectedY = ref('') // Y轴指标，单选
  const selectedX = ref([]) // X轴时间，多选
  const xAxisOptions = ref([]) // 动态获取的X轴时间选项
  const isLoadingXAxis = ref(false) // X轴数据加载状态
  const expandedTemplates = ref({}) // 控制模板展开状态

  // 格式化X轴时间选项显示
  const formattedXAxisOptions = computed(() => {
    return xAxisOptions.value.map(item => {
      const timeValue = item.check_time || item
      const displayLabel = formatTimeDisplay(timeValue)
      
      return {
        value: timeValue,
        label: displayLabel
      }
    })
  })

  // x轴排序，保证图表和表格一致
  const selectedXSorted = computed(() => {
    return [...selectedX.value].sort()
  })

  // 时间显示格式化函数
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return ''
    
    try {
      const date = new Date(timeStr)
      if (isNaN(date.getTime())) {
        return timeStr
      }
      
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (error) {
      return timeStr
    }
  }

  // 获取X轴时间选项
  const fetchXAxisOptions = async () => {
    if (!selectedY.value) {
      xAxisOptions.value = []
      return
    }
    
    isLoadingXAxis.value = true
    console.log('selectedY.value', selectedY.value)
    console.log('patientData.caseId', patientData.value.caseId)
    
    try {
      const res = await caseVisualizationXaxisOptionsCreate({
        case_code: patientData.value.caseId,
        y_axis_word_code: selectedY.value
      })
      
      console.log('X轴API完整响应:', res.data)
      
      if (res.data.code === 200 && res.data.data && res.data.data.x_axis_options) {
        xAxisOptions.value = res.data.data.x_axis_options
        console.log('获取到X轴时间选项:', xAxisOptions.value)
      } else {
        console.log('获取X轴数据失败:', res.data)
        xAxisOptions.value = []
      }
    } catch (error) {
      console.error('获取X轴数据异常:', error)
      xAxisOptions.value = []
    } finally {
      isLoadingXAxis.value = false
    }
  }

  // 全选X轴时间
  const selectAllXAxis = () => {
    selectedX.value = formattedXAxisOptions.value.map(item => item.value)
  }

  // 清空X轴选择
  const clearAllXAxis = () => {
    selectedX.value = []
  }

  // 切换模板展开状态
  const toggleTemplate = (templateCode) => {
    expandedTemplates.value[templateCode] = !expandedTemplates.value[templateCode]
  }

  // 初始化模板展开状态
  const initExpandedTemplates = () => {
    if (axisData.value.templateData && axisData.value.templateData.length > 0) {
      const newExpandedState = {}
      axisData.value.templateData.forEach((template, index) => {
        // 默认展开第一个模板，其他收起
        newExpandedState[template.template_code] = index === 0
      })
      expandedTemplates.value = newExpandedState
    }
  }

  // 监听Y轴选择变化
  watch(selectedY, async (newValue) => {
    if (newValue) {
      // 清空之前的X轴选择
      selectedX.value = []
      
      // 获取新的X轴选项
      await fetchXAxisOptions()
    } else {
      xAxisOptions.value = []
      selectedX.value = []
    }
  })

  // 监听axisData变化，重新初始化展开状态
  watch(() => axisData.value.templateData, () => {
    initExpandedTemplates()
  }, { immediate: true, deep: true })

  return {
    selectedY,
    selectedX,
    selectedXSorted,
    xAxisOptions,
    isLoadingXAxis,
    expandedTemplates,
    formattedXAxisOptions,
    fetchXAxisOptions,
    selectAllXAxis,
    clearAllXAxis,
    toggleTemplate,
    initExpandedTemplates
  }
} 