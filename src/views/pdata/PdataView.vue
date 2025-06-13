<template>
  <div class="data-entry-workflow-container">
    <div class="workflow-header-steps">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="选择患者/病例" icon="UserFilled" />
        <el-step title="选择临床模板" icon="Tickets" />
        <el-step title="数据录入" icon="Edit" />
      </el-steps>
    </div>

    <div class="workflow-content">
      <SelectPatientAndCase
        v-if="currentStep === 0"
        @patient-case-selected="handlePatientCaseSelected"
      />

      <SelectClinicalTemplate
        v-if="currentStep === 1"
        :patient-data="selectedPatientData"
        @template-selected="handleTemplateSelected"
      />

      <BloodRoutineEntry
        v-if="currentStep === 2"
        :patient-data="selectedPatientData"
        :selected-template="selectedTemplate"
        @data-submitted="handleDataSubmitted"
        @go-back-to-template="currentStep = 1"
      />
    </div>

    <div v-if="currentStep !== 2" class="workflow-navigation-buttons">
      <el-button v-if="currentStep > 0" @click="currentStep--"> 上一步 </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElSteps, ElStep, ElButton, ElMessage } from 'element-plus';
import { UserFilled, Tickets, Edit } from '@element-plus/icons-vue';

// Import child components
import SelectPatientAndCase from './SelectPatientAndCase.vue';
import SelectClinicalTemplate from './SelectClinicalTemplate.vue';
import BloodRoutineEntry from './BloodRoutineEntry.vue';

const currentStep = ref(0); // 0: Select Patient/Case, 1: Select Template, 2: Data Entry

const selectedPatientData = reactive({
  name: '王XXX',
  gender: '女',
  age: '52岁',
  idCard: 'XXXXXXXXXXXXXXXXX',
  caseId: 'XA568942', // Only one case ID passed for simplicity as per image
});

const selectedTemplate = ref(null); // To store the selected template name/ID

// Handlers for child component events
const handlePatientCaseSelected = (data) => {
  // In a real app, 'data' would contain the actual selected patient/case IDs
  // For now, we use the hardcoded data
  ElMessage.success('患者和病例已选择，进入下一步');
  currentStep.value = 1; // Move to next step
};

const handleTemplateSelected = (templateName) => {
  selectedTemplate.value = templateName;
  ElMessage.success(`临床模板 "${templateName}" 已选择，进入数据录入`);
  currentStep.value = 2; // Move to next step
};

const handleDataSubmitted = (formData) => {
  ElMessage.success('数据已成功录入！');
  console.log('Final submitted data:', formData);
  // Optionally, reset workflow or navigate elsewhere
  // currentStep.value = 0; // Go back to start
};
</script>

<style scoped>
.data-entry-workflow-container {
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

/* Customizing step icon colors to match the blue in the image */
.workflow-header-steps .el-step__icon-inner {
  color: #409eff; /* Element Plus primary blue */
}

.workflow-header-steps .el-step__title {
  color: #303133; /* Default text color for title */
}

.workflow-header-steps .el-step.is-process .el-step__title {
  font-weight: bold;
}

.workflow-content {
  flex-grow: 1; /* Allows content to take up available space */
  display: flex;
  flex-direction: column; /* Child components will stack vertically */
}

.workflow-navigation-buttons {
  margin-top: 20px;
  text-align: center;
}
</style>
