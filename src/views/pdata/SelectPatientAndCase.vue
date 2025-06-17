<template>
  <div class="select-patient-case-container">
    <div v-if="!selectedPatient && !props.patientData?.idCard">
      <el-card class="patient-selection-card" shadow="never">
        <template #header>
          <div class="card-header-content">
            <el-icon><UserFilled /></el-icon>
            <span>选择患者</span>
          </div>
        </template>
        <div class="info-message">
          <el-alert type="info" :closable="false" show-icon> 请选择要录入数据的患者 </el-alert>
        </div>
        <div class="patient-content">
          <div class="search-bar">
            <el-input
              v-model="searchQuery"
              placeholder="请输入患者姓名或身份证号"
              clearable
              @input="handleSearch"
              style="width: 300px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <el-table :data="patients" style="width: 100%" @row-click="handlePatientSelect">
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
                <el-button type="primary" link @click.stop="handlePatientSelect(row)">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <Pagination
              v-model:current-page="currentPage"
              :total="total"
              :page-size="pageSize"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </el-card>
    </div>

    <div v-else>
      <el-card class="case-selection-card" shadow="never">
        <template #header>
          <div class="card-header-content">
            <el-icon><Tickets /></el-icon>
            <span>选择病例</span>
          </div>
        </template>
        <div class="info-message">
          <el-alert type="info" :closable="false" show-icon> 请选择要录入数据的病例 </el-alert>
        </div>
        <div class="case-content">
          <el-table :data="cases" style="width: 100%" @row-click="handleCaseSelect">
            <el-table-column prop="case_code" label="病例编号" width="120" />
            <el-table-column prop="main_diagnosis" label="主要诊断" />
            <el-table-column prop="has_transplant_surgery" label="移植手术" width="120">
              <template #default="{ row }">
                {{ row.has_transplant_surgery ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link @click.stop="handleCaseSelect(row)">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElAlert, ElButton, ElCard, ElTable, ElTableColumn, ElMessage, ElInput } from 'element-plus';
import { UserFilled, Tickets, Search } from '@element-plus/icons-vue';
import { patientList, patientRead } from '../../api/patient';
import Pagination from '../../components/Pagination.vue';

const props = defineProps({
  patientData: Object,
});

const emit = defineEmits(['patient-case-selected']);

const patients = ref([]);
const selectedPatient = ref(null);
const cases = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 监听患者数据变化
watch(() => props.patientData, (newVal) => {
  if (newVal?.identity_id) {
    // 如果有患者信息，直接获取病例列表
    selectedPatient.value = newVal;
    fetchPatientInfo(newVal.identity_id);
  }
}, { immediate: true });

// 获取患者列表
const fetchPatients = async () => {
  try {
    const res = await patientList({
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchQuery.value
    });
    console.log('患者列表:', res.data);
    if (res?.data?.code === 200) {
      patients.value = res.data.data.list;
      total.value = res.data.data.total;
    }
  } catch (error) {
    console.error('获取患者列表失败:', error);
    ElMessage.error('获取患者列表失败');
  }
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchPatients();
};

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchPatients();
};

// 选择患者
const handlePatientSelect = async (patient) => {
  try {
    console.log('开始选择患者:', patient);
    const res = await patientRead({ identity_id: patient.identity_id });
    console.log('API返回数据:', res);
    console.log('API返回状态码:', res.status);

    if (res.status === 200) {
      console.log('API调用成功，开始处理数据');
      selectedPatient.value = res.data;
      console.log('设置选中的患者:', selectedPatient.value);
      
      cases.value = res.data.case_list || [];
      console.log('设置病例列表:', cases.value);
      
      if (cases.value.length === 0) {
        console.log('没有找到病例');
        ElMessage.warning('该患者暂无病例记录');
      } else if (cases.value.length === 1) {
        console.log('找到1个病例，自动选择');
        handleCaseSelect(cases.value[0]);
      } else {
        console.log('找到多个病例，显示病例列表');
      }
    } else {
      console.error('API返回错误:', res);
      ElMessage.error('获取患者信息失败');
    }
  } catch (error) {
    console.error('获取患者信息失败:', error);
    ElMessage.error('获取患者信息失败');
  }
};

// 选择病例
const handleCaseSelect = (caseData) => {
  console.log('开始选择病例:', caseData);
  console.log('当前选中的患者:', selectedPatient.value);
  
  if (!selectedPatient.value) {
    console.error('没有选中的患者信息');
    ElMessage.error('请先选择患者');
    return;
  }

  try {
    const emitData = {
      patientId: selectedPatient.value.id,
      caseId: caseData.case_code,
      patientData: {
        name: selectedPatient.value.name,
        gender: selectedPatient.value.gender,
        age: selectedPatient.value.age,
        identity_id: selectedPatient.value.identity_id,
        caseId: caseData.case_code
      }
    };
    
    console.log('准备发送的数据:', emitData);
    emit('patient-case-selected', emitData);
    console.log('事件已发送');
  } catch (error) {
    console.error('发送数据失败:', error);
    ElMessage.error('选择病例失败');
  }
};

// 组件挂载时获取患者列表
onMounted(() => {
  fetchPatients();
});
</script>

<style scoped>
.select-patient-case-container {
  padding: 0px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-message {
  margin-bottom: 20px;
  padding: 15px;
}

.patient-content,
.case-content {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>