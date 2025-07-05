<template>
  <div class="axis-select-block">
    <div class="axis-block-title">X轴时间：</div>
    <div v-if="!selectedY" class="x-axis-hint">
      <el-alert type="info" :closable="false" show-icon size="small">
        请先选择Y轴指标
      </el-alert>
    </div>
    <div v-else-if="isLoadingXAxis" class="x-axis-hint">
      <el-alert type="info" :closable="false" show-icon size="small">
        正在加载时间数据...
      </el-alert>
    </div>
    <div v-else-if="formattedXAxisOptions.length === 0" class="x-axis-hint">
      <el-alert type="warning" :closable="false" show-icon size="small">
        该指标暂无时间数据
      </el-alert>
    </div>
    <div v-else class="x-axis-selection-area">
      <div class="x-axis-buttons-container">
        <el-checkbox-group 
          :model-value="selectedX" 
          @update:model-value="$emit('update:selectedX', $event)"
        >
          <el-checkbox-button
            v-for="item in formattedXAxisOptions"
            :key="item.value"
            :value="item.value"
            class="x-radio-btn"
          >
            {{ item.label }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div v-if="formattedXAxisOptions.length > 0" class="x-axis-actions">
        <el-button size="small" type="primary" link @click="$emit('select-all')">
          全选
        </el-button>
        <el-button size="small" type="primary" link @click="$emit('clear-all')">
          清空
        </el-button>
        <span class="selected-count">已选择 {{ selectedX.length }}/{{ formattedXAxisOptions.length }} 个时间点</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElAlert, ElCheckboxGroup, ElCheckboxButton, ElButton } from 'element-plus'

defineProps({
  selectedY: {
    type: String,
    default: ''
  },
  selectedX: {
    type: Array,
    default: () => []
  },
  isLoadingXAxis: {
    type: Boolean,
    default: false
  },
  formattedXAxisOptions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:selectedX', 'select-all', 'clear-all'])
</script>

<style scoped>
.axis-select-block {
  background: #f6faff;
  border: 1px solid #d3e4f7;
  border-radius: 8px;
  padding: 18px 18px 12px 18px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.axis-block-title {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 12px;
}

.x-axis-hint {
  width: 100%;
}

.x-axis-selection-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.x-axis-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.x-axis-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #e4e7ed;
  font-size: 14px;
}

.selected-count {
  color: #909399;
  font-size: 13px;
  margin-left: auto;
}

.x-radio-btn {
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .x-axis-buttons-container {
    gap: 6px;
  }
  
  .x-radio-btn :deep(.el-checkbox-button__inner) {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .x-axis-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .selected-count {
    font-size: 12px;
    width: 100%;
    text-align: center;
    margin-left: 0;
    margin-top: 4px;
  }
}
</style> 