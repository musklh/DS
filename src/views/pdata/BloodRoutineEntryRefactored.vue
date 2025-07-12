<template>
  <div class="blood-routine-entry-container">
    <!-- 患者病例头部 -->
    <PatientCaseHeader 
      :patient-data="patientData"
      @refresh="handleRefresh"
    />

    <el-card class="content-card">
      <!-- 卡片头部 -->
      <template #header>
        <TemplateHeader 
          :template-name="selectedTemplate.name"
          @go-back="emit('go-back-to-template')"
          @refresh="handleRefresh"
        />
      </template>

      <div class="entry-form-layout">
        <!-- 左侧表单区域 -->
        <div class="left-form-section">
          <el-form 
            :model="formData" 
            :rules="formRules" 
            ref="formRef" 
            label-width="auto" 
            label-position="left" 
            class="adaptive-form"
          >
            <!-- 检查时间字段 -->
            <CheckTimeField 
              v-model="formData.checkTime"
              :get-current-time="getCurrentDateTime"
            />

            <!-- 动态表单字段 -->
            <el-form-item
              v-for="item in selectedTemplate.dictionaryList"
              :key="item.word_code"
              :label="item.word_name"
              :prop="`values.${item.word_code}`"
            >
              <DynamicFormField
                :model-value="formData.values[item.word_code]"
                @update:model-value="formData.values[item.word_code] = $event"
                :input-type="item.input_type"
                :word-code="item.word_code"
                :get-options="getOptions"
                :has-followup-for-option="hasFollowupForOption"
                :get-followup-type="getFollowupType"
                :get-followup-options="getFollowupOptions"
                :get-followup-label="getFollowupLabel"
                :get-followup-fields="getFollowupFields"
                :get-field-options="getFieldOptions"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 右侧OCR区域 -->
        <OcrSection
          :file-input="fileInput"
          :uploaded-image="uploadedImage"
          :has-camera="hasCamera"
          :ocr-results="ocrResults"
          :is-processing="isProcessingOcr"
          :match-statistics="matchStatistics"
          @trigger-upload="triggerFileUpload"
          @handle-upload="handleFileUpload"
          @open-camera="openCamera"
          @remove-image="removeImage"
          @apply-result="(result) => applyOcrResult(result, formData, selectedTemplate)"
          @apply-all="() => applyAllOcrResults(formData, selectedTemplate)"
          :get-confidence-class="getConfidenceClass"
          :can-apply-result="(result) => canApplyOcrResult(result, selectedTemplate)"
        />
      </div>

      <!-- 表单操作按钮 -->
      <FormActions
        :is-loading="submitting"
        @save="handleSubmit"
        @cancel="() => emit('go-back-to-template')"
        @reset="handleReset"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, toRef } from 'vue'
import { ElCard, ElForm, ElFormItem } from 'element-plus'

// 组合式函数
import { useFormData } from '../../composables/useFormData'
import { useOcrRecognition } from '../../composables/useOcrRecognition'
import { useFormSubmission } from '../../composables/useFormSubmission'

// 工具函数
import { 
  getOptions as getOptionsUtil,
  hasFollowupForOption as hasFollowupForOptionUtil,
  getFollowupType as getFollowupTypeUtil,
  getFollowupOptions as getFollowupOptionsUtil,
  getFollowupLabel as getFollowupLabelUtil,
  getFollowupFields as getFollowupFieldsUtil,
  getFieldOptions as getFieldOptionsUtil
} from '../../utils/formHelpers'

// 子组件
import PatientCaseHeader from './components/PatientCaseHeader.vue'
import TemplateHeader from './components/TemplateHeader.vue'
import CheckTimeField from './components/CheckTimeField.vue'
import DynamicFormField from '../../components/form/DynamicFormField.vue'
import OcrSection from './components/OcrSection.vue'
import FormActions from './components/FormActions.vue'

const props = defineProps({
  patientData: {
    type: Object,
    required: true
  },
  selectedTemplate: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['data-submitted', 'go-back-to-template'])

// 表单引用
const formRef = ref(null)

// 使用组合式函数
const selectedTemplateRef = toRef(props, 'selectedTemplate')

const {
  formData,
  formRules,
  resetFormData,
  getCurrentDateTime
} = useFormData(selectedTemplateRef)

const {
  fileInput,
  uploadedImage,
  hasCamera,
  ocrResults,
  isProcessingOcr,
  matchStatistics,
  checkCamera,
  triggerFileUpload,
  handleFileUpload,
  openCamera,
  removeImage,
  canApplyOcrResult,
  applyOcrResult,
  applyAllOcrResults,
  getConfidenceClass,
  clearOcrState
} = useOcrRecognition(selectedTemplateRef)

const {
  submitting,
  submitForm
} = useFormSubmission()

// 辅助函数包装器
const getOptions = (wordCode) => getOptionsUtil(wordCode, props.selectedTemplate)
const hasFollowupForOption = (wordCode, option) => hasFollowupForOptionUtil(wordCode, option, props.selectedTemplate)
const getFollowupType = (wordCode, option) => getFollowupTypeUtil(wordCode, option, props.selectedTemplate)
const getFollowupOptions = (wordCode, option) => getFollowupOptionsUtil(wordCode, option, props.selectedTemplate)
const getFollowupLabel = (wordCode, option) => getFollowupLabelUtil(wordCode, option, props.selectedTemplate)
const getFollowupFields = (wordCode, option) => getFollowupFieldsUtil(wordCode, option, props.selectedTemplate)
const getFieldOptions = (field) => getFieldOptionsUtil(field)

// 事件处理
const handleRefresh = () => {
  // 可以添加刷新逻辑
  console.log('刷新数据')
}

const handleSubmit = () => {
  submitForm(formRef, formData, props.selectedTemplate, props.patientData, emit)
}

const handleReset = () => {
  resetFormData()
  if (formRef.value) {
    formRef.value.resetFields()
  }
  clearOcrState()
}

// 组件挂载时的初始化
onMounted(() => {
  checkCamera()
})
</script>

<style scoped>
.blood-routine-entry-container {
  padding: 0;
  background-color: #f5f7fa;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.content-card :deep(.el-card__header) {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.entry-form-layout {
  display: flex;
  gap: 30px;
  padding: 20px;
  flex-grow: 1;
}

.left-form-section {
  flex: 0 0 500px;
  max-width: 500px;
}

.left-form-section .el-form-item {
  margin-bottom: 18px;
  position: relative;
  display: flex;
  align-items: flex-start;
}

.left-form-section :deep(.el-form-item__label) {
  min-width: 140px;
  max-width: 200px;
  width: auto !important;
  text-align: right;
  padding-right: 12px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.left-form-section :deep(.el-form-item__content) {
  flex: 1;
  margin-left: 0 !important;
  position: relative;
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
</style> 