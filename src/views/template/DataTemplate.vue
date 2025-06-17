<template>
  <div class="template-container">
    <!-- 头部区域：包含按钮和搜索框 -->
    <TemplateHeader
      v-model:search-keyword="searchKeyword"
      @add-template="handleAddCustomTemplate"
      @show-all="handleShowAll"
      @add-category="handleAddCategory"
    />

    <!-- 编辑表单区域 -->
    <div v-if="showEditForm" class="edit-form-section">
      <TemplateEditDialog
        :dialog-title="dialogTitle"
        :form-data="formData"
        :rules="rules"
        @submit-form="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- 模板分类对话框 -->
    <TemplateCategoryDialog
      ref="categoryDialogRef"
      @success="handleCategorySuccess"
    />

    <!-- 模板列表区域 -->
    <div v-if="!showEditForm" class="template-content">
      <el-collapse v-model="activeNames">
        <template v-for="category in categories" :key="category">
          <TemplateCollapseSection
            :section-title="getCategoryName(category)"
            :section-name="String(category)"
            :table-data="getTemplatesByCategory(category)"
            :show-actions="true"
            @edit-template="handleEdit"
            @delete-template="handleDelete"
          />
        </template>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

// 导入拆分后的组件
import TemplateHeader from './TemplateHeader.vue';
import TemplateCollapseSection from './TemplateCollapseSection.vue';
import TemplateEditDialog from './TemplateEditDialog.vue';
import TemplateCategoryDialog from './TemplateCategoryDialog.vue';

import {
    dataTemplateList,
    dataTemplateCreate,
    dataTemplateUpdate,
    dataTemplateDelete,
} from '../../api/dataTemplate';

// 定义模板数据类型
interface TemplateItem {
  id?: number;
  template_name: string;
  template_code?: string;
  template_description?: string;
  category: number;
  category_name?: string;
  dictionary_list?: API.Dictionary[];
  dictionaries?: number[]; // 添加这个字段以兼容现有代码
  type?: string; // 添加这个字段以兼容现有代码
}

// 搜索关键字
const searchKeyword = ref('');
// 展开的折叠面板名称，默认全部展开
const activeNames = ref<string[]>([]);

// 存储所有模板数据
const templates = ref<TemplateItem[]>([]);

// 根据搜索关键字过滤模板列表的计算属性
const filterTemplates = (templates: TemplateItem[]) => {
  if (!searchKeyword.value) return templates;
  const keyword = searchKeyword.value.toLowerCase();
  return templates.filter(
    (template) =>
      template.template_name.toLowerCase().includes(keyword) ||
      (template.template_code?.toLowerCase() || '').includes(keyword) ||
      (template.template_description?.toLowerCase() || '').includes(keyword)
  );
};

// 获取所有分类的唯一值
const categories = computed(() => {
  console.log('当前模板列表:', templates.value);
  const uniqueCategories = new Set(templates.value.map(t => t.category));
  console.log('提取的分类ID:', Array.from(uniqueCategories));
  return Array.from(uniqueCategories).sort((a, b) => a - b);
});

// 根据分类过滤模板
const getTemplatesByCategory = (category: number) => {
  const filtered = filterTemplates(templates.value.filter(t => t.category === category));
  console.log(`分类 ${category} 的模板:`, filtered);
  return filtered;
};

// 获取分类名称
const getCategoryName = (category: number) => {
  const template = templates.value.find(t => t.category === category);
  const categoryName = template?.category_name || `分类${category}`;
  console.log(`分类 ${category} 的名称:`, categoryName);
  return categoryName;
};

// 替换 dialogVisible 为 showEditForm
const showEditForm = ref(false);
const dialogTitle = ref('');
// 用于弹窗表单的数据
const formData = reactive<TemplateItem>({
  template_name: '',
  template_code: '',
  template_description: '',
  category: 1,
  dictionary_list: [],
});
// 表单引用，用于表单验证

// 表单验证规则
const rules = reactive<FormRules>({
  template_name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
  template_code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }],
  template_description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
  category: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
});

/**
 * 处理添加自定义模板的点击事件
 */
const handleAddCustomTemplate = () => {
  dialogTitle.value = '添加自定义临床模版';
  // 重置表单数据为初始状态
  Object.assign(formData, { 
    template_name: '', 
    template_code: '', 
    template_description: '', 
    category: 1, 
    dictionary_list: [], 
    dictionaries: [] 
  });
  showEditForm.value = true;
};

/**
 * 处理编辑模板的点击事件
 * @param row 被编辑的模板数据
 */
const handleEdit = (row: TemplateItem) => {
  console.log('编辑模板:', row);
  dialogTitle.value = '编辑模版';
  // 复制当前行数据到表单，以便在弹窗中编辑
  Object.assign(formData, {
    id: row.id,
    template_name: row.template_name,
    template_code: row.template_code,
    template_description: row.template_description,
    category: row.category,
    dictionary_list: row.dictionary_list || [],
    dictionaries: row.dictionary_list?.map(d => d.id) || [],
  });
  showEditForm.value = true;
};

/**
 * 处理取消编辑
 */
