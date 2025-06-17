<template>
  <div class="patient-table-container">
    <el-table
      :data="tableData"
      border
      stripe
      class="patient-table"
      header-cell-class-name="table-header"
      style="width: 100%;"
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
          <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  address: string;
  bloodType: string;
  surgeryTime: string;
  isWaiting: string;
}

const emit = defineEmits(['view-detail', 'page-change']);

const props = defineProps<{
  tableData: Patient[];
}>();



function handleViewDetail(row: Patient) {
  console.log('选中患者身份证号:', row.id);
  emit('view-detail', row);
}
</script>

<style scoped>
.patient-table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.patient-table {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
