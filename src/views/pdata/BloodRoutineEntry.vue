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

      <div class="entry-form-layout">
        <div class="left-form-section">
          <el-form :model="formData" :rules="formRules" ref="formRef" label-width="auto" label-position="left" class="adaptive-form">
            <el-form-item label="检查时间" prop="checkTime">
              <div style="display: flex; gap: 8px; align-items: center;">
                <el-date-picker
                  v-model="formData.checkTime"
                  type="datetime"
                  placeholder="请选择"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="flex: 1"
                />
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="formData.checkTime = getCurrentDateTime()"
                  title="重置为当前时间"
                >
                  当前时间
                </el-button>
              </div>
            </el-form-item>

            <template v-for="item in selectedTemplate.dictionaryList" :key="item.word_code">
              <!-- 默认文本输入框 -->
              <el-form-item v-if="!item.input_type || item.input_type === 'text'" :prop="`values.${item.word_code}`">
                <template #label>
                  <el-tooltip :content="item.word_name" placement="top" :disabled="item.word_name.length <= 8">
                    <span class="form-label">{{ item.word_name }}</span>
                  </el-tooltip>
                </template>
                <el-input 
                  v-model="formData.values[item.word_code]" 
                  placeholder="请输入"
                  :suffix-icon="item.word_short ? '' : undefined"
                />
                <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
              </el-form-item>

              <!-- 日期  -->
              <el-form-item v-else-if="item.input_type === 'date' || (item.word_name && item.word_name.includes('时间'))" :prop="`values.${item.word_code}`" :label="item.word_name">
                <el-date-picker v-model="formData.values[item.word_code]" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD" style="width: 100%;" />
              </el-form-item>

              <!-- 数值 -->
              <el-form-item v-else-if="item.input_type === 'number'" :prop="`values.${item.word_code}`" :label="item.word_name">
                <el-input-number v-model="formData.values[item.word_code]" :controls="false" placeholder="请输入数值" style="width: 100%;" />
                <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
              </el-form-item>

              <!-- 单选 -->
              <el-form-item v-else-if="item.input_type === 'single'" :prop="`values.${item.word_code}`" :label="item.word_name">
                  <el-radio-group v-model="formData.values[item.word_code]">
                      <el-radio v-for="option in item.options.split(',')" :key="option" :label="option" />
                  </el-radio-group>
              </el-form-item>

              <!-- 单选（含其他） -->
              <el-form-item v-else-if="item.input_type === 'single_with_other'" :prop="`values.${item.word_code}`" :label="item.word_name">
                <div class="single-with-other-container">
                    <el-radio-group v-model="formData.values[item.word_code].selected">
                        <el-radio v-for="option in item.options.split(',')" :key="option" :label="option" />
                        <el-radio label="__other__">其他</el-radio>
                    </el-radio-group>
                    <el-input
                      v-if="formData.values[item.word_code] && formData.values[item.word_code].selected === '__other__'"
                      v-model="formData.values[item.word_code].other"
                      placeholder="请输入"
                      size="small"
                      class="other-input"
                    />
                </div>
              </el-form-item>

              <!-- 多选 / 多选带时间 / 级联选择 -->
              <el-form-item v-else-if="item.input_type === 'multi' || item.input_type === 'multi_with_date'" :label="item.word_name" :prop="`values.${item.word_code}`">
                <el-checkbox-group v-model="formData.values[item.word_code].selected">
                  <div v-for="option in item.options.split(',')" :key="option" class="checkbox-time-item">
                    <el-checkbox :label="option" />
                    
                    <!-- 多选带时间 -->
                    <el-date-picker
                      v-if="item.input_type === 'multi_with_date' && isOptionSelected(item.word_code, option)"
                      v-model="formData.values[item.word_code].times[option]"
                      type="datetime"
                      placeholder="选择时间"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      size="small"
                      style="margin-left: 10px;"
                    />

                    <!-- 级联子问题 -->
                    <div v-if="isOptionSelected(item.word_code, option) && item.followup_options && item.followup_options[option]">
                      <div class="followup-container">
                        <span class="followup-label">{{ item.followup_options[option].label || option }}:</span>
                        <!-- Level 1 Followup Input -->
                        <el-radio-group v-if="item.followup_options[option].input_type === 'single'" v-model="formData.values[item.word_code].followup[option]">
                          <el-radio v-for="fu_option in getOptionsArray(item.followup_options[option].options)" :key="fu_option" :label="fu_option" />
                        </el-radio-group>
                        <el-input v-else-if="item.followup_options[option].input_type === 'text'" v-model="formData.values[item.word_code].followup[option]" size="small" placeholder="请输入" style="width: 150px;"/>
                        <el-input-number v-else-if="item.followup_options[option].input_type === 'number'" v-model="formData.values[item.word_code].followup[option]" size="small" :controls="false" placeholder="请输入数值" style="width: 150px;"/>
                        <el-date-picker v-else-if="item.followup_options[option].input_type === 'date'" v-model="formData.values[item.word_code].followup[option]" type="date" size="small" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 150px;"/>
                      </div>

                      <!-- Level 2 Followup (Nested) -->
                      <div v-if="isNestedFollowupVisible(item, option)" class="followup-container-nested">
                        <template v-if="getNestedFollowup(item, option)">
                           <span class="followup-label">{{ getNestedFollowup(item, option).label }}:</span>
                           <el-radio-group v-if="getNestedFollowup(item, option).input_type === 'single'" v-model="formData.values[item.word_code].followup[getNestedFollowupKey(option, formData.values[item.word_code].followup[option])]">
                              <el-radio v-for="fu2_option in getOptionsArray(getNestedFollowup(item, option).options)" :key="fu2_option" :label="fu2_option" />
                           </el-radio-group>
                           <el-input v-else-if="getNestedFollowup(item, option).input_type === 'text'" v-model="formData.values[item.word_code].followup[getNestedFollowupKey(option, formData.values[item.word_code].followup[option])]" size="small" placeholder="请输入" style="width: 150px;"/>
                           <el-input-number v-else-if="getNestedFollowup(item, option).input_type === 'number'" v-model="formData.values[item.word_code].followup[getNestedFollowupKey(option, formData.values[item.word_code].followup[option])]" size="small" :controls="false" placeholder="请输入数值" style="width: 150px;"/>
                           <el-date-picker v-else-if="getNestedFollowup(item, option).input_type === 'date'" v-model="formData.values[item.word_code].followup[getNestedFollowupKey(option, formData.values[item.word_code].followup[option])]" type="date" size="small" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 150px;"/>
                        </template>
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </el-form-item>
            </template>
          </el-form>
        </div>

        <div class="right-ocr-section">
          <div class="ocr-placeholder" @click="triggerFileUpload">
            <div v-if="!uploadedImage" class="ocr-icon-box">
              <img src="../../assets/s.png" alt="" />
              <div class="upload-hint">点击上传图片或拍照</div>
            </div>
            <div v-else class="image-preview">
              <img :src="uploadedImage" alt="上传的图片" />
              <div class="image-overlay">
                <el-button type="primary" size="small" @click.stop="triggerFileUpload">重新上传</el-button>
                <el-button type="danger" size="small" @click.stop="removeImage">删除</el-button>
              </div>
            </div>
          </div>
          
          <!-- 隐藏的文件上传输入框 -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
          
          <!-- 拍照按钮 -->
          <div class="camera-section">
            <el-button type="primary" @click="openCamera" :disabled="!hasCamera">
              <el-icon><Camera /></el-icon>
              拍照
            </el-button>
            <el-button @click="triggerFileUpload">
              <el-icon><Upload /></el-icon>
              上传图片
            </el-button>
          </div>
          
          <div class="ocr-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>拍照或者上传图片后OCR会自动识别字段。</span>
          </div>
          
          <!-- OCR识别结果展示 -->
          <div v-if="ocrResults.length > 0" class="ocr-results">
            <div class="ocr-results-header">
              <h4>OCR识别结果：</h4>
              <div class="ocr-stats" v-if="matchStatistics">
                <span class="match-rate">匹配率: {{ Math.round(matchStatistics.matchRate * 100) }}%</span>
                <span class="match-count">({{ matchStatistics.matchedFields }}/{{ matchStatistics.totalFields }})</span>
              </div>
              <el-button 
                type="primary" 
                size="small" 
                @click="applyAllOcrResults"
                :disabled="ocrResults.length === 0"
              >
                批量应用
              </el-button>
            </div>
            <div class="ocr-result-list">
              <div v-for="result in ocrResults" :key="result.field" class="ocr-result-item">
                <div class="result-info">
                  <span class="field-name">{{ result.field }}:</span>
                  <span class="field-value">{{ result.value }}</span>
                  <span class="confidence-badge" :class="getConfidenceClass(result.confidence)">
                    {{ Math.round(result.confidence * 100) }}%
                  </span>
                </div>
                <div class="result-actions">
                  <span v-if="result.ocr_item !== result.field" class="ocr-source">
                    来源: {{ result.ocr_item }}
                  </span>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="applyOcrResult(result)"
                    :disabled="!canApplyOcrResult(result)"
                  >
                    应用
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm" :loading="submitting"> 录入 </el-button>
        <el-button @click="resetForm"> 重置 </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import {
  ElDivider,
  ElIcon,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElButton,
  ElMessage,
  ElTooltip,
  ElCheckboxGroup,
  ElCheckbox,
  ElRadioGroup,
  ElRadio,
  ElInputNumber,
} from 'element-plus';
import { Refresh, InfoFilled, Camera, Upload } from '@element-plus/icons-vue';
import { dataCreate } from '../../api/data';
import { ocrUpload } from '../../api/ocr';
import { 
  matchOcrWithTemplate, 
  convertMatchesToFormData, 
  getMatchStatistics
} from '../../utils/ocrMatcher';


