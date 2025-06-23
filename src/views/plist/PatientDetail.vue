<template>
  <div class="patient-detail">
    <div class="toolbar">
      <el-button icon="Back" @click="goBack"> 返回列表 </el-button>
      <div class="right-toolbar">
        <el-button icon="Edit" type="primary" @click="openEditDialog"> 编辑信息 </el-button>
        <div class="view-switch">
        <!-- 自定义图标：列表视图 -->
        <el-button
          :type="viewMode === 'table' ? 'danger' : 'default'"
          square
          @click="viewMode = 'table'"
          class="square-btn"
        >
        <img src="@/assets/table.png" alt="自定义图标" class="icon-img" />
        </el-button>

        <!-- 自定义图标：时间轴视图 -->
        <el-button
          :type="viewMode === 'timeline' ? 'danger' : 'default'"
          square
          @click="viewMode = 'timeline'"
          class="square-btn"
        >
        <img src="@/assets/time.png" alt="自定义图标" class="icon-img" />
        </el-button>
      </div>
      </div>
    </div>

    <el-card class="mb-4">
      <div class="patient-info-grid">
        <p><strong>当前患者: </strong>{{ patient.identity_name }}</p>
        <p><strong>性别: </strong>{{ patient.gender === 1 ? '男' : '女' }}</p>

        <p><strong>年龄: </strong>{{ patient.age }}</p>
        <p><strong>身份证号: </strong>{{ patient.idCard }}</p>
        <div class="case-selector">
          <strong>病例号: </strong>
          <div class="case-buttons">
            <el-button
              v-for="(caseItem, index) in patient.allCases"
              :key="caseItem.case_code"
              :type="selectedCaseCodes.includes(caseItem.case_code) ? 'primary' : 'default'"
              size="small"
              @click="toggleCaseSelection(caseItem.case_code)"
            >
              {{ caseItem.case_code }}
            </el-button>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="patient-contact-info-grid">
        <p><strong>联系电话: </strong>{{ patient.phone_number }}</p>
        <p><strong>家庭住址: </strong>{{ patient.home_address }}</p>
      </div>
      <div class="patient-medical-info-grid">
        <p><strong>血型: </strong>{{ patient.blood_type }}</p>
        <p><strong>RH: </strong>{{ patient.rh||"阴性" }}</p>
        <p><strong>是否做过移植手术: </strong>{{ patient.has_transplant_surgery }}</p>
        <p><strong>是否在移植排队: </strong>{{ patient.is_in_transplant_queue }}</p>
      </div>
      <p><strong>主要诊断: </strong>{{ patient.main_diagnosis }}</p>
    </el-card>


    <div v-if="viewMode === 'table'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card v-for="section in leftSections" :key="section.title" class="mb-4">
            <template #header>
              <div class="section-title-header">
                <strong>{{ section.title }}</strong>
              </div>
            </template>
            <el-table :data="section.items" border stripe size="small" :show-header="false">
              <el-table-column prop="label" label="项目" width="180">
                <template #default="{ row }">
                  <el-button type="primary" link @click="openTemplateDetailDialog(row.template_code, row.case_code)">
                    {{ row.label }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="检查时间" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card v-for="section in rightSections" :key="section.title" class="mb-4">
            <template #header>
              <div class="section-title-header">
                <strong>{{ section.title }}</strong>
              </div>
            </template>
            <el-table :data="section.items" border stripe size="small" :show-header="false">
              <el-table-column prop="label" label="项目" width="180">
                <template #default="{ row }">
                  <el-button type="primary" link @click="openTemplateDetailDialog(row.template_code, row.case_code)">
                    {{ row.label }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="检查时间" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div v-else>
      <el-timeline>
        <el-timeline-item
          v-for="(entry, index) in timelineData"
          :key="index"
          :timestamp="entry.date"
          :type="index === 0 ? 'primary' : 'info'"
          :hollow="index !== 0"
        >
          <div v-for="item in entry.items" :key="item.label">
            {{ item.label }}
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑患者信息" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ editForm.gender === 1 ? '男' : '女' }}</span>
        </el-form-item>
        <el-form-item label="年龄">
          <span>{{ editForm.age }}</span>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editForm.phone_number" />
        </el-form-item>
        <el-form-item label="是否做过移植手术">
          <el-input v-model="editForm.has_transplant_surgery" />
        </el-form-item>
        <el-form-item label="是否在移植排队">
          <el-select v-model="editForm.is_in_transplant_queue" placeholder="请选择">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="主要诊断">
          <el-input v-model="editForm.main_diagnosis" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveEdit"> 保存 </el-button>
      </template>
    </el-dialog>

    <!-- 模板详情对话框 -->
    <el-dialog v-model="templateDetailDialogVisible" title="模板详情" width="600px">
      <div v-if="currentTemplateDetail">
        <p><strong>模板名称: </strong>{{ currentTemplateDetail.template_name }}</p>
        <p><strong>检查时间: </strong>{{ currentTemplateDetail.check_time }}</p>
        <el-divider />
        <el-table :data="currentTemplateDetail.items" border stripe size="small">
          <el-table-column prop="word_name" label="词条名称" />
          <el-table-column prop="value" label="值" />
        </el-table>
      </div>
      <div v-else>
        <el-alert type="info" :closable="false"> 暂无模板详情数据 </el-alert>
      </div>
      <template #footer>
        <el-button @click="templateDetailDialogVisible = false"> 关闭 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, PropType } from 'vue';
import { ElMessage, ElButton, ElDialog, ElTable, ElTableColumn, ElDivider, ElAlert } from 'element-plus';
import { caseTemplateSummaryCreate } from '../../api/caseTemplateSummary';
import { caseTemplateDetailCreate } from '../../api/caseTemplateDetail';
import { caseUpdate} from '../../api/openApiCase'

// 定义接口以解决类型错误
interface TemplateItem {
  template_name: string;
  template_code: string; // 确保这里包含 template_code
  check_time: string;
  case_code: string; // 添加病例编号字段
}

interface TemplateCategoryData {
  template_category: string;
  templates: TemplateItem[];
}

// 新增：按病例分组的模板数据结构
interface CaseTemplateData {
  case_code: string;
  template_categories: TemplateCategoryData[];
}

interface TemplateDetailItem {
  word_code: string;
  word_name: string;
  value: string;
}

interface TemplateDetailData {
  template_name: string;
  check_time: string;
  items: TemplateDetailItem[];
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface PatientCase {
  case_code: string;
  // ... 其他病例属性
}

interface Patient {
  identity_name: string;//name 和identity_name不一致，原因在于 一个身份证录入两个不同的名字
  gender: number;
  age: number;
  idCard: string;
  phone_number: string;
  home_address: string;
  blood_type: string;
  rh: string;
  has_transplant_surgery: string;
  is_in_transplant_queue: string;
  main_diagnosis: string;
  allCases?: PatientCase[]; // 确保这里是 PatientCase 数组
  // ... 其他患者属性
}

const props = defineProps({
  patient: {
    type: Object as PropType<Patient>,
    required: true
  },
});

const viewMode = ref('table'); // 'table' or 'timeline'

const editDialogVisible = ref(false);
const editForm = reactive({
  name: '',
  gender: 1,
  age: '',
  phone_number: '',
  has_transplant_surgery: '',
  is_in_transplant_queue: '',
  main_diagnosis:'',
});

const emit = defineEmits(['back']);
const templateData = ref<CaseTemplateData[]>([]);

// 新增：选中的病例编号列表
const selectedCaseCodes = ref<string[]>([]);

const templateDetailDialogVisible = ref(false);
const currentTemplateDetail = ref<TemplateDetailData | null>(null);

// 切换病例选择
const toggleCaseSelection = (caseCode: string) => {
  const index = selectedCaseCodes.value.indexOf(caseCode);
  if (index > -1) {
    // 如果已选中，则取消选择
    selectedCaseCodes.value.splice(index, 1);
  } else {
    // 如果未选中，则添加到选择列表
    selectedCaseCodes.value.push(caseCode);
  }
  console.log('当前选中的病例:', selectedCaseCodes.value);
};

// 获取模板数据 - 分别获取每个病例的模板数据
const fetchTemplateData = async () => {
  try {
    if (!props.patient.allCases?.length) return;
    
    // 默认选中第一个病例
    if (selectedCaseCodes.value.length === 0) {
      selectedCaseCodes.value = [props.patient.allCases[0].case_code];
    }
    
    const caseTemplatePromises = props.patient.allCases.map(async (patientCase: PatientCase) => {
      try {
        const res = await caseTemplateSummaryCreate({ case_codes: [patientCase.case_code] });
        console.log(`病例 ${patientCase.case_code} 的模板数据:`, res.data);
        
        const apiResponse = res.data as ApiResponse<TemplateCategoryData[]>;
        if (apiResponse?.code === 200) {
          // 为每个模板添加病例编号
          const processedCategories = apiResponse.data.map((category: TemplateCategoryData) => ({
            ...category,
            templates: category.templates.map((template: TemplateItem) => ({
              ...template,
              case_code: patientCase.case_code
            }))
          }));
          
          return {
            case_code: patientCase.case_code,
            template_categories: processedCategories
          };
        } else {
          console.error(`获取病例 ${patientCase.case_code} 的模板数据失败:`, apiResponse?.msg);
          return {
            case_code: patientCase.case_code,
            template_categories: []
          };
        }
      } catch (error) {
        console.error(`获取病例 ${patientCase.case_code} 的模板数据失败:`, error);
        return {
          case_code: patientCase.case_code,
          template_categories: []
        };
      }
    });
    
    const results = await Promise.all(caseTemplatePromises);
    templateData.value = results.filter(result => result.template_categories.length > 0);
    
    console.log('所有病例的模板数据:', templateData.value);
  } catch (error) {
    console.error('获取模板数据失败:', error);
    ElMessage.error('获取模板数据失败');
  }
};

// 将模板数据转换为左右两栏的格式 - 只显示选中病例的模板数据
const leftSections = computed(() => {
  if (!templateData.value.length || !selectedCaseCodes.value.length) return [];
  
  // 只处理选中病例的模板数据
  const selectedCaseData = templateData.value.filter(caseData => 
    selectedCaseCodes.value.includes(caseData.case_code)
  );
  
  // 收集所有选中病例的所有模板分类
  const allCategories: TemplateCategoryData[] = [];
  
  selectedCaseData.forEach((caseData: CaseTemplateData) => {
    caseData.template_categories.forEach((category: TemplateCategoryData) => {
      // 检查是否已存在相同的模板分类
      const existingCategory = allCategories.find(cat => cat.template_category === category.template_category);
      if (existingCategory) {
        // 如果存在，合并模板
        existingCategory.templates.push(...category.templates);
      } else {
        // 如果不存在，添加新分类
        allCategories.push({
          template_category: category.template_category,
          templates: [...category.templates]
        });
      }
    });
  });
  
  // 将数据分成左右两栏
  const midPoint = Math.ceil(allCategories.length / 2);
  return allCategories.slice(0, midPoint).map((category: TemplateCategoryData) => ({
    title: category.template_category,
    items: category.templates.map((template: TemplateItem) => ({
      label: template.template_name,midPoint,
      time: template.check_time,
      template_code: template.template_code,
      case_code: template.case_code
    }))
  }));
});

const rightSections = computed(() => {
  if (!templateData.value.length || !selectedCaseCodes.value.length) return [];
  
  // 只处理选中病例的模板数据
  const selectedCaseData = templateData.value.filter(caseData => 
    selectedCaseCodes.value.includes(caseData.case_code)
  );
  
  // 收集所有选中病例的所有模板分类
  const allCategories: TemplateCategoryData[] = [];
  
  selectedCaseData.forEach((caseData: CaseTemplateData) => {
    caseData.template_categories.forEach((category: TemplateCategoryData) => {
      // 检查是否已存在相同的模板分类
      const existingCategory = allCategories.find(cat => cat.template_category === category.template_category);
      if (existingCategory) {
        // 如果存在，合并模板
        existingCategory.templates.push(...category.templates);
      } else {
        // 如果不存在，添加新分类
        allCategories.push({
          template_category: category.template_category,
          templates: [...category.templates]
        });
      }
    });
  });
  
  // 将数据分成左右两栏
  const midPoint = Math.ceil(allCategories.length / 2);
  return allCategories.slice(midPoint).map((category: TemplateCategoryData) => ({
    title: category.template_category,
    items: category.templates.map((template: TemplateItem) => ({
      label: template.template_name,
      time: template.check_time,
      template_code: template.template_code,
      case_code: template.case_code
    }))
  }));
});

// Open edit dialog
const openEditDialog = () => {
  editForm.name = props.patient.identity_name;
  editForm.gender = props.patient.gender;
  editForm.age = String(props.patient.age);
  editForm.phone_number = props.patient.phone_number;
  editForm.has_transplant_surgery = props.patient.has_transplant_surgery;
  editForm.is_in_transplant_queue = props.patient.is_in_transplant_queue;
  editForm.main_diagnosis = props.patient.main_diagnosis;
  editDialogVisible.value = true;
};

// Save edited information
const saveEdit = async () => {
  if (selectedCaseCodes.value.length !== 1) {
    ElMessage.warning('请选择一个且仅一个病例以进行信息编辑。');
    return;
  }

  const caseCodeToUpdate = selectedCaseCodes.value[0];

  try {
    const params = {
      case_code: caseCodeToUpdate,
    };
    
    // Construct the body for the PUT request.
    const body = {
      // Editable fields from form
      name: editForm.name,
      phone_number: editForm.phone_number,
      main_diagnosis: editForm.main_diagnosis,
      has_transplant_surgery: editForm.has_transplant_surgery,
      is_in_transplant_queue: editForm.is_in_transplant_queue,
      
      // Non-editable fields from original patient data
      identity: props.patient.idCard,
      gender: props.patient.gender,
      home_address: props.patient.home_address,
      blood_type: props.patient.blood_type,
      rh: props.patient.rh,
    };

    const res = await caseUpdate(params, body as any);

    if (res.data?.code === 200) {
      ElMessage.success('患者信息更新成功！');
      editDialogVisible.value = false;
      // Update local patient data to reflect changes
      props.patient.identity_name = editForm.name;
      props.patient.phone_number = editForm.phone_number;
      props.patient.main_diagnosis = editForm.main_diagnosis;
      props.patient.has_transplant_surgery = editForm.has_transplant_surgery;
      props.patient.is_in_transplant_queue = editForm.is_in_transplant_queue;
      // 无感刷新：重新拉取模板数据
      await fetchTemplateData();
    } else {
      ElMessage.error(res.data?.msg || '更新患者信息失败。');
    }
  } catch (error) {
    console.error('更新患者信息失败:', error);
    ElMessage.error('更新操作失败。');
  }
};

// Go back to list
const goBack = () => {
  emit('back');
};

// 新增：打开模板详情对话框
const openTemplateDetailDialog = async (templateCode: string, caseCode: string) => {
  if (!caseCode) {
    ElMessage.warning('缺少病例编号信息，无法获取模板详情。');
    return;
  }
  
  console.log(`正在获取模板详情 - 病例编号: ${caseCode}, 模板编号: ${templateCode}`);
  
  try {
    const res = await caseTemplateDetailCreate({
      case_code: caseCode,
      template_code: templateCode
    });

    // 明确类型断言以解决 linter 错误
    const apiResponse = res.data as ApiResponse<TemplateDetailData>;
    if (apiResponse?.code === 200) {
      currentTemplateDetail.value = apiResponse.data;
      templateDetailDialogVisible.value = true;
      console.log('模板详情获取成功:', apiResponse.data);
    } else {
      ElMessage.error(`获取模板详情失败: ${apiResponse?.msg || '未知错误'}`);
    }
  } catch (error) {
    console.error('获取模板详情失败:', error);
    ElMessage.error('获取模板详情失败');
  }
};

// Combine all sections for timeline view
const allSections = computed(() => [...leftSections.value, ...rightSections.value]);

// Assemble timeline data
const timelineData = computed(() => {
  const data: { date: string; items: { label: string; time: string }[] }[] = [];
  allSections.value.forEach((section) => {
    section.items.forEach((item: { label: string; time: string }) => {
      const found = data.find((t) => t.date === item.time);
      if (found) {
        found.items.push(item);
      } else {
        data.push({ date: item.time, items: [item] });
      }
    });
  });
  // Sort timeline data by date (latest first)
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 格式化时间轴日期，如果是今天则显示"今天"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.map(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    let formattedDate = entry.date; // 默认使用完整日期

    if (entryDate.getTime() === today.getTime()) {
      formattedDate = '今天';
    } else {
      formattedDate = new Date(entry.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    return { ...entry, date: formattedDate };
  });
});

// 组件挂载时获取数据
onMounted(() => {
  fetchTemplateData();
});
</script>

<style scoped>

.square-btn {
  width: 35px;
  height: 35px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-img {
  width: 25px;
  height: 25px;
}

.patient-detail {
  padding: 32px;
  width: 100vw;
  max-width: 100vw;
  min-width: 0;
  margin: 0;
  box-sizing: border-box;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.right-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-switch {
  display: flex;
  gap: 12px;
}

.mb-4 {
  margin-bottom: 32px;
}

/* 默认3列 */
.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  font-size: 20px;
}

/* 默认4列 */
.patient-medical-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 16px;
  font-size: 18px;
}

/* 默认2列 */
.patient-contact-info-grid {
  display: grid;
  grid-template-columns: 1.5fr 3fr;
  gap: 20px;
  margin-top: 16px;
  font-size: 18px;
}

/* 平板及以下：2列 */
@media (max-width: 900px) {
  .patient-info-grid {
    grid-template-columns: repeat(2, 1fr);
    font-size: 18px;
  }
  .patient-medical-info-grid {
    grid-template-columns: repeat(2, 1fr);
    font-size: 16px;
  }
}

/* 手机：1列 */
@media (max-width: 600px) {
  .patient-detail {
    padding: 8px;
  }
  .patient-info-grid,
  .patient-medical-info-grid,
  .patient-contact-info-grid {
    grid-template-columns: 1fr;
    font-size: 15px;
    gap: 10px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
}

.patient-info-grid p,
.patient-contact-info-grid p,
.patient-medical-info-grid p {
  margin: 0;
  padding: 0;
}

.el-divider {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* 病例选择器样式 */
.case-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.case-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.case-buttons .el-button {
  margin: 0;
  min-width: 80px;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .case-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .case-buttons {
    gap: 6px;
  }
  
  .case-buttons .el-button {
    min-width: 70px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .case-buttons .el-button {
    min-width: 60px;
    font-size: 11px;
    padding: 4px 8px;
  }
}

.section-title-header {
  background: #F0F0F0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
}

.el-card.mb-4 {
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  transition: box-shadow 0.3s;
  border: none;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  position: relative;
}
.el-card.mb-4:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.16);
}
.el-card.mb-4::before {
  content: '';
  display: block;
  height: 5px;
  width: 100%;
  /* background: linear-gradient(90deg, #6a9cf7 0%, #7ee8fa 100%); 这是边框渐变化处理 */
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 14px 14px 0 0;
}
.el-card__body {
  padding: 28px 24px 20px 24px;
  font-size: 16px;
  color: #333;
  line-height: 1.7;
}
</style>
