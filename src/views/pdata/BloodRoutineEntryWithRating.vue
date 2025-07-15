<template>
  <div class="blood-routine-entry-container">
    <div class="patient-case-header">
      <span class="patient-name">{{ patientData.name }}</span>
      <span class="patient-age-gender">{{ patientData.gender }} {{ patientData.age }}</span>
      <span class="patient-id-card">{{ patientData.identity_id }}</span>
      <el-divider direction="vertical" />
      <span class="case-id">病例: {{ patientData.caseId }}</span>
      <el-icon class="refresh-icon">
        <Refresh />
      </el-icon>
    </div>
    <el-card class="content-card">
      <template #header>
        <div class="card-header-content">
          <span class="in-progress-text">正在录入:</span>
          <span class="template-name">{{ selectedTemplate.name }}</span>
          <el-icon class="refresh-icon">
            <Refresh />
          </el-icon>
          <el-button class="back-to-template-btn" size="small" @click="emit('go-back-to-template')">
            返回模板选择
          </el-button>
        </div>
      </template>
      <template #>
        <div class="pdata-container">
          <div class="main-content">
            <div class="score-form">
              <el-form label-width="80px" label-position="left">
                <el-form-item label="评分时间">
                  <el-date-picker
                    v-model="scoreTime"
                    type="datetime"
                    placeholder="2024-XX-XX 13:20"
                  />
                </el-form-item>

                <div class="score-table">
                  <div class="score-row" style="margin-bottom: 0">
                    <span data-v-2b4be9f2="" class="score-label"> </span>
                    <span class="el-select score-select">评分:</span>
                    <span class="el-select score-select">数值:</span>
                  </div>
                  <div
                    class="score-row"
                    v-for="item in scoreItems"
                    :key="item.label"
                    style="margin-bottom: 4px"
                  >
                    <span class="score-label"
                      >{{ item.label }}<span v-if="item.required" class="required">*</span></span
                    >
                    <el-input v-model="item.score" class="score-select" />
                    <!-- <el-input v-model="item.value" class="score-select" /> -->
                    <el-select
                      v-model="item.value"
                      class="value-select"
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择或输入数值"
                    >
                      <el-option v-for="val in item.values" :key="val" :label="val" :value="val" />
                    </el-select>
                    <!-- <el-select v-model="item.value" class="value-select">
                      <el-option v-for="val in item.values" :key="val" :label="val" :value="val" />
                    </el-select> -->
                    <a class="choose-value" href="#" @click.prevent="openValueDialog(item)"
                      >选择数值</a
                    >
                  </div>
                </div>
                <div class="score-result">
                  <span style="margin-right: 20px">评分分级</span>
                  <span class="score-value">{{ ratingGrading }}</span>
                  <span class="calc-link">计算结果</span>
                </div>
                <div class="score-tag">
                  <span>评分标签</span>
                  <span class="score-desc">{{ ratingLabels }}</span>
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

            <div class="score-rule-box">
              <div class="rule-title">临床评分表规则<span class="required">*</span></div>
              <div class="rule-table">
                <div class="rule-thead">
                  <div class="item-box">规则属性</div>
                  <div class="item-box">规则类型</div>
                  <div class="item-box">规则设置</div>
                  <div class="item-box">增加操作</div>
                </div>
                <div class="rule-row" v-for="rule in rules" :key="rule.id">
                  <div class="flex-1">
                    <el-select
                      v-model="rule.attr"
                      class="rule-select"
                      placeholder="规则属性"
                      @change="(e) => handleRuleChange(e, rule, '规则属性')"
                    >
                      <el-option
                        v-for="attr in rule.ruleAttrsDdta"
                        :key="attr"
                        :label="attr"
                        :value="attr"
                      />
                    </el-select>
                  </div>
                  <div class="flex-1">
                    <el-select
                      v-model="rule.type"
                      class="rule-select"
                      placeholder="规则类型"
                      @change="(e) => handleRuleChange(e, rule, '规则类型')"
                    >
                      <el-option
                        v-for="type in rule.ruleTypes"
                        :key="type"
                        :label="type"
                        :value="type"
                      />
                    </el-select>
                  </div>
                  <div class="flex-1">
                    <el-button
                      type="primary"
                      :disabled="!!(rule.rule && rule.rule.rules)"
                      @click="openRuleDialog(rule)"
                      >{{ rule.rule && rule.rule.rules ? '已设置' : '设置规则' }}</el-button
                    >
                  </div>
                  <div class="flex-1">
                    <div
                      class="add"
                      @click="addRule(index)"
                      :class="{ disabled: rules.length == ruleAttrsDdta.length + 2 }"
                      :style="{
                        opacity: rules.length == ruleAttrsDdta.length + 2 ? 0.5 : 1,
                        cursor:
                          rules.length == ruleAttrsDdta.length + 2 ? 'not-allowed' : 'pointer',
                      }"
                    >
                      +
                    </div>
                    <div
                      class="remove"
                      @click="removeRule(index)"
                      :class="{ disabled: rules.length <= 1 }"
                      :style="{
                        opacity: rules.length <= 1 ? 0.5 : 1,
                        cursor: rules.length <= 1 ? 'not-allowed' : 'pointer',
                      }"
                    >
                      -
                    </div>
                  </div>
                </div>
              </div>
              <div class="applicationOfRules">
                <el-button
                  class="apply-rule-btn"
                  :icon="Refresh"
                  round
                  style="
                    background-color: rgba(64, 158, 255, 0.1);
                    border-color: rgba(64, 158, 255, 0.5);
                    color: #409eff;
                  "
                  @click="applyRules"
                >
                  应用规则</el-button
                >
                <el-button
                  class="apply-rule-btn"
                  :icon="Refresh"
                  round
                  style="
                    background-color: rgba(64, 158, 255, 0.1);
                    border-color: rgba(64, 158, 255, 0.5);
                    color: #409eff;
                  "
                  @click="saveRuleSettings"
                >
                  保存规则设置</el-button
                >
              </div>
            </div>
          </div>

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
                  <span class="test-name">{{ historyItem.testName }}</span>
                  <span class="value">{{ historyItem.value }}</span>
                  <el-radio v-model="selectedHistoryIndex" :label="index" class="radio-btn">
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

          <el-dialog
            v-model="ruleDialogVisible"
            :title="`设置${dialogType}规则`"
            width="600px"
            :before-close="handleCloseRuleDialog"
          >
            <div
              class="rule-dialog-content"
              v-if="dialogType === '范围编码' || dialogType === '范围标签'"
            >
              <div
                class="rule-header"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 20px 40px;
                "
              >
                <span class="range-label">范围介于</span>
                <span class="score-label">对应评分</span>
              </div>
              <div class="rule-items">
                <div
                  class="rule-item"
                  v-for="(ruleItem, index) in currentRuleItems"
                  :key="index"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 18px 40px;
                  "
                >
                  <div class="range-inputs" style="display: flex; align-items: center">
                    <el-input
                      v-model="ruleItem.minValue"
                      placeholder="请输入"
                      class="range-input"
                      style="width: 90px; margin-right: 6px"
                    />
                    <span class="range-separator" style="margin: 0 6px">到</span>
                    <el-input
                      v-model="ruleItem.maxValue"
                      placeholder="请输入"
                      class="range-input"
                      style="width: 90px; margin-left: 6px"
                    />
                  </div>
                  <div class="arrow" style="">→</div>
                  <div class="score-input" style="display: flex; align-items: center">
                    <el-input
                      v-model="ruleItem.score"
                      placeholder="请输入"
                      class="score-input-field"
                      style="width: 90px"
                    />
                  </div>
                  <div class="action-buttons" style="margin-left: 16px">
                    <div class="flex-1" style="display: flex; align-items: center">
                      <div class="add-icon" @click="addRuleItem(index)">+</div>
                      <div class="remove-icon" @click="removeRuleItem(index)">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rule-dialog-content" v-if="dialogType === '数字编码'">
              <div
                class="rule-header"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 20px 40px;
                "
              >
                <span style="flex: 1; text-align: center">原数值</span>
                <span style="flex: 1; text-align: center">对应评分</span>
              </div>
              <div class="rule-items">
                <div
                  class="rule-item"
                  v-for="(item, idx) in numberRuleItems"
                  :key="idx"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 18px 40px;
                  "
                >
                  <el-input
                    v-model="item.originValue"
                    placeholder="请输入"
                    style="width: 120px; margin-right: 12px"
                  />
                  <span style="margin: 0 12px">→</span>
                  <el-input
                    v-model="item.scoreValue"
                    placeholder="请输入"
                    style="width: 120px; margin-left: 12px"
                  />
                  <div style="display: flex; align-items: center; margin-left: 16px">
                    <div
                      class="add-icon"
                      @click="addNumberRuleItem(idx)"
                      style="cursor: pointer; font-size: 22px; margin-right: 8px"
                    >
                      +
                    </div>
                    <div
                      class="remove-icon"
                      @click="removeNumberRuleItem(idx)"
                      style="cursor: pointer; font-size: 22px"
                    >
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rule-dialog-content" v-if="dialogType === '公式计算'">
              <div style="display: flex; align-items: center; margin: 24px 0 18px 0">
                <span style="width: 60px">输出 = </span>
                <div
                  class="formula-display"
                  style="
                    padding: 8px 12px;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    background-color: #f5f7fa;
                    min-height: 32px;
                    flex: 1;
                  "
                >
                  {{ formulaString }}
                </div>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 18px">
                <span style="width: 80px">输出属性：</span>
                <el-input
                  v-model="formulaOutputAttr"
                  placeholder="评分分级"
                  disabled
                  style="width: 180px"
                />
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 18px">
                <span style="width: 80px">计算属性：</span>
                <div style="display: flex; flex-wrap: wrap; gap: 12px">
                  <el-button
                    v-for="attr in formulaAttrs"
                    :key="attr"
                    size="small"
                    :style="{
                      background: selectedFormulaAttrs.includes(attr) ? '#409eff' : '#f5f7fa',
                      color: selectedFormulaAttrs.includes(attr) ? '#fff' : '#909399',
                      borderColor: selectedFormulaAttrs.includes(attr) ? '#409eff' : '#dcdfe6',
                    }"
                    @click="toggleFormulaAttr(attr)"
                  >
                    {{ attr }}
                  </el-button>
                </div>
              </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="ruleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmRuleSettings">添加</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { Refresh } from '@element-plus/icons-vue';