const props = defineProps({
  patientData: Object,
  selectedTemplate: Object,
});


const emit = defineEmits(['data-submitted', 'go-back-to-template']);

// 表单引用
const formRef = ref(null);
const submitting = ref(false);

// 图片上传相关
const fileInput = ref(null);
const uploadedImage = ref('');
const hasCamera = ref(false);
const ocrResults = ref([]);
const isProcessingOcr = ref(false);
const matchResults = ref([]);
const matchStatistics = ref(null);



// 获取当前时间的辅助函数
const getCurrentDateTime = () => {
  const now = new Date();
  // 获取本地时间（考虑时区偏移）
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 19).replace('T', ' ');
};

// 表单数据
const formData = reactive({
  checkTime: getCurrentDateTime(),
  values: {},
});

// 初始化表单数据
const initializeFormData = () => {
  // 设置默认检查时间为当前时间
  formData.checkTime = getCurrentDateTime();
  const newValues = {};
  if (props.selectedTemplate?.dictionaryList) {
    props.selectedTemplate.dictionaryList.forEach(item => {
      if (item.input_type === 'multi' || item.input_type === 'multi_with_date') {
        newValues[item.word_code] = { selected: [], times: {}, followup: {} };
      } else if (item.input_type === 'single') {
        newValues[item.word_code] = '';
      } else if (item.input_type === 'single_with_other') {
        newValues[item.word_code] = { selected: '', other: '' };
      } else if (item.input_type === 'number') {
        newValues[item.word_code] = undefined;
      } else if (item.input_type === 'date') {
        newValues[item.word_code] = '';
      } else {
        newValues[item.word_code] = ''; // text
      }
    });
  }
  formData.values = newValues;
};

