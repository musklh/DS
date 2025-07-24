<template>
  <div class="pdata-container">
    <!-- 头部信息 -->
    <div class="score-header">
      <div class="patient-info">
        <span class="patient-name">{{ patientData.name }}</span>
        <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
        <span class="patient-id-card">{{ patientData.identity_id }}</span>
        <el-divider direction="vertical" />
        <span class="case-id">病例: {{ patientData.caseId }}</span>
      </div>
      <div class="score-title">
        <span class="in-progress-text">正在录入:</span>
        <span class="scale-name">{{ selectedScale.word_name }}</span>
        <el-button class="back-btn" size="small" @click="goBack">
          返回
        </el-button>
      </div>
    </div>
    
    <div class="main-content">
      <!-- 左侧评分表单 -->
      <div class="score-form">
        <el-form label-width="80px" label-position="left">
          <div class="score-table" style="margin-top: 20px">
            <div class="score-row" style="margin-bottom: 0">
              <span data-v-2b4be9f2="" class="score-label"> </span>
              <span class="el-select score-select">评分:</span>
              <span class="el-select score-select">数值:</span>
            </div>
            <div
              class="score-row"
              v-for="item in scoreItems"
              :key="item.word_name"
              style="margin-bottom: 4px"
            >
              <span class="score-label"
                >{{ item.word_name }}<span v-if="item.required" class="required">*</span>
              </span>

              <el-input
                v-model="item.score"
                class="score-select"
                v-if="item.word_name != '评分分级' && item.word_name != '评分标签'"
              />

              <el-select
                v-model="item.value"
                class="value-select"
                v-if="item.word_name != '评分分级' && item.word_name != '评分标签'"
              >
                <el-option v-for="val in item.values" :key="val" :label="val" :value="val" />
              </el-select>
              <a
                v-if="item.word_name != '评分分级' && item.word_name != '评分标签'"
                class="choose-value"
                href="#"
                @click.prevent="openValueDialog(item)"
                >选择数值</a
              >
              <div
                class=""
                style="height: 45px; display: flex; align-items: center; width: 100px"
                v-if="item.word_name === '评分分级'"
              >
                {{ item.score }}
              </div>
              <div
                class=""
                style="
                  height: 45px;
                  display: flex;
                  align-items: center;
                  width: 400px;
                  font-size: 18px;
                  font-weight: 700;
                "
                v-if="item.word_name === '评分标签'"
              >
                {{ item.score }}
              </div>
              <div
                class=""
                style="height: 45px; display: flex; align-items: center; width: 100px"
                v-if="item.word_name === '评分分级'"
              >
                计算结果
              </div>
            </div>
          </div>

          <div class="form-actions">
            <el-button
              type="primary"
              round
              style="
                background-color: rgba(64, 158, 255, 0.1);
                border-color: rgba(64, 158, 255, 0.5);
                color: #409eff;
              "
              @click="enterData"
              >录入</el-button
            >
            <el-button
              type="danger"
              round
              style="
                background-color: rgba(245, 108, 108, 0.2);
                border-color: rgba(245, 108, 108, 0.5);
                color: #f0290c;
              "
              @click="resetData"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>

      <!-- 右侧评分规则设置 -->
      <div class="score-rule-box">
        <div class="rule-title">临床评分表规则<span class="required">*</span></div>
        <!-- 这里可以添加实际表单内容 -->
        <ratingRules
          :icon="'Refresh'"
          :nitialRules="mockInitialRules"
          :selectionRules="mockSelectionRules"
          @settings="onSettings"
          :applyTitle="'应用规则'"
        />
        <!-- :entryOfCalculation="mockInitialRules" -->
      </div>
    </div>

    <!-- 选择数值弹窗 -->
    <el-dialog
      v-model="valueDialogVisible"
      title="从所有检查中选择数值"
      width="500px"
      :before-close="handleCloseDialog"
    >
      <div class="value-dialog-content">
        <div class="value-list">
          <div
            class="value-item"
            v-for="(historyItem, index) in currentHistoryData"
            :key="index"
            :class="{ selected: selectedHistoryIndex === index }"
            @click="selectHistoryItem(index)"
          >
            <span class="date">{{ historyItem.date }}</span>
            <span class="test-name">{{ historyItem.word_name }}</span>
            <span class="value">{{ historyItem.value }}</span>
            <el-radio v-model="selectedHistoryIndex" :label="index" class="radio-btn">
              <!-- 不传 slot 内容，label 区域就不会显示 -->
            </el-radio>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="valueDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSelectValue">选择</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import ratingRules from '@/components/ratingRules/index.vue';
import { applyRules } from './baseFunction';
import { dataTableCrudList } from '../../api/dataTableCrud';

