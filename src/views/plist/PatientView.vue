<template>
    <div class="patient-view-root">
      <div class="selector-bar">
        <case-selector @caseSelected="handleCaseSelect" />
      </div>
      <el-alert
        v-if="!selectedCase"
        title="查看患者列表之前请选择专病档案！"
        type="info"
        show-icon
        class="mt-4"
      />
      <!-- 患者详情页 -->
      <div v-else-if="selectedPatient" class="table-card-wrap">
        <PatientDetail :patient="selectedPatient" @back="goBackToTable" />
      </div>
      <!-- 患者表格页 -->
      <div v-else class="table-card-wrap">
        <el-card class="table-card">
          <div class="card-header">
            <span class="card-title">{{ caseNameMap[selectedCase] }}</span>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="el-icon-refresh" circle @click="refreshTable" />
            </el-tooltip>
          </div>
          <patient-table
            :tableData="patients[selectedCase] || []"
            @view-detail="handleViewDetail"
          />
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import CaseSelector from './CaseSelector.vue'
  import PatientTable from './PatientTable.vue'
  import PatientDetail from './PatientDetail.vue'
  
  const selectedCase = ref('')
  const selectedPatient = ref(null)
  const caseNameMap = {
    'liver-transplant': '肝移植手术档案',
    'kidney-transplant': '肾移植手术档案',
    'cardiac-case': '心脏病病例档案'
  }
  
  const handleCaseSelect = (caseKey) => {
    selectedCase.value = caseKey
    selectedPatient.value = null
  }
  
  const handleViewDetail = (patient) => {
    selectedPatient.value = patient
  }
  
  const goBackToTable = () => {
    selectedPatient.value = null
  }
  
  const refreshTable = () => {
    // TODO: 添加刷新逻辑
  }
  
  const patients = {
    'liver-transplant': Array.from({ length: 15 }, (_, i) => ({
      id: `ID-${i}`,
      name: `患者${i + 1}`,
      gender: i % 2 === 0 ? '男' : '女',
      age: 30 + i,
      phone: `12345678${i}`,
      address: '某地某区某街',
      bloodType: 'A',
      surgeryTime: '2023-12-01',
      isWaiting: '否'
    })),
    // 可以继续添加其他档案数据...
  }
  </script>
  
  <style scoped>
  .patient-view-root {
    min-height: 100vh;
    background: #f7fafd;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 48px;
  }
  .selector-bar {
    margin-bottom: 24px;
  }
  .table-card-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }
  .table-card {
    width: 1000px;
    max-width: 98vw;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    border-radius: 12px;
    padding: 32px 24px;
    background: #fff;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
  .card-title {
    font-size: 20px;
    font-weight: bold;
    color: #222;
  }
  </style>