watch(
  () => props.selectedTemplate,
  (newTemplate) => {
    if (newTemplate && newTemplate.dictionaryList) {
      initializeFormData();
    }
  },
  { immediate: true, deep: true }
);

// 动态生成表单校验规则
const formRules = computed(() => {
  const rules = {
    checkTime: [
      { required: true, message: '请选择检查时间', trigger: 'change' }
    ]
  };
  //这里少一个词条单位，目前用的是英文缩写代替。。。。。。
  console.log(props.selectedTemplate.dictionaryList)
  // 为每个模板字段添加必填校验
  if (props.selectedTemplate?.dictionaryList) {
    props.selectedTemplate.dictionaryList.forEach(item => {
      const rule = { required: true, trigger: 'blur' };
      if (item.input_type === 'multi' || item.input_type === 'multi_with_date') {
        rule.message = `请选择${item.word_name}`;
        rule.trigger = 'change';
        // 自定义校验
        rule.validator = (rule, value, callback) => {
          if (!value || value.selected.length === 0) {
            return callback(new Error(`请至少选择一个${item.word_name}`));
          }
          // 校验 multi_with_date
          if (item.input_type === 'multi_with_date') {
            for (const option of value.selected) {
              if (!value.times[option]) {
                return callback(new Error(`请为'${option}'选择时间`));
              }
            }
          }
          // 校验级联选项
          if (item.followup_options) {
            for (const option of value.selected) {
              const fu1 = item.followup_options[option];
              if (fu1 && !value.followup[option]) {
                  return callback(new Error(`请完成'${option}'的后续选项`));
              }
              // 校验二级级联
              if (fu1 && fu1.input_type === 'single' && value.followup[option]) {
                  const selected_fu1_option = value.followup[option];
                  const fu2 = fu1.followup_options && fu1.followup_options[selected_fu1_option];
                  const fu2_key = `${option}_${selected_fu1_option}`;
                  if (fu2 && !value.followup[fu2_key]) {
                      return callback(new Error(`请完成'${selected_fu1_option}'的后续选项`));
                  }
              }
            }
          }
          callback();
        };
      } else if (item.input_type === 'single') {
          rule.message = `请选择${item.word_name}`;
          rule.trigger = 'change';
      } else if (item.input_type === 'single_with_other') {
        rule.message = `请选择${item.word_name}`;
        rule.trigger = 'change';
        rule.validator = (rule, value, callback) => {
          if (!value || !value.selected) {
            return callback(new Error(`请选择${item.word_name}`));
          }
          if (value.selected === '__other__' && !value.other) {
            return callback(new Error('请输入其他内容'));
          }
          callback();
        };
      } else if (item.input_type === 'number' || item.input_type === 'date') {
        rule.message = `请输入${item.word_name}`;
      } else {
        rule.message = `请输入${item.word_name}`;
      }
      rules[`values.${item.word_code}`] = [rule];
    });
  }

  return rules;
});

