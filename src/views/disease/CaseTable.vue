<template>
  <div class="toolbar" style="margin-bottom: 16px; display: flex;">
    <el-input
      v-model="searchQuery"
      placeholder="搜索病例号/姓名/身份证号"
      clearable
      @keyup.enter="handleSearch"
      style="width: 300px; margin-right: 10px;"
      @clear="handleSearch"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" border v-loading="loading">
    <el-table-column prop="recordId" label="档案号" min-width="120" show-overflow-tooltip />
    <el-table-column prop="caseId" label="病例号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="idNumber" label="身份证号" min-width="180" show-overflow-tooltip />
    <el-table-column prop="outpatientId" label="门诊号" min-width="120" show-overflow-tooltip />
    <el-table-column prop="inpatientId" label="住院号" min-width="120" show-overflow-tooltip />
    <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip />
    <el-table-column prop="gender" label="性别" width="80" />
    <el-table-column prop="age" label="年龄" width="80" />
    <el-table-column prop="diagnosis" label="主要诊断" min-width="200" show-overflow-tooltip />

    <el-table-column label="操作" width="160" fixed="right">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <Pagination
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @page-change="handlePageChange"
  />

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="50%"
    :before-close="handleCloseDialog"
  >
    <el-form :model="currentCase" label-width="120px" ref="caseFormRef">
      <el-form-item label="档案号" prop="recordId">
        <el-input v-model="currentCase.recordId" disabled />
      </el-form-item>
      <el-form-item label="病例号" prop="caseId" :rules="[{ required: true, message: '病例号不能为空', trigger: 'blur' }]">
        <el-input v-model="currentCase.caseId" />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber" :rules="[{ required: true, message: '身份证号不能为空', trigger: 'blur' }]">
        <el-input v-model="currentCase.idNumber" />
      </el-form-item>
      <el-form-item label="门诊号" prop="outpatientId">
        <el-input v-model="currentCase.outpatientId" />
      </el-form-item>
      <el-form-item label="住院号" prop="inpatientId">
        <el-input v-model="currentCase.inpatientId" />
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]">
        <el-input v-model="currentCase.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="currentCase.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="currentCase.age!" :min="0" :max="150" />
      </el-form-item>
      <el-form-item label="主要诊断" prop="diagnosis">
        <el-input v-model="currentCase.diagnosis" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
} from 'element-plus';
import type { FormInstance, } from 'element-plus';
import { caseList, caseDelete, caseUpdate } from '../../api/openApiCase';
import Pagination from '@/components/Pagination.vue';

// Define the type for a table row item
interface TableCaseItem {
  recordId: string; // From archive_codes
  caseId: string; // From case_code
  idNumber: string; // From identity
  outpatientId: string; // From opd_id
  inpatientId: string; // From inhospital_id
  name: string;
  gender: string; // '男' or '女'
  age: number | null;
  diagnosis: string; // From main_diagnosis
  // Add original backend IDs to help with update/delete
  originalCaseCode: string; // Store original case_code for API calls
  originalIdentity: string; // Store original identity for API calls
  originalGender: number; // Store original gender as number
  originalBirthDate?: string; // Store original birth date
  originalArchiveCodes: string[]; // Store original archive_codes for update/delete
}

// Table data
const tableData = ref<TableCaseItem[]>([]);
const loading = ref(false);

// Pagination parameters
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchQuery = ref('');

// Dialog and form for editing
const dialogVisible = ref(false);
const dialogTitle = ref('编辑病例');
const currentCase = reactive<TableCaseItem>({
  recordId: '',
  caseId: '',
  idNumber: '',
  outpatientId: '',
  inpatientId: '',
  name: '',
  gender: '',
  age: null,
  diagnosis: '',
  originalCaseCode: '',
  originalIdentity: '',
  originalGender: 0,
  originalArchiveCodes: [],
  originalBirthDate: ''
});
const caseFormRef = ref<FormInstance>();


