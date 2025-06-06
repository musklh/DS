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
        <p><strong>性别: </strong>{{ patient.gender }}</p>
        <p><strong>年龄: </strong>{{ patient.age }}</p>
        <p><strong>身份证号: </strong>{{ patient.idCard }}</p>
        <p><strong>病例: </strong>{{ patient.caseId1 }}</p>
        <p><strong>病例: </strong>{{ patient.caseId2 }}</p>
      </div>
      <el-divider />
      <div class="patient-contact-info-grid">
        <p><strong>联系电话: </strong>{{ patient.phone }}</p>
        <p><strong>家庭住址: </strong>{{ patient.address }}</p>
      </div>
      <div class="patient-medical-info-grid">
        <p><strong>血型: </strong>{{ patient.bloodType }}</p>
        <p><strong>RH: </strong>{{ patient.rh }}</p>
        <p><strong>是否行肝移植手术: </strong>{{ patient.transplanted }}</p>
        <p><strong>是否在移植排队: </strong>{{ patient.waiting }}</p>
      </div>
      <p><strong>主要诊断: </strong>{{ patient.diagnosis }}</p>
    </el-card>

    <div v-if="viewMode === 'table'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card v-for="section in leftSections" :key="section.title" class="mb-4">
            <template #header>
              <strong>{{ section.title }}</strong>
            </template>
            <el-table :data="section.items" border stripe size="small" :show-header="false">
              <el-table-column prop="label" label="项目" width="180" />
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
              <el-table-column prop="label" label="项目" width="180" />
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
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  patient: Object,
});

const viewMode = ref('table'); // 'table' or 'timeline'

const editDialogVisible = ref(false);
const editForm = reactive({
  name: '',
  gender: '',
  age: '',
  phone: '',
});

// Mock patient data based on the image
const patient = reactive({
  name: '王XXX',
  gender: '女',
  age: '52岁',
  idCard: 'XXXXXXXXXXXXXXXXX',
  caseId1: 'XA568942',
  caseId2: 'XA584523',
  phone: '18956142356',
  address: '家庭住址: 福建省厦门市XXXXXXXXXXXXXXX',
  bloodType: 'O型',
  rh: '阴性',
  transplanted: '是 (2024-XX-XX)',
  waiting: '否',
  diagnosis: '主要诊断: XXXXXXXXXXXXXXXXXXXXXX',
});

// Open edit dialog
const openEditDialog = () => {
  Object.assign(editForm, patient); // Assign current patient data to edit form
  editDialogVisible.value = true;
};

// Save edited information
const saveEdit = () => {
  // In a real application, you'd send this data to a backend
  Object.assign(patient, editForm); // Update patient data with edited form
  ElMessage.success('已保存');
  editDialogVisible.value = false;
};

// Go back to list
const goBack = () => {
  ElMessage.info('返回列表');
};

// Data for the sections, categorized as left and right based on the image layout
const leftSections = [
  {
    title: '临床检验',
    items: [
      { label: '血常规', time: '2024-XX-XX 12:21' },
      { label: '凝血四项', time: '2024-XX-XX 12:25' },
      { label: '血气分析', time: '2024-XX-XX 13:33' },
      { label: '术前免疫', time: '2024-XX-XX 13:40' },
    ],
  },
  {
    title: '临床记录',
    items: [
      { label: '病史采集', time: '2024-XX-XX 09:21' },
      { label: '专家诊疗意见', time: '2024-XX-XX 11:22' },
    ],
  },
  {
    title: '随访',
    items: [
      { label: '当前治疗情况', time: '2024-XX-XX 13:30' },
      { label: '移植后随访', time: '2024-XX-XX 18:23' },
    ],
  },
];

const rightSections = [
  {
    title: '辅助检查',
    items: [
      { label: '胸部CT', time: '2024-XX-XX 09:02' },
      { label: '腹部CT', time: '2024-XX-XX 10:29' },
      { label: '心脏彩超', time: '2024-XX-XX 11:33' },
    ],
  },
  {
    title: '评分',
    items: [
      { label: 'Child-pugh评分', time: '2024-XX-XX 10:11' },
      { label: 'MELD评分', time: '2024-XX-XX 12:32' },
      { label: 'CLIF-CAD评分', time: '2024-XX-XX 18:45' },
      { label: 'EASL-ACLF评分', time: '2024-XX-XX 18:48' },
      { label: 'MELD评分 (移植后)', time: '2024-XX-XX 16:28' },
    ],
  },
];

// Combine all sections for timeline view
const allSections = computed(() => [...leftSections, ...rightSections]);

// Assemble timeline data
const timelineData = computed(() => {
  const data = [];
  allSections.value.forEach((section) => {
    section.items.forEach((item) => {
      const found = data.find((t) => t.date === item.time);
      if (found) {
        found.items.push(item);
      } else {
        data.push({ date: item.time, items: [item] });
      }
    });
  });
  // Sort timeline data by date (latest first, as per typical timeline display)
  data.sort((a, b) => new Date(b.date) - new Date(a.date));
  return data;
});
</script>

<style scoped>
.patient-detail {
  padding: 24px;
  max-width: 1100px;
  margin: auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.right-toolbar {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between "编辑信息" and view switch */
}

.view-switch {
  display: flex;
  gap: 8px;
}

.mb-4 {
  margin-bottom: 24px;
}

/* Basic Info Grid Layout */
.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns for name, gender, age, ID, case IDs */
  gap: 10px;
}

.patient-contact-info-grid {
  display: grid;
  grid-template-columns: 1.5fr 3fr; /* phone and address, adjust ratio as needed */
  gap: 10px;
  margin-top: 10px; /* Space after divider */
}

.patient-medical-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* blood type, RH, transplanted, waiting */
  gap: 10px;
  margin-top: 10px;
}

/* Style for patient info paragraphs to make them compact */
.patient-info-grid p,
.patient-contact-info-grid p,
.patient-medical-info-grid p {
  margin: 0; /* Remove default paragraph margin */
  padding: 0;
}

.el-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
