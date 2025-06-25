<template>
  <div class="patient-view-root">
    <div class="selector-bar">
      <CaseSelector
        @case-selected="handleCaseSelect"
        :disabled="isSelectorDisabled"
        :initial-selected-code="selectedCase"
      />
      <el-button
        v-if="isSelectorDisabled"
        type="primary"
        class="ml-2"
        @click="resetArchive"
      >
        重新选择档案
      </el-button>
    </div>

    <el-alert
      v-if="!selectedCase"
      title="查看患者列表之前请选择专病档案！"
      type="info"
      show-icon
      class="mt-4"
    />

    <div v-else-if="selectedPatient" class="table-card-wrap">
      <PatientDetail :patient="selectedPatient" @back="goBackToTable" />
    </div>

    <div v-else class="table-card-wrap">
      <el-card class="table-card">
        <div class="card-header">
          <span class="card-title">{{ selectedCaseName }}</span>
          <el-tooltip content="刷新" placement="top">
            <el-button type="primary" circle @click="refreshTable">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <PatientTable
          :table-data="patients[selectedCase] || []"
          @view-detail="handleViewDetail"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { patientMergedCaseList } from '../../api/patientMergedCase';
import { caseIdentityCases } from '../../api/openApiCase';
import { RefreshRight } from '@element-plus/icons-vue';

import CaseSelector from './CaseSelector.vue';
import PatientTable from './PatientTable.vue';
import PatientDetail from './PatientDetail.vue';
import { archiveRead } from '../../api/archive';

interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  address: string;
  bloodType: string;
  surgeryTime: string;
  isWaiting: string;
}

const selectedCase = ref('');
const selectedCaseName = ref('');
const selectedPatient = ref<Patient | null>(null);
const patients = ref<{ [key: string]: Patient[] }>({});
const isSelectorDisabled = ref(false);

// 页面加载时读取 localStorage
onMounted(() => {
  const archiveCode = localStorage.getItem('selectedCase') || '';
  const archiveName = localStorage.getItem('selectedCaseName') || '';
  if (archiveCode) {
    selectedCase.value = archiveCode;
    selectedCaseName.value = archiveName;
    isSelectorDisabled.value = true;
    // 这里可以自动加载患者列表
    handleCaseSelect({ archive_code: archiveCode, archive_name: archiveName });
  }
});

const handleCaseSelect = async (archive: { archive_code: string; archive_name: string }) => {
  if (!archive.archive_code) return;
  selectedCase.value = archive.archive_code;
  selectedCaseName.value = archive.archive_name;
  selectedPatient.value = null;
  isSelectorDisabled.value = true;
  // 保存到 localStorage
  localStorage.setItem('selectedCase', archive.archive_code);
  localStorage.setItem('selectedCaseName', archive.archive_name);

  try {
    const res = await patientMergedCaseList({ archive_code: archive.archive_code });
    // 将后端返回的 case_list 映射为 Patient 类型
    const patientList = (res.data.data.list || []).map((item: any) => ({
      id: item.identity_id || '',
      name: item.name || '',
      gender: item.gender === 1 ? '男' : '女',
      age: item.age || 0,
      phone: item.phone_number || '',
      address: item.home_address || '',
      bloodType: item.blood_type || '',
      surgeryTime: item.has_transplant_surgery || '',
      isWaiting: item.is_in_transplant_queue || '',
    }));
    console.log
    patients.value = {
      [archive.archive_code]: patientList,
    };
  } catch (err) {
    console.error('获取档案详情失败:', err);
    ElMessage.error('获取档案详情失败');
  }
};

const handleViewDetail = async (patient: Patient) => {
  const identityId = patient.id;
  try {
    const res = await caseIdentityCases({ identity_id: identityId });
    console.log(res.data)
    const caseList = res.data.data.list || [];

    const detailData = caseList.length > 0 ? {
      ...caseList[0],
      allCases: caseList,
      idCard: identityId, // 直接用 identityId
    } : { idCard: identityId, allCases: [] };
    console.log(detailData)
    selectedPatient.value = detailData;
  } catch (err) {
    ElMessage.error('获取该患者所有病例失败');
    console.error(err);
  }
};

const goBackToTable = () => {
  selectedPatient.value = null;
};

const refreshTable = async () => {
  if (!selectedCase.value) return;
  try {
    const res = await archiveRead({ archive_code: selectedCase.value });
    
    // Assuming 'patients' array is directly under 'data' in the response for refresh
    patients.value[selectedCase.value] = res.data.data.case_list.map((item: any) => ({
      id: item.identity || '',
      name: item.identity_name || '',
      gender: item.gender === 1 ? '男' : '女',
      age: item.age || 0,
      phone: item.phone_number || '',
      address: item.home_address || '',
      bloodType: item.blood_type || '',
      surgeryTime: item.has_transplant_surgery || '',
      isWaiting: item.is_in_transplant_queue || '',
    })) || [];
    ElMessage.success('刷新成功');
  } catch (err) {
    console.error('刷新失败:', err);
    ElMessage.error('刷新失败');
  }
};

const resetArchive = () => {
  selectedCase.value = '';
  selectedCaseName.value = '';
  selectedPatient.value = null;
  isSelectorDisabled.value = false;
  // 清空 localStorage
  localStorage.removeItem('selectedCase');
  localStorage.removeItem('selectedCaseName');
};
</script>

---

<style scoped>
.patient-view-root {
  min-height: 100vh;
  background: #f7fafd;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
}

.selector-bar {
  margin-bottom: 24px;
}

.table-card-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.table-card {
  /* Increased width for a larger table */
  width: 20000px; /* Increased from 1000px */
  max-width: 95vw; /* Slightly reduced max-width to give a bit more margin on very large screens */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  background: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #222;
}
</style>