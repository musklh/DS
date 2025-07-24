<template>
  <div>
    <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="word_code" label="词条编号" width="120" show-overflow-tooltip />
      <el-table-column prop="word_name" label="词条名称" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="->, prev, pager, next, jumper"
        @current-change="fetchScaleList"
        @size-change="fetchScaleList"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { dictionaryList } from '../../api/dictionary';

// 定义词条数据类型
interface ScaleItem {
  id?: number;
  word_code?: string;
  word_name: string;
  word_eng?: string;
  word_short?: string;
  word_class: string;
  word_apply: string;
  word_belong?: string;
  data_type?: string;
  input_type?: string;
  options?: string;
  followup_options?: Record<string, any>;
  has_unit?: number;
  unit?: string;
  is_score?: number;
  score_func?: string;
}

const emit = defineEmits(['editRules']);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableData = ref<ScaleItem[]>([]);

const fetchScaleList = async () => {
  loading.value = true;
  try {
    const response = await dictionaryList({
      page: currentPage.value,
      page_size: 1000,
    });
    
    // 过滤只显示评分词条 (is_score: 1)
    const responseData = response as any;
    const filteredData = responseData.data?.data?.list?.filter((item: ScaleItem) => {
      return item.is_score === 1;
    }) || [];
    tableData.value = filteredData;
    total.value = filteredData.length; // 使用过滤后数据的长度作为总数
  } catch (error) {
    console.error('获取词条列表失败:', error);
    ElMessage.error('获取量表列表失败');
  } finally {
    loading.value = false;
  }
};

const handleEdit = (row: ScaleItem) => {
  emit('editRules', row);
};

const handleDelete = async (row: ScaleItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除词条"${row.word_name}"吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    ElMessage.success('删除成功');
    fetchScaleList();
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败');
  }
};

onMounted(() => {
  fetchScaleList();
});
</script>

<style scoped lang="scss">
.scale-content {
  background: #fff;
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: end;
  }
}
</style>