// 检查是否有摄像头
const checkCamera = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    hasCamera.value = devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.log('无法检测摄像头:', error);
    hasCamera.value = false;
  }
};

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    processImage(file);
  }
};

// 打开摄像头拍照
const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // 这里可以打开一个拍照对话框，或者直接使用文件上传
    // 为了简化，我们直接触发文件上传
    triggerFileUpload();
  } catch (error) {
    ElMessage.error('无法访问摄像头');
    console.error('摄像头访问失败:', error);
  }
};

// 处理图片
const processImage = (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target.result;
    // 开始OCR识别过程，传入文件
    performOcrRecognition(file);
  };
  reader.readAsDataURL(file);
};

// 删除图片
const removeImage = () => {
  uploadedImage.value = '';
  ocrResults.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// OCR识别处理
const performOcrRecognition = async (file) => {
  isProcessingOcr.value = true;
  
  try {
    ElMessage.info('正在进行OCR识别...');
    
    // 调用真实OCR接口
    const response = await ocrUpload({ file });

    console.log("OCR原始响应:", response.data)

    if (response.data.code === 200) {
      // 解析msg字段，因为OCR服务返回的是JSON字符串
      let msgData;
      try {
        msgData = typeof response.data.msg === 'string' ? JSON.parse(response.data.msg) : response.data.msg;
      } catch (parseError) {
        console.error('解析OCR响应数据失败:', parseError);
        throw new Error('OCR响应数据格式错误');
      }
      
      const testResults = msgData.test_results;
      
             if (!testResults || !Array.isArray(testResults)) {
         throw new Error('OCR识别结果格式错误');
       }
       
       console.log("解析后的OCR数据:", msgData);
       console.log("检测结果数组:", testResults);
       
       // 将模板字段转换为匹配器需要的格式
      const templateFields = props.selectedTemplate.dictionaryList.map(item => ({
        word_code: item.word_code,
        word_name: item.word_name,
        word_short: item.word_short
      }));
      
      // 进行智能匹配
      const matches = matchOcrWithTemplate(templateFields, testResults, 0.6);
      matchResults.value = matches;
      
      // 获取匹配统计信息
      const stats = getMatchStatistics(templateFields, matches);
      matchStatistics.value = stats;
      
      // 将匹配结果转换为表单数据格式
      const matchedFormData = convertMatchesToFormData(matches);
      
      // 自动填充表单
      Object.keys(matchedFormData).forEach(key => {
        if (formData.values[key] !== undefined) {
          formData.values[key] = matchedFormData[key];
        }
      });
      
      // 显示匹配结果
      ocrResults.value = matches.map(match => ({
        field: match.word_name,
        value: match.result,
        word_code: match.word_code,
        confidence: match.confidence,
        ocr_item: match.ocr_item
      }));
      
      ElMessage.success(`OCR识别完成！成功匹配 ${stats.matchedFields}/${stats.totalFields} 个字段`);
      
      console.log('匹配统计:', stats);
      console.log('匹配结果:', matches);
    } else {
      throw new Error('OCR识别失败');
    }
  } catch (error) {
    console.error('OCR识别错误:', error);
    ElMessage.error('OCR识别失败，请重试');
  } finally {
    isProcessingOcr.value = false;
  }
};

// 检查是否可以应用OCR结果
const canApplyOcrResult = (result) => {
  return props.selectedTemplate?.dictionaryList?.some(item => 
    item.word_code === result.word_code
  );
};

// 应用OCR结果到表单
const applyOcrResult = (result) => {
  if (canApplyOcrResult(result)) {
    formData.values[result.word_code] = result.value;
    ElMessage.success(`已应用 ${result.field} 的值: ${result.value}`);
  } else {
    ElMessage.warning(`无法应用 ${result.field}，字段不匹配`);
  }
};

// 批量应用所有OCR结果
const applyAllOcrResults = () => {
  let appliedCount = 0;
  ocrResults.value.forEach(result => {
    if (canApplyOcrResult(result)) {
      formData.values[result.word_code] = result.value;
      appliedCount++;
    }
  });
  
  if (appliedCount > 0) {
    ElMessage.success(`已批量应用 ${appliedCount} 个字段的值`);
  } else {
    ElMessage.warning('没有可应用的字段');
  }
};

// 获取置信度样式类
const getConfidenceClass = (confidence) => {
  if (confidence >= 0.9) return 'confidence-high';
  if (confidence >= 0.7) return 'confidence-medium';
  return 'confidence-low';
};

// Helper function to check if an option is selected for multi_with_date
const isOptionSelected = (wordCode, option) => {
  return formData.values[wordCode]?.selected.includes(option);
};

const getOptionsArray = (optionsStr) => {
  if (optionsStr && typeof optionsStr === 'string') {
    return optionsStr.split(',').map(o => o.trim()).filter(o => o);
  }
  return [];
};

// --- 级联选择辅助函数 ---
const isNestedFollowupVisible = (item, option) => {
  const wordCode = item.word_code;
  const fu1_answer = formData.values[wordCode]?.followup?.[option];
  if (!fu1_answer) return false;

  const fu1 = item.followup_options?.[option];
  return fu1?.input_type === 'single' && fu1.followup_options?.[fu1_answer];
};

const getNestedFollowup = (item, option) => {
  const wordCode = item.word_code;
  const fu1_answer = formData.values[wordCode]?.followup?.[option];
  if (!fu1_answer) return null;
  
  return item.followup_options?.[option]?.followup_options?.[fu1_answer];
};

const getNestedFollowupKey = (option, fu1_answer) => {
  return `${option}_${fu1_answer}`;
};

// 组件挂载时检查摄像头
onMounted(() => {
  // initializeFormData(); // Now handled by watch
  checkCamera();
});

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        const dataToSubmit = [];
        for (const word_code in formData.values) {
          const value = formData.values[word_code];
          const item = props.selectedTemplate.dictionaryList.find(i => i.word_code === word_code);
          
          if (!item) continue; // 安全起见，如果找不到词条定义则跳过

          let formattedValue;

          if (item.input_type === 'single_with_other') {
            if (value && value.selected) {
              formattedValue = value.selected === '__other__' ? value.other : value.selected;
            } else {
              formattedValue = '';
            }
          } else if (typeof value === 'object' && value !== null && value.hasOwnProperty('selected')) {
            // 处理多选、多选带时间、级联等复杂类型
            if (!value.selected || value.selected.length === 0) {
              formattedValue = '';
            } else if (item.input_type === 'multi' && !item.followup_options) {
              // 1. 如果是简单的多选（没有后续问题），则格式化为逗号分隔的字符串
              formattedValue = value.selected.join(',');
            } else {
              // 2. 如果是多选带时间或带后续问题，则格式化为JSON对象
              const submissionObject = {};
              value.selected.forEach(option => {
                const fu1 = item.followup_options && item.followup_options[option];

                if (item.input_type === 'multi_with_date' && value.times && value.times[option]) {
                  submissionObject[option] = value.times[option];
                } else if (fu1) {
                  const fu1_answer = value.followup[option];
                  const fu2 = fu1.input_type === 'single' && fu1_answer && fu1.followup_options && fu1.followup_options[fu1_answer];
                  
                  if (fu2) {
                    const fu2_key = `${option}_${fu1_answer}`;
                    const fu2_answer = value.followup[fu2_key];
                    submissionObject[option] = { [fu1_answer]: fu2_answer };
                  } else {
                    submissionObject[option] = fu1_answer;
                  }
                } else {
                  submissionObject[option] = true; // 对于没有值的多选项，标记为true
                }
              });
              formattedValue = JSON.stringify(submissionObject);
            }
          } else {
            // 处理文本、单选等简单类型
            formattedValue = value;
          }
          
          // 只提交有意义的数据
          if (formattedValue && formattedValue !== '{}' && formattedValue !== '[]' && formattedValue !== '') {
            dataToSubmit.push({
              word_code: word_code,
              value: formattedValue,
              check_time: formData.checkTime,
            });
          }
        }

        if (dataToSubmit.length === 0) {
          ElMessage.warning('没有需要提交的数据。');
          submitting.value = false;
          return;
        }

        const payload = {
          case_code: props.patientData.caseId,
          template_code: props.selectedTemplate.code,
          data_list: dataToSubmit,
        };

        const res = await dataCreate(payload);
        if (res.data.code === 200 || res.data.code === 201) {
          ElMessage.success('数据录入成功！');
          emit('data-submitted', formData);
        } else {
          ElMessage.error(res.data.msg || '数据录入失败');
        }
      } catch (error) {
        console.error('Submit form error:', error);
        ElMessage.error('数据录入失败，请检查网络或联系管理员。');
      } finally {
        submitting.value = false;
      }
    } else {
      ElMessage.error('请检查表单是否填写完整。');
    }
  });
};

