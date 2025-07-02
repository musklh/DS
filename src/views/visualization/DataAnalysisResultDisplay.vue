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
      <div class="header-buttons">
        <el-button class="patient-detail-button" size="small" type="primary" @click="goToPatientDetail">
          <el-icon><User /></el-icon>
          查看病例详情
        </el-button>
        <el-button class="back-button" size="small" @click="emit('go-back-to-selection')">
          <el-icon><Back /></el-icon>
          返回选择
        </el-button>
      </div>
    </div>
      <!-- Y轴指标选择区域 -->
      <div class="axis-select-block">
        <div class="axis-block-title">Y轴指标：</div>
        <div v-if="!props.axisData.templateData || props.axisData.templateData.length === 0" class="no-data-hint">
          <el-alert type="info" :closable="false" show-icon size="small">
            暂无可选指标数据
          </el-alert>
        </div>
        <div v-else class="template-indicators-container">
          <div 
            v-for="template in props.axisData.templateData" 
            :key="template.template_code" 
            class="template-group"
          >
            <div 
              class="template-title-header"
              @click="toggleTemplate(template.template_code)"
            >
              <span class="template-title">{{ template.template_name }}</span>
              <span class="indicator-count">({{ template.dictionaries?.length || 0 }}项)</span>
              <el-icon class="expand-icon" :class="{ 'expanded': expandedTemplates[template.template_code] }">
                <ArrowDown />
              </el-icon>
            </div>
            <el-collapse-transition>
              <div v-show="expandedTemplates[template.template_code]" class="template-indicators-wrapper">
                <el-radio-group v-model="selectedY" @change="handleSelectionChange" class="template-indicators">
                  <el-radio-button
                    v-for="item in template.dictionaries"
                    :key="item.word_code"
                    :value="item.word_code"
                    class="indicator-button"
                  >
                    {{ item.word_name }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>

      <!-- X轴时间选择区域 -->
      <div class="axis-select-block">
        <div class="axis-block-title">X轴时间：</div>
        <div v-if="!selectedY" class="x-axis-hint">
          <el-alert type="info" :closable="false" show-icon size="small">
            请先选择Y轴指标
          </el-alert>
        </div>
        <div v-else-if="isLoadingXAxis" class="x-axis-hint">
          <el-alert type="info" :closable="false" show-icon size="small">
            正在加载时间数据...
          </el-alert>
        </div>
        <div v-else-if="xAxisOptions.length === 0" class="x-axis-hint">
          <el-alert type="warning" :closable="false" show-icon size="small">
            该指标暂无时间数据
          </el-alert>
        </div>
        <div v-else class="x-axis-selection-area">
          <div class="x-axis-buttons-container">
                         <el-checkbox-group v-model="selectedX" @change="handleSelectionChange">
                <el-checkbox-button
                 v-for="item in formattedXAxisOptions"
                 :key="item.value"
                 :value="item.value"
                 class="x-radio-btn"
                >
                 {{ item.label }}
                </el-checkbox-button>
              </el-checkbox-group>
          </div>
          <div v-if="formattedXAxisOptions.length > 0" class="x-axis-actions">
            <el-button size="small" type="primary" link @click="selectAllXAxis">
              全选
            </el-button>
            <el-button size="small" type="primary" link @click="clearAllXAxis">
              清空
            </el-button>
            <span class="selected-count">已选择 {{ selectedX.length }}/{{ formattedXAxisOptions.length }} 个时间点</span>
          </div>
        </div>
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
import { useRouter } from 'vue-router';
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
  ElAlert,
  ElCollapseTransition
} from 'element-plus';
import { Refresh, Back, Download, User, ArrowDown } from '@element-plus/icons-vue';
import { caseVisualizationDataCreate } from '../../api/caseVisualizationData';
import { caseVisualizationXaxisOptionsCreate } from '../../api/caseVisualizationXaxisOptions';
import { caseIdentityCases } from '../../api/openApiCase';
import { ElMessage } from 'element-plus';
import VChart from 'vue-echarts';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const props = defineProps({
  patientData: Object,
  axisData: {
    type: Object,
    default: () => ({ x_axis_options: [], templateData: [] })
  }
});
const emit = defineEmits(['go-back-to-selection']);
const router = useRouter();

