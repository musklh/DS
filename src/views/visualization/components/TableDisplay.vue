<template>
  <div class="table-section">
    <h3>表:</h3>
    <div class="table-box">
      <h4 class="table-title">{{ chartTitle }}</h4>
      <el-table
        :data="tableData"
        border
        stripe
        size="small"
        :show-header="true"
        style="width: 100%"
        ref="tableRef"
      >
        <el-table-column prop="date" label="时间" width="120" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </div>
    <div class="table-actions">
      <el-button size="small" @click="$emit('export-table')">
        <el-icon><Download /></el-icon>
        保存为Excel表格
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElIcon, ElTable, ElTableColumn } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

defineProps({
  chartTitle: {
    type: String,
    default: ''
  },
  tableData: {
    type: Array,
    required: true
  }
})

const tableRef = ref()

defineEmits(['export-table'])

// 暴露 tableRef 给父组件
defineExpose({
  tableRef
})
</script>

<style scoped>
.table-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #303133;
}

.table-actions {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-box {
  border: 1px solid #dcdfe6;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.table-box :deep(.el-table .cell) {
  padding: 8px 10px;
}

.table-box :deep(.el-table__header-wrapper) {
  display: none;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #01050a;
  text-align: center;
}
</style> 