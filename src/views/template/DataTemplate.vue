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
import { templateCategoryList } from '../../api/templateCategory';

// 定义模板数据类型
interface TemplateItem {
  id?: number;
  template_name: string;
  template_code?: string;
  template_description?: string;
  category: number;
  category_name?: string;
  dictionaries?: number[]; // 添加这个字段以兼容现有代码
  type?: string; // 添加这个字段以兼容现有代码
}

// 搜索关键字
const searchKeyword = ref('');
// 展开的折叠面板名称，默认全部展开
const activeNames = ref<string[]>([]);

// 存储所有模板数据
const templates = ref<TemplateItem[]>([]);

// 存储分类数据
const categories_data = ref<{ id: number; name: string }[]>([]);

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

// 获取所有分类的唯一值 - 包括没有模板的分类
const categories = computed(() => {
  console.log('当前模板列表:', templates.value);
  console.log('当前分类数据:', categories_data.value);
  
  // 从模板数据中提取分类ID
  const templateCategories = new Set(templates.value.map(t => t.category));
  
  // 从分类数据中提取所有分类ID
  const allCategories = new Set(categories_data.value.map(c => c.id));
  
  // 合并两个集合，确保所有分类都显示
  const mergedCategories = new Set([...templateCategories, ...allCategories]);
  
  console.log('模板分类ID:', Array.from(templateCategories));
  console.log('所有分类ID:', Array.from(allCategories));
  console.log('合并后的分类ID:', Array.from(mergedCategories));
  
  return Array.from(mergedCategories).sort((a, b) => a - b);
});

// 根据分类过滤模板 - 包括空分类
const getTemplatesByCategory = (category: number) => {
  const categoryTemplates = templates.value.filter(t => t.category === category);
  const filtered = filterTemplates(categoryTemplates);
  console.log(`分类 ${category} 的模板:`, filtered);
  console.log(`分类 ${category} 是否为空分类:`, categoryTemplates.length === 0);
  return filtered;
};

// 获取分类名称 - 同步版本用于模板显示
const getCategoryName = (category: number) => {
  // 先从缓存的分类数据中查找
  const categoryInfo = categories_data.value.find(c => c.id === category);
  if (categoryInfo) {
    return categoryInfo.name;
  }
  
  // 从模板数据中查找
  const template = templates.value.find(t => t.category === category);
  if (template?.category_name) {
    return template.category_name;
  }
  
  // 如果都没有，触发数据更新并返回临时名称
  refreshCategoryData(category);
  return `分类${category}`;
};

// 异步刷新分类数据
const refreshCategoryData = async (category?: number) => {
  try {
    // 同时获取分类数据和模板数据
    const [categoryRes] = await Promise.all([
      templateCategoryList({ page: 1, page_size: 9999 }),
      fetchTemplates()
    ]);
    
    // 根据实际的API响应结构来处理数据
    if (categoryRes?.data?.code === 200 && categoryRes?.data?.data?.list) {
      categories_data.value = categoryRes.data.data.list.map((item: any) => ({
        id: item.id!,
        name: item.name
      }));
      console.log('分类数据已更新（从list）:', categories_data.value);
    } else if (categoryRes?.data?.results) {
      categories_data.value = categoryRes.data.results.map((item: any) => ({
        id: item.id!,
        name: item.name
      }));
      console.log('分类数据已更新（从results）:', categories_data.value);
    } else {
      console.log('刷新时分类数据结构不匹配:', categoryRes?.data);
    }
  } catch (error) {
    console.error('刷新分类数据失败:', error);
  }
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
        dictionaries: data.dictionaries || [],
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
        dictionaries: data.dictionaries || [],
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

// 获取分类数据
const fetchCategories = async () => {
  try {
    const res = await templateCategoryList({
      page: 1,
      page_size: 9999
    });
    console.log('获取到的分类列表:', res.data);
    
    // 根据实际的API响应结构来处理数据
    if (res?.data?.code === 200 && res?.data?.data?.list) {
      // 如果是分页结构 {code: 200, data: {list: [], total: x}}
      categories_data.value = res.data.data.list.map((item: any) => ({
        id: item.id!,
        name: item.name
      }));
      console.log('处理后的分类数据（从list）:', categories_data.value);
    } else if (res?.data?.results) {
      // 如果是直接的results结构 {results: []}
      categories_data.value = res.data.results.map((item: any) => ({
        id: item.id!,
        name: item.name
      }));
      console.log('处理后的分类数据（从results）:', categories_data.value);
    } else {
      console.log('分类数据结构不匹配，完整响应:', res.data);
      categories_data.value = [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    categories_data.value = [];
  }
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
  // 刷新分类和模板数据
  refreshCategoryData();
};

onMounted(async () => {
  // 在组件挂载时获取初始数据，先获取分类再获取模板
  await fetchCategories();
  await fetchTemplates();
  
  // 确保分类数据完整后，设置默认展开状态
  setTimeout(() => {
    activeNames.value = categories.value.map(String);
    console.log('设置展开的分类（包括空分类）:', activeNames.value);
  }, 100);
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