const props = defineProps({
  patientData: Object,
  selectedTemplate: Object,
});
import {
  dictionaryCreate,
  dictionaryList,
  dictionaryUpdate,
  dictionaryDelete,
} from "@/api/dictionary";
import { dataList, dataCreate } from '@/api/data';
import { ElMessage, ElMessageBox } from "element-plus";
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElAlert,
  ElButton,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { ref, reactive, onMounted, computed, watch } from 'vue';
import {
  rulesData,
  getHistoryData,
  eRules,
  scoreItemsData,
} from './data.ts';
import dayjs from 'dayjs';
const scoreTime = ref('');
const valueDialogVisible = ref(false);
const ruleDialogVisible = ref(false);
const selectedHistoryIndex = ref(null);
const currentScoreItem = ref(null);
const currentHistoryData = ref([]);
const currentRule = ref(null);
const currentRuleItems = ref([]);
const currentHistoryRuleItems = ref([]);

const ruleAttrsDdta = ref([]);
const ratingGrading = ref(scoreItemsData.ratingGrading);
const ratingLabels = ref(scoreItemsData.ratingLabels);
const rulesWordCode = ref(null);

const scoreItems = reactive([]);
const historyData = ref([]);

const dialogType = ref('');
const scoreLevel = ref(7);
const initialRules = reactive(rulesData);
const rules = ref([]);