const selectedY = ref(''); // 只允许单选
const selectedX = ref([]); // 多选
const chartTitle = ref('');
const chartValues = ref([]); // y值数组
const tableData = ref([]);
const xAxisOptions = ref([]); // 动态获取的X轴时间选项
const isLoadingXAxis = ref(false); // X轴数据加载状态
const expandedTemplates = ref({}); // 控制模板展开状态
const showResult = computed(() => selectedY.value && selectedX.value.length > 0 && chartValues.value.length > 0);

// 格式化X轴时间选项显示
const formattedXAxisOptions = computed(() => {
  return xAxisOptions.value.map(item => {
    // 处理不同的数据格式
    const timeValue = item.check_time || item;
    const displayLabel = formatTimeDisplay(timeValue);
    
    return {
      value: timeValue,
      label: displayLabel
    };
  });
});

// 时间显示格式化函数
const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  
  try {
    // 处理不同的时间格式
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      return timeStr; // 如果无法解析，返回原始字符串
    }
    
    // 格式化为 YYYY-MM-DD HH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return timeStr; // 出错时返回原始字符串
  }
};

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

// 全选X轴时间
const selectAllXAxis = () => {
  selectedX.value = formattedXAxisOptions.value.map(item => item.value);
};

// 清空X轴选择
const clearAllXAxis = () => {
  selectedX.value = [];
};

// 获取X轴时间选项
const fetchXAxisOptions = async () => {
  if (!selectedY.value) {
    xAxisOptions.value = [];
    return;
  }
  
  isLoadingXAxis.value = true;
  console.log('selectedY.value', selectedY.value);
  console.log('props.patientData.caseId',props.patientData.caseId);
  
  try {
    const res = await caseVisualizationXaxisOptionsCreate({
      case_code: props.patientData.caseId,
      y_axis_word_code: selectedY.value
    });
    
    console.log('X轴API完整响应:', res.data);
    
    if (res.data.code === 200 && res.data.data && res.data.data.x_axis_options) {
      // 根据API返回的数据结构调整，取x_axis_options数组
      xAxisOptions.value = res.data.data.x_axis_options;
      console.log('获取到X轴时间选项:', xAxisOptions.value);
    } else {
      console.log('获取X轴数据失败:', res.data);
      xAxisOptions.value = [];
    }
  } catch (error) {
    console.error('获取X轴数据异常:', error);
    xAxisOptions.value = [];
  } finally {
    isLoadingXAxis.value = false;
  }
};

// 监听Y轴选择变化
watch(selectedY, async (newValue) => {
  if (newValue) {
    // 清空之前的X轴选择
    selectedX.value = [];
    chartValues.value = [];
    tableData.value = [];
    chartTitle.value = '';
    
    // 获取新的X轴选项
    await fetchXAxisOptions();
  } else {
    xAxisOptions.value = [];
    selectedX.value = [];
    chartValues.value = [];
    tableData.value = [];
    chartTitle.value = '';
  }
});

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
    y_axis_word_codes:[selectedY.value],
    x_axis_times: xAxisStr
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
    console.error('获取图表数据异常:', e);
    chartValues.value = [];
    tableData.value = [];
    chartTitle.value = '';
  }
};

// 切换模板展开状态
const toggleTemplate = (templateCode) => {
  expandedTemplates.value[templateCode] = !expandedTemplates.value[templateCode];
};

// 初始化模板展开状态
const initExpandedTemplates = () => {
  if (props.axisData.templateData && props.axisData.templateData.length > 0) {
    const newExpandedState = {};
    props.axisData.templateData.forEach((template, index) => {
      // 默认展开第一个模板，其他收起
      newExpandedState[template.template_code] = index === 0;
    });
    expandedTemplates.value = newExpandedState;
  }
};

