<!-- DiseaseData -->
<template>
  <div class="disease-table-container">
    <!-- 头部操作区域 -->
    <div class="table-header">
      <div class="header-left">
        <!-- 添加“专病分类”按钮 -->
        <el-button type="info" @click="handleAllCasesClick">
          <el-icon>
            <Menu />
          </el-icon>
          专病分类
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          录入病例
        </el-button>
        <el-upload
          class="upload-btn"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx,.xls"
          @change="handleFileChange"
        >
          <el-button type="success">
            <el-icon>
              <Upload />
            </el-icon>
            导入数据
          </el-button>
        </el-upload>
        <el-button type="warning" @click="handleExport">
          <el-icon>
            <Download />
          </el-icon>
          导出数据
        </el-button>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入病例编号/患者姓名"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="filteredDiseaseList" style="width: 100%" border stripe>
      <el-table-column prop="id" label="归档号" width="200" />
      <el-table-column prop="identity_id" label="身份证号" width="200" />
      <el-table-column prop="case_id" label="病例号" width="200" />
      <el-table-column prop="inhospital_id" label="住院号" width="200" />
      <el-table-column prop="completion" label="病例完成度" width="150">
        <template #default="{ row }">
          <el-progress :percentage="row.completion" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)"> 查看 </el-button>
          <el-button size="small" type="primary" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 录入病例对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="归档号" prop="id">
          <el-input v-model="formData.id" disabled placeholder="由系统自动生成，无需填写" />
        </el-form-item>
        <el-form-item label="身份证号" prop="identity_id">
          <el-input v-model="formData.identity_id" />
        </el-form-item>
        <el-form-item label="病例号" prop="case_id">
          <el-input v-model="formData.case_id" />
        </el-form-item>
        <el-form-item label="住院号" prop="inhospital_id">
          <el-input v-model="formData.inhospital_id" />
        </el-form-item>
        <el-form-item label="病例完成度" prop="completion">
          <el-input-number v-model="formData.completion" :min="0" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看病例详情对话框 -->
    <el-dialog v-model="viewDialogVisible" :title="'查看病例'" width="600px">
      <el-form :model="viewData" label-width="100px">
        <el-form-item label="归档号">
          <el-input v-model="viewData.id" disabled />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="viewData.identity_id" disabled />
        </el-form-item>
        <el-form-item label="病例号">
          <el-input v-model="viewData.case_id" disabled />
        </el-form-item>
        <el-form-item label="住院号">
          <el-input v-model="viewData.inhospital_id" disabled />
        </el-form-item>
        <el-form-item label="病例完成度">
          <el-input v-model="viewData.completion" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Upload, Download, Search, Menu } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { casesList, casesCreate, casesUpdate, casesDelete } from '@/api/cases';

interface DiseaseData {
  id?: number;
  identity_id: string;
  case_id: string;
  inhospital_id: string;
  completion: number;
}

export default defineComponent({
  name: 'DiseaseTable',
  components: {
    Plus,
    Upload,
    Download,
    Search,
    Menu,
  },
  setup() {
    const router = useRouter();
    const searchKeyword = ref('');
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const formRef = ref<FormInstance>();

    // 后端数据列表
    const diseaseList = ref<DiseaseData[]>([]);

    // 录入病例对话框的表单数据
    const formData = ref<DiseaseData>({
      id: '',
      identity_id: '',
      case_id: '',
      inhospital_id: '',
      completion: 0,
    });

    // 查看病例的对话框数据
    const viewDialogVisible = ref(false);
    const viewData = ref<DiseaseData>({
      id: '',
      identity_id: '',
      case_id: '',
      inhospital_id: '',
      completion: 0,
    });

    const rules = {
      identity_id: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
      case_id: [{ required: true, message: '请输入病例号', trigger: 'blur' }],
      inhospital_id: [{ required: true, message: '请输入住院号', trigger: 'blur' }],
      completion: [{ required: true, message: '请输入病例完成度', trigger: 'blur' }],
    };

    const dialogTitle = computed(() => (isEdit.value ? '编辑病例' : '录入病例'));

    const filteredDiseaseList = computed(() => {
      if (!searchKeyword.value) return diseaseList.value;
      const keyword = searchKeyword.value.toLowerCase();
      return diseaseList.value.filter(
        (item) =>
          item.id?.toString().includes(keyword) ||
          item.identity_id.toLowerCase().includes(keyword) ||
          item.case_id.toLowerCase().includes(keyword) ||
          item.inhospital_id.toLowerCase().includes(keyword)
      );
    });

    // 从后端获取病例数据
    const fetchData = async () => {
      try {
        const res = await casesList({});
        diseaseList.value = res.data.data.list;
      } catch (error) {
        console.error('获取数据失败：', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    const handleAdd = () => {
      isEdit.value = false;
      formData.value = {
        id: null, // 系统生成
        identity_id: '',
        case_id: '',
        inhospital_id: '',
        completion: 0,
      };
      dialogVisible.value = true;
    };

    const handleEdit = (row: DiseaseData) => {
      isEdit.value = true;
      formData.value = { ...row };
      dialogVisible.value = true;
    };

    const handleView = (row: DiseaseData) => {
      // 显示病例详情
      viewData.value = { ...row };
      viewDialogVisible.value = true;
    };

    const handleDelete = (row: DiseaseData) => {
      ElMessageBox.confirm('确定要删除该病例吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await casesDelete({ id: row.id });
          diseaseList.value = diseaseList.value.filter((item) => item.id !== row.id);
          ElMessage.success('删除成功');
        } catch (error) {
          console.error('删除失败：', error);
          ElMessage.error('删除失败');
        }
      });
    };

    const handleSubmit = async () => {
      if (!formRef.value) return;

      await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            if (isEdit.value) {
              await casesUpdate({ id: formData.value.id }, formData.value);
              const index = diseaseList.value.findIndex((item) => item.id === formData.value.id);
              if (index > -1) {
                diseaseList.value[index] = { ...formData.value };
              }
              ElMessage.success('编辑成功');
            } else {
              const res = await casesCreate(formData.value);
              diseaseList.value.push({
                ...res.data.data,
              });
              ElMessage.success('录入成功');
            }
            dialogVisible.value = false;
          } catch (error) {
            console.error('操作失败：', error);
            ElMessage.error('操作失败，请重试');
          }
        }
      });
    };

    const handleFileChange = (file: File) => {
      console.log('选择的文件:', file);
    };

    const handleExport = () => {
      console.log('导出数据');
    };

    const handleAllCasesClick = () => {
      router.push('/dashboard/Diseaset');
    };

    return {
      searchKeyword,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      filteredDiseaseList,
      isEdit,
      handleAdd,
      handleEdit,
      handleView,
      handleDelete,
      handleSubmit,
      handleFileChange,
      handleExport,
      handleAllCasesClick,
      viewDialogVisible,
      viewData,
    };
  },
});
</script>

<style scoped lang="scss">
.disease-table-container {
  padding: 20px;
  background: #f0f2f5; /* 主页面背景色 */
  min-height: 100vh;
  width: 100vw;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 垂直居中对齐 */
    margin-bottom: 20px;
    flex-wrap: wrap; /* 允许换行 */

    .header-left {
      display: flex;
      gap: 10px;
      flex-wrap: wrap; /* 允许按钮换行 */
    }

    .header-right {
      .search-input {
        width: 300px;
      }
    }
  }

  .el-table {
    border: 1px solid #e9e9e9;
  }
}
</style>
