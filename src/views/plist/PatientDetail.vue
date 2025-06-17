<template>
  <div class="patient-detail">
    <div class="toolbar">
      <el-button icon="Back" @click="goBack"> 返回列表 </el-button>
      <div class="right-toolbar">
        <el-button icon="Edit" type="primary" @click="openEditDialog"> 编辑信息 </el-button>
        <div class="view-switch">
          <el-button
            :type="viewMode === 'table' ? 'danger' : 'default'"
            icon="Grid"
            circle
            @click="viewMode = 'table'"
          />
          <el-button
            :type="viewMode === 'timeline' ? 'danger' : 'default'"
            icon="Notebook"
            circle
            @click="viewMode = 'timeline'"
          />
        </div>
      </div>
    </div>

    <el-card class="mb-4">
      <div class="patient-info-grid">
        <p><strong>当前患者: </strong>{{ patient.name }}</p>
        <p><strong>性别: </strong>{{ patient.gender === 1 ? '男' : '女' }}</p>

        <p><strong>年龄: </strong>{{ patient.age }}</p>
        <p><strong>身份证号: </strong>{{ patient.idCard }}</p>
        <p v-for="item in patient.allCases" :key="item.case_code"><strong>病例号: </strong>{{ item.case_code }}</p>
      </div>
      <el-divider />
      <div class="patient-contact-info-grid">
        <p><strong>联系电话: </strong>{{ patient.phone_number }}</p>
        <p><strong>家庭住址: </strong>{{ patient.home_address }}</p>
      </div>
      <div class="patient-medical-info-grid">
        <p><strong>血型: </strong>{{ patient.blood_type }}</p>
        <p><strong>RH: </strong>{{ patient.rh||"阴性" }}</p>
        <p><strong>是否行肝移植手术: </strong>{{ patient.has_transplant_surgery }}</p>
        <p><strong>是否在移植排队: </strong>{{ patient.is_in_transplant_queue }}</p>
      </div>
      <p><strong>主要诊断: </strong>{{ patient.main_diagnosis }}</p>
    </el-card>

    <div v-if="viewMode === 'table'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card v-for="section in leftSections" :key="section.title" class="mb-4">
            <template #header>
              <strong>{{ section.title }}</strong>
            </template>
            <el-table :data="section.items" border stripe size="small" :show-header="false">
              <el-table-column prop="label" label="项目" width="180">
                <template #default="{ row }">
                  <el-button type="primary" link @click="openTemplateDetailDialog(row.template_code)">
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
              <strong>{{ section.title }}</strong>
            </template>
            <el-table :data="section.items" border stripe size="small" :show-header="false">
              <el-table-column prop="label" label="项目" width="180">
                <template #default="{ row }">
                  <el-button type="primary" link @click="openTemplateDetailDialog(row.template_code)">
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
          <el-select v-model="editForm.gender">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.age" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editForm.phone" />
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
import type { AxiosResponse } from 'axios';

// 定义接口以解决类型错误
interface TemplateItem {
  template_name: string;
  template_code: string; // 确保这里包含 template_code
  check_time: string;
}

interface TemplateCategoryData {
  template_category: string;
  templates: TemplateItem[];
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
  name: string;
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
  gender: '',
  age: '',
  phone: '',
});

const emit = defineEmits(['back']);
const templateData = ref<TemplateCategoryData[]>([]);

const templateDetailDialogVisible = ref(false);
const currentTemplateDetail = ref<TemplateDetailData | null>(null);

// 获取模板数据
const fetchTemplateData = async () => {
  try {
    if (!props.patient.allCases?.length) return;
    
    const caseCodes = props.patient.allCases.map((case_: PatientCase) => case_.case_code);
    const res = await caseTemplateSummaryCreate({ case_codes: caseCodes });
    
    // 明确类型断言以解决 linter 错误
    const apiResponse = res.data as ApiResponse<TemplateCategoryData[]>;
    if (apiResponse?.code === 200) {
      templateData.value = apiResponse.data;
    } else {
      ElMessage.error('获取模板数据失败');
    }
  } catch (error) {
    console.error('获取模板数据失败:', error);
    ElMessage.error('获取模板数据失败');
  }
};

// 将模板数据转换为左右两栏的格式
const leftSections = computed(() => {
  if (!templateData.value.length) return [];
  
  // 将数据分成左右两栏
  const midPoint = Math.ceil(templateData.value.length / 2);
  return templateData.value.slice(0, midPoint).map((category: TemplateCategoryData) => ({
    title: category.template_category,
    items: category.templates.map((template: TemplateItem) => ({
      label: template.template_name,
      time: template.check_time,
      template_code: template.template_code // 传递 template_code
    }))
  }));
});

const rightSections = computed(() => {
  if (!templateData.value.length) return [];
  
  // 将数据分成左右两栏
  const midPoint = Math.ceil(templateData.value.length / 2);
  return templateData.value.slice(midPoint).map((category: TemplateCategoryData) => ({
    title: category.template_category,
    items: category.templates.map((template: TemplateItem) => ({
      label: template.template_name,
      time: template.check_time,
      template_code: template.template_code // 传递 template_code
    }))
  }));
});

// Open edit dialog
const openEditDialog = () => {
  Object.assign(editForm, props.patient);
  editDialogVisible.value = true;
};

// Save edited information
const saveEdit = () => {
  Object.assign(props.patient, editForm);
  ElMessage.success('已保存');
  editDialogVisible.value = false;
};

// Go back to list
const goBack = () => {
  emit('back');
};

// 新增：打开模板详情对话框
const openTemplateDetailDialog = async (templateCode: string) => {
  if (!props.patient.allCases || props.patient.allCases.length === 0) {
    ElMessage.warning('该患者没有病例信息，无法获取模板详情。');
    return;
  }
  const caseCode = props.patient.allCases[0].case_code; // 假设使用第一个病例编号
  
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
    } else {
      ElMessage.error('获取模板详情失败');
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
</style>