const resetForm = () => {
  initializeFormData();
  if (formRef.value) {
    formRef.value.resetFields();
  }
  // 清空OCR相关状态
  uploadedImage.value = '';
  ocrResults.value = [];
  matchResults.value = [];
  matchStatistics.value = null;
};
</script>

<style scoped>
.blood-routine-entry-container {
  padding: 0; /* Remove padding here, handled by parent workflow container */
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

.content-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1; /* Allow card to fill space */
  display: flex;
  flex-direction: column;
}

.content-card :deep(.el-card__header) {
  padding: 15px 20px; /* Adjust header padding to match image */
  display: flex;
  align-items: center;
  justify-content: space-between; /* To push the button to the right */
}

.content-card .card-header-content {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #303133;
  flex-grow: 1; /* Allow content to take space */
}

.content-card .in-progress-text {
  color: #909399; /* Greyed out text */
  margin-right: 8px;
  font-size: 16px;
}

.content-card .template-name {
  margin-right: 15px;
}

.content-card .card-header-content .refresh-icon {
  margin-left: 0; /* Adjust margin for icon within header */
  margin-right: 10px;
}

.back-to-template-btn {
  margin-left: auto; /* Push button to the far right */
}

.entry-form-layout {
  display: flex;
  gap: 30px; /* Space between form and OCR section */
  padding: 20px; /* Add padding to the layout */
  flex-grow: 1; /* Allow layout to fill space */
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .entry-form-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .left-form-section {
    flex: none;
    max-width: 100%;
    width: 100%;
  }
  
  .left-form-section :deep(.el-form-item__label) {
    min-width: 120px;
    max-width: 160px;
  }
}

