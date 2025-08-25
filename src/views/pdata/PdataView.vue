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

      <BloodRoutineEntry
        v-if="currentStep === 2"
        :patient-data="selectedPatientData"
        :selected-template="selectedTemplate"
        @data-submitted="handleDataSubmitted"
        @go-back-to-template="currentStep = 1"
      />
      <BloodRoutineEntryWithRating
        v-if="currentStep === 3"
        :patient-data="selectedPatientData"
        :selected-template="selectedTemplate"
        :pending-score-data="pendingScoreData"
        @data-submitted="handleDataSubmitted"
        @go-back-to-template="currentStep = 1"
        @navigate-to-scale="handleNavigateToScale"
        @clear-pending-data="pendingScoreData = {}"
      />
      
      <DynamicScoreSheet
        v-if="currentStep === 4"
        :selected-scale="selectedScale"
        :template-item="selectedTemplateItem"
        :patient-data="selectedPatientData"
        @go-back="currentStep = 3"
        @save-score-data="handleSaveScoreData"
      />
    </div>

    <div v-if="currentStep !== 2" class="workflow-navigation-buttons">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElSteps, ElStep, ElButton, ElMessage } from 'element-plus';
import { UserFilled, Tickets, Edit } from '@element-plus/icons-vue';
import { dataTemplateList } from '../../api/dataTemplate';

// Import child components
import SelectPatientAndCase from './SelectPatientAndCase.vue';
import SelectClinicalTemplate from './SelectClinicalTemplate.vue';
import BloodRoutineEntry from './BloodRoutineEntry.vue';
import BloodRoutineEntryWithRating from './BloodRoutineEntryWithRating.vue';
import DynamicScoreSheet from '../scale/DynamicScoreSheet.vue';

// import { caseIdentityCases } from '../../api/openApiCase'; // This import seems unused, can be removed if not needed elsewhere

const route = useRoute();
const currentStep = ref(0); // 0: Select Patient/Case, 1: Select Template, 2: Data Entry

const selectedPatientData = reactive({
  name: '',
  gender: '',
  age: '',
  idCard: '',
  caseId: '',
});

const selectedTemplate = ref(null); // To store the selected template name/ID
const selectedScale = ref(null); // To store the selected scale
const selectedTemplateItem = ref(null); // To store the selected template item
const pendingScoreData = ref({}); // To store pending score data for all template items

// 处理自动跳转逻辑
const handleAutoJump = async () => {
  const { autoJump, patientData } = route.query;

  if (autoJump === 'true' && patientData) {
    try {
      // 解析患者数据
      const parsedPatientData = JSON.parse(String(patientData));

      // 更新选中的患者数据
      Object.assign(selectedPatientData, {
        name: parsedPatientData.name || '',
        gender: parsedPatientData.gender === 0 ? '女' : '男',
        age: parsedPatientData.age || '',
        identity_id: parsedPatientData.identity_id || '',
        caseId: parsedPatientData.caseId || '',
      });

      console.log('自动跳转：患者数据已设置', selectedPatientData);

      // 获取第一个模板
      const templateResponse = await dataTemplateList({
        page: 1,
        page_size: 1 // 只获取第一个模板
      });

      if (templateResponse?.data?.code === 200 && templateResponse.data.data.list.length > 0) {
        const firstTemplate = templateResponse.data.data.list[0];
        console.log('自动跳转：获取到第一个模板', firstTemplate);

        // 自动选择第一个模板
        selectedTemplate.value = {
          id: firstTemplate.id,
          code: firstTemplate.template_code,
          name: firstTemplate.template_name,
          dictionaryList: firstTemplate.dictionary_list,
        };

        ElMessage.success(`自动选择模板 "${firstTemplate.template_name}"，正在跳转到数据录入页面...`);

        // 根据模板名称判断跳转到哪个步骤
        if (firstTemplate.template_name.includes('评分')) {
          currentStep.value = 3;
        } else {
          currentStep.value = 2;
        }
      } else {
        ElMessage.error('获取模板失败，跳转到模板选择页面');
        currentStep.value = 1;
      }
    } catch (error) {
      console.error('自动跳转处理失败:', error);
      ElMessage.error('自动跳转失败，请手动选择患者和模板');
      currentStep.value = 0;
    }
  }
};

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
  if (templateData.templateName.includes('评分')) currentStep.value = 3;
  else currentStep.value = 2;
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

// 处理跳转到量表评分界面
const handleNavigateToScale = (data) => {
  selectedScale.value = data.selectedScale;
  selectedTemplateItem.value = data.templateItem;
  currentStep.value = 4;
  ElMessage.success(`已跳转到 ${data.selectedScale.word_name} 评分界面`);
};

// 处理暂存评分数据
const handleSaveScoreData = (data) => {
  // 使用模板词条的word_code作为key来存储评分数据
  const wordCode = data.templateItem.word_code;
  pendingScoreData.value[wordCode] = data;
  currentStep.value = 3; // 跳回模板页面
  ElMessage.success(`评分数据已暂存，请在模板页面统一录入`);
};

// 组件挂载时处理自动跳转
onMounted(() => {
  handleAutoJump();
});
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