const props = defineProps({
  selectedScale: {
    type: Object,
    required: true
  },
  templateItem: {
    type: Object,
    required: true
  },
  patientData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['go-back', 'save-score-data']);

const rules = ref([]);
const valueDialogVisible = ref(false);
const selectedHistoryIndex = ref(null);
const currentScoreItem = ref(null);
const currentHistoryData = ref([]);
// 评分时间现在使用当前时间，不再需要单独的变量
const ratingGrading = ref(null);
const ratingLabels = ref('');

// 动态生成评分项目，基于选中的量表
const scoreItems = ref<any[]>([]);

// 初始化评分项目
const initializeScoreItems = async () => {
  if (props.selectedScale && props.selectedScale.score_func) {
    try {
      const scoreFunc = JSON.parse(props.selectedScale.score_func);
      const items = [];
      
      // 添加量表中的评分项目
      for (let index = 0; index < scoreFunc.length; index++) {
        const item = scoreFunc[index];
        const scoreItem = {
          id: index + 1,
          word_code: item.word_code || `item_${index}`,
          word_name: item.word_name || `项目${index + 1}`,
          word_short: item.word_short || '',
          value: '',
          values: [],
          score: '',
          required: true
        };
        
        // 为每个评分项目加载历史数据
        try {
          const response = await dataTableCrudList({
            case_code: props.patientData.caseId,
            word_code: scoreItem.word_code,
          } as any);
          
          if (response.data?.code === 200 && response.data?.data?.list) {
            // 提取历史数据中的数值作为下拉选项
            const historyValues = response.data.data.list.map(historyItem => historyItem.value);
            scoreItem.values = [...new Set(historyValues)]; // 去重
          }
        } catch (error) {
          console.log(`加载词条 ${scoreItem.word_code} 历史数据失败:`, error);
        }
        
        items.push(scoreItem);
      }
      
      // 添加评分分级和评分标签
      items.push({
        word_code: 'tj01',
        word_name: '评分分级',
        score: '',
        required: false
      });
      
      items.push({
        word_code: 'tj02',
        word_name: '评分标签',
        score: '',
        required: false
      });
      
      scoreItems.value = items;
    } catch (error) {
      console.error('解析量表评分函数失败:', error);
      // 如果解析失败，使用默认项目
      scoreItems.value = [
        {
          word_code: 'default',
          word_name: props.selectedScale.word_name || '默认评分',
          value: '',
          values: [],
          score: '',
          required: true
        },
        {
          word_code: 'tj01',
          word_name: '评分分级',
          score: '',
          required: false
        },
        {
          word_code: 'tj02',
          word_name: '评分标签',
          score: '',
          required: false
        }
      ];
    }
  }
};

// 模拟历史数据
const historyData = ref<Record<string, any[]>>({});

// 初始化历史数据
const initializeHistoryData = () => {
  // 不再设置默认值，让用户手动选择
  // 历史数据现在通过API获取，不再使用模拟数据
  console.log('initializeHistoryData: 历史数据已通过API获取，不再设置默认值');
};

// 模拟规则数据
const mockInitialRules = ref<any[]>([]);
const mockSelectionRules = ref<any[]>([]);

// 初始化规则数据
const initializeRules = () => {
  if (props.selectedScale && props.selectedScale.score_func) {
    try {
      const scoreFunc = JSON.parse(props.selectedScale.score_func);
      mockInitialRules.value = scoreFunc;
      
      // 生成选择规则（这里可以根据实际需求调整）
      mockSelectionRules.value = scoreFunc.map(item => ({
        ...item,
        ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算']
      }));
    } catch (error) {
      console.error('解析量表规则失败:', error);
      mockInitialRules.value = [];
      mockSelectionRules.value = [];
    }
  }
};

// 组件挂载时初始化数据
onMounted(async () => {
  await initializeScoreItems();
  initializeHistoryData();
  initializeRules();
});

// 监听props变化
watch(() => props.selectedScale, async () => {
  await initializeScoreItems();
  initializeHistoryData();
  initializeRules();
}, { immediate: true });

// 点击应用规则事件
const onSettings = (data) => {
  console.log('保存规则设置', data);
  rules.value = data;
  // 自动应用规则
  applyRules(scoreItems, rules, ratingLabels);
};

// 打开选择数值弹窗
const openValueDialog = async (item) => {
  currentScoreItem.value = item;
  
  try {
    // 根据图片说明：传入左侧对应词条的word_code和该病例的case_code
    const response = await dataTableCrudList({
      case_code: props.patientData.caseId,
      word_code: item.word_code, // 左侧对应词条的word_code
    } as any);
    
    if (response.data?.code === 200 && response.data?.data?.list) {
      // 将历史数据转换为弹窗需要的格式
      currentHistoryData.value = response.data.data.list.map(historyItem => ({
        date: historyItem.check_time,
        testName: historyItem.word_name,
        value: historyItem.value,
        case_code: historyItem.case_code,
      }));
      
      // 更新下拉列表的选项，使用真实的历史数据
      const historyValues = response.data.data.list.map(historyItem => historyItem.value);
      item.values = [...new Set(historyValues)]; // 去重并更新下拉选项
      
      selectedHistoryIndex.value = null;
      valueDialogVisible.value = true;
    } else {
      ElMessage.warning(`没有找到${item.word_name}的历史记录`);
      currentHistoryData.value = [];
      item.values = []; // 清空下拉选项
      selectedHistoryIndex.value = null;
      valueDialogVisible.value = true;
    }
  } catch (error) {
    console.error('获取历史数据失败:', error);
    ElMessage.error('获取历史数据失败');
    currentHistoryData.value = [];
    selectedHistoryIndex.value = null;
    valueDialogVisible.value = true;
  }
};

// 选择数值事件
const selectHistoryItem = (index) => {
  selectedHistoryIndex.value = index;
};

const confirmSelectValue = () => {
  if (selectedHistoryIndex.value !== null && currentScoreItem.value) {
    const selectedItem = currentHistoryData.value[selectedHistoryIndex.value];
    currentScoreItem.value.value = selectedItem.value;
  }
  valueDialogVisible.value = false;
};

const handleCloseDialog = () => {
  valueDialogVisible.value = false;
};

// 录入 - 暂存数据并跳回模板页面
const enterData = async () => {
  // 使用当前时间作为评分时间
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

  // 验证必填字段
  const requiredItems = scoreItems.value.filter(item => item.required && item.word_name !== '评分分级' && item.word_name !== '评分标签');
  for (const item of requiredItems) {
    if (!item.value) {
      return ElMessage.error(`请填写${item.word_name}的数值`);
    }
  }

  // 构建评分数据
  const scoreData = {
    value: 0, // 评分总分，需要根据规则计算
    unit: '分', // 默认单位
    result: '', // 评分临床意义
    sources: [] // 参与评分的词条数据
  };

  // 收集参与评分的词条数据
  scoreItems.value.forEach(item => {
    if (item.word_name !== '评分分级' && item.word_name !== '评分标签' && item.value) {
      scoreData.sources.push({
        word_code: item.word_code,
        word_name: item.word_name, // 添加词条名称
        template_code: props.templateItem.template_code || props.selectedTemplate?.code,
        check_time: currentTime,
        value: item.value
      });
    }
  });

  // 计算评分总分（这里需要根据实际规则计算）
  // 暂时使用简单的累加，实际应该根据规则计算
  let totalScore = 0;
  scoreItems.value.forEach(item => {
    if (item.word_name !== '评分分级' && item.word_name !== '评分标签' && item.score) {
      totalScore += parseFloat(item.score) || 0;
    }
  });
  scoreData.value = totalScore;

  // 设置评分临床意义
  const ratingLabelItem = scoreItems.value.find(item => item.word_name === '评分标签');
  if (ratingLabelItem && ratingLabelItem.score) {
    scoreData.result = ratingLabelItem.score;
  }

  // 设置单位（根据量表类型）
  if (props.selectedScale.word_name.includes('Child')) {
    scoreData.unit = '分';
  } else if (props.selectedScale.word_name.includes('MELD')) {
    scoreData.unit = '分';
  } else if (props.selectedScale.word_name.includes('CLIF-C AD')) {
    scoreData.unit = '分';
  } else if (props.selectedScale.word_name.includes('EASL-ACLF')) {
    scoreData.unit = '型';
  }

  console.log('暂存评分数据:', scoreData);
  console.log('props.templateItem:', props.templateItem);
  console.log('props.templateItem.word_code:', props.templateItem?.word_code);

  // 暂存数据并跳回模板页面
  emit('save-score-data', {
    scaleData: scoreData,
    selectedScale: props.selectedScale,
    templateItem: props.templateItem,
    checkTime: currentTime
  });

  ElMessage.success('评分数据已暂存，返回模板页面');
};

// 重置
const resetData = () => {
  scoreItems.value.forEach((item) => {
    item.score = '';
    item.value = '';
  });
  ElMessage.success('重置成功');
};

// 返回按钮
const goBack = () => {
  emit('go-back');
};
</script>

<style scoped lang="scss">
@import url(./scoreSheet.scss);

.score-header {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;

  .patient-info {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #303133;
    margin-bottom: 15px;

    span {
      margin-right: 15px;
    }

    .patient-name {
      font-weight: bold;
    }

    .el-divider--vertical {
      margin: 0 15px;
    }
  }

  .score-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    font-size: 18px;
    color: #303133;

    .in-progress-text {
      color: #909399;
      margin-right: 8px;
      font-size: 16px;
    }

    .scale-name {
      margin-right: 15px;
    }

    .back-btn {
      margin-left: auto;
    }
  }
}
</style> 