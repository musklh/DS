<template>
    <div class="template-header">
      <div class="header-left">
        <el-button-group class="custom-button-group">
          <el-button type="primary" plain @click="$emit('show-all')">
            <img src="@/assets/2-1.png" class="button-icon" alt="All Templates Icon" />
            全部临床模版
          </el-button>
          <el-button @click="$emit('add-template')">
            <img src="@/assets/2-2.png" class="button-icon" alt="Add Custom Template Icon" />
            添加自定义临床模版
          </el-button>
          <el-button @click="$emit('add-category')">
            <img src="@/assets/2-2.png" class="button-icon" alt="Add Category Icon" />
            添加模板分类
          </el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <el-input
          :model-value="searchKeyword"
          @update:model-value="$emit('update:searchKeyword', $event)"
          placeholder="请输入模版名称关键字"
          :prefix-icon="Search"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Search } from '@element-plus/icons-vue';
  
  // 定义组件接收的 props
  // searchKeyword: 用于搜索框的绑定值，通过 v-model 实现双向绑定
  interface Props {
    searchKeyword: string;
  }
  const props = defineProps<Props>();
  
  // 定义组件可以触发的事件
  // update:searchKeyword: 用于 v-model 的更新事件
  // add-template: 点击"添加自定义临床模版"按钮时触发
  // show-all: 点击"全部临床模版"按钮时触发
  // add-category: 点击"添加模板分类"按钮时触发
  const emit = defineEmits(['update:searchKeyword', 'add-template', 'show-all', 'add-category']);
  </script>
  
  <style scoped lang="scss">
  .custom-button-group {
    .el-button {
      display: flex;
      align-items: center;
      padding: 8px 15px; // Adjust padding to match visual
      height: 40px; // Standard button height
    }
  
    .button-icon {
      width: 20px; // Smaller icon size
      height: 20px;
      margin-right: 6px; // Adjust margin
    }
  }
  
  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #fff; /* White header background */
    padding: 10px 20px;
    border-bottom: 1px solid #e9e9e9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
    border-radius: 4px; /* Rounded corners for the header */
  
    .header-left {
      display: flex; /* Ensure button group is aligned */
      align-items: center;
    }
  
    .header-right {
      width: 300px;
      .el-input {
        --el-input-height: 40px; // Match button height
      }
    }
  }
  </style>
  