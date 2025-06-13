<!-- src/views/chart/ChartCreate.vue -->
<template>
  <div class="attribute-container">
    <div class="attribute-header">
      <div class="left">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>添加计算属性
        </el-button>
      </div>
      <div class="right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入计算属性名称"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 计算属性列表 -->
    <el-table :data="filteredAttributes" style="width: 100%" border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="计算属性名称" />
      <el-table-column prop="formula" label="公式" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)"> 查看 </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    />

    <!-- 添加计算属性对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="计算属性名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <!-- 公式构建 -->
        <el-form-item label="公式" prop="formula">
          <div class="formula-builder">
            <!-- 已构建的公式展示 -->
            <div v-if="formulaParts.length > 0" class="formula-display">
              <span v-for="(part, index) in formulaParts" :key="index">
                {{ part }}
              </span>
            </div>
            <div class="formula-input">
              <!-- 选择词条 -->
              <el-select v-model="currentWord" placeholder="选择词条">
                <el-option
                  v-for="item in dictionaryItems"
                  :key="item.id"
                  :label="item.word_name"
                  :value="item.word_name"
                />
              </el-select>
              <!-- 选择操作符 -->
              <el-select
                v-model="currentOperator"
                placeholder="选择操作符"
                style="margin-left: 10px"
              >
                <el-option label="+" value="+" />
                <el-option label="-" value="-" />
                <el-option label="*" value="*" />
                <el-option label="/" value="/" />
              </el-select>
              <!-- 添加到公式 -->
              <el-button type="primary" style="margin-left: 10px" @click="addToFormula">
                添加
              </el-button>
              <!-- 清空公式 -->
              <el-button type="danger" style="margin-left: 10px" @click="clearFormula">
                清空
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="formData.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import {
  dictionaryList,
  dictionaryCreate,
  dictionaryUpdate,
  dictionaryDelete,
} from '../../api/dictionary';

interface DictItem {
  id?: number;
  word_name: string;
  word_eng: string;
  word_short: string;
  word_code: string;
  word_class: string;
  word_apply: string;
  word_belong: string;
}

export default defineComponent({
  name: 'ChartCreate',
  setup() {
    const searchKeyword = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const dialogVisible = ref(false);
    const dialogTitle = ref('添加计算属性');

    const formData = ref({
      name: '',
      formula: '',
      remarks: '',
    });

    const attributes = ref([
      { name: '属性1', formula: 'A+B', remarks: '备注1' },
      { name: '属性2', formula: 'C-D', remarks: '备注2' },
    ]);

    // 词条相关数据
    const dictionaryItems = ref<DictItem[]>([]);
    const currentWord = ref('');
    const currentOperator = ref('');
    const formulaParts = ref<string[]>([]);

    // 加载词条数据
    const loadDictionary = async () => {
      try {
        const params = {
          page: 1,
          page_size: 10,
        };
        const response = await dictionaryList(params);
        console.log(response.data);
        // 从 response.data.results 中提取词条数据
        dictionaryItems.value = response.data.data.results || [];
      } catch (error) {
        console.error('获取词条失败:', error);
      }
    };

    // 页面加载时获取词条
    onMounted(() => {
      loadDictionary();
    });

    // 过滤计算属性
    const filteredAttributes = computed(() => {
      return attributes.value.filter((attr) => attr.name.includes(searchKeyword.value));
    });

    // 添加计算属性
    const handleAdd = () => {
      dialogVisible.value = true;
      formulaParts.value = []; // 清空公式
      formData.value = { name: '', formula: '', remarks: '' }; // 重置表单
    };

    // 添加到公式
    const addToFormula = () => {
      if (currentWord.value) {
        formulaParts.value.push(currentWord.value);
        if (currentOperator.value) {
          formulaParts.value.push(currentOperator.value);
        }
        formData.value.formula = formulaParts.value.join(' ');
        currentWord.value = '';
        currentOperator.value = '';
      }
    };

    // 清空公式
    const clearFormula = () => {
      formulaParts.value = [];
      formData.value.formula = '';
      currentWord.value = '';
      currentOperator.value = '';
    };

    // 提交表单
    const handleSubmit = () => {
      if (formData.value.name && formData.value.formula) {
        attributes.value.push({ ...formData.value });
        dialogVisible.value = false;
        formData.value = { name: '', formula: '', remarks: '' };
        formulaParts.value = [];
      } else {
        (window as any).$message?.error('请填写计算属性名称和公式');
      }
    };

    // 删除计算属性
    const handleDelete = (attribute: any) => {
      attributes.value = attributes.value.filter((attr) => attr !== attribute);
    };

    // 查看计算属性
    const handleView = (attribute: { name: any }) => {
      (window as any).$message?.info(`查看 ${attribute.name}`);
    };

    return {
      searchKeyword,
      currentPage,
      pageSize,
      total,
      dialogVisible,
      dialogTitle,
      formData,
      attributes,
      filteredAttributes,
      dictionaryItems,
      currentWord,
      currentOperator,
      formulaParts,
      handleAdd,
      handleSubmit,
      handleDelete,
      handleView,
      addToFormula,
      clearFormula,
    };
  },
});
</script>

<style scoped lang="scss">
.attribute-container {
  padding: 20px;
  color: #dedcc7;

  .attribute-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .left {
      display: flex;
      gap: 10px;
    }

    .right {
      .search-input {
        width: 300px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .formula-builder {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .formula-display {
      padding: 10px;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      min-height: 40px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .formula-input {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
