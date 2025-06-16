<template>
    <el-collapse-item :title="sectionTitle" :name="sectionName">
      <el-table :data="tableData" style="width: 100%" border stripe>
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
  const emit = defineEmits(['edit-template', 'delete-template']);
  
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
  
  <style scoped lang="scss">
  .el-table {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e9e9e9; // Border for the table
  
    /* Ensure table cells are aligned and have consistent padding */
    :deep(.el-table__cell) {
      padding: 10px 12px;
      font-size: 14px;
      color: #606266;
    }
  
    :deep(.el-table__header-wrapper) {
      .el-table__header {
        .el-table__cell {
          background-color: #f5f7fa; /* Header background for table */
          color: #303133;
          font-weight: bold;
        }
      }
    }
  }
  </style>
  