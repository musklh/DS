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
      >
        <template #header>
          <div class="card-header-content" style="justify-content: space-between">
            <div>
              <el-icon><Tickets /></el-icon>
              <span>选择病例</span>
            </div>
            <el-button type="text" @click="handleBackToPatient" style="color: #409eff"
              >返回</el-button
            >
          </div>
        </template>
      </SelectPatientAndCase>

      <SelectClinicalTemplate
        v-if="currentStep === 1"
        :patient-data="selectedPatientData"
        @template-selected="handleTemplateSelected"
        @go-back-to-case="handleBackToCase"
      />

      <BloodRoutineEntryWithRating
        v-if="currentStep === 2 && selectedTemplate && selectedTemplate.name.includes('评分')"
        :patient-data="selectedPatientData"
        :selected-template="selectedTemplate"
        @data-submitted="handleDataSubmitted"
        @go-back-to-template="currentStep = 1"
      />
      <BloodRoutineEntryRefactored
        v-else-if="currentStep === 2"
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
import BloodRoutineEntryWithRating from './BloodRoutineEntryWithRating.vue';
import BloodRoutineEntryRefactored from './BloodRoutineEntryRefactored.vue';

// import { caseIdentityCases } from '../../api/openApiCase'; // This import seems unused, can be removed if not needed elsewhere

const currentStep = ref(0); // 0: Select Patient/Case, 1: Select Template, 2: Data Entry

const selectedPatientData = reactive({
  name: '',
  gender: '',
  age: '',
  idCard: '',
  caseId: '',
});

const selectedTemplate = ref(null); // To store the selected template name/ID

// Handlers for child component events
const handlePatientCaseSelected = (data) => {
  try {
    console.log('PdataView: 开始接收患者和病例数据');
    console.log('PdataView: 接收到的数据:', data);
    
    if (!data || !data.patientData) {
      console.error('接收到的数据格式不正确');
      ElMessage.error('数据格式错误');
      return;
    }
    
    // 更新选中的患者数据
    Object.assign(selectedPatientData, {
      name: data.patientData.name || '',
      gender: data.patientData.gender === 0 ? '女' : '男',
      age: data.patientData.age || '',
      identity_id: data.patientData.identity_id || '',
      caseId: data.patientData.caseId || '',
    });
    
    console.log('PdataView: 更新后的患者数据:', selectedPatientData);
    ElMessage.success('患者和病例已选择，进入下一步');
    
    currentStep.value = 1; 
    console.log('PdataView: 步骤已更新到1');

  } catch (error) {
    console.error('处理患者和病例数据失败:', error);
    ElMessage.error('处理数据失败');
  }
};

const handleTemplateSelected = (templateData) => {
  console.log('PdataView: 接收到的模板数据:', templateData);
  selectedTemplate.value = {
    id: templateData.templateId,
    code: templateData.templateCode,
    name: templateData.templateName,
    dictionaryList: templateData.dictionaryList,
  };
  ElMessage.success(`临床模板 "${templateData.templateName}" 已选择，进入数据录入`);
  currentStep.value = 2;
};

const handleDataSubmitted = (formData) => {
  ElMessage.success('数据已成功录入！');
  console.log('Final submitted data:', formData);
  // 数据录入完成后，重置整个流程，跳转回到患者列表
  currentStep.value = 0;
  // 清空已选择的数据
  Object.assign(selectedPatientData, {
    name: '',
    gender: '',
    age: '',
    idCard: '',
    caseId: '',
  });
  selectedTemplate.value = null;
};

// 返回病例选择
const handleBackToCase = () => {
  // 保留患者信息，只清空病例信息
  selectedPatientData.caseId = '';
  // 返回第一步，显示病例列表
  currentStep.value = 0;
};

const handleBackToPatient = () => {
  selectedPatientData.caseId = '';
  currentStep.value = 0;
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