const formulaOutput = ref('');
const formulaOutputAttr = ref('评分分级');
const formulaAttrs = ref([]);
const moFormulaAttrs = ref([]);

const filterRulesTypes = (datas) => {
  datas.forEach((element) => {
    if (element.attr === '评分分级') {
      element.ruleTypes = ['公式计算'];
    } else if (element.attr === '评分标签') {
      element.ruleTypes = ['范围标签'];
    } else {
      element.ruleTypes = ['范围编码', '数字编码'];
    }
  });
};

const updateRuleAttrs = () => {
  const selectedAttrs = new Set(rules.value.map((rule) => rule.attr).filter((attr) => attr));

  rules.value.forEach((rule) => {
    rule.ruleAttrsDdta = ruleAttrsDdta.value.filter((attr) => {
      return !selectedAttrs.has(attr) || attr === rule.attr;
    });
  });
};

const initializeScoreItems = () => {
  // Use static score items from data.ts and enrich with word_code from template
  scoreItems.splice(0, scoreItems.length);

  const dictionaryList = props.selectedTemplate?.dictionaryList || [];
  const dictionaryMap = new Map(dictionaryList.map(item => [item.word_name, item]));

  const newScoreItems = scoreItemsData.list.map(staticItem => {
    const dynamicItem = dictionaryMap.get(staticItem.label);
    return {
      ...staticItem,
      word_code: dynamicItem ? dynamicItem.word_code : undefined,
    };
  });
  
  newScoreItems.forEach(item => scoreItems.push(item));

  formulaAttrs.value = scoreItems.map((item) => item.label);
  updateRuleAttrs(); // This depends on scoreItems
};

