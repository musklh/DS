<template>
  <div class="data-analysis-workflow-container">
    <div class="workflow-header-steps">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="选择患者" icon="UserFilled" />
        <el-step title="选择病例" icon="Document" />
        <el-step title="结果展示" icon="DataAnalysis" />
      </el-steps>
    </div>

    <!-- 信息展示区域，仅在已选病例且currentStep为1时显示 -->
    <div v-if="selectedPatientData.caseId && currentStep === 1" class="selected-info-bar">
      <span class="patient-name">{{ selectedPatientData.name }}</span>
      <span class="patient-age-gender">{{ selectedPatientData.gender }} {{ selectedPatientData.age }}</span>
      <span class="patient-id-card">{{ selectedPatientData.idCard }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ selectedPatientData.caseId }}</span>
      <el-icon class="refresh-icon">
        <Refresh />
      </el-icon>
    </div>

    <div class="workflow-content">
      <DataAnalysisSelectPatientAndCase
        v-if="currentStep === 1"
        :key="resetKey"
        @patient-case-selected="handlePatientCaseSelected"
        @clear-selected="handleClearSelected"
      />

      <DataAnalysisResultDisplay
        v-if="currentStep === 2"
        :patient-data="selectedPatientData"
        :axis-data="axisData"
        @go-back-to-selection="handleGoBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElSteps, ElStep, ElMessage, ElDivider, ElIcon } from 'element-plus';
import { UserFilled, Document, DataAnalysis, Refresh } from '@element-plus/icons-vue';
import DataAnalysisSelectPatientAndCase from './DataAnalysisSelectPatientAndCase.vue';
import DataAnalysisResultDisplay from './DataAnalysisResultDisplay.vue';
import { caseVisualizationYaxisOptionsCreate } from '../../api/caseVisualizationYaxisOptions';

const currentStep = ref(1); // 1: 选择患者和病例, 2: 结果展示
const resetKey = ref(0); // 用于强制刷新子组件

const selectedPatientData = reactive({
  name: '',
  gender: '',
  age: '',
  idCard: '',
  caseId: '',
});

const axisData = ref({ y_axis_options: [] });

const handlePatientCaseSelected = async (data) => {
  selectedPatientData.name = data.patientName;
  selectedPatientData.gender = data.gender;
  selectedPatientData.age = data.age;
  selectedPatientData.idCard = data.idCard;
  selectedPatientData.caseId = data.caseId;
  
  // 获取y轴数据
  try {
    const res = await caseVisualizationYaxisOptionsCreate({ case_code: data.caseId });
    if (res.data.code === 200 ) {
      axisData.value = { 
        templateData: res.data.data, // 按模板分类的词条数据
        x_axis_options: [] // X轴时间数据，目前为空，需要后续获取
      };
    } else {
      console.log('获取Y轴数据失败:', res.data)
      axisData.value = { templateData: [], x_axis_options: [] };
    }
  } catch (e) {
    console.error('获取Y轴数据异常:', e);
    axisData.value = { templateData: [], x_axis_options: [] };
  }
  ElMessage.success('患者和病例已选择，进入结果展示');
  currentStep.value = 2;
};

const handleGoBack = () => {
  selectedPatientData.name = '';
  selectedPatientData.gender = '';
  selectedPatientData.age = '';
  selectedPatientData.idCard = '';
  selectedPatientData.caseId = '';
  currentStep.value = 1;
};

const handleClearSelected = () => {
  selectedPatientData.name = '';
  selectedPatientData.gender = '';
  selectedPatientData.age = '';
  selectedPatientData.idCard = '';
  selectedPatientData.caseId = '';
  currentStep.value = 1;
  resetKey.value++;
};

// 检测从患者详情页面传递的数据
const checkPatientDataFromDetails = async () => {
  try {
    const storedData = localStorage.getItem('visualizationPatientData');
    if (storedData) {
      const patientData = JSON.parse(storedData);
      console.log('检测到从患者详情页面传递的数据:', patientData);
      
      // 清除localStorage中的数据
      localStorage.removeItem('visualizationPatientData');
      
      // 设置患者数据并直接调用选择处理函数
      await handlePatientCaseSelected({
        patientName: patientData.name,
        gender: patientData.gender,
        age: patientData.age,
        idCard: patientData.idCard,
        caseId: patientData.caseId
      });
    }
  } catch (error) {
    console.error('处理从患者详情页面传递的数据失败:', error);
  }
};

// 组件挂载时检查是否有传递的数据
onMounted(() => {
  checkPatientDataFromDetails();
});
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

.selected-info-bar {
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
.selected-info-bar span {
  margin-right: 15px;
}
.selected-info-bar .patient-name {
  font-weight: bold;
}
.selected-info-bar .refresh-icon {
  margin-left: 5px;
  cursor: pointer;
  color: #409eff;
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
