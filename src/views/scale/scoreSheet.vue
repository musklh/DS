<template>
  <div class="pdata-container">
    <div class="main-content">
      <!-- 左侧评分表单 -->
      <div class="score-form">
        <el-form label-width="80px" label-position="left">
          <el-form-item label="评分时间">
            <el-date-picker v-model="scoreTime" type="datetime" placeholder="2024-XX-XX 13:20" />
          </el-form-item>

          <div class="score-table" style="margin-top: 40px">
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
          @save="onSaveRules"
          :applyTitle="'应用规则'"
          :showSaveButton="true"
          :saveButtonText="'保存评分规则'"
          :saving="saving"
          :currentItem="currentScaleItem"
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
import { dictionaryPartialUpdate } from '../../api/dictionary';

const rules = ref([]);
const valueDialogVisible = ref(false);
const selectedHistoryIndex = ref(null);
const currentScoreItem = ref(null);
const currentHistoryData = ref([]);
const scoreTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const ratingGrading = ref(null);
const ratingLabels = ref('');

// 保存相关变量
const saving = ref(false);
const currentScaleItem = ref(null);

/**左边要参与评分的数据
 * 注意
 *  word_code: 'tj01',    word_name: '评分分级',
 * word_code: 'tj02',    word_name: '评分等级',
 * 这两条如果数据库没有要手动添加，word_code必须唯一，word_name必须唯一
 */
const scoreItems = ref([
  {
    id: 161,
    word_code: 'TES000060',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '检验指标',
    word_name: '阴离子间隙',
    word_eng: null,
    word_short: 'AG',
    word_class: '检验名称',
    word_belong: null,
    data_type: '数值类型',
    options: null,
    followup_options: null,
    value: '',
    values: [],
  },
  {
    id: 162,
    word_code: 'TES000061',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '检验指标',
    word_name: '标准碳酸氢盐',
    word_eng: null,
    word_short: 'SB',
    word_class: '检验名称',
    word_belong: null,
    data_type: '数值类型',
    options: null,
    followup_options: null,
    value: '',
    values: [],
  },
  {
    id: 330,
    word_code: 'C000007',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '术前检验',
    word_name: '乳酸',
    word_eng: 'Lac',
    word_short: '',
    word_class: '数据类型',
    word_belong: '',
    data_type: '数值类型',
    options: null,
    followup_options: null,
    value: '',
    values: [],
  },
  {
    id: 333,
    word_code: 'TES000144',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '检验指标',
    word_name: '实际碳酸氢盐',
    word_eng: '',
    word_short: '',
    word_class: '检验名称',
    word_belong: '',
    data_type: '数值类型',
    options: null,
    followup_options: null,
    value: '',
    values: [],
  },
  {
    word_code: 'tj01',
    word_name: '评分分级',
  },
  {
    word_code: 'tj02',
    word_name: '评分标签',
  },
]);

/** 历史检查数据 给选择数值弹窗用
 * 注意 TES000060 是word_code
 *
 */
const historyData = ref({
  TES000060: [
    { date: '2025-03-02 15:12', word_name: '阴离子间隙', value: '1.5' },
    { date: '2025-03-15 12:10', word_name: '阴离子间隙', value: '1.2' },
    { date: '2025-03-22 20:33', word_name: '阴离子间隙', value: '1.5' },
    { date: '2025-04-01 11:29', word_name: '阴离子间隙', value: '1.0' },
  ],
  TES000061: [
    { date: '2025-03-02 15:12', word_name: '标准碳酸氢盐', value: '3.2' },
    { date: '2025-03-15 12:10', word_name: '标准碳酸氢盐', value: '2.8' },
    { date: '2025-03-22 20:33', word_name: '标准碳酸氢盐', value: '3.0' },
    { date: '2025-04-01 11:29', word_name: '标准碳酸氢盐', value: '2.5' },
  ],
  C000007: [
    { date: '2025-03-02 15:12', word_name: '乳酸', value: '3.2' },
    { date: '2025-03-15 12:10', word_name: '乳酸', value: '2.8' },
    { date: '2025-03-22 20:33', word_name: '乳酸', value: '3.0' },
    { date: '2025-04-01 11:29', word_name: '乳酸', value: '2.5' },
  ],
  TES000144: [
    { date: '2025-03-02 15:12', word_name: '实际碳酸氢盐', value: '3.2' },
    { date: '2025-03-15 12:10', word_name: '实际碳酸氢盐', value: '2.8' },
    { date: '2025-03-22 20:33', word_name: '实际碳酸氢盐', value: '3.0' },
    { date: '2025-04-01 11:29', word_name: '实际碳酸氢盐', value: '2.5' },
  ],
});

