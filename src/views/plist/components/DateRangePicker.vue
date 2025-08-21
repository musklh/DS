<template>
  <div class="date-range-picker">
    <div class="date-range-header">
      <h4>选择导出时间段</h4>
      <el-checkbox v-model="exportAll" @change="handleExportAllChange">导出全部数据</el-checkbox>
    </div>

    <div v-if="!exportAll" class="date-range-controls">
      <div class="date-input-group">
        <label>开始时间：</label>
        <el-date-picker
          v-model="startDate"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledStartDate"
          :clearable="true"
        />
      </div>

      <div class="date-input-group">
        <label>结束时间：</label>
        <el-date-picker
          v-model="endDate"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="disabledEndDate"
          :clearable="true"
        />
      </div>

      <div v-if="startDate && endDate" class="date-info">
        <p>选择的时间段：{{ formatDateRange }}</p>
      </div>
    </div>

    <div v-else class="export-all-info">
      <el-alert
        title="将导出所有可用数据"
        type="info"
        :closable="false"
        class="export-info"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      exportAll: true,
      startDate: null,
      endDate: null
    })
  }
})

const emit = defineEmits(['update:modelValue'])

// 响应式数据
const exportAll = ref(props.modelValue.exportAll)
const startDate = ref(props.modelValue.startDate)
const endDate = ref(props.modelValue.endDate)

// 计算属性
const formatDateRange = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  return `${startDate.value} 至 ${endDate.value}`
})

// 监听变化并发出更新事件
const emitUpdate = () => {
  emit('update:modelValue', {
    exportAll: exportAll.value,
    startDate: startDate.value,
    endDate: endDate.value
  })
}

// 监听单个值变化
watch(exportAll, emitUpdate)
watch(startDate, emitUpdate)
watch(endDate, emitUpdate)

// 处理"导出全部"变化
const handleExportAllChange = (value) => {
  if (value) {
    startDate.value = null
    endDate.value = null
  }
  emitUpdate()
}

// 禁用开始日期的函数
const disabledStartDate = (date) => {
  if (!endDate.value) return false
  return date.getTime() > new Date(endDate.value).getTime()
}

// 禁用结束日期的函数
const disabledEndDate = (date) => {
  if (!startDate.value) return false
  return date.getTime() < new Date(startDate.value).getTime()
}
</script>

<style scoped>
.date-range-picker {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
}

.date-range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-range-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.date-range-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-input-group label {
  min-width: 80px;
  font-size: 14px;
  color: #606266;
}

.date-info {
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.date-info p {
  margin: 0;
  color: #409eff;
  font-size: 14px;
}

.export-all-info {
  margin-top: 16px;
}

.export-info {
  margin: 0;
}
</style>
