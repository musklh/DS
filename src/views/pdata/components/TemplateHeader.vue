<template>
  <div class="card-header-content">
    <span class="in-progress-text">正在录入:</span>
    <span class="template-name">{{ templateName }}</span>
    <el-icon class="refresh-icon" @click="emit('refresh')">
      <Refresh />
    </el-icon>
    <el-button class="back-to-template-btn" size="small" @click="emit('go-back')">
      返回模板选择
    </el-button>
  </div>
</template>

<script setup>
import { ElButton, ElIcon } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

defineProps({
  templateName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['go-back', 'refresh'])
</script>

<style scoped>
.card-header-content {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #303133;
  flex-grow: 1;
  width: 100%;
}

.in-progress-text {
  color: #909399;
  margin-right: 8px;
  font-size: 16px;
}

.template-name {
  margin-right: 15px;
}

.refresh-icon {
  margin-left: 0;
  margin-right: 10px;
  cursor: pointer;
  color: #409eff;
  transition: transform 0.3s ease;
}

.refresh-icon:hover {
  transform: rotate(180deg);
}

.back-to-template-btn {
  margin-left: auto;
}
</style> 