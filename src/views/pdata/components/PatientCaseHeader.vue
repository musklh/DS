<template>
  <div class="patient-case-header">
    <span class="patient-name">{{ patientData.name }}</span>
    <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
    <span class="patient-id-card">{{ patientData.identity_id }}</span>
    <el-divider direction="vertical" />
    <span class="case-id">病例: {{ patientData.caseId }}</span>
    <el-icon class="refresh-icon" @click="emit('refresh')">
      <Refresh />
    </el-icon>
  </div>
</template>

<script setup>
import { ElDivider, ElIcon } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

defineProps({
  patientData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['refresh'])
</script>

<style scoped>
.patient-case-header {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #303133;
}

.patient-case-header span {
  margin-right: 15px;
}

.patient-case-header .patient-name {
  font-weight: bold;
}

.refresh-icon {
  margin-left: 5px;
  cursor: pointer;
  color: #409eff;
  transition: transform 0.3s ease;
}

.refresh-icon:hover {
  transform: rotate(180deg);
}
</style> 