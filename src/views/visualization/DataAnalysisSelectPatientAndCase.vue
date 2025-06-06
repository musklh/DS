<template>
    <div class="analysis-select-container">
      <el-card class="selection-card">
        <div class="info-message">
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            请选择数据可视化目标！先选择患者，再选择患者的病例。
          </el-alert>
        </div>
  
        <div class="simulated-selection-area">
          <p>模拟患者和病例选择中...</p>
          <el-button type="primary" @click="simulateSelection">
            选择患者/病例 (模拟)
          </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ElAlert, ElButton, ElCard } from 'element-plus';
  
  const emit = defineEmits(['patient-case-selected']);
  
  const simulateSelection = () => {
    // In a real application, this would involve actual selection logic.
    // For now, emit mock data.
    emit('patient-case-selected', {
      patientName: '王XXX',
      gender: '女',
      age: '52岁',
      idCard: 'XXXXXXXXXXXXXXXXX',
      caseId: 'XA568942',
    });
  };
  </script>
  
  <style scoped>
  .analysis-select-container {
    padding: 0; /* Handled by parent */
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .selection-card {
    flex-grow: 1;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  
  .info-message {
    margin-bottom: 20px;
    padding: 15px; /* Add padding to the alert area */
  }
  
  .simulated-selection-area {
    padding: 50px;
    text-align: center;
    flex-grow: 1; /* Allow this area to expand */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  </style>