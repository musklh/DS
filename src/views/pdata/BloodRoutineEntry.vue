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
          <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px" label-position="left">
            <el-form-item label="检查时间" prop="checkTime">
              <el-date-picker
                v-model="formData.checkTime"
                type="datetime"
                placeholder="请选择"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>

            <template v-for="item in selectedTemplate.dictionaryList" :key="item.word_code">
              <el-form-item :label="item.word_name" :prop="`values.${item.word_code}`">
                <el-input v-model="formData.values[item.word_code]" placeholder="请输入" />
                <span v-if="item.word_short" class="unit-label">{{ item.word_short }}</span>
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
import { reactive, ref, computed, onMounted } from 'vue';
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
} from 'element-plus';
import { Refresh, InfoFilled, Camera, Upload } from '@element-plus/icons-vue';
import { dataCreate } from '../../api/data';
import { mockOcrRecognition } from '../../api/ocr';
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

// 表单数据
const formData = reactive({
  checkTime: '',
  values: {},
});

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
      rules[`values.${item.word_code}`] = [
        { required: true, message: `请输入${item.word_name}`, trigger: 'blur' }
      ];
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
    // 开始OCR识别过程
    performOcrRecognition();
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
const performOcrRecognition = async () => {
  isProcessingOcr.value = true;
  
  try {
    ElMessage.info('正在进行OCR识别...');
    
    // 调用模拟OCR接口
    const response = await mockOcrRecognition();
    
    if (response.data.code === 200) {
      const testResults = response.data.msg.test_results;
      
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

// 组件挂载时检查摄像头
onMounted(() => {
  checkCamera();
});

// 提交表单
const submitForm = async () => {
  try {
    // 表单校验
    const valid = await formRef.value.validate();
    if (!valid) {
      ElMessage.warning('请完善所有必填字段');
      return;
    }

    submitting.value = true;

    // 确保 checkTime 是完整格式（加上秒）
    let checkTime = formData.checkTime;
      checkTime += ':00'; // 自动补全秒


    // 构建批量录入数据
    const dataList = props.selectedTemplate.dictionaryList.map(item => ({
      word_code: item.word_code,
      check_time: checkTime,
      value: formData.values[item.word_code] || ''
    }));

    const submitData = {
      case_code: props.patientData.caseId,
      template_code: props.selectedTemplate.code,
      data_list: dataList
    };

    console.log('提交的数据:', submitData);

    // 调用 API
    const response = await dataCreate(submitData);
    console.log('API响应:', response);

    // 判断响应是否成功
    if (response?.data?.code === 200) {
      ElMessage.success('数据录入成功，即将跳转到患者列表');
      emit('data-submitted', submitData);
    } else {
      ElMessage.error(`数据提交失败: ${response?.data?.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('数据提交异常:', error);
    if (error.message && error.message.includes('validation')) {
      ElMessage.warning('请完善所有必填字段');
    } else {
      ElMessage.error('数据提交异常');
    }
  } finally {
    submitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.checkTime = '';
  formData.values = {};
  // 清除表单校验状态
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  ElMessage.info('表单已重置');
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

.left-form-section {
  flex: 0 0 450px; /* Fixed width for the form section as per image */
  max-width: 450px;
}

.left-form-section .el-form-item {
  margin-bottom: 18px; /* Adjust spacing between form items */
  position: relative; /* For unit label positioning */
}

.unit-label {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 14px;
  margin-right: 10px; /* Space from input field */
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
</style>