onMounted(async () => {
  rules.value = eRules;
  filterRulesTypes(rules.value);

  // Perform initial data load
  if (props.selectedTemplate && props.selectedTemplate.dictionaryList) {
    initializeScoreItems();
    await getTableCrudList();
  }
});

watch(
  () => props.selectedTemplate,
  (newTemplate, oldTemplate) => {
    // Only run if template actually changes, ignoring the initial run
    if (newTemplate && oldTemplate && newTemplate.code !== oldTemplate.code) {
      initializeScoreItems();
      resetData();
      getTableCrudList();
    }
  },
  { deep: true }
);

watch(
  () => props.patientData,
  (newPatient, oldPatient) => {
    if (newPatient && oldPatient && newPatient.caseId !== oldPatient.caseId) {
      resetData();
      scoreItems.forEach((item) => {
        item.value = '';
        item.values = [];
      });
      getTableCrudList();
    }
  },
  { deep: true }
);

const enterData = async () => {
  if (!scoreTime.value) {
    return ElMessage.error('请选择检查时间');
  }

  console.log('enterData', scoreItems);

  const formatted = dayjs(new Date(scoreTime.value)).format('YYYY-MM-DD HH:mm:ss');

  const requests = scoreItems.map((item) => {
    const valueData = {
      value: item.score,
      unit: '分',
      result: ratingLabels.value,
    };

    return dataCreate({
      case_code: props.patientData.caseId,
      template_code: props.selectedTemplate.code,
      word_code: item.word_code,
      check_time: formatted,
      value: JSON.stringify(valueData),
    });
  });

  try {
    const results = await Promise.all(requests);

    const allSuccess = results.every((res) => res.data?.code === 200);

    if (allSuccess) {
      ElMessage.success('录入成功');
    } else {
      ElMessage.error('部分数据录入失败');
    }
  } catch (error) {
    console.error('Failed to create data', error);
    ElMessage.error('录入失败');
  }
};