/** 模拟右边计算的词条给公式计算中的计算属性配置用用 如果没有[]
 *  注意 左边的数据 评分分级，评分标签 有参加计算。这里就要手动配置 （word_code 需要左边要参与评分的数据的word_code=tj01。。。） [ {
    word_code: 'tj01',
    word_name: '评分分级',
    type: '公式计算',
    rule: {
      type: '公式计算',
      selectedAttrs: ['TES000060', 'TES000061', 'C000007', 'TES000144'],
      formula: 'TES000060 + TES000061 + C000007 + TES000144',
    },
  },
  {
    word_code: 'tj02',
    word_name: '评分标签',
    type: '范围标签',
    rule: {
      type: '范围标签',
      rules: [
        {
          minValue: '1',
          maxValue: '2',
          score: '3',
        },
      ],
    },
  },]


 */
const mockInitialRules = [
  {
    id: 1,
    word_name: '阴离子间隙',
    type: '范围编码',
    ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
    word_code: 'TES000060',
    word_short: 'AG',
    rule: {
      type: '范围编码',
      rules: [
        {
          minValue: '0',
          maxValue: '1.2',
          score: '1',
        },
        {
          minValue: '1.2',
          maxValue: '1.5',
          score: '2',
        },
        {
          minValue: '1.5',
          maxValue: '999',
          score: '3',
        },
      ],
    },
  },
  {
    id: 2,
    word_name: '标准碳酸氢盐',
    type: '数字编码',
    ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
    word_code: 'TES000061',
    word_short: 'SB',
    rule: {
      type: '数字编码',
      rules: [
        {
          originValue: '2.5',
          scoreValue: '1',
        },
        {
          originValue: '2.8',
          scoreValue: '2',
        },
        {
          originValue: '3.2',
          scoreValue: '3',
        },
      ],
    },
  },
  {
    id: 3,
    word_name: '乳酸',
    type: '范围编码',
    ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
    word_code: 'C000007',
    word_short: 'Lac',
    rule: {
      type: '范围编码',
      rules: [
        {
          minValue: '0',
          maxValue: '2.8',
          score: '1',
        },
        {
          minValue: '2.8',
          maxValue: '3.2',
          score: '2',
        },
        {
          minValue: '3.2',
          maxValue: '999',
          score: '3',
        },
      ],
    },
  },
  {
    id: 4,
    word_name: '实际碳酸氢盐',
    type: '范围编码',
    ruleTypes: ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'],
    word_code: 'TES000144',
    word_short: '',
    rule: {
      type: '范围编码',
      rules: [
        {
          minValue: '0',
          maxValue: '2.8',
          score: '1',
        },
        {
          minValue: '2.8',
          maxValue: '3.2',
          score: '2',
        },
        {
          minValue: '3.2',
          maxValue: '999',
          score: '3',
        },
      ],
    },
  },
  {
    word_code: 'tj01',
    word_name: '评分分级',
    type: '公式计算',
    rule: {
      type: '公式计算',
      selectedAttrs: ['TES000060', 'TES000061', 'C000007', 'TES000144'],
      formula: 'TES000060 + TES000061 + C000007 + TES000144',
    },
  },
  {
    word_code: 'tj02',
    word_name: '评分标签',
    type: '范围标签',
    rule: {
      type: '范围标签',
      rules: [
        {
          minValue: '1',
          maxValue: '50',
          score: '严重.超级严重',
        },
      ],
    },
  },
];

