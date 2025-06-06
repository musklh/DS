<template>
    <el-table
      :data="tableData"
      border
      stripe
      class="patient-table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="身份证号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="家庭住址" />
      <el-table-column prop="bloodType" label="血型" />
      <el-table-column prop="surgeryTime" label="移植手术（时间）" />
      <el-table-column prop="isWaiting" label="是否移植排队" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" size="small" @click="$emit('view-detail', scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  defineProps({
    tableData: {
      type: Array,
      required: true
    }
  })
  defineEmits(['view-detail'])
  </script>
  
  <style scoped>
  .patient-table {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    overflow: hidden;
    font-size: 15px;
  }
  .table-header {
    background: #f5f8fa !important;
    color: #333 !important;
    font-weight: bold;
    font-size: 15px;
  }
  .el-table__row:hover {
    background: #f0f6ff !important;
  }
  </style>