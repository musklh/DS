<template>
  <div class="select-patient-case-container">
    <div class="info-message">
      <el-alert type="info" :closable="false" show-icon>
        请选择录入数据的目标！先选择患者，再选择患者的病例。
      </el-alert>
    </div>

    <el-card class="selection-content">
      <div style="text-align: center; padding: 50px">
        <p>模拟患者和病例选择...</p>
        <el-button type="primary" @click="simulateSelection"> 选择患者/病例 (模拟) </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ElAlert, ElButton, ElCard } from 'element-plus';

import {patientList,patientRead,patientCaseData} from '../../api/patient';

const emit = defineEmits(['patient-case-selected']);

const simulateSelection = () => {
  // In a real app, this would be triggered after a user selects a patient and case
  // We'll emit some dummy data for now
  emit('patient-case-selected', {
    patientId: 'patient123',
    caseId: 'XA568942',
  });
};
</script>

<style scoped>
.select-patient-case-container {
  padding: 0px; /* Remove padding here, handled by parent workflow container */
  background-color: #fff; /* White background for the card */
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-grow: 1; /* Allow it to fill space */
  display: flex;
  flex-direction: column;
}

.info-message {
  margin-bottom: 20px;
  padding: 15px; /* Add some padding around the alert */
}

.selection-content {
  background-color: #fff;
  border-radius: 4px;
  flex-grow: 1; /* Allows content to expand */
  display: flex;
  align-items: center;
  justify-content: center;
}

.selection-content :deep(.el-card__body) {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