// 初始化历史数据
const initializeHistoryData = () => {
  if (
    historyData.value &&
    scoreItems.value &&
    Object.keys(historyData.value).length > 0 &&
    scoreItems.value.length > 0
  ) {
    scoreItems.value.forEach((item) => {
      const wordCode = item.word_code;
      if (historyData.value[wordCode] && historyData.value[wordCode].length > 0) {
        // 设置item.value为对应word_code的第一条value
        item.value = historyData.value[wordCode][0].value;
        // 设置item.values为对应word_code的所有value
        item.values = historyData.value[wordCode].map((historyItem) => historyItem.value);
      }
    });
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  initializeHistoryData();
});
// 模拟所有词条
const mockSelectionRules = [
  {
    id: 123,
    word_code: 'TES000022',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '检验指标',
    word_name: '总胆红素',
    word_eng: null,
    word_short: 'TBIL',
    word_class: '检验名称',
    word_belong: null,
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 329,
    word_code: 'TES000143',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '术前检验',
    word_name: '白蛋白',
    word_eng: 'A/G',
    word_short: '',
    word_class: '检验名称',
    word_belong: '',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 148,
    word_code: 'TES000047',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '检验指标',
    word_name: '凝血酶原时间',
    word_eng: null,
    word_short: 'PT',
    word_class: '检验名称',
    word_belong: null,
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 284,
    word_code: 'INF000101',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '基本信息',
    word_name: '腹水',
    word_eng: null,
    word_short: null,
    word_class: '信息名称',
    word_belong: '失代偿史',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 286,
    word_code: 'INF000103',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '基本信息',
    word_name: '肝性脑病',
    word_eng: null,
    word_short: null,
    word_class: '信息名称',
    word_belong: '失代偿史',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 280,
    word_code: 'INF000097',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '基本信息',
    word_name: '多囊肝',
    word_eng: null,
    word_short: null,
    word_class: '信息名称',
    word_belong: '原发疾病',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 285,
    word_code: 'INF000102',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '基本信息',
    word_name: '消化道出血',
    word_eng: null,
    word_short: null,
    word_class: '信息名称',
    word_belong: '失代偿史',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },

  {
    id: 289,
    word_code: 'INF000106',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '基本信息',
    word_name: '高血压',
    word_eng: null,
    word_short: null,
    word_class: '信息名称',
    word_belong: '',
    data_type: '数值类型',
    options: null,
    followup_options: null,
  },
  {
    id: 6,
    word_code: 'A000001',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '系统',
    word_eng: 'System',
    word_short: 'sys',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },
  {
    id: 7,
    word_code: 'A000002',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '词条应用',
    word_eng: 'Word Apply',
    word_short: 'WA',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },
  {
    id: 8,
    word_code: 'A000003',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '检验指标',
    word_eng: 'Test Rating',
    word_short: 'TR',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },
  {
    id: 9,
    word_code: 'A000004',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '辅助检查',
    word_eng: 'Auxiliary Examination',
    word_short: 'AE',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },
  {
    id: 10,
    word_code: 'A000005',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '基本信息',
    word_eng: 'General Information',
    word_short: 'GI',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },

  {
    id: 107,
    word_code: 'A00000003',
    input_type: 'text',
    has_unit: 0,
    unit: null,
    is_score: 0,
    score_func: null,
    word_apply: '词条应用',
    word_name: '代数换算',
    word_eng: 'Algebraic Conversion',
    word_short: 'AC',
    word_class: '字典词条',
    word_belong: null,
    data_type: '文本类型',
    options: null,
    followup_options: null,
  },
];

//计算规则中需要额外添加项
// 点击应用规则事件
const onSettings = (data) => {
  console.log('保存规则设置', data);
  console.log(data);

  // 将data赋值给rules.value用于应用规则
  rules.value = data;

  // 自动应用规则
  applyRules(scoreItems, rules, ratingGrading, ratingLabels);
};

// 保存评分规则
const onSaveRules = async (data) => {
  if (saving.value) return;
  
  saving.value = true;
  console.log('保存评分规则数据:', data);
  
  try {
    // 找到当前评分对应的词条
    const currentScale = scoreItems.value.find(item => 
      item.word_name === '评分分级' || 
      item.word_name.includes('评分')
    );
    
    if (!currentScale) {
      ElMessage.error('未找到对应的评分词条');
      return;
    }
    
    const scoreFunc = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 更新评分词条的规则
    await dictionaryPartialUpdate(
      { word_code: currentScale.word_code },
      {
        is_score: 1,
        score_func: scoreFunc,
      }
    );
    
    ElMessage.success(`保存成功！词条：${currentScale.word_name}(${currentScale.word_code})`);
    
  } catch (error) {
    console.error('保存评分规则失败:', error);
    ElMessage.error('保存评分规则失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 新增方法打开选择数值事件
const openValueDialog = (item) => {
  currentScoreItem.value = item;
  if (historyData.value && !historyData.value[item.word_code]) {
    ElMessage.error(`没有找到${item.word_code}历史记录`);
    return;
  } else {
    currentHistoryData.value = historyData.value[item.word_code] || [];
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

//录入
const enterData = async () => {
  if (!scoreTime.value) {
    return ElMessage.error('请选择检查时间');
  }

  console.log('enterData', scoreItems);

  try {
    ElMessage.success('录入成功');
  } catch (error) {
    console.error('Failed to create data', error);
    ElMessage.error('录入失败');
  }
};
// 右边点击应用规则事件
const resetData = () => {
  scoreItems.value.forEach((item) => {
    item.score = '';
    item.value = '';
  });
  ElMessage.success('重置成功');
};
</script>

<style scoped lang="scss">
@import url(./scoreSheet.scss);
</style>
