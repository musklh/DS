<template>
  <div class="analysis-result-display-container">
    <div class="patient-case-header">
      <span class="patient-name">{{ patientData.name }}</span>
      <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
      <span class="patient-id-card">{{ patientData.idCard }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ patientData.caseId }}</span>
      <el-icon class="refresh-icon">
        <Refresh />
      </el-icon>
      <el-button class="back-button" size="small" @click="emit('go-back-to-selection')">
        <el-icon><Back /></el-icon>
        返回选择
      </el-button>
    </div>

      <!-- Y轴指标选择区域 -->
      <div class="axis-select-block">
        <div class="axis-block-title">Y轴指标：</div>
        <el-radio-group v-model="selectedY" @change="handleSelectionChange">
          <el-radio-button
            v-for="item in props.axisData.y_axis_options"
            :key="item.word_code"
            :label="item.word_code"
          >
            {{ item.word_name }}
          </el-radio-button>
        </el-radio-group>
      </div>
      

      <!-- X轴时间选择区域 -->
      <div class="axis-select-block">
        <div class="axis-block-title">X轴时间：</div>
        <el-checkbox-group v-model="selectedX" @change="handleSelectionChange">
          <el-checkbox-button
            v-for="item in props.axisData.x_axis_options"
            :key="item.check_time"
            :label="item.check_time"
            class="x-radio-btn"
          >
            {{ item.check_time }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    <el-card class="content-card">
      <el-alert type="info" :closable="false" show-icon style="margin-bottom: 20px;">
        先选Y轴指标，再选X轴时间。
      </el-alert>


      <!-- 折线图和表格，只有选中Y和X后才显示 -->
      <div v-if="showResult" class="analysis-sections">
        <div class="chart-section">
          <h3>图:</h3>
          <div class="chart-box">
            <h4 class="chart-title">{{ chartTitle }}</h4>
            <v-chart :option="echartsOption" autoresize style="width: 100%; height: 260px;" ref="chartRef" />
          </div>
          <el-button size="small" @click="exportChartToImage">
              <el-icon><Download /></el-icon>
              保存为图片
            </el-button>
        </div>

        <div class="table-section">
          <h3>表:</h3>

          <div class="table-box">
            <h4 class="table-title">{{ chartTitle }}</h4>
            <el-table
              :data="tableData"
              border
              stripe
              size="small"
              :show-header="true"
              style="width: 100%"
              ref="tableRef"
            >
              <el-table-column prop="date" label="时间" width="120" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </div>
          <div class="table-actions">
            <el-button size="small" @click="exportTableToExcel">
              <el-icon><Download /></el-icon>
              保存为Excel表格
            </el-button>
          </div>
        </div>

      </div>
      
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElTable,
  ElTableColumn,
  ElAlert
} from 'element-plus';
import { Refresh, Back, Download } from '@element-plus/icons-vue';
import { caseVisualizationDataCreate } from '../../api/caseVisualizationData';
import VChart from 'vue-echarts';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const props = defineProps({
  patientData: Object,
  axisData: {
    type: Object,
    default: () => ({ x_axis_options: [], y_axis_options: [] })
  }
});
const emit = defineEmits(['go-back-to-selection']);

const selectedY = ref(''); // 只允许单选
const selectedX = ref([]); // 多选
const chartTitle = ref('');
const chartValues = ref([]); // y值数组
const tableData = ref([]);
const showResult = computed(() => selectedY.value && selectedX.value.length > 0 && chartValues.value.length > 0);

const tableRef = ref();
const chartRef = ref();

// x轴排序，保证图表和表格一致
const selectedXSorted = computed(() => {
  // 按时间字符串升序排列
  return [...selectedX.value].sort();
});

// eCharts option
const echartsOption = computed(() => {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: selectedXSorted.value,
      axisLabel: { rotate: 30 },
      axisLine: { lineStyle: { color: '#409EFF' } },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e6f1' } }
    },
    yAxis: {
      type: 'value',
      min: val => Math.floor(val.min * 0.9),
      max: val => Math.ceil(val.max * 1.1),
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e6f1' } },
      axisLine: { lineStyle: { color: '#409EFF' } }
    },
    series: [
      {
        name: chartTitle.value,
        type: 'line',
        data: chartValues.value,
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { color: '#67C23A', width: 3 },
        itemStyle: { color: '#409EFF', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: 'rgba(64,158,255,0.08)' }
      }
    ]
  };
});

// 导出图表为图片
const exportChartToImage = async () => {
  await nextTick();
  const chartEl = chartRef.value?.$el;
  if (!chartEl) return;
  html2canvas(chartEl, { backgroundColor: '#fff' }).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${chartTitle.value || '图表'}.png`;
    link.click();
  });
};

// 导出表格为Excel表格
const exportTableToExcel = () => {
  // 只导出当前表格数据
  const ws = XLSX.utils.json_to_sheet(tableData.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, chartTitle.value || 'Sheet1');
  XLSX.writeFile(wb, `${chartTitle.value || '表格'}.xlsx`);
};

const handleSelectionChange = async () => {
  if (!selectedY.value || selectedX.value.length === 0) {
    chartValues.value = [];
    tableData.value = [];
    chartTitle.value = '';
    return;
  }
  // x轴转字符串并排序
  const xAxisStr = selectedX.value.map(x => {
    if (x instanceof Date) {
      return x.toISOString().slice(0, 10);
    }
    return x;
  }).sort();
  const body = {
    case_code: props.patientData.caseId,
    x_axis_word_codes: xAxisStr,
    y_axis_word_codes: [selectedY.value],
  };
  try {
    const res = await caseVisualizationDataCreate(body);
    if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const yData = res.data.data[0];
      chartTitle.value = yData.word_name || '';
      // 保证chartValues顺序与xAxisStr一致
      const valueMap = {};
      (yData.data_points || []).forEach(p => { valueMap[p.check_time] = Number(p.value); });
      chartValues.value = xAxisStr.map(x => valueMap[x] ?? 0);
      tableData.value = xAxisStr.map((x, i) => ({ date: x, value: chartValues.value[i] ?? '' }));
    } else {
      chartValues.value = [];
      tableData.value = [];
      chartTitle.value = '';
    }
  } catch (e) {
    chartValues.value = [];
    tableData.value = [];
    chartTitle.value = '';
  }
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

.axis-select-block {
  background: #f6faff;
  border: 1px solid #d3e4f7;
  border-radius: 8px;
  padding: 18px 18px 12px 18px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.axis-block-title {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 12px;
}
.x-radio-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}

.xy-axis-info {
  margin-bottom: 24px;
  font-size: 16px;
}

.xy-axis-info .el-tag {
  font-size: 15px;
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

.chart-actions {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-box {
  border: 1px solid #409eff; /* Blue border as in image */
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
