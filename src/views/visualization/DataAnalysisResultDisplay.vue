<template>
    <div class="analysis-result-display-container">
      <div class="patient-case-header">
        <span class="patient-name">{{ patientData.name }}</span>
        <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
        <span class="patient-id-card">{{ patientData.idCard }}</span>
        <el-divider direction="vertical"></el-divider>
        <span class="case-id">病例: {{ patientData.caseId }}</span>
        <el-icon class="refresh-icon"><Refresh /></el-icon>
        <el-button class="back-button" size="small" @click="emit('go-back-to-selection')">
          <el-icon><Back /></el-icon>
          返回选择
        </el-button>
      </div>
  
      <el-card class="content-card">
        <div class="parameter-selection">
          <el-button-group>
            <el-button
              v-for="param in parameters"
              :key="param.value"
              :type="selectedParameter === param.value ? 'primary' : 'default'"
              @click="selectParameter(param.value)"
            >
              {{ param.label }}
            </el-button>
          </el-button-group>
          <el-icon class="filter-icon"><Filter /></el-icon>
        </div>
  
        <div class="date-filter-row">
          <el-radio-group v-model="selectedDateFilter">
            <el-radio-button label="YTD">YTD</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="2024-XX-XX"
            value-format="YYYY-MM-DD"
            style="width: 130px;"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="2024-XX-XX"
            value-format="YYYY-MM-DD"
            style="width: 130px;"
          />
        </div>
  
        <div class="analysis-sections">
          <div class="chart-section">
            <h3>图:</h3>
            <div class="chart-box">
              <h4 class="chart-title">{{ chartData.title }}</h4>
              <div class="line-chart-placeholder">
                <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
                  <rect x="0" y="0" width="300" height="200" fill="transparent" stroke="#409EFF" stroke-width="2"/>
                  <polyline fill="none" stroke="#409EFF" stroke-width="2" points="30,170 100,100 200,120 270,80"/>
                  <text x="30" y="190" font-size="12" fill="#606266">2024-XX-XX</text>
                  <text x="100" y="190" font-size="12" fill="#606266">2024-XX-XX</text>
                  <text x="200" y="190" font-size="12" fill="#606266">2024-XX-XX</text>
                </svg>
              </div>
            </div>
            <div class="chart-actions">
              <el-icon><Download /></el-icon>
              <span>保存为图片</span>
            </div>
          </div>
  
          <div class="table-section">
            <h3>表:</h3>
            <div class="table-box">
            <h4 class="table-title">{{ chartData.title }}</h4> <!-- 新增表头标题 -->
              <el-table :data="tableData" border stripe size="small" :show-header="false" style="width: 100%;">
                <el-table-column prop="date" width="120" />
                <el-table-column prop="value" />
              </el-table>
            </div>
            <div class="table-actions">
              <el-icon><Download /></el-icon>
              <span>保存为Excel表</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue';
  import {
    ElDivider, ElIcon, ElCard, ElButton, ElButtonGroup,
    ElRadioGroup, ElRadioButton, ElDatePicker, ElTable, ElTableColumn,
  } from 'element-plus';
  import { Refresh, Filter, Download, Back } from '@element-plus/icons-vue';
  
  const props = defineProps({
    patientData: Object, // Patient and case data from parent
  });
  
  const emit = defineEmits(['go-back-to-selection']);
  
  // Mock Data
  const parameters = reactive([
    { label: 'YEB', value: 'yeb' },
    { label: '红细胞计数', value: 'rbcCount' },
    { label: '白细胞计数', value: 'wbcCount' },
    { label: '中性粒细胞比例', value: 'neutrophilRatio' },
    { label: '中性粒细胞计数', value: 'neutrophilCount' },
    { label: '红细胞计数', value: 'rbcCount2' }, // Duplicated as per image for visual
    { label: '血红蛋白', value: 'hemoglobin' },
    { label: '血小板计数', value: 'plateletCount' },
    { label: '总蛋白', value: 'totalProtein' },
    { label: '白蛋白', value: 'albumin' },
    { label: '球蛋白', value: 'globulin' },
    { label: '总胆红素', value: 'totalBilirubin' },
    { label: '直接胆红素', value: 'directBilirubin' },
    { label: '间接胆红素', value: 'indirectBilirubin' },
    { label: '尿素氮', value: 'bun' },
    { label: '谷氨酰转肽酶', value: 'ggt' },
    { label: '天冬氨酸氨基转移酶', value: 'ast' },
    { label: '激活部分凝血活酶时间', value: 'aptt' },
    { label: '凝血酶原时间', value: 'pt' },
    { label: '血浆纤维蛋白原', value: 'fibrinogen' },
    { label: 'CRP', value: 'crp' },
    { label: '血氨', value: 'bloodAmmonia' },
    { label: '他克莫司', value: 'tacrolimus' },
  ]);
  
  const selectedParameter = ref('bloodAmmonia'); // Default selected as per image
  
  const selectedDateFilter = ref('YTD'); // Default selected as per image
  const startDate = ref('2024-XX-XX'); // Mock dates
  const endDate = ref('2024-XX-XX'); // Mock dates
  
  const chartData = reactive({
    title: '血氨', // Changes with selectedParameter
    // In a real app, this would be dynamic based on selectedParameter and dates
  });
  
  const tableData = reactive([
    { date: '2024-XX-XX', value: 10 },
    { date: '2024-XX-XX', value: 20 },
    { date: '2024-XX-XX', value: 15 },
  ]);
  
  watch(selectedParameter, (newVal) => {
    const param = parameters.find(p => p.value === newVal);
    chartData.title = param ? param.label : '';
    // In a real app, you'd fetch/update chart and table data here
    // For now, we update the title and keep mock data
    if (newVal === 'bloodAmmonia') {
      Object.assign(tableData, [
        { date: '2024-XX-XX', value: 10 },
        { date: '2024-XX-XX', value: 20 },
        { date: '2024-XX-XX', value: 15 },
      ]);
    } else {
       Object.assign(tableData, [
        { date: '2024-XX-XX', value: Math.floor(Math.random() * 100) },
        { date: '2024-XX-XX', value: Math.floor(Math.random() * 100) },
        { date: '2024-XX-XX', value: Math.floor(Math.random() * 100) },
      ]);
    }
  });
  
  const selectParameter = (value) => {
    selectedParameter.value = value;
  };
  </script>
  
  <style scoped>
  .analysis-result-display-container {
    padding: 0; /* Handled by parent */
    background-color: #f5f7fa;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .patient-case-header {
    background-color: #fff;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #303133;
    position: relative; /* For absolute positioning of back button */
  }
  
  .patient-case-header span {
    margin-right: 15px;
  }
  
  .patient-case-header .patient-name {
    font-weight: bold;
  }
  
  .refresh-icon {
    margin-left: 5px;
    cursor: pointer;
    color: #409eff;
  }
  
  .back-button {
    margin-left: auto; /* Pushes button to the far right */
    border: none;
    background-color: transparent;
    color: #606266;
    font-size: 14px;
  }
  
  .back-button .el-icon {
    margin-right: 5px;
    font-size: 16px;
    color: #606266;
  }
  
  .content-card {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 20px; /* Add padding to the card content */
  }
  
  .parameter-selection {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Space between button group and filter icon */
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    gap: 10px; /* Space between wrapped items */
  }
  
  .parameter-selection .el-button-group {
    flex-wrap: wrap; /* Allow buttons to wrap */
    max-width: calc(100% - 40px); /* Adjust max-width to allow space for filter icon */
  }
  
  .parameter-selection .el-button {
    margin-right: 5px; /* Space between buttons in group */
    margin-bottom: 5px; /* Space for wrapped buttons */
  }
  
  .filter-icon {
    font-size: 20px;
    color: #909399;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .date-filter-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
  }
  
  .analysis-sections {
    display: flex;
    gap: 20px;
    flex-grow: 1; /* Allows sections to take up available space */
    justify-content: space-around; /* Distributes space */
    align-items: flex-start; /* Align sections to the top */
  }
  
  .chart-section,
  .table-section {
    flex: 1; /* Each section takes equal width */
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content within sections */
  }
  
  .chart-section h3,
  .table-section h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #303133;
  }
  
  .chart-box {
    border: 1px solid #409EFF; /* Blue border as in image */
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px; /* Adjust max-width as needed */
    background-color: #fdfdfd;
    box-sizing: border-box; /* Include padding and border in width */
  }
  
  .chart-title {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    color: #303133;
  }
  
  .line-chart-placeholder {
    width: 100%;
    height: 200px; /* Fixed height for the chart area */
    border: 1px solid #dcdfe6; /* Inner border for the chart area */
    margin-bottom: 10px;
    position: relative;
    overflow: hidden; /* Ensure SVG content is clipped */
  }
  
  .chart-actions,
  .table-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: #606266;
    font-size: 14px;
    cursor: pointer;
  }
  
  .chart-actions .el-icon,
  .table-actions .el-icon {
    margin-right: 5px;
    font-size: 16px;
  }
  
  .table-box {
    border: 1px solid #dcdfe6; /* Standard table border */
    width: 100%;
    max-width: 400px; /* Match chart max-width */
    box-sizing: border-box;
  }
  
  /* Ensure table cells don't have extra padding if not needed */
  .table-box :deep(.el-table .cell) {
    padding: 8px 10px;
  }
  
  /* Hide table header as per image */
  .table-box :deep(.el-table__header-wrapper) {
    display: none;
  }

  .table-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #01050a;
  text-align: center;
}

  </style>