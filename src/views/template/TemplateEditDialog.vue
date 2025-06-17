<template>
    <div class="template-form">
      <h2 class="form-title">{{ dialogTitle }}</h2>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
        <div class="form-content">
          <div class="form-left">
            <el-form-item label="模版名称" prop="template_name">
              <el-input v-model="formData.template_name" placeholder="请输入模版名称" style="width: 400px;" />
            </el-form-item>
            <el-form-item label="模版描述" prop="template_description">
              <el-input v-model="formData.template_description" type="textarea" placeholder="请输入模版描述" style="width: 400px;" :rows="4" />
            </el-form-item>
            <el-form-item label="模板类型" prop="category">
              <el-select v-model="formData.category" placeholder="请选择模板类型" style="width: 400px;">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item label="词条选择" prop="dictionaries" class="dictionary-form-item">
              <div class="dictionary-list">
                <div class="dictionary-search">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索词条"
                    prefix-icon="Search"
                    clearable
                    style="width: 100%;"
                  />
                </div>
                <div class="dictionary-items">
                  <el-checkbox-group v-model="selectedDictionaries">
                    <div v-for="item in filteredDictionaryItems" :key="item.id" class="dictionary-item">
                      <el-checkbox :value="item.id"> {{ item.word_name }}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="form-footer">
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus';
  import { dictionaryList } from '../../api/dictionary';
  import { ElMessage } from 'element-plus'; // 引入 ElMessage 用于提示
  import { templateCategoryList } from '../../api/templateCategory';
  
  // 假设这些 API 导入是正确的，如果你的项目结构需要调整路径，请自行修改
  
  interface Props {
    dialogTitle: string;
    formData: TemplateItem;
    rules: FormRules;
    isEdit?: boolean; // 新增一个 prop 来判断是编辑还是新建
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['cancel', 'submit-form', 'success']); // 添加一个 'success' 事件用于通知父组件操作成功
  
  const formRef = ref<FormInstance>();
  const dictionaryItems = ref<API.Dictionary[]>([]);
  const searchKeyword = ref('');
  const categoryList = ref<API.DataTemplateCategory[]>([]);
  
  // 使用本地状态来管理选中的词条
  const selectedDictionaries = ref<number[]>([]);

  // 监听 props.formData 的变化，初始化选中的词条
  watch(() => props.formData, (newVal) => {
    if (newVal.dictionaries) {
      selectedDictionaries.value = newVal.dictionaries.map(id => Number(id));
    } else if (newVal.dictionary_list) {
      selectedDictionaries.value = newVal.dictionary_list.map(item => Number(item.id));
    } else {
      selectedDictionaries.value = [];
    }
  }, { immediate: true, deep: true });
  
  // 过滤后的词条列表
  const filteredDictionaryItems = computed(() => {
    const items = dictionaryItems.value;
    if (!searchKeyword.value) {
      return items;
    }
    const filtered = items.filter(item =>
      item.word_name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
    return filtered;
  });
  
  // 获取词条列表
  const fetchDictionaryList = async () => {
    try {
      const res = await dictionaryList({
        page: 1,
        page_size: 9999  // 设置一个足够大的数值以获取所有数据
      });
      console.log('API响应数据:', res);
      // 确保 res.data 存在，res.data.list 是数组且有数据
      if (res?.data?.code === 200 && res.data?.data.list) {
        dictionaryItems.value = res.data.data.list;
        console.log('词条列表赋值成功:', dictionaryItems.value);
      } else {
        console.log('API响应中没有有效数据或列表为空。', res);
        dictionaryItems.value = [];
      }
    } catch (error) {
      console.error('获取词条列表失败:', error);
      dictionaryItems.value = [];
    }
  };
  
  // 获取分类列表
  const fetchCategoryList = async () => {
    try {
      const res = await templateCategoryList({
        page: 1,
        page_size: 9999  // 设置一个足够大的数值以获取所有数据
      });
      if (res?.data?.code === 200 && res.data?.data?.list) {
        categoryList.value = res.data.data.list;
      } else {
        console.log('获取分类列表失败:', res);
        categoryList.value = [];
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
      categoryList.value = [];
    }
  };
  
  const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
      await formRef.value.validate();
      console.log('表单验证通过，提交数据:', props.formData);
      
      // 准备提交的数据
      const submitData = {
        ...props.formData,
        template_description: props.formData.template_description || '',
        dictionaries: selectedDictionaries.value,
        category: props.formData.category,
      };

      console.log('提交的数据:', submitData);
      // 发送提交事件给父组件
      emit('submit-form', submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
      ElMessage.error('请检查表单填写是否正确');
    }
  };
  
  interface TemplateItem {
    id?: number;
    template_name: string;
    template_code?: string;
    template_description?: string;
    category: number;
    category_name?: string;
    dictionary_list?: API.Dictionary[];
    dictionaries?: number[];
    type?: string;
  }
  
  // 在组件挂载时获取词条列表和分类列表
  onMounted(() => {
    fetchDictionaryList();
    fetchCategoryList();
  });
  </script>
  
  <style scoped>
  .template-form {
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-width: 1000px;
  }
  
  .form-title {
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .form-content {
    display: flex;
    gap: 40px;
  }
  
  .form-left {
    flex: 1;
    min-width: 500px;
  }
  
  .form-right {
    flex: 1;
    min-width: 500px;
  }
  
  .dictionary-list {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 16px;
    background-color: #f8f9fa;
  }
  
  .dictionary-search {
    margin-bottom: 16px;
  }
  
  .dictionary-items {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 8px;
  }
  
  .dictionary-items::-webkit-scrollbar {
    width: 6px;
  }
  
  .dictionary-items::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 3px;
  }
  
  .dictionary-items::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
  
  .dictionary-item {
    padding: 12px 8px;
    border-bottom: 1px solid #ebeef5;
    transition: background-color 0.3s;
  }
  
  .dictionary-item:hover {
    background-color: #f5f7fa;
  }
  
  .dictionary-item:last-child {
    border-bottom: none;
  }
  
  .form-footer {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
  
  .el-button {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .el-form-item {
    margin-bottom: 24px;
  }
  
  .dictionary-form-item {
    margin-bottom: 0;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
  
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
  }
  
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }
  
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #409eff inset;
  }
  </style>