<template>
  <div>
    <!-- {{ rules }} -->
    <div class="score-rule-box">
      <div class="rule-table">
        <div class="rule-row">
          <div class="rule-item item-th">规则属性</div>
          <div class="rule-item item-th">规则类型</div>
          <div class="rule-item item-th">规则设置</div>
          <div class="rule-item item-th">增加操作</div>
        </div>
        <div class="rule-row" v-for="(rule, idx) in rules" :key="rule.id">
          <div class="rule-item">
            <el-input
              v-model="rule.word_name"
              class="rule-select"
              placeholder="规则属性"
              readonly
              :value="rule.word_name ? `${rule.word_name}（${rule.word_code}）` : ''"
              @click="openAttrSearchDialog(rule)"
              :suffix-icon="Search"
              @suffix-click="openAttrSearchDialog(rule)"
            />
          </div>
          <div class="rule-item">
            <el-select
              v-model="rule.type"
              class="rule-select"
              placeholder="规则类型"
              @change="(e) => handleRuleChange(e, rule, '规则类型')"
            >
              <el-option
                v-for="type in getRuleTypeOptions(rule)"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
          </div>
          <div class="rule-item">
            <el-button type="primary" @click="openRuleDialog(rule)">
              {{
                rule?.rule &&
                ((Array.isArray(rule.rule.rules) && rule.rule.rules.length > 0) ||
                  (Array.isArray(rule.rule.selectedAttrs) && rule.rule.selectedAttrs.length > 0) ||
                  rule.rule.function)
                  ? '已设置'
                  : '去设置'
              }}
            </el-button>
          </div>
          <div class="rule-item">
            <div class="add" @click="addRule(index)">+</div>
            <div class="remove" @click="removeRule(index)">-</div>
          </div>
        </div>
      </div>
      <div class="applicationOfRules" :class="`justify-content-${props.buttonAlign}`">
        <!-- // 在应用规则按钮上添加点击事件 -->

        <el-button
          v-if="props.icon"
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
          {{ props.applyTitle }}</el-button
        >
        <el-button
          v-else
          class="apply-rule-btn"
          round
          style="
            background-color: rgba(64, 158, 255, 0.1);
            border-color: rgba(64, 158, 255, 0.5);
            color: #409eff;
          "
          @click="applyRules"
        >
          {{ props.applyTitle }}</el-button
        >
        
        <!-- 保存按钮 -->
        <el-button
          v-if="props.showSaveButton"
          class="save-rule-btn"
          type="success"
          round
          :loading="props.saving"
          style="
            background-color: rgba(103, 194, 58, 0.1);
            border-color: rgba(103, 194, 58, 0.5);
            color: #67c23a;
          "
          @click="saveRules"
        >
          {{ props.saving ? '保存中...' : props.saveButtonText }}
        </el-button>
      </div>
    </div>
    <!-- 设置范围编码规则弹窗 -->
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
            <div class="arrow" style=""><img src="@/assets/jt21.png" alt="" /></div>
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
          <div>计算属性：</div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; flex: 1;">
            <div
              class=""
              v-for="attr in formulaAttrs"
              style="margin-bottom: 8px; margin-right: 6px"
            >
              <el-button
                v-if="!attr.word_name.includes('评分')"
                :key="attr.word_code"
                size="small"
                :style="{
                  background: selectedFormulaAttrs.includes(attr.word_code) ? '#409eff' : '#f5f7fa',
                  color: selectedFormulaAttrs.includes(attr.word_code) ? '#fff' : '#909399',
                  borderColor: selectedFormulaAttrs.includes(attr.word_code)
                    ? '#409eff'
                    : '#dcdfe6',
                }"
                @click="toggleFormulaAttr(attr)"
              >
                {{ `${attr.word_name}+${attr.word_code}` }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 新增代数换算弹窗内容 -->
      <div class="rule-dialog-content" v-if="dialogType === '代数换算'">
        <div class="algebraic-conversion-container">
          <div class="conversion-header">
            <div class="header-item">
              <span>选择变换函数：</span>
              <el-select
                v-model="algebraicFunction"
                placeholder="请选择"
                style="width: 200px; margin-left: 10px"
              >
                <el-option label="对数" value="对数" />
                <el-option label="平方" value="平方" />
                <el-option label="指数" value="指数" />
                <el-option label="倒数" value="倒数" />
              </el-select>
            </div>
          </div>
          <div class=" " style="margin-top: 20px">
            <span>{{ getFormulaPreview() }}</span>
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

    <!-- 规则属性搜索弹窗 -->
    <el-dialog
      v-model="attrSearchDialogVisible"
      title="选择规则属性"
      width="800px"
      :before-close="handleCloseAttrSearchDialog"
    >
      <div class="attr-search-container">
        <div class="search-header">
          <el-input
            v-model="attrSearchKeyword"
            placeholder="输入词条名称、编号、英文缩写或类型进行搜索..."
            clearable
            prefix-icon="Search"
            style="width: 100%; margin-bottom: 20px;"
            @input="handleAttrSearch"
          />
          <el-text v-if="attrSearchKeyword" type="info" style="margin-bottom: 10px; display: block;">
            找到 {{ filteredAttrOptions.length }} 个词条
          </el-text>
        </div>
        
        <div class="attr-list">
          <el-table
            :data="filteredAttrOptions"
            style="width: 100%"
            max-height="400"
            @row-click="selectAttr"
            highlight-current-row
          >
            <el-table-column prop="word_name" label="词条名称" width="200" />
            <el-table-column prop="word_code" label="词条编号" width="150" />
            <el-table-column prop="word_short" label="英文缩写" width="120" />
            <el-table-column prop="word_class" label="词条类型" width="120" />
            <el-table-column prop="word_apply" label="词条应用" />
          </el-table>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="attrSearchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAttrSelection">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Refresh, Search } from '@element-plus/icons-vue';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, computed, watch } from 'vue';
