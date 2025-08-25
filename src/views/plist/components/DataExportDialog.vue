<template>
  <el-dialog
    v-model="visible"
    title="导出患者数据"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="export-dialog-content">
      <!-- 时间段选择 -->
      <DateRangePicker
        v-model="dateRange"
        @update:modelValue="handleDateRangeChange"
      />

      <!-- 导出格式选择 -->
      <div class="format-selection">
        <h4>选择导出格式</h4>
        <el-radio-group v-model="exportFormat" size="large">
          <el-radio-button label="pdf">PDF 格式</el-radio-button>
          <el-radio-button label="excel">Excel 格式</el-radio-button>
          <el-radio-button label="csv">CSV 格式</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 导出说明 -->
      <div class="export-info">
        <el-alert
          title="导出说明"
          type="warning"
          :closable="false"
          description="PDF格式：生成标准的病人检验报告单，包含完整的病人信息和检查数据。Excel/CSV格式：数据将按模板分类导出，相同模板按时间倒序排列。导出文件包含：模板基本信息、词条名称、词条编码、检查值、输入类型等完整信息。"
        />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="exporting"
          @click="handleExport"
          :disabled="!canExport"
        >
          {{ exporting ? '正在获取数据并导出...' : '开始导出' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import DateRangePicker from './DateRangePicker.vue'
import { useDataExport } from '../../../composables/useDataExport'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  patientData: {
    type: Object,
    default: null
  },
  templateData: {
    type: Array,
    default: () => []
  },
  selectedCaseCodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'export-success'])

// 组合式函数
const { exportTemplateDataToExcel, exportTemplateDataToCsv, exportTemplateDataToPdf } = useDataExport()

// 响应式数据
const visible = ref(props.modelValue)
const dateRange = ref({
  exportAll: true,
  startDate: null,
  endDate: null
})
const exportFormat = ref('pdf')
const exporting = ref(false)

// 计算属性
const canExport = computed(() => {
  if (!props.patientData || !props.templateData.length) return false
  if (!dateRange.value.exportAll && (!dateRange.value.startDate || !dateRange.value.endDate)) return false
  return true
})

// 监听对话框显示状态
const handleDateRangeChange = (newRange) => {
  dateRange.value = newRange
}

// 处理取消
const handleCancel = () => {
  visible.value = false
  emit('update:modelValue', false)
  resetForm()
}

// 重置表单
const resetForm = () => {
  dateRange.value = {
    exportAll: true,
    startDate: null,
    endDate: null
  }
  exportFormat.value = 'excel'
}

// 处理导出
const handleExport = async () => {
  if (!canExport.value) return

  exporting.value = true

  try {
    const exportParams = {
      patientData: props.patientData,
      templateData: props.templateData,
      selectedCaseCodes: props.selectedCaseCodes,
      dateRange: dateRange.value,
      format: exportFormat.value
    }

    let result
    if (exportFormat.value === 'pdf') {
      result = await exportTemplateDataToPdf(exportParams)
    } else if (exportFormat.value === 'excel') {
      result = await exportTemplateDataToExcel(exportParams)
    } else {
      result = await exportTemplateDataToCsv(exportParams)
    }

    if (result.success) {
      ElMessage.success(`数据导出成功！文件已保存为：${result.fileName}`)
      emit('export-success')
      handleCancel()
    } else {
      ElMessage.error(result.message || '导出失败，请重试')
    }
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出过程中发生错误，请重试')
  } finally {
    exporting.value = false
  }
}

// 监听props变化
const updateVisible = (newVal) => {
  console.log('DataExportDialog updateVisible 被调用:', newVal)
  console.log('当前 visible:', visible.value)
  visible.value = newVal
  console.log('设置后 visible:', visible.value)
  if (newVal) {
    resetForm()
  }
}

// 使用 watch 监听 modelValue 变化
watch(() => props.modelValue, updateVisible, { immediate: true })
</script>

<style scoped>
.export-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.format-selection {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.format-selection h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.export-info {
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
