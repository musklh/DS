<template>
  <el-collapse-item :name="sectionName" class="template-section">
    <template #title>
      <div class="section-title-wrapper">
        <h3 class="section-title">{{ sectionTitle }}</h3>
        <div class="category-actions">
          <el-button
            type="primary"
            link
            @click.stop="$emit('edit-category', parseInt(sectionName))"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click.stop="$emit('delete-category', parseInt(sectionName))"
          >
            删除
          </el-button>
        </div>
      </div>
    </template>
    
    <div v-if="tableData.length > 0" class="table-container">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="template_name" label="模版名称" width="200" />
        <el-table-column prop="template_code" label="模版编号" width="200" />
        <el-table-column prop="template_description" label="模版描述" />
        <el-table-column v-if="showActions" label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="$emit('edit-template', scope.row)"> 编辑 </el-button>
            <el-button size="small" type="danger" @click="$emit('delete-template', scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-collapse-item>
</template>
  
  <script setup lang="ts">
  // 定义组件接收的 props
  // sectionTitle: 可折叠项的标题
  // sectionName: 可折叠项的唯一标识名
  // tableData: 表格要显示的数据数组
  // showActions: 是否显示操作列（编辑/删除按钮），默认为 false
  
  interface Props {
    sectionTitle: string;
    sectionName: string;
    tableData: TemplateItem[];
    showActions?: boolean;
  }
  const props = defineProps<Props>();
  
  // 定义组件可以触发的事件
  // edit-template: 点击编辑按钮时触发，传递当前行数据
  // delete-template: 点击删除按钮时触发，传递当前行数据
  const emit = defineEmits(['edit-template', 'delete-template', 'edit-category', 'delete-category']);
  
  // 定义 TemplateItem 接口，与 DataTemplate.vue 中的保持一致
  interface TemplateItem {
    template_name: string;
    template_code: string;
    template_description: string;
    category: number;
    dictionaries: number[];
    type: string;
  }
  </script>
  
  <style lang="scss" scoped>
  .template-section {
    background-color: #ffffff;
    border-radius: 4px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    .section-title-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 20px;
    }

    .section-title {
      font-size: 16px;
      color: #303133;
      margin: 0;
    }

    .category-actions {
      display: flex;
      gap: 10px;
    }

    .table-container {
      padding: 10px 20px 20px;
    }
  }
  </style>
  