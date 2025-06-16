<template>
    <div class="template-form">
      <h2 class="form-title">{{ dialogTitle }}</h2>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="模版名称" prop="template_name">
          <el-input v-model="formData.template_name" placeholder="请输入模版名称" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模版描述" prop="template_description">
          <el-input v-model="formData.template_description" type="textarea" placeholder="请输入模版描述" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="模板类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择模板类型" style="width: 300px;">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="词条选择" prop="dictionaries">
          <div class="dictionary-list">
            <div class="dictionary-search">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索词条"
                style="width: 200px;"
              />
            </div>
            <div class="dictionary-items">
              <el-checkbox-group v-model="formData.dictionaries">
                <div v-for="item in filteredDictionaryItems" :key="item.id" class="dictionary-item">
                  <el-checkbox :value="item.id"> {{ item.word_name }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus';
  import { dictionaryList } from '../../api/dictionary';
  import { ElMessage } from 'element-plus'; // 引入 ElMessage 用于提示
  import { templateCategoryList } from '../../api/templateCategory';
  
  // 假设这些 API 导入是正确的，如果你的项目结构需要调整路径，请自行修改
  import {
    dataTemplateCreate, // 引入创建模板的API
    // dataTemplateList, // 如果不需要列表API，可以不引入以减少打包体积
    // dataTemplateUpdate,
    // dataTemplateDelete,
  } from '../../api/dataTemplate';
  
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
      const res = await dictionaryList({});
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
      const res = await templateCategoryList({});
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
        dictionary_list: props.formData.dictionary_list || [],
      };

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
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .form-title {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }
  
  .dictionary-list {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    width: 300px;
  }
  
  .dictionary-search {
    margin-bottom: 10px;
  }
  
  .dictionary-items {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .dictionary-item {
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;
  }
  
  .dictionary-item:last-child {
    border-bottom: none;
  }
  
  .el-form-item:last-child {
    margin-bottom: 0;
  }
  
  .el-button {
    margin-right: 10px;
  }
  </style>