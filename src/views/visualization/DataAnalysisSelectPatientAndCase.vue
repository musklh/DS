<template>
  <div class="analysis-select-container">
    <el-card class="selection-card">
      <div class="info-message">
        <el-alert type="info" :closable="false" show-icon>
          请选择数据可视化目标！先选择患者，再选择患者的病例。
        </el-alert>
      </div>

      <div v-if="step === 1" class="select-patient-area">
        <div class="search-bar">
          <el-input v-model="search" placeholder="搜索姓名/身份证号" clearable @keyup.enter="fetchPatients" style="width: 240px; margin-right: 12px;" />
          <el-button type="primary" @click="fetchPatients">搜索</el-button>
        </div>
        <el-table :data="patients" style="width: 100%; margin-top: 16px;" border stripe size="small">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="identity_id" label="身份证号" />
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click.stop="handleSelectPatient(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 12px;">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="total"
            layout="->, prev, pager, next, jumper"
            @current-change="fetchPatients"
            @size-change="fetchPatients"
            background
          />
        </div>
      </div>

      <div v-else-if="step === 2" class="select-case-area">
        <div style="margin-bottom: 12px;">
          <el-button type="default" @click="handleBackToPatientList">返回患者列表</el-button>
        </div>
        <el-table :data="cases" border stripe size="small">
          <el-table-column prop="case_code" label="病例号" width="120" />
          <el-table-column prop="main_diagnosis" label="主诊断" />
          <el-table-column prop="inhospital_id" label="住院号" width="120" />
          <el-table-column prop="opd_id" label="门诊号" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click.stop="handleSelectCase(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="cases.length === 0" style="margin: 24px 0; text-align: center; color: #999;">该患者暂无病例</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElAlert, ElButton, ElCard, ElInput, ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus';
import { patientList, patientRead } from '../../api/patient';
import { caseIdentityCases } from '@/api/openApiCase';
import{caseVisualizationOptionsCreate} from '@/api/caseVisualizationOptions'

const emit = defineEmits(['patient-case-selected', 'clear-selected']);

const step = ref(1); // 1: 选择患者, 2: 选择病例
const search = ref('');
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const patients = ref([]);
const selectedPatient = ref(null);
const cases = ref([]);

const fetchPatients = async () => {
  const params = {
    page: page.value,
    page_size: pageSize.value,
    search: search.value,
  };
  const res = await patientList(params);
  if (res?.data?.code === 200) {
    patients.value = res.data.data.list;
    total.value = res.data.data.total;
  } else {
    patients.value = [];
    total.value = 0;
  }
};

const handleSelectPatient = async (row) => {
  selectedPatient.value = row;
  // 获取病例列表，改为调用patientRead
  try {
    const res = await patientRead({ identity_id: row.identity_id });
    if (res.status === 200 && res.data) {
      cases.value = res.data.case_list || [];
    } else {
      cases.value = [];
    }
  } catch (error) {
    cases.value = [];
  }
  step.value = 2;
};

const handleSelectCase = (row) => {
  // 选中病例后emit
  emit('patient-case-selected', {
    patientName: selectedPatient.value.name,
    gender: selectedPatient.value.gender === 1 ? '男' : '女',
    age: selectedPatient.value.age || '',
    idCard: selectedPatient.value.identity_id,
    caseId: row.case_code,
  });
};

const handleBackToPatientList = () => {
  step.value = 1;
  emit('clear-selected');
};

// 初始化加载患者列表
fetchPatients();
</script>

<style scoped>
.analysis-select-container {
  padding: 32px 0 0 0;
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
.select-patient-area, .select-case-area {
  padding: 32px 0 0 0;
}
.search-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