const getTableCrudList = async () => {
  try {
    if (
      props.patientData?.caseId &&
      props.selectedTemplate?.code &&
      scoreItems &&
      scoreItems.length > 0
    ) {
      let word_codes = scoreItems.map((item) => item['word_code']);

      const requests = word_codes.map((word_code) =>
        dataList({
          case_code: props.patientData.caseId,
          template_code: props.selectedTemplate.code,
          word_code: word_code,
        })
      );

      const results = await Promise.all(requests);

      const groupedByWordName = {};
      results.forEach((res) => {
        if (res.data?.count > 0 && res.data?.results) {
          res.data.results.forEach((item) => {
            if (!groupedByWordName[item.word_name]) {
              groupedByWordName[item.word_name] = [];
            }
            groupedByWordName[item.word_name].push(item);
          });
        }
      });

      const guldwordNme = [];
      for (const key in groupedByWordName) {
        if (Object.prototype.hasOwnProperty.call(groupedByWordName, key)) {
          groupedByWordName[key].forEach((item) => {
            const testName = item.word_name;
            if (!guldwordNme[testName]) {
              guldwordNme[testName] = [];
            }
            guldwordNme[testName].push({
              date: item.check_time,
              testName: item.word_name,
              value: item.value,
              case_code: item.case_code,
            });
          });
        }
      }

      historyData.value = guldwordNme;

      scoreItems.forEach((item) => {
        if (guldwordNme[item.label]) {
          const values = guldwordNme[item.label].map((entry) => entry.value);
          const uniqueValues = [...new Set(values)];
          item.values = uniqueValues;
          item.value = uniqueValues[0] ? uniqueValues[0] : '';
        }
      });
    } else {
    }
  } catch (error) {
    console.error('Failed to fetch dictionary', error);
    ElMessage.error('获取系统词典失败');
  }
};

const fetchDictionary = async () => {
  try {
    const res = await dictionaryList({ page: 1, page_size: 99999 });
    if (res.data?.code === 200 && res.data?.data?.list) {
      const dictionaryMap = res.data.data.list.find((item) => item.id === 355);
      if (dictionaryMap && dictionaryMap.score_func) {
        rulesWordCode.value = dictionaryMap.word_code;
        currentHistoryRuleItems.value = dictionaryMap.score_func;
        filterdictionaryMap(dictionaryMap.score_func);
      } else {
      }
    }
  } catch (error) {
    console.error('Failed to fetch dictionary', error);
    ElMessage.error('获取系统词典失败');
  }
};

const filterdictionaryMap = (scoreFunc) => {
  const JSONdictionary = eRules;

  rules.value.forEach((item, index) => {
    const findAttr = JSONdictionary.find((attr) => attr.attr === item.attr);
    if (findAttr && findAttr.type) {
      if (findAttr.rule && findAttr.rule.rules) {
        rules.value[index] = findAttr;
      }
    }
  });
};

const saveRuleSettings = async () => {
  let scoreFuncs = JSON.parse(currentHistoryRuleItems.value);
  scoreFuncs.forEach((item, index) => {
    let findscoreFunc = rules.value.find((attr) => attr.attr === item.attr);

    if (findscoreFunc && findscoreFunc.rule && findscoreFunc.rule.rules)
      scoreFuncs[index] = findscoreFunc;
  });

  try {
    const ruleData = {
      word_name: '计算规则数据',
      word_eng: '',
      word_short: '',
      word_class: '临床信息',
      word_apply: '临床',
      word_belong: '',
      data_type: '',
      input_type: 'single',
      options: '恩替卡韦 ,替诺福韦 ,无 ,其他',
      followup_options: {},
      is_score: 0,
      score_func: JSON.stringify(scoreFuncs),
      has_unit: 0,
      unit: null,
    };

    const res = await dictionaryUpdate({ word_code: rulesWordCode.value }, ruleData);
    if (res.data?.code === 200) {
      ElMessage.success('规则保存成功');
    } else {
      ElMessage.error('规则保存失败');
    }
  } catch (error) {
    console.error('Failed to save rules', error);
    ElMessage.error('保存规则失败');
  }
};

const handleCloseRuleDialog = () => {
  ruleDialogVisible.value = false;
};

