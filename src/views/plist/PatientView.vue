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

    <!-- 如果有选中的患者，直接显示患者详情（无论是否选择了档案） -->
    <div v-if="selectedPatient" class="table-card-wrap">
      <PatientDetail :patient="selectedPatient" @back="goBackToTable" />
    </div>

    <!-- 如果没有选中档案，显示提示信息 -->
    <el-alert
      v-else-if="!selectedCase"
      title="查看患者列表之前请选择专病档案！"
      type="info"
      show-icon
      class="mt-4"
    />

    <!-- 显示患者列表 -->
    <div v-else class="table-card-wrap">
      <el-card class="table-card">
        <div class="card-header">
          <span class="card-title">{{ selectedCaseName }}</span>
          <div class="search-and-refresh">
            <el-input
              v-model="searchQuery"
              placeholder="搜索姓名/身份证号"
              clearable
              @keyup.enter="handleSearch"
              style="width: 240px; margin-right: 12px;"
            />
            <el-button type="primary" circle @click="refreshTable">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </div>
        </div>
        <PatientTable
          :table-data="patients[selectedCase] || []"
          :total="total"
          :current-page="currentPage"
          @view-detail="handleViewDetail"
          @page-change="handlePageChange"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { patientMergedCaseList } from '../../api/patientMergedCase';
import { caseIdentityCases } from '../../api/openApiCase';
import { RefreshRight } from '@element-plus/icons-vue';

import CaseSelector from './CaseSelector.vue';
import PatientTable from './PatientTable.vue';
import PatientDetail from './PatientDetail.vue';

interface Patient {
  id: string;
  name: string;
  gender: number;
  age: number;
  phone: string;
  address: string;
  bloodType: string;
  surgeryTime: string;
  isWaiting: string;
  // 以下是 PatientDetail 需要的字段
  identity_name: string;
  idCard: string;
  phone_number: string;
  home_address: string;
  blood_type: string;
  rh: string;
  has_transplant_surgery: string;
  is_in_transplant_queue: string;
  main_diagnosis: string;
  allCases: any[];
}

const router = useRouter();

const selectedCase = ref('');
const selectedCaseName = ref('');
const selectedPatient = ref<Patient | null>(null);
const patients = ref<{ [key: string]: Patient[] }>({});
const isSelectorDisabled = ref(false);

const currentPage = ref(1);
const total = ref(0);
const pageSize = 10; // 假设每页10条
const searchQuery = ref('');

// 监听搜索框变化，自动触发搜索
watch(searchQuery, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleSearch();
  }
});

// 页面加载时读取 localStorage
onMounted(() => {
  // 首先检查是否有从可视化页面传递的患者数据
  const selectedPatientDetailStr = localStorage.getItem('selectedPatientDetail');
  if (selectedPatientDetailStr) {
    try {
      const patientDetail = JSON.parse(selectedPatientDetailStr);
      console.log('检测到从可视化页面传递的患者数据:', patientDetail);
      
      // 直接显示患者详情
      selectedPatient.value = patientDetail;
      
      // 清除localStorage中的数据，避免重复使用
      localStorage.removeItem('selectedPatientDetail');
      
      // 不需要设置档案选择器状态，因为是直接跳转到详情页
      return;
    } catch (error) {
      console.error('解析患者详情数据失败:', error);
      localStorage.removeItem('selectedPatientDetail');
    }
  }
  
  // 正常的档案选择流程
  const archiveCode = localStorage.getItem('selectedCase') || '';
  const archiveName = localStorage.getItem('selectedCaseName') || '';
  if (archiveCode) {
    selectedCase.value = archiveCode;
    selectedCaseName.value = archiveName;
    isSelectorDisabled.value = true;
    handleCaseSelect({ archive_code: archiveCode, archive_name: archiveName });
  }
});

const handleCaseSelect = async (archive: { archive_code: string; archive_name: string }) => {
  if (!archive.archive_code) return;
  selectedCase.value = archive.archive_code;
  selectedCaseName.value = archive.archive_name;
  selectedPatient.value = null;
  isSelectorDisabled.value = true;
  localStorage.setItem('selectedCase', archive.archive_code);
  localStorage.setItem('selectedCaseName', archive.archive_name);

  fetchPatientsForCase(archive.archive_code, 1);
};

const fetchPatientsForCase = async (archiveCode: string, page: number) => {
  try {
    const res = await patientMergedCaseList({
      archive_code: archiveCode,
      page: page,
      page_size: pageSize,
      search: searchQuery.value || undefined,
    });
    
    const patientList = (res.data.data.list || []).map((item: any) => ({
      id: item.identity_id || '',
      name: item.name || '',
      gender: item.gender,
      age: item.age || 0,
      phone: item.phone_number || '',
      address: item.home_address || '',
      bloodType: item.blood_type || '',
      surgeryTime: item.has_transplant_surgery || '',
      isWaiting: item.is_in_transplant_queue || '',
      identity_name: item.name || '',
      idCard: item.identity_id || '',
      phone_number: item.phone_number || '',
      home_address: item.home_address || '',
      blood_type: item.blood_type || '',
      rh: item.rh || '',
      has_transplant_surgery: item.has_transplant_surgery || '',
      is_in_transplant_queue: item.is_in_transplant_queue || '',
      main_diagnosis: item.main_diagnosis || '',
      allCases: [],
    }));
    
    patients.value = { [archiveCode]: patientList };
    total.value = res.data.data.total;
    currentPage.value = page;
  } catch (err) {
    console.error('获取档案详情失败:', err);
    ElMessage.error('获取档案详情失败');
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchPatientsForCase(selectedCase.value, 1);
};

const handlePageChange = (page: number) => {
  fetchPatientsForCase(selectedCase.value, page);
};

const handleViewDetail = async (patient: Patient) => {
  const identityId = patient.id;
  try {
    const res = await caseIdentityCases({ identity_id: identityId });
    const caseList = res.data.data.list || [];

    const detailData = caseList.length > 0 ? {
      ...caseList[0],
      allCases: caseList,
      idCard: identityId,
    } : { ...patient, idCard: identityId, allCases: [] };
    selectedPatient.value = detailData;
  } catch (err) {
    ElMessage.error('获取该患者所有病例失败');
    console.error(err);
  }
};

const goBackToTable = () => {
  selectedPatient.value = null;
  
  // 如果没有选择档案，说明是从可视化页面跳转过来的，需要返回到数据分析页面
  if (!selectedCase.value) {
    router.push('/dashboard/DataAnalysisView');
  }
};

const refreshTable = async () => {
  if (!selectedCase.value) return;
  fetchPatientsForCase(selectedCase.value, currentPage.value);
  ElMessage.success('刷新成功');
};

const resetArchive = () => {
  selectedCase.value = '';
  selectedCaseName.value = '';
  selectedPatient.value = null;
  isSelectorDisabled.value = false;
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

.search-and-refresh {
  display: flex;
  align-items: center;
}
</style>