// --- Data Fetching ---
const fetchData = async () => {
  try {
    loading.value = true;
    const res = await caseList({
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchQuery.value || undefined,
    });

    console.log('caseList 返回结果:', res);

    if (!res.data?.data?.list || !Array.isArray(res.data.data.list)) {
      throw new Error('返回数据格式错误：res.data.data.list 应为数组');
    }

    total.value = res.data.data.total || 0;

    tableData.value = res.data.data.list.flatMap((item: {
      archive_codes: string[];
      case_code: string;
      identity: string;
      opd_id: string;
      inhospital_id: string;
      name: string;
      gender: number;
      birth_date?: string;
      main_diagnosis: string;
    }) => {
      // Create a base object with common properties
      const baseCase: Omit<TableCaseItem, 'recordId'> & { recordId?: string } = {
        caseId: item.case_code || '-',
        idNumber: item.identity || '-',
        outpatientId: item.opd_id || '-',
        inpatientId: item.inhospital_id || '-',
        name: item.name || '-',
        gender: item.gender === 1 ? '男' : '女',
        age: getAgeFromBirth(item.birth_date),
        diagnosis: item.main_diagnosis || '-',
        originalCaseCode: item.case_code, // Store original for update/delete
        originalIdentity: item.identity, // Store original for update/delete
        originalGender: item.gender, // Store original for update/delete
        originalBirthDate: item.birth_date, // Store original for update/delete
        originalArchiveCodes: item.archive_codes || [] // Store original for update/delete
      };

      if (!item.archive_codes || item.archive_codes.length === 0) {
        return [{ ...baseCase, recordId: '-' } as TableCaseItem];
      }

      // If archive_codes exist, create a row for each
      return item.archive_codes.map(code => ({
        ...baseCase,
        recordId: code || '-',
      })) as TableCaseItem[];
    });
  } catch (error) {
    ElMessage.error('获取病例数据失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

// --- Pagination Handler ---
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

// --- Age Calculation ---
function getAgeFromBirth(birthDateStr?: string): number | null {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

// --- Edit Operations ---
const handleEdit = (row: TableCaseItem) => {
  // Deep copy the row data to avoid direct modification of tableData
  Object.assign(currentCase, JSON.parse(JSON.stringify(row)));
  dialogTitle.value = '编辑病例';
  dialogVisible.value = true;
  nextTick(() => {
    // Reset validation after dialog opens and data is set
    caseFormRef.value?.clearValidate();
  });
};


const submitForm = async () => {
  if (!caseFormRef.value) return;
  await caseFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 1. Prepare the 'params' argument for caseUpdate
        // This includes the path parameter (case_code) and any other query params needed for lookup
        const apiParams = {
          case_code: currentCase.originalCaseCode, // Use the original case_code for the URL path
        };

        // 2. Prepare the 'body' argument for caseUpdate
        // This is the actual data that will be sent as JSON in the request body
        const apiBody = {
          case_code: currentCase.caseId, // New case ID if changed
          identity: currentCase.idNumber, // New identity if changed
          opd_id: currentCase.outpatientId === '-' ? '' : currentCase.outpatientId,
          inhospital_id: currentCase.inpatientId === '-' ? '' : currentCase.inpatientId,
          name: currentCase.name,
          gender: currentCase.gender === '男' ? 1 : 0, // Convert back to number
          birth_date: currentCase.originalBirthDate, // If editable, you'd need to convert age back to birth_date
          main_diagnosis: currentCase.diagnosis === '-' ? '' : currentCase.diagnosis,
          archive_codes: currentCase.originalArchiveCodes, // Ensure this is an array
        };

        // 3. Call caseUpdate with the two separate arguments
        const res = await caseUpdate(apiParams, apiBody);
        console.log(res.data)
        if (res.data?.code === 200) {
          ElMessage.success('病例更新成功！');
          dialogVisible.value = false;
          fetchData(); // Refresh table data
        } else {
          ElMessage.error(res.data?.message || '病例更新失败！');
        }
      } catch (error) {
        ElMessage.error('病例更新失败！');
        console.error('更新病例失败:', error);
      }
    } else {
      ElMessage.warning('请检查表单填写！');
    }
  });
};
const handleCloseDialog = () => {
  dialogVisible.value = false;
  caseFormRef.value?.resetFields(); // Reset form validation and fields
};

// --- Delete Operations ---
const handleDelete = async (row: TableCaseItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除病例 "${row.name} (病例号: ${row.caseId})" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // If confirmed, proceed with deletion
    const res = await caseDelete({
      case_code: row.originalCaseCode,
    });

    if (res.data?.code === 200) {
      ElMessage.success('病例删除成功！');
      fetchData(); // Refresh table data after deletion
    } else {
      ElMessage.error(res.data?.message || '病例删除失败！');
    }
  } catch (error: any) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除操作。');
    } else {
      ElMessage.error('病例删除失败！');
      console.error('删除病例失败:', error);
    }
  }
};


// --- Initial Data Fetch ---
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.el-table {
  font-size: 14px;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>