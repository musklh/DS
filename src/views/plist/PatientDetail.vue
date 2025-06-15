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

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  patient: {
    type: Object,
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

// Open edit dialog
const openEditDialog = () => {
  Object.assign(editForm, props.patient); // Assign current patient data to edit form
  editDialogVisible.value = true;
};

// Save edited information
const saveEdit = () => {
  // In a real application, you'd send this data to a backend
  Object.assign(props.patient, editForm); // Update patient data with edited form
  ElMessage.success('已保存');
  editDialogVisible.value = false;
};

// Go back to list
const goBack = () => {
  emit('back');
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
  const data: any[] = [];
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
