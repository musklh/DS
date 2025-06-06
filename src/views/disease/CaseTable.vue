<template>
  <el-table :data="tableData" style="width: 100%" border>
    <el-table-column prop="recordId" label="档案号" />
    <el-table-column prop="caseId" label="病例号" />
    <el-table-column prop="idNumber" label="身份证号" />
    <el-table-column prop="outpatientId" label="门诊号" />
    <el-table-column prop="inpatientId" label="住院号" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="age" label="年龄" />
    <el-table-column prop="diagnosis" label="主要诊断" />
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 表格数据定义（占位符）
const tableData = ref([
  {
    recordId: '-',
    caseId: '-',
    idNumber: '-',
    outpatientId: '-',
    inpatientId: '-',
    name: '-',
    gender: '-',
    age: '-',
    diagnosis: '-',
  },
  // 你可以复制粘贴添加更多行数据
  {
    recordId: '-',
    caseId: '-',
    idNumber: '-',
    outpatientId: '-',
    inpatientId: '-',
    name: '-',
    gender: '-',
    age: '-',
    diagnosis: '-',
  },
]);
</script>

<style scoped>
.el-table {
  font-size: 14px;
}
</style>
