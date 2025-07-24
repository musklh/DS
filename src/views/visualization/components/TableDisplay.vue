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
        <el-table-column label="值" min-width="200">
          <template #default="{ row }">
            <!-- 评分数据显示 -->
            <div v-if="row.scoreInfo" class="score-data-display">
              <div class="score-main">
                <span class="score-value">{{ row.value }}</span>
                <span v-if="row.scoreInfo.unit" class="score-unit">{{ row.scoreInfo.unit }}</span>
              </div>
              <div v-if="row.scoreInfo.result" class="score-result">
                结果: {{ row.scoreInfo.result }}
              </div>
              <div v-if="row.scoreInfo.sources && row.scoreInfo.sources.length > 0" class="score-sources">
                <div class="sources-title">参与评分词条:</div>
                <div v-for="source in row.scoreInfo.sources" :key="source.word_code" class="source-item">
                  <span class="source-name">{{ source.word_name || source.word_code }}</span>
                  <span class="source-value">{{ source.value }}</span>
                </div>
              </div>
            </div>
            <!-- 普通数据显示 -->
            <div v-else class="normal-data-display">
              {{ row.value }}
            </div>
          </template>
        </el-table-column>
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

/* 评分数据显示样式 */
.score-data-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-main {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.score-value {
  font-size: 14px;
  color: #303133;
}

.score-unit {
  font-size: 12px;
  color: #909399;
}

.score-result {
  font-size: 12px;
  color: #67c23a;
  background-color: #f0f9ff;
  padding: 2px 6px;
  border-radius: 3px;
}

.score-sources {
  margin-top: 4px;
}

.sources-title {
  font-size: 11px;
  color: #909399;
  margin-bottom: 2px;
  font-weight: 500;
}

.source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  padding: 1px 0;
}

.source-name {
  color: #606266;
  flex: 1;
}

.source-value {
  color: #409eff;
  font-weight: 500;
  margin-left: 8px;
}

/* 普通数据显示样式 */
.normal-data-display {
  font-size: 14px;
  color: #303133;
}
</style> 