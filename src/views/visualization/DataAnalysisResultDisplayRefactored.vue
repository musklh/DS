<template>
  <div class="analysis-result-display-container">
    <!-- 患者病例头部 -->
    <PatientCaseHeader 
      :patient-data="patientData"
      :back-button-text="backButtonText"
      @go-to-patient-detail="goToPatientDetail"
      @back-navigation="handleBackNavigation"
    />

    <!-- Y轴指标选择 -->
    <YAxisSelection 
      :axis-data="axisData"
      v-model:selectedY="selectedY"
      :expanded-templates="expandedTemplates"
      @toggle-template="toggleTemplate"
    />

    <!-- X轴时间选择 -->
    <XAxisSelection 
      :selected-y="selectedY"
      v-model:selectedX="selectedX"
      :is-loading-x-axis="isLoadingXAxis"
      :formatted-x-axis-options="formattedXAxisOptions"
      @select-all="selectAllXAxis"
      @clear-all="clearAllXAxis"
    />

    <!-- 主要内容卡片 -->
    <el-card class="content-card">
      <el-alert type="info" :closable="false" show-icon style="margin-bottom: 20px;">
        先选Y轴指标，再选X轴时间。
      </el-alert>

      <!-- 图表和表格显示 -->
      <div v-if="showResult" class="analysis-sections">
        <ChartDisplay 
          :chart-title="chartTitle"
          :echarts-option="echartsOption"
          ref="chartDisplayRef"
          @export-chart="handleExportChart"
        />

        <TableDisplay 
          :chart-title="chartTitle"
          :table-data="tableData"
          ref="tableDisplayRef"
          @export-table="handleExportTable"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRef } from 'vue'
import { ElCard, ElAlert } from 'element-plus'

// 组件导入
import PatientCaseHeader from './components/PatientCaseHeader.vue'
import YAxisSelection from './components/YAxisSelection.vue'
import XAxisSelection from './components/XAxisSelection.vue'
import ChartDisplay from './components/ChartDisplay.vue'
import TableDisplay from './components/TableDisplay.vue'

// 组合式函数导入
import { usePatientHeader } from '../../composables/usePatientHeader'
import { useAxisSelection } from '../../composables/useAxisSelection'
import { useChartData } from '../../composables/useChartData'
import { useDataExport } from '../../composables/useDataExport'

// Props 和 Emits
const props = defineProps({
  patientData: {
    type: Object,
    required: true
  },
  axisData: {
    type: Object,
    default: () => ({ x_axis_options: [], templateData: [] })
  }
})

const emit = defineEmits(['go-back-to-selection'])

// 响应式引用
const patientDataRef = toRef(props, 'patientData')
const axisDataRef = toRef(props, 'axisData')

// 使用组合式函数
const { 
  backButtonText, 
  handleBackNavigation: handleBack,
  goToPatientDetail 
} = usePatientHeader(patientDataRef)

const {
  selectedY,
  selectedX,
  selectedXSorted,
  isLoadingXAxis,
  expandedTemplates,
  formattedXAxisOptions,
  selectAllXAxis,
  clearAllXAxis,
  toggleTemplate
} = useAxisSelection(patientDataRef, axisDataRef)

const {
  chartTitle,
  tableData,
  showResult,
  echartsOption,
  handleSelectionChange,
  resetData
} = useChartData(patientDataRef)

const { exportChartToImage, exportTableToExcel } = useDataExport()

// 组件引用
const chartDisplayRef = ref()
const tableDisplayRef = ref()

// 处理返回导航
const handleBackNavigation = () => {
  handleBack(emit)
}

// 处理图表导出
const handleExportChart = async () => {
  // 直接获取子组件中的 chartRef
  const chartRef = chartDisplayRef.value?.chartRef
  
  if (!chartRef) {
    console.log('chartRef 不存在，无法导出')
    return
  }
  
  await exportChartToImage(chartRef, chartTitle.value)
}

// 处理表格导出
const handleExportTable = () => {
  exportTableToExcel(tableData.value, chartTitle.value)
}

// 监听选择变化
watch([selectedY, selectedX], async ([newY, newX]) => {
  await handleSelectionChange(newY, newX)
}, { deep: true })

// 监听Y轴变化时重置数据
watch(selectedY, (newValue, oldValue) => {
  if (oldValue && newValue !== oldValue) {
    resetData()
  }
})
</script>

<style scoped>
.analysis-result-display-container {
  padding: 0;
  background-color: #f5f7fa;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.analysis-sections {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  justify-content: space-around;
  align-items: flex-start;
}
</style> 