const numberRuleItems = ref([
  { originValue: '', scoreValue: '' },
  { originValue: '', scoreValue: '' },
  { originValue: '', scoreValue: '' },
]);

const addRule = (index) => {
  if (rules.value.length >= ruleAttrsDdta.value.length + 2) {
    return;
  }

  const newRule = {
    attr: '',
    type: '',
    ruleAttrsDdta: [],
    ruleTypes: [],
  };

  rules.value.splice(index + 1, 0, newRule);

  updateRuleAttrs();

  filterRulesTypes(rules.value);
};

const removeRule = (index) => {
  if (rules.value.length > 1) {
    rules.value.splice(index, 1);

    updateRuleAttrs();

    filterRulesTypes(rules.value);
  }
};

const handleRuleChange = (e, item, type) => {
  if (type === '规则属性') {
    item.type = '';
  }
  if (e === '评分分级') {
    item.ruleTypes = ['公式计算'];
  } else if (e === '评分标签') {
    item.ruleTypes = ['范围标签'];
  } else if (e !== '评分分值' && e != '评分编码') {
    item.ruleTypes = ['范围编码', '数字编码'];
  }
  currentRule.value = item;
  updateRuleAttrs();
};

const openValueDialog = (item) => {
  currentScoreItem.value = item;
  currentHistoryData.value = historyData.value[item.label] || [];
  selectedHistoryIndex.value = null;
  valueDialogVisible.value = true;
};

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

const openRuleDialog = (rule) => {
  currentRule.value = rule;
  dialogType.value = rule.type;
  if (rule.type === '范围编码' || rule.type === '范围标签') {
    if (rule.rule && rule.rule.rules) currentRuleItems.value = rule.rule.rules;
    else {
      rule.rule = { name: '范围编码', rules: [{ minValue: '', maxValue: '', score: '' }] };
      currentRuleItems.value = [{ minValue: '', maxValue: '', score: '' }];
    }
  }
  if (rule.type === '数字编码') {
    if (rule.rule && rule.rule.rules) {
      numberRuleItems.value = rule.rule.rules;
    } else {
      rule.rule = { name: '范围编码', numberRuleItems: [{ originValue: '', scoreValue: '' }] };
      numberRuleItems.value = [{ originValue: '', scoreValue: '' }];
    }
  }
  if (rule.type === '公式计算') {
    formulaAttrs.value = scoreItems.map((item) => item.label);

    moFormulaAttrs.value = rule.formulaAttrs;
    selectedFormulaAttrs.value = rule.rule && rule.rule.rules ? rule.rule.rules.split('+') : [];
    if (selectedFormulaAttrs.value && selectedFormulaAttrs.value.length)
      formulaString.value = selectedFormulaAttrs.value.join('+');
  }

  ruleDialogVisible.value = true;
};

const addRuleItem = (index) => {
  const newItem = { minValue: '', maxValue: '', score: '' };
  currentRuleItems.value.splice(index + 1, 0, newItem);
};

const removeRuleItem = (index) => {
  if (currentRuleItems.value.length > 1) {
    currentRuleItems.value.splice(index, 1);
  }
};

const confirmRuleSettings = () => {
  let eventRules = rules.value.find((item) => item.attr === currentRule.value.attr);
  let Rule = {};
  if (dialogType.value === '范围编码' || dialogType.value === '范围标签') {
    Rule = {
      name: dialogType.value,
      rules: currentRuleItems.value,
    };
  }
  if (dialogType.value === '数字编码') {
    Rule = {
      name: dialogType.value,
      rules: numberRuleItems.value,
    };
  }
  if (dialogType.value === '公式计算') {
    Rule = {
      name: dialogType.value,
      rules: formulaString.value,
    };
    eventRules.formulaAttrs = selectedFormulaAttrs.value;
  }

  eventRules.rule = Rule;

  ruleDialogVisible.value = false;
};

const addNumberRuleItem = (idx) => {
  numberRuleItems.value.splice(idx + 1, 0, { originValue: '', scoreValue: '' });
};
const removeNumberRuleItem = (idx) => {
  if (numberRuleItems.value.length > 1) numberRuleItems.value.splice(idx, 1);
};

