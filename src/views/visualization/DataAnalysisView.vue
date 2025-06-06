<template>
  <div class="data-analysis-workflow-container">
    <div class="workflow-header-steps">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="选择患者" icon="UserFilled" />
        <el-step title="选择病例" icon="Document" />
        <el-step title="结果展示" icon="DataAnalysis" />
      </el-steps>
    </div>

    <div class="workflow-content">
      <DataAnalysisSelectPatientAndCase
        v-if="currentStep <= 1"
        @patient-case-selected="handlePatientCaseSelected"
      />

      <DataAnalysisResultDisplay
        v-if="currentStep === 2"
        :patient-data="selectedPatientData"
        @go-back-to-selection="currentStep = 1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElSteps, ElStep, ElMessage } from 'element-plus';
import { UserFilled, Document, DataAnalysis } from '@element-plus/icons-vue';

// Import child components
import DataAnalysisSelectPatientAndCase from './DataAnalysisSelectPatientAndCase.vue';
import DataAnalysisResultDisplay from './DataAnalysisResultDisplay.vue';

const currentStep = ref(0); // 0: Select Patient, 1: Select Case (handled within child), 2: Display Results

const selectedPatientData = reactive({
  name: '王XXX',
  gender: '女',
  age: '52岁',
  idCard: 'XXXXXXXXXXXXXXXXX',
  caseId: 'XA568942', // Mocking a selected case ID
});

// Handler for patient/case selection
const handlePatientCaseSelected = (data) => {
  // In a real app, 'data' would contain the actual selected patient/case IDs
  // For now, we update the mock data if needed and advance
  selectedPatientData.name = data.patientName || '王XXX';
  selectedPatientData.gender = data.gender || '女';
  selectedPatientData.age = data.age || '52岁';
  selectedPatientData.idCard = data.idCard || 'XXXXXXXXXXXXXXXXX';
  selectedPatientData.caseId = data.caseId || 'XA568942';

  ElMessage.success('患者和病例已选择，进入结果展示');
  currentStep.value = 2; // Move to results display
};
</script>

<style scoped>
.data-analysis-workflow-container {
  padding: 20px;
  background-color: #f5f7fa; /* Light background */
  min-height: 100vh; /* Full height */
  display: flex;
  flex-direction: column;
}

.workflow-header-steps {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.workflow-header-steps .el-step__icon-inner {
  color: #409eff;
}
.workflow-header-steps .el-step__title {
  color: #303133;
}
.workflow-header-steps .el-step.is-process .el-step__title {
  font-weight: bold;
}

.workflow-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