const handleCancel = () => {
  showEditForm.value = false;
  // 重置表单数据
  Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionary_list: [], type: 'custom' });
};

/**
 * 处理删除模板的点击事件
 * @param row 被删除的模板数据
 */
const handleDelete = (row: TemplateItem) => {
  ElMessageBox.confirm(`确定删除模版 "${row.template_name}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      if (row.template_code) { // 使用 template_code 作为唯一标识
        // 在实际应用中，这里会调用 API 删除后端数据
        await dataTemplateDelete({ template_code: row.template_code }); // API 需要 template_code
        templates.value = templates.value.filter(
          (item) => item.template_code !== row.template_code
        );
        ElMessage.success(`模版 "${row.template_name}" 删除成功!`);
      } else {
        ElMessage.error('无法删除，模版编号不存在。');
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

/**
 * 处理表单提交（添加或编辑）
 * @param data 从 TemplateEditDialog 组件传递过来的表单数据
 */
const handleSubmit = async (data: TemplateItem) => {
  try {
    console.log('提交的数据:', data);
    // 检查是否有 template_code，有则为编辑，没有则为新增
    if (data.template_code) {
      console.log('执行更新操作');
      // 编辑现有模板
      const apiData: API.DataTemplate = {
        template_name: data.template_name,
        template_code: data.template_code,
        template_description: data.template_description || '',
        category: data.category,
        dictionary_list: data.dictionary_list || [],
      };
      console.log('更新模板数据:', apiData);
      const res = await dataTemplateUpdate({ template_code: data.template_code }, apiData);
      console.log('更新响应:', res);
      
      if (res?.data?.code === 200) {
        const index = templates.value.findIndex((item) => item.template_code === data.template_code);
        if (index !== -1) {
          templates.value[index] = { ...data };
          ElMessage.success('模版更新成功!');
        }
      } else {
        ElMessage.error(res?.data?.msg || '更新失败');
      }
    } else {
      console.log('执行创建操作');
      // 添加新模板
      const apiData: API.DataTemplate = {
        template_name: data.template_name,
        template_description: data.template_description || '',
        category: data.category,
        dictionary_list: data.dictionary_list || [],
      };
      console.log('创建模板数据:', apiData);
      const res = await dataTemplateCreate(apiData);
      console.log('创建响应:', res);
      
      if (res?.data?.code === 200) {
        await fetchTemplates();
        ElMessage.success('自定义模版添加成功!');
      } else {
        ElMessage.error(res?.data?.msg || '创建失败');
      }
    }
    showEditForm.value = false;
    // 重置表单数据
    Object.assign(formData, {
      template_name: '',
      template_code: '',
      template_description: '',
      category: 1,
      dictionary_list: [],
      dictionaries: [],
    });
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  }
};

/**
 * 处理显示全部模板的点击事件
 */
const handleShowAll = () => {
  showEditForm.value = false;
  // 重置表单数据
  Object.assign(formData, { template_name: '', template_code: '', template_description: '', category: 1, dictionary_list: [], type: 'custom' });
};

// 修改获取模板列表的函数
const fetchTemplates = async () => {
  try {
    const res = await dataTemplateList({
      page: 1,
      page_size: 9999  // 设置一个足够大的数值以获取所有数据
    });
    console.log('获取到的模板列表:', res.data);
    if (res?.data?.code === 200 && res.data?.data?.list) {
      templates.value = res.data.data.list;
      // 设置默认展开所有分类
      activeNames.value = categories.value.map(String);
      console.log('设置展开的分类:', activeNames.value);
    } else {
      templates.value = [];
      console.log('API response does not contain valid template data or list is empty.', res);
    }
  } catch (error) {
    console.error('获取模板列表失败:', error);
    templates.value = [];
  }
};

const categoryDialogRef = ref<InstanceType<typeof TemplateCategoryDialog> | null>(null);

const handleAddCategory = () => {
  if (categoryDialogRef.value) {
    categoryDialogRef.value.show();
  }
};

const handleCategorySuccess = () => {
  // 可以在这里刷新分类列表
  fetchTemplates();
};

onMounted(async () => {
  // 在组件挂载时获取初始数据
  await fetchTemplates();
});
</script>

<style scoped lang="scss">
.template-container {
  padding: 20px;
  background-color: #f5f7fa; /* Light grey background */
  min-height: 100vh;
  box-sizing: border-box; /* Include padding in element's total width and height */

  .edit-form-section {
    max-width:auto;
    margin: 20px auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .template-content {
    padding: 0px; /* Remove padding here, let el-collapse handle it */
  }

  .el-collapse {
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-bottom: 20px; /* Space below the entire collapse component */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    :deep(.el-collapse-item) {
      border-bottom: 1px solid #e9e9e9;

      &:last-child {
        border-bottom: none;
      }

      :deep(.el-collapse-item__header) {
        font-size: 16px;
        color: #333;
        padding: 15px 20px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #e9e9e9;
        font-weight: bold;

        .el-collapse-item__arrow {
            margin-right: 8px;
        }
      }

      :deep(.el-collapse-item__content) {
        padding: 15px 20px;
      }
    }
  }
}
</style>