.left-form-section {
  flex: 0 0 500px; /* 增大表单区域宽度 */
  max-width: 500px;
}

.left-form-section .adaptive-form {
  /* 自适应表单标签宽度 */
}

.left-form-section .el-form-item {
  margin-bottom: 18px;
  position: relative;
  display: flex;
  align-items: flex-start; /* 确保对齐 */
}

/* 优化标签和输入框的布局 */
.left-form-section :deep(.el-form-item__label) {
  min-width: 140px; /* 最小标签宽度 */
  max-width: 200px; /* 最大标签宽度 */
  width: auto !important; /* 自适应宽度 */
  text-align: right;
  padding-right: 12px;
  line-height: 32px; /* 与输入框高度对齐 */
  white-space: nowrap; /* 防止标签文字换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 过长时显示省略号 */
}

.left-form-section :deep(.el-form-item__content) {
  flex: 1;
  margin-left: 0 !important; /* 移除默认margin */
  position: relative;
}

/* 对于特别长的标签，提供tooltip提示 */
.left-form-section :deep(.el-form-item__label):hover {
  overflow: visible;
  white-space: normal;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 4px 8px;
}

/* 表单标签样式 */
.form-label {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

.unit-label {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 14px;
  pointer-events: none; /* 防止影响输入框交互 */
  z-index: 10;
}

.right-ocr-section {
  flex: 1; /* Takes remaining space */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ocr-placeholder {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  width: 100%;
  max-width: 450px; /* Max width to control its size */
  height: 300px; /* Fixed height for the placeholder */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #c0c4cc;
  font-size: 24px;
  text-align: center;
  background-color: #fafafa;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ocr-placeholder:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.upload-hint {
  margin-top: 10px;
  font-size: 14px;
  color: #909399;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.camera-section {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
}

.camera-section .el-button {
  min-width: 100px;
}

.ocr-hint {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.ocr-hint .el-icon {
  margin-right: 5px;
}

.form-actions {
  margin-top: auto; /* Push buttons to the bottom of the card */
  padding: 20px; /* Add padding around buttons */
  text-align: center;
  border-top: 1px solid #ebeef5; /* Separator line */
}

.form-actions .el-button {
  width: 100px; /* Fixed width for buttons */
  margin: 0 10px;
}

.ocr-results {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  max-width: 100%;
}

.ocr-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.ocr-results-header h4 {
  margin: 0;
  color: #495057;
  font-size: 14px;
}

.ocr-stats {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6c757d;
}

.match-rate {
  font-weight: 500;
  color: #28a745;
}

.match-count {
  color: #6c757d;
}

.ocr-result-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.ocr-result-item {
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.field-name {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  font-size: 13px;
}

.field-value {
  flex: 1;
  color: #6c757d;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
  min-width: 60px;
}

.confidence-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  min-width: 35px;
  text-align: center;
}

.confidence-high {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.confidence-medium {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.confidence-low {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ocr-source {
  font-size: 11px;
  color: #868e96;
  font-style: italic;
  flex: 1;
}

.ocr-result-item .el-button {
  min-width: 60px;
  height: 28px;
  font-size: 12px;
}

.multi-with-time-group .checkbox-time-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.followup-container {
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.followup-label {
    margin-right: 8px;
    font-size: 14px;
    color: #606266;
}

.single-with-other-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.other-input {
  width: 150px !important;
}

.followup-container-nested {
  display: inline-flex;
  align-items: center;
  margin-left: 40px; /* 更多缩进 */
  margin-top: 8px;
  background-color: #f0f2f5;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