// 监听axisData变化，重新初始化展开状态
watch(() => props.axisData.templateData, () => {
  initExpandedTemplates();
}, { immediate: true, deep: true });

// 跳转到病例详情页面
const goToPatientDetail = async () => {
  try {
    console.log('准备跳转到病例详情页，患者身份证号:', props.patientData.idCard);
    
    // 获取患者的所有病例信息
    const res = await caseIdentityCases({ identity_id: props.patientData.idCard });
    console.log('获取病例信息响应:', res.data);
    
    if (res.data?.code === 200) {
      const caseList = res.data.data.list || [];
      
      if (caseList.length === 0) {
        ElMessage.warning('该患者暂无病例信息');
        return;
      }
      
      // 构造患者详情数据
      const patientDetail = {
        identity_name: props.patientData.name,
        gender: props.patientData.gender === '男' ? 1 : 0,
        age: parseInt(props.patientData.age) || 0,
        idCard: props.patientData.idCard,
        phone_number: '',
        home_address: '',
        blood_type: '',
        rh: '',
        has_transplant_surgery: '',
        is_in_transplant_queue: '',
        main_diagnosis: '',
        allCases: caseList,
        // 从第一个病例中获取一些基本信息
        ...(caseList[0] || {})
      };
      
      console.log('构造的患者详情数据:', patientDetail);
      
      // 跳转到患者列表页面并传递患者数据
      // 通过路由参数或者localStorage传递数据
      localStorage.setItem('selectedPatientDetail', JSON.stringify(patientDetail));
      
      await router.push('/dashboard/patient-list');
      
      ElMessage.success('正在跳转到病例详情页面...');
    } else {
      ElMessage.error('获取病例信息失败: ' + (res.data?.msg || '未知错误'));
    }
  } catch (error) {
    console.error('跳转到病例详情页面失败:', error);
    ElMessage.error('跳转失败，请重试');
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

.header-buttons {
  margin-left: auto; /* Pushes button group to the far right */
  display: flex;
  gap: 12px;
  align-items: center;
}

.patient-detail-button {
  border: 1px solid #409eff;
  background-color: #409eff;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.patient-detail-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.patient-detail-button .el-icon {
  margin-right: 5px;
  font-size: 16px;
}

.back-button {
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

.no-data-hint {
  width: 100%;
}

.template-indicators-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-group {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
}

.template-title-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  transition: background-color 0.3s ease;
}

.template-title-header:hover {
  background-color: #f0f2f5;
}

.template-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.indicator-count {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.expand-icon {
  font-size: 14px;
  color: #909399;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.template-indicators-wrapper {
  padding: 12px 16px;
}

.template-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.indicator-button {
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .template-indicators {
    gap: 6px;
  }
  
  .indicator-button :deep(.el-radio-button__inner) {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .template-title {
    font-size: 13px;
  }
  
  .template-title-header {
    padding: 10px 12px;
  }
  
  .template-indicators-wrapper {
    padding: 10px 12px;
  }
  
  .indicator-count {
    font-size: 11px;
  }
}


.x-axis-hint {
  width: 100%;
}

.x-axis-selection-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.x-axis-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.x-axis-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #e4e7ed;
  font-size: 14px;
}

.selected-count {
  color: #909399;
  font-size: 13px;
  margin-left: auto;
}

/* 优化复选框按钮的样式 */
.x-radio-btn {
  margin: 0 !important; /* 移除默认margin，使用gap来控制间距 */
}

/* 确保复选框按钮在小屏幕上也能正常换行 */
@media (max-width: 768px) {
  .x-axis-buttons-container {
    gap: 6px;
  }
  
  .x-radio-btn :deep(.el-checkbox-button__inner) {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .x-axis-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .selected-count {
    font-size: 12px;
    width: 100%;
    text-align: center;
    margin-left: 0;
    margin-top: 4px;
  }
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
