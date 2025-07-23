<template>
  <div class="pdata-container">
    <div class="main-content">
      <!-- 左侧评分表单 -->
      <div class="score-form">
        <el-form label-width="80px" label-position="left">
          <el-form-item label="评分时间">
            <el-date-picker v-model="scoreTime" type="datetime" placeholder="2024-XX-XX 13:20" />
          </el-form-item>
          <div class="">Child评分 <span class="required">*</span></div>

          <div
            class="score-table"
            style="margin-top: 40px"
            v-if="scoreItems && scoreItems.length > 0"
          >
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
              <span class="score-label">{{ item.word_name }}<span class="required">*</span> </span>

              <el-input
                v-model="item.score"
                class="score-select"
                v-if="!item.word_name.includes('评分')"
              />

              <el-select
                v-model="item.value"
                class="value-select"
                v-if="!item.word_name.includes('评分')"
              >
                <el-option v-for="val in item.values" :key="val" :label="val" :value="val" />
              </el-select>
              <a
                v-if="!item.word_name.includes('评分')"
                class="choose-value"
                href="#"
                @click.prevent="openValueDialog(item)"
                >选择数值</a
              >
              <div
                class=""
                style="height: 45px; display: flex; align-items: center; width: 100px"
                v-if="item.word_name.includes('评分') && !item.word_name.includes('标签')"
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
                v-if="item.word_name.includes('评分') && item.word_name.includes('标签')"
              >
                {{ item.score }}
              </div>
              <div
                class=""
                style="height: 45px; display: flex; align-items: center; width: 100px"
                v-if="item.word_name.includes('评分') && !item.word_name.includes('标签')"
              >
                计算结果
              </div>
            </div>
          </div>

          <div class="form-actions" v-if="scoreItems && scoreItems.length > 0">
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
        <div class="rule-title" style="margin-left: 40px">
          临床评分表规则<span class="required">*</span>
        </div>
        <el-button
          type="primary"
          round
          style="padding: 10px 20px; border-radius: 20px; margin-left: 40px"
          @click="ruleDialogVisible = true"
          >读取量表规则</el-button
        >
        <el-dialog v-model="ruleDialogVisible" title="选择量表" width="400px">
          <div style="width: 100%; margin-top: 10px">
            <div
              class="value-item"
              v-for="(item, idx) in childRatingList"
              :key="idx"
              :class="{ selected: selectedRuleIndex === idx }"
              @click="selectedRuleIndex = idx"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                cursor: pointer;
              "
            >
              <span class="date" style="font-weight: bold">{{ item.template_code }}</span>
              <span class="test-name" style="margin-left: 12px">{{ item.name }}</span>
              <el-radio v-model="selectedRuleIndex" :label="idx" style="margin-right: 12px">
              </el-radio>
            </div>
          </div>
          <template #footer>
            <el-button @click="ruleDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmSelectRule">确定</el-button>
          </template>
        </el-dialog>
        <!-- 这里可以添加实际表单内容 -->
        <div class="" v-if="scoreItems && scoreItems.length > 0">
          <ratingRules
            :icon="'Refresh'"
            :nitialRules="mockInitialRules"
            :selectionRules="mockSelectionRules"
            @settings="onSettings"
            :applyTitle="'应用规则'"
          />
        </div>
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
import { ElMessage, ElLoading } from 'element-plus';
import ratingRules from '@/components/ratingRules/index.vue';
import { childRatingLists } from './data';
import { applyRules } from './baseFunction';

const rules = ref([]);
const valueDialogVisible = ref(false);
const selectedHistoryIndex = ref(null);
const currentScoreItem = ref(null);
const currentHistoryData = ref([]);
const scoreTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const ratingLabels = ref('');

// child评分列表
const childRatingList = ref(childRatingLists);
/**左边要参与评分的数据
 * 注意 逻辑如果需要手动配置一个加入scoreItems中 右边如果需要也是要加入到mockInitialRules 中
 *  word_code: 'tj01',    word_name: '评分分级',
 * word_code: 'tj02',    word_name: '评分等级',
 * 这两条如果数据库没有要手动添加，word_code必须唯一，word_name必须唯一
 */
const scoreItems = ref([]);
// 规则弹窗相关
const ruleDialogVisible = ref(false);
const selectedRuleIndex = ref(null);
//右边计算逻辑列表
const mockInitialRules = ref([]);
// 检查数据 给选择数值弹窗用
const historyData = ref({});
//点击选取量表规则
function confirmSelectRule() {
  if (selectedRuleIndex.value !== null) {
    let rulesList = childRatingList.value[selectedRuleIndex.value].rulesList;
    mockInitialRules.value = rulesList;
    filterScoreItems(rulesList);
    ruleDialogVisible.value = false;
  }
}
//右边计算规则的词条反推左边的数据
const filterScoreItems = async (data) => {
  scoreItems.value = data.map((item) => ({
    word_code: item.word_code,
    word_name: item.word_name,
    value: '',
    values: [],
    score: null,
  }));
  concurrentRequestHistoricalEntryData(data);
};

// 并发请求历史词条数据
const concurrentRequestHistoricalEntryData = (data) => {
  // 添加loading效果
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载历史数据...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  // 创建所有词条的并发请求Promise数组
  const promises = data.map((item) => {
    return new Promise((resolve) => {
      const delay = Math.random() * 1000 + 500;
      setTimeout(() => {
        // 模拟异步请求回来数据
        const data = [
          {
            date: '2025-03-02 15:12',
            word_name: item.word_name,
            value: 1.5,
            word_code: item.word_code,
          },
          {
            date: '2025-03-15 12:10',
            word_name: item.word_name,
            value: 1.2,
            word_code: item.word_code,
          },
          {
            date: '2025-03-22 20:33',
            word_name: item.word_name,
            value: 1.5,
            word_code: item.word_code,
          },
          {
            date: '2025-04-01 11:29',
            word_name: item.word_name,
            value: 1.0,
            word_code: item.word_code,
          },
        ];
        resolve(data);
      }, delay);
    });
  });

  // 等待所有并发请求完成 构建历史词条数据
  Promise.all(promises)
    .then((data) => {
      loading.close();
      console.log('所有历史数据加载完成', data);
      // 构建 historyData.value，按 word_code 分组
      historyData.value = {};
      data.forEach((itemArray) => {
        if (itemArray && itemArray.length > 0) {
          const wordCode = itemArray[0].word_code;
          historyData.value[wordCode] = itemArray;
        }
      });
      console.log('构建的历史数据分组:', historyData.value);
      scoreItems.value.forEach((item) => {
        if (item.word_name.includes('评分')) {
          return;
        }
        const itemArray = historyData.value[item.word_code];
        if (itemArray && itemArray.length > 0) {
          item.value = itemArray[0].value;
          item.values = itemArray.map((historyItem) => historyItem.value);
        }
      });

      console.log('处理后的 scoreItems:', scoreItems.value);
    })
    .catch((error) => {
      console.error('加载历史数据时出错:', error);
      loading.close();
    });
};

// 新增方法打开选择数值事件
const openValueDialog = (item) => {
  currentScoreItem.value = item;
  selectedHistoryIndex.value = null;
  valueDialogVisible.value = true;
  currentHistoryData.value = historyData.value[item.word_code] || [];
};

onMounted(() => {});

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
  applyRules(scoreItems, rules, ratingLabels);
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

//录入事件
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
// 重置事件
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
