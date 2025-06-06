<template>
  <div class="select-template-container">
    <div class="patient-case-header">
      <span class="patient-name">{{ patientData.name }}</span>
      <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
      <span class="patient-id-card">{{ patientData.idCard }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ patientData.caseId }}</span>
      <el-icon class="refresh-icon">
        <Refresh />
      </el-icon>
    </div>

    <el-card class="template-selection-card" shadow="never">
      <template #header>
        <div class="card-header-content">
          <el-icon><Tickets /></el-icon>
          <span>选择临床模板</span>
        </div>
      </template>
      <div class="info-message">
        <el-alert type="info" :closable="false" show-icon> 请选择录入的临床模板 </el-alert>
      </div>
      <div class="template-content">
        <el-radio-group v-model="selectedRadioTemplate" class="template-radio-group">
          <el-radio value="bloodRoutine"> 血常规 </el-radio>
          <el-radio value="liverFunction"> 肝功能 </el-radio>
          <el-radio value="renalFunction"> 肾功能 </el-radio>
        </el-radio-group>

        <div style="text-align: center; margin-top: 30px">
          <el-button type="primary" :disabled="!selectedRadioTemplate" @click="selectTemplate">
            选择模板
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElAlert,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElMessage,
} from 'element-plus';
import { Refresh, Tickets } from '@element-plus/icons-vue';

const props = defineProps({
  patientData: Object, // Prop to receive patient and case ID from parent
});

const emit = defineEmits(['template-selected']);

const selectedRadioTemplate = ref(null); // v-model for radio group

const selectTemplate = () => {
  if (selectedRadioTemplate.value) {
    let templateName = '';
    switch (selectedRadioTemplate.value) {
      case 'bloodRoutine':
        templateName = '血常规';
        break;
      case 'liverFunction':
        templateName = '肝功能';
        break;
      case 'renalFunction':
        templateName = '肾功能';
        break;
    }
    emit('template-selected', templateName);
  } else {
    ElMessage.warning('请选择一个临床模板');
  }
};
</script>

<style scoped>
.select-template-container {
  padding: 0; /* Remove padding here, handled by parent workflow container */
  background-color: #f5f7fa;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

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
}

.template-selection-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-grow: 1; /* Allow card to fill space */
}

.template-selection-card :deep(.el-card__header) {
  padding: 15px 20px; /* Adjust header padding to match image */
}

.template-selection-card .card-header-content {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
}

.template-selection-card .card-header-content .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.template-selection-card .info-message {
  margin-bottom: 20px;
  padding: 0 20px; /* Keep alert padding */
}

.template-content {
  padding: 20px; /* Add padding to content */
  min-height: 200px; /* Placeholder height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.template-radio-group .el-radio {
  margin-bottom: 10px;
  display: block; /* Make radios stack vertically */
  font-size: 16px;
}
</style>