import { dictionaryList } from '@/api/dictionary';

const props = defineProps({
  nitialRules: {
    type: Array,
    default: () => [
      {
        word_name: '',
        word_code: '',
      },
    ],
  },
  selectionRules: {
    type: Array,
    default: () => [],
  },
  extrasRules: {
    type: Array,
    default: () => [],
  },
  applyTitle: {
    type: String,
    default: '应用规则',
  },
  icon: {
    type: String,
    default: '',
  },
  buttonAlign: {
    type: String,
    default: 'center',
  },
  // 新增保存相关props
  currentItem: {
    type: Object,
    default: null,
  },
  showSaveButton: {
    type: Boolean,
    default: false,
  },
  saveButtonText: {
    type: String,
    default: '保存评分规则',
  },
  saving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['settings', 'save']);
const ruleDialogVisible = ref(false);
const currentRule = ref(null);
const currentRuleItems = ref([]);
const ruleTypeOptions = ['范围编码', '数字编码', '公式计算', '范围标签', '代数换算'];
const ruleAttrsDdta = ref([]);

// 属性搜索相关
const attrSearchDialogVisible = ref(false);
const attrSearchKeyword = ref('');
const currentSelectingRule = ref(null);
const selectedAttr = ref(null);

const rules = ref([]);

const dialogType = ref('');
const formulaOutputAttr = ref('评分分级');

// 将 formulaAttrs 改为从 rules 中计算得出
const formulaAttrs = computed(() => {
  return rules.value.filter((rule) => rule.word_code && rule.word_name);
});

const moFormulaAttrs = ref([]);

// 获取所有词条列表
const fetchAllDictionaryItems = async () => {
  try {
    const response = await dictionaryList({ page: 1, page_size: 99999 });
    if (response.data?.code === 200 && response.data?.data?.list) {
      // 获取所有词条作为可选属性
      const allItems = response.data.data.list;
      console.log('获取到所有词条:', allItems.length);
      return allItems;
    }
  } catch (error) {
    console.error('获取词条列表失败:', error);
  }
  return [];
};

// 将 selectedFormulaAttrs 改为从 rules 中计算得出
const selectedFormulaAttrs = computed(() => {
  if (!currentRule.value || !currentRule.value.rule) return [];
  return currentRule.value.rule.selectedAttrs || [];
});

const formulaString = computed(() => {
  if (selectedFormulaAttrs.value.length === 0) return '';

  const attrNames = selectedFormulaAttrs.value.map((code) => {
    const attr = rules.value.find((item) => item.word_code === code);
    console.log('转换为对应的 word_name ', code, moFormulaAttrs.value);
    return attr ? attr.word_name : code;
  });
  return attrNames.join(' + ');
});

const numberRuleItems = ref([{ originValue: '', scoreValue: '' }]);

const algebraicFunction = ref('对数');

// 过滤后的属性选项
const filteredAttrOptions = computed(() => {
  if (!attrSearchKeyword.value.trim()) {
    return moFormulaAttrs.value;
  }

  const keyword = attrSearchKeyword.value.toLowerCase().trim();
  
  return moFormulaAttrs.value.filter(item => {
    return (
      // 搜索词条名称
      item.word_name?.toLowerCase().includes(keyword) ||
      // 搜索词条编号
      item.word_code?.toLowerCase().includes(keyword) ||
      // 搜索英文缩写
      item.word_short?.toLowerCase().includes(keyword) ||
      // 搜索词条类型
      item.word_class?.toLowerCase().includes(keyword) ||
      // 搜索词条应用
      item.word_apply?.toLowerCase().includes(keyword) ||
      // 搜索英文名称
      item.word_eng?.toLowerCase().includes(keyword)
    );
  });
});

watch(
  () => props.selectionRules,
  async (newSelectionRules) => {
    console.log('评分规则组件接收到selectionRules:', newSelectionRules);
    // 获取所有词条列表
    const allItems = await fetchAllDictionaryItems();
    // 合并当前评分词条和所有可用词条
    moFormulaAttrs.value = [...newSelectionRules, ...props.extrasRules, ...allItems];
    console.log('设置moFormulaAttrs:', moFormulaAttrs.value.length);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.nitialRules,
  (newNitialRules) => {
    if (newNitialRules && newNitialRules.length > 0) {
      rules.value = [...newNitialRules, ...props.extrasRules];
      if (
        rules.value.length === 2 &&
        rules.value.some(
          (item) =>
            item.word_name && item.word_name.includes('评分') && !item.word_name.includes('标签')
        ) &&
        rules.value.some(
          (item) =>
            item.word_name && item.word_name.includes('评分') && item.word_name.includes('标签')
        )
      ) {
        rules.value.unshift({
          word_name: '',
          word_code: '',
        });
      }
    } else {
      rules.value = [
        {
          word_name: '',
          word_code: '',
        },
      ];
    }
  },
  { immediate: true, deep: true }
);

const getFormulaPreview = () => {
  if (!currentRule.value || !currentRule.value.word_name) {
    return '请先选择规则属性';
  }

  const attrName = currentRule.value.word_name;
  const functionMap = {
    对数: `Log(${attrName})`,
    平方: `${attrName}²`,
    指数: `e^${attrName}`,
    倒数: `1/${attrName}`,
  };

  return `${attrName} = ${functionMap[algebraicFunction.value] || ''}`;
};

const saveRuleSettings = async () => {
  if (!checkDataFormat(rules.value)) {
    return;
  }
  emit('settings', rules.value);
};

const openRuleDialog = (rule) => {
  currentRule.value = rule;
  dialogType.value = rule.type;

  if (!rule.word_code) {
    ElMessage.error('请选择规则属性');
    return;
  }

  if (!rule.type) {
    ElMessage.error('请选择规则类型');
    return;
  }

  if (rule.type === '范围编码' || rule.type === '范围标签') {
    currentRuleItems.value = rule.rule?.rules || [{ minValue: '', maxValue: '', score: '' }];
  } else if (rule.type === '数字编码') {
    numberRuleItems.value = rule.rule?.rules || [{ originValue: '', scoreValue: '' }];
  } else if (rule.type === '公式计算') {
    // selectedFormulaAttrs 现在是计算属性，不需要手动设置
    // selectedFormulaAttrs.value = rule.rule?.selectedAttrs || [];
  } else if (rule.type === '代数换算') {
    algebraicFunction.value = rule.rule?.function || '对数';
  }

  ruleDialogVisible.value = true;
};

// 打开属性搜索弹窗
const openAttrSearchDialog = async (rule) => {
  currentSelectingRule.value = rule;
  attrSearchKeyword.value = '';
  selectedAttr.value = null;
  
  // 重新获取最新的词条列表
  const allItems = await fetchAllDictionaryItems();
  moFormulaAttrs.value = [...props.selectionRules, ...props.extrasRules, ...allItems];
  console.log('打开属性搜索弹窗，可用词条数量:', moFormulaAttrs.value.length);
  
  attrSearchDialogVisible.value = true;
};

// 处理属性搜索
const handleAttrSearch = () => {
  // 搜索是通过计算属性实时进行的，这里可以添加额外的搜索逻辑
};

// 选择属性
const selectAttr = (row) => {
  selectedAttr.value = row;
};

// 确认属性选择
const confirmAttrSelection = () => {
  if (!selectedAttr.value) {
    ElMessage.warning('请选择一个属性');
    return;
  }

  if (!currentSelectingRule.value) {
    ElMessage.error('选择规则对象不存在');
    return;
  }

  // 检查是否已存在相同的属性
  const existingRule = rules.value.find((r) => r.word_code === selectedAttr.value.word_code && r.id !== currentSelectingRule.value.id);
  if (existingRule) {
    ElMessage.error('该规则属性已存在，请选择其他属性');
    return;
  }

  // 更新规则属性
  currentSelectingRule.value.word_code = selectedAttr.value.word_code;
  currentSelectingRule.value.word_name = selectedAttr.value.word_name;
  currentSelectingRule.value.word_short = selectedAttr.value.word_short;

  // 重置规则类型和规则设置
  currentSelectingRule.value.type = '';
  currentSelectingRule.value.rule = null;

  // 检查当前规则类型是否仍然有效
  const availableTypes = getRuleTypeOptions(currentSelectingRule.value);
  if (currentSelectingRule.value.type && !availableTypes.includes(currentSelectingRule.value.type)) {
    currentSelectingRule.value.type = '';
  }

  attrSearchDialogVisible.value = false;
  ElMessage.success('属性选择成功');
};

// 关闭属性搜索弹窗
const handleCloseAttrSearchDialog = () => {
  attrSearchDialogVisible.value = false;
  currentSelectingRule.value = null;
  selectedAttr.value = null;
  attrSearchKeyword.value = '';
};

const handleCloseRuleDialog = () => {
  ruleDialogVisible.value = false;
  currentRule.value = null;
  currentRuleItems.value = [];
  numberRuleItems.value = [{ originValue: '', scoreValue: '' }];
  // selectedFormulaAttrs 现在是计算属性，不需要手动重置
  // selectedFormulaAttrs.value = [];
  algebraicFunction.value = '对数';
};

const getRuleTypeOptions = (rule) => {
  if (!rule.word_name) {
    return ruleTypeOptions;
  }

  if (rule.word_name.includes('评分')) {
    if (rule.word_name.includes('标签')) {
      return ['范围标签'];
    } else {
      return ['公式计算'];
    }
  } else {
    return ['范围编码', '数字编码', '代数换算'];
  }
};

const handleRuleChange = (value, rule, type) => {
  if (type === '规则属性') {
    const existingRule = rules.value.find((r) => r.word_code === value && r.id !== rule.id);
    if (existingRule) {
      ElMessage.error('该规则属性已存在，请选择其他属性');
      return;
    }

    rule.word_code = value;
    const selectedAttr = moFormulaAttrs.value.find((item) => item.word_code === value);
    console.log('selectedAttr', selectedAttr);
    if (selectedAttr) {
      rule.word_name = selectedAttr.word_name;
      rule.word_short = selectedAttr.word_short;

      rule.type = '';
      rule.rule = null;

      const availableTypes = getRuleTypeOptions(rule);
      if (rule.type && !availableTypes.includes(rule.type)) {
        rule.type = '';
      }
    }
  } else if (type === '规则类型') {
    rule.type = value;
    rule.rule = null;
  }
};

const addRule = (index) => {
  const newRule = {
    id: Date.now(),
    word_code: '',
    type: '',
    rule: null,
    ruleAttrsDdta: ruleAttrsDdta.value,
    ruleTypes: ruleTypeOptions,
  };

  rules.value.splice(index + 1, 0, newRule);
};

const removeRule = (index) => {
  if (rules.value.length <= 1) {
    ElMessageBox.alert('至少保留一条规则', '提示', {
      confirmButtonText: '确定',
    });
    return;
  }
  ElMessageBox.confirm('确定要删除这条规则吗？', '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      rules.value.splice(index, 1);
    })
    .catch(() => {});
};

const addRuleItem = (index) => {
  currentRuleItems.value.splice(index + 1, 0, { minValue: '', maxValue: '', score: '' });
};

const removeRuleItem = (index) => {
  if (currentRuleItems.value.length <= 1) return;
  currentRuleItems.value.splice(index, 1);
};

const addNumberRuleItem = (index) => {
  numberRuleItems.value.splice(index + 1, 0, { originValue: '', scoreValue: '' });
};

const removeNumberRuleItem = (index) => {
  if (numberRuleItems.value.length <= 1) return;
  numberRuleItems.value.splice(index, 1);
};

const toggleFormulaAttr = (attr) => {
  const code = attr.word_code;
  if (!currentRule.value.rule) {
    currentRule.value.rule = { selectedAttrs: [] };
  }
  if (!currentRule.value.rule.selectedAttrs) {
    currentRule.value.rule.selectedAttrs = [];
  }

  const index = currentRule.value.rule.selectedAttrs.indexOf(code);
  if (index > -1) {
    currentRule.value.rule.selectedAttrs.splice(index, 1);
  } else {
    currentRule.value.rule.selectedAttrs.push(code);
  }
};

const confirmRuleSettings = () => {
  if (!currentRule.value) return;

  let ruleData = {};

  if (dialogType.value === '范围编码' || dialogType.value === '范围标签') {
    ruleData = {
      type: dialogType.value,
      rules: currentRuleItems.value.filter(
        (item) => item.minValue !== '' && item.maxValue !== '' && item.score !== ''
      ),
    };
  } else if (dialogType.value === '数字编码') {
    ruleData = {
      type: dialogType.value,
      rules: numberRuleItems.value.filter(
        (item) => item.originValue !== '' && item.scoreValue !== ''
      ),
    };
  } else if (dialogType.value === '公式计算') {
    ruleData = {
      type: dialogType.value,
      selectedAttrs: currentRule.value.rule?.selectedAttrs || [],
      formula: formulaString.value,
    };
  } else if (dialogType.value === '代数换算') {
    ruleData = {
      type: dialogType.value,
      function: algebraicFunction.value,
      formula: getFormulaPreview(),
    };
  }

  currentRule.value.rule = ruleData;
  ruleDialogVisible.value = false;
  ElMessage.success('规则设置成功');
};

const checkDataFormat = (data) => {
  for (const item of data) {
    const rule = item.rule;
    const type = rule?.type;

    if (!rule || !type) {
      ElMessage.error(`请检查 ${item.word_name} 配置规则`);
      return false;
    }

    if (type === '范围编码' || type === '范围标签') {
      if (!Array.isArray(rule.rules) || rule.rules.length === 0) {
        ElMessage.error(`请检查 ${item.word_name} 的 rules 配置`);
        return false;
      }
    }

    if (type === '公式计算') {
      if (!Array.isArray(rule.selectedAttrs) || rule.selectedAttrs.length === 0 || !rule.formula) {
        ElMessage.error(`请检查 ${item.word_name} 的 selectedAttrs 或 formula 配置`);
        return false;
      }
    }

    if (type === '代数换算') {
      if (!rule.function || !rule.formula) {
        ElMessage.error(`请检查 ${item.word_name} 的 function 或 formula 配置`);
        return false;
      }
    }
  }

  return true;
};

const applyRules = () => {
  if (!checkDataFormat(rules.value)) {
    return;
  }
  emit('settings', rules.value);
};

const saveRules = () => {
  if (!checkDataFormat(rules.value)) {
    return;
  }
  emit('save', rules.value);
};

onMounted(async () => {
  // 初始化时获取所有词条列表
  const allItems = await fetchAllDictionaryItems();
  moFormulaAttrs.value = [...props.selectionRules, ...props.extrasRules, ...allItems];
  console.log('组件挂载，初始化词条列表:', moFormulaAttrs.value.length);
});
</script>

<style scoped lang="scss">
@import url('./ratingRules.scss');

.algebraic-conversion-container {
  padding: 20px;

  .conversion-header {
    .header-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
  }

  .conversion-formula {
    border-left: 4px solid #409eff;
    padding-left: 15px;
  }

  .conversion-preview {
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    padding: 15px;
    background-color: #fafafa;
  }
}

.attr-search-container {
  .search-header {
    margin-bottom: 20px;
  }

  .attr-list {
    .el-table {
      .el-table__row {
        cursor: pointer;
        
        &:hover {
          background-color: #f5f7fa;
        }
        
        &.current-row {
          background-color: #e6f7ff;
        }
      }
    }
  }
}

.rule-select {
  cursor: pointer;
  
  &:hover {
    border-color: #409eff;
  }
}

.save-rule-btn {
  &:hover {
    background-color: rgba(103, 194, 58, 0.2) !important;
    border-color: rgba(103, 194, 58, 0.7) !important;
  }
}
</style>
