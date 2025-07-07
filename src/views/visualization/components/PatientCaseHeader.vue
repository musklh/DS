<template>
  <div class="patient-case-header">
    <span class="patient-name">{{ patientData.name }}</span>
    <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
    <span class="patient-id-card">{{ patientData.idCard }}</span>
    <el-divider direction="vertical" />
    <span class="case-id">病例: {{ patientData.caseId }}</span>
    <el-icon class="refresh-icon">
      <Refresh />
    </el-icon>
    <div class="header-buttons">
      <el-button class="patient-detail-button" size="small" type="primary" @click="$emit('go-to-patient-detail')">
        <el-icon><User /></el-icon>
        查看病例详情
      </el-button>
      <el-button class="back-button" size="small" @click="$emit('back-navigation')">
        <el-icon><Back /></el-icon>
        {{ backButtonText }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ElDivider, ElIcon, ElButton } from 'element-plus'
import { Refresh, Back, User } from '@element-plus/icons-vue'

defineProps({
  patientData: {
    type: Object,
    required: true
  },
  backButtonText: {
    type: String,
    default: '返回选择'
  }
})

defineEmits(['go-to-patient-detail', 'back-navigation'])
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
  position: relative;
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
}

.header-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
  align-items: center;
}

.patient-detail-button {
  border: 1px solid #409eff;
  background-color: #409eff;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.patient-detail-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.patient-detail-button .el-icon {
  margin-right: 5px;
  font-size: 16px;
}

.back-button {
  border: none;
  background-color: transparent;
  color: #606266;
  font-size: 14px;
}

.back-button .el-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #606266;
}
</style> 