const selectedFormulaAttrs = ref([]);

const formulaString = ref('请输入公式');

const toggleFormulaAttr = (attr) => {
  const index = selectedFormulaAttrs.value.indexOf(attr);
  if (index > -1) {
    selectedFormulaAttrs.value.splice(index, 1);
  } else {
    selectedFormulaAttrs.value.push(attr);
  }

  formulaString.value = selectedFormulaAttrs.value.join('+') || '请输入公式';
};

const applyRules = () => {
  scoreItems.forEach((scoreItem) => {
    const matchedRule = rules.value.find((rule) => rule.attr === scoreItem.label);

    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type == '范围编码' &&
      matchedRule.rule &&
      matchedRule.rule.rules
    ) {
      const ruleItems = matchedRule.rule.rules;
      const itemValue = parseFloat(scoreItem.value);

      if (!scoreItem.value || isNaN(itemValue)) {
        return;
      }

      const matchedRuleItem = ruleItems.find((ruleItem) => {
        const minValue = parseFloat(ruleItem.minValue);
        const maxValue = parseFloat(ruleItem.maxValue);

        return itemValue >= minValue && itemValue <= maxValue;
      });

      if (matchedRuleItem) {
        scoreItem.score = matchedRuleItem.score;
      }
    }

    if (
      matchedRule &&
      matchedRule.type &&
      matchedRule.type == '数字编码' &&
      matchedRule.rule &&
      matchedRule.rule.rules
    ) {
      const ruleItems = matchedRule.rule.rules;
      const itemValue = parseFloat(scoreItem.value);

      if (!scoreItem.value || isNaN(itemValue)) {
        return;
      }

      const matchedRuleItem = ruleItems.find((ruleItem) => {
        const minValue = parseFloat(ruleItem.originValue);
        const maxValue = parseFloat(ruleItem.scoreValue);

        return itemValue == minValue;
      });

      if (matchedRuleItem) {
        scoreItem.score = matchedRuleItem.scoreValue;
      }
    }
  });

  rules.value.forEach((item) => {
    if (item.attr === '评分分级') {
      if (item.formulaAttrs) {
        let values = 0;
        item.formulaAttrs.forEach((At) => {
          const matchedRule = scoreItems.find((score) => score.label === At);
          if (matchedRule && matchedRule.score) {
            values = values + Number(matchedRule.score);
          }
        });
        ratingGrading.value = values;
      }
    }
    if (item.attr === '评分标签') {
      const matchedRule = rules.value.find((rule) => rule.attr === '评分标签');

      if (matchedRule && matchedRule.rule && matchedRule.rule.rules) {
        const ruleItems = matchedRule.rule.rules;

        const matchedRuleItem = ruleItems.find((ruleItem) => {
          const minValue = parseFloat(ruleItem.minValue);
          const maxValue = parseFloat(ruleItem.maxValue);

          return ratingGrading.value >= minValue && ratingGrading.value <= maxValue;
        });

        if (matchedRuleItem) {
          ratingLabels.value = matchedRuleItem.score;
        }
      }
    }
  });
};

const resetData = () => {
  ratingGrading.value = null;
  ratingLabels.value = null;
  scoreItems.forEach((item) => {
    item.score = null;
    item.value = '';
  });
};

const emit = defineEmits(['go-back-to-template']);
</script>

<style scoped lang="scss">
@import url('./BloodRoutineEntry.scss');
::v-deep(.custom-dialog .el-dialog__headerbtn) {
  width: 40px;
  height: 40px;
  top: 10px;
  right: 10px;
}

::v-deep(.custom-dialog .el-dialog__close) {
  font-size: 24px; /* 默认是16px，可以改大 */
}

::v-deep(.el-dialog__header) {
  border-bottom: 1px solid #e5e5e5;
}
::v-deep(.el-radio__label) {
  display: none !important;
}
</style> 