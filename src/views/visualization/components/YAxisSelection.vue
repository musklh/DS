<template>
  <div class="axis-select-block">
    <div class="axis-block-title">Y轴指标：</div>
    <div v-if="!axisData.templateData || axisData.templateData.length === 0" class="no-data-hint">
      <el-alert type="info" :closable="false" show-icon size="small">
        暂无可选指标数据
      </el-alert>
    </div>
    <div v-else class="template-indicators-container">
      <div 
        v-for="template in axisData.templateData" 
        :key="template.template_code" 
        class="template-group"
      >
        <div 
          class="template-title-header"
          @click="$emit('toggle-template', template.template_code)"
        >
          <span class="template-title">{{ template.template_name }}</span>
          <span class="indicator-count">({{ template.dictionaries?.length || 0 }}项)</span>
          <el-icon class="expand-icon" :class="{ 'expanded': expandedTemplates[template.template_code] }">
            <ArrowDown />
          </el-icon>
        </div>
        <el-collapse-transition>
          <div v-show="expandedTemplates[template.template_code]" class="template-indicators-wrapper">
            <el-radio-group 
              :model-value="selectedY" 
              @update:model-value="$emit('update:selectedY', $event)" 
              class="template-indicators"
            >
              <el-radio-button
                v-for="item in template.dictionaries"
                :key="item.word_code"
                :value="item.word_code"
                class="indicator-button"
              >
                {{ item.word_name }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElAlert, ElRadioGroup, ElRadioButton, ElIcon, ElCollapseTransition } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

defineProps({
  axisData: {
    type: Object,
    required: true
  },
  selectedY: {
    type: String,
    default: ''
  },
  expandedTemplates: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['update:selectedY', 'toggle-template'])
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

.no-data-hint {
  width: 100%;
}

.template-indicators-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-group {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
}

.template-title-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  transition: background-color 0.3s ease;
}

.template-title-header:hover {
  background-color: #f0f2f5;
}

.template-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.indicator-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.expand-icon {
  font-size: 14px;
  color: #909399;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.template-indicators-wrapper {
  padding: 12px 16px;
}

.template-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.indicator-button {
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .template-indicators {
    gap: 6px;
  }
  
  .indicator-button :deep(.el-radio-button__inner) {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .template-title {
    font-size: 13px;
  }
  
  .template-title-header {
    padding: 10px 12px;
  }
  
  .template-indicators-wrapper {
    padding: 10px 12px;
  }
  
  .indicator-count {
    font-size: 11px;
  }